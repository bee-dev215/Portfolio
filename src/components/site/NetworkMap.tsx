import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/hooks/use-motion";
import { LAND } from "./world-land";

// Exchange points the traffic runs between, as [longitude, latitude]
const HUBS = {
  sfo: [-122.4, 37.8],
  dal: [-96.8, 32.8],
  chi: [-87.6, 41.9],
  nyc: [-74, 40.7],
  mia: [-80.2, 25.8],
  mex: [-99.1, 19.4],
  bog: [-74.1, 4.7],
  sao: [-46.6, -23.5],
  scl: [-70.7, -33.4],
  hnl: [-157.9, 21.3],
  lon: [-0.1, 51.5],
  mad: [-3.7, 40.4],
  fra: [8.7, 50.1],
  sto: [18.1, 59.3],
  mow: [37.6, 55.8],
  cai: [31.2, 30],
  los: [3.4, 6.5],
  nbo: [36.8, -1.3],
  jnb: [28, -26.2],
  dxb: [55.3, 25.3],
  bom: [72.9, 19.1],
  sin: [103.8, 1.35],
  hkg: [114.2, 22.3],
  sel: [127, 37.6],
  tyo: [139.7, 35.7],
  syd: [151.2, -33.9],
} as const;
type Hub = keyof typeof HUBS;
const HUB_KEYS = Object.keys(HUBS) as Hub[];

// Where traffic can travel: land trunks and the big subsea cables. They are never drawn; packets just follow them.
// Pairs more than 180° apart cross the Pacific and wrap around the map's edges.
const LINKS: [Hub, Hub][] = [
  ["sfo", "chi"], ["sfo", "dal"], ["chi", "nyc"], ["dal", "mia"], ["dal", "mex"], ["nyc", "mia"],
  ["mia", "bog"], ["mia", "sao"], ["bog", "sao"], ["sao", "scl"], ["bog", "scl"],
  ["nyc", "lon"], ["nyc", "mad"], ["sao", "los"], ["hnl", "sfo"], ["tyo", "sfo"], ["syd", "hnl"],
  ["lon", "fra"], ["lon", "mad"], ["fra", "sto"], ["sto", "mow"], ["fra", "mow"], ["fra", "cai"], ["mad", "los"],
  ["los", "jnb"], ["jnb", "nbo"], ["nbo", "dxb"], ["cai", "dxb"], ["mow", "dxb"], ["mow", "sel"],
  ["dxb", "bom"], ["bom", "sin"], ["sin", "hkg"], ["sin", "syd"], ["hkg", "sel"], ["hkg", "tyo"], ["sel", "tyo"],
];

const MIN_MAP_W = 960; // narrower screens show part of a map this wide…
const NARROW_CENTER = -20; // …centred on the Atlantic, where the busiest cables cross (longitude)
const SPEED = 0.26; // packet speed, px per ms
const SIGNAL = 1000; // a hub's Wi-Fi-style signal, from its first arc lighting to the last fading, ms
const SEND = 420; // the packet sets off this far into its hub's signal, ms
const RIPPLE = 1300; // delivery rings, ms
const FLOW = 0.028; // speed of the faint background traffic, px per ms
const BLINK = 140; // packets pulse once every 2π × this many ms (≈ 0.9 s)
// Edge fade, baked into the drawing (a CSS mask would re-composite the whole layer every frame): full strength inside
// an ellipse around the middle, easing out toward the sides and bottom, and clear of the header at the top.
// Fractions of the canvas size.
const EDGE = { x: 0.5, y: 0.46, rx: 0.68, ry: 0.78, from: 0.55, top: [0.04, 0.2] } as const;

type Pt = { x: number; y: number };
type Link = { a: number; b: number; p0: Pt; c: Pt; p1: Pt; len: number; shifts: number[] };
type Hop = { li: number; dir: 1 | -1 };
type Packet = { route: number[]; hops: Hop[]; hop: number; flying: boolean; until: number; done: boolean };
type Flight = Hop & { t0: number; dur: number };
type Signal = { node: number; angle: number; t0: number };
type Ripple = { node: number; t0: number };

const rgba = (c: string, a: number) => `rgb(${c} / ${a})`;
const easeInOut = (t: number) => 0.5 - Math.cos(Math.PI * t) / 2;
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const wave = (t: number) => 0.5 + 0.5 * Math.sin(t); // 0…1
const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];

/** Point on a link's path, t from 0 (hub a) to 1 (hub b). */
const at = ({ p0, c, p1 }: Link, t: number): Pt => {
  const u = 1 - t;
  return { x: u * u * p0.x + 2 * u * t * c.x + t * t * p1.x, y: u * u * p0.y + 2 * u * t * c.y + t * t * p1.y };
};

/** Brand colours as RGB channels, read from the site tokens so the map follows the light/dark theme. */
const palette = (el: Element) => {
  const css = getComputedStyle(el);
  const v = (name: string) => css.getPropertyValue(name).trim();
  const dark = document.documentElement.dataset.theme === "dark";
  return {
    dark,
    dot: dark ? v("--brand-text-rgb") : v("--line-rgb"),
    line: dark ? v("--brand-text-rgb") : v("--brand-rgb"),
    glow: v("--sky-rgb"),
    head: dark ? "224 242 254" : v("--brand-rgb"),
  };
};

/**
 * Hero backdrop: a dotted world map with a global broadband network running over it, drawn without lines. Faint dots
 * drift between countries all the time; every so often a hub sends a packet: it gives off a Wi-Fi-style signal
 * pointed where the packet is going, the packet travels there as a softly blinking dot, the next hub signals it on, and
 * the destination answers with soft rings. Pauses off screen; under reduced motion it draws the map and hubs once and
 * stays still.
 */
export default function NetworkMap() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLCanvasElement>(null);
  const liveRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const baseCtx = baseRef.current?.getContext("2d");
    const ctx = liveRef.current?.getContext("2d");
    if (!wrap || !baseCtx || !ctx) return;

    const still = prefersReducedMotion();
    const land = Uint8Array.from(atob(LAND.bits), (ch) => ch.charCodeAt(0));
    let pal = palette(wrap);
    let w = 0, h = 0, dpr = 1, mapW = 0, cell = 0, x0 = 0, y0 = 0;
    let nodes: Pt[] = [];
    let links: Link[] = [];
    let routes: { to: number; hop: Hop }[][] = [];

    // Simulation state, on its own clock so a paused map resumes where it left off
    let now = 0;
    let nextSpawn = 0;
    let packets: Packet[] = [];
    let flights: Flight[] = [];
    let signals: Signal[] = [];
    let ripples: Ripple[] = [];
    const flash = HUB_KEYS.map(() => -Infinity);

    const project = (lon: number, lat: number): Pt => ({
      x: x0 + ((lon + 180) / LAND.step) * cell,
      y: y0 + ((LAND.top - lat) / LAND.step) * cell,
    });

    const layout = () => {
      w = wrap.clientWidth;
      h = wrap.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      mapW = Math.max(w, MIN_MAP_W);
      cell = mapW / LAND.cols;
      x0 = Math.min(0, Math.max(w - mapW, w / 2 - ((NARROW_CENTER + 180) / 360) * mapW));
      y0 = Math.max(0, (h - LAND.rows * cell) * 0.6);
      for (const cv of [baseCtx.canvas, ctx.canvas]) {
        cv.width = Math.round(w * dpr);
        cv.height = Math.round(h * dpr);
      }

      nodes = HUB_KEYS.map((k) => project(HUBS[k][0], HUBS[k][1]));
      links = LINKS.map(([ka, kb]) => {
        const [lonA, latA] = HUBS[ka];
        let [lonB] = HUBS[kb];
        if (lonB - lonA > 180) lonB -= 360;
        else if (lonA - lonB > 180) lonB += 360;
        const p0 = project(lonA, latA);
        const p1 = project(lonB, HUBS[kb][1]);
        // Bow each path upward, away from the map, like a great-circle route
        const dx = p1.x - p0.x, dy = p1.y - p0.y, chord = Math.hypot(dx, dy);
        const sign = dx < 0 ? -1 : 1;
        const c = { x: (p0.x + p1.x) / 2 + sign * dy * 0.22, y: (p0.y + p1.y) / 2 - sign * dx * 0.22 };
        const shifts = p1.x > x0 + mapW ? [0, -mapW] : p1.x < x0 ? [0, mapW] : [0];
        const len = (chord + Math.hypot(c.x - p0.x, c.y - p0.y) + Math.hypot(p1.x - c.x, p1.y - c.y)) / 2;
        return { a: HUB_KEYS.indexOf(ka), b: HUB_KEYS.indexOf(kb), p0, c, p1, len, shifts };
      });
      routes = nodes.map((_, n) =>
        links.flatMap((l, li): { to: number; hop: Hop }[] =>
          l.a === n ? [{ to: l.b, hop: { li, dir: 1 } }] : l.b === n ? [{ to: l.a, hop: { li, dir: -1 } }] : []
        )
      );
    };

    const fade = (x: number, y: number) => {
      const d = Math.hypot((x / w - EDGE.x) / EDGE.rx, (y / h - EDGE.y) / EDGE.ry);
      const side = (1 - d) / (1 - EDGE.from);
      const top = (y / h - EDGE.top[0]) / (EDGE.top[1] - EDGE.top[0]);
      return Math.max(0, Math.min(1, side, top));
    };

    // The still layer: land dots, each a touch lighter or darker for texture
    const paintBase = () => {
      const c = baseCtx;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.clearRect(0, 0, w, h);
      const r = Math.max(0.75, cell * 0.2);
      const shades = [0.15, 0.21, 0.27, 0.35];
      shades.forEach((alpha, shade) => {
        c.beginPath();
        for (let row = 0; row < LAND.rows; row++) {
          for (let col = 0; col < LAND.cols; col++) {
            const i = row * LAND.cols + col;
            if (!((land[i >> 3] >> (7 - (i & 7))) & 1)) continue;
            if (((row * 7919) ^ (col * 104729)) % shades.length !== shade) continue;
            const x = x0 + (col + 0.5 + (row & 1) * 0.5) * cell;
            if (x < -r || x > w + r) continue;
            const y = y0 + row * cell;
            c.moveTo(x + r, y);
            c.arc(x, y, r, 0, Math.PI * 2);
          }
        }
        c.fillStyle = rgba(pal.dot, alpha * (pal.dark ? 1.3 : 1));
        c.fill();
      });

      c.globalCompositeOperation = "destination-in";
      c.save();
      c.translate(w * EDGE.x, h * EDGE.y);
      c.scale(w * EDGE.rx, h * EDGE.ry);
      const side = c.createRadialGradient(0, 0, 0, 0, 0, 1);
      side.addColorStop(EDGE.from, "#000");
      side.addColorStop(1, "transparent");
      c.fillStyle = side;
      c.fillRect(-2, -2, 4, 4);
      c.restore();
      const top = c.createLinearGradient(0, 0, 0, h);
      top.addColorStop(EDGE.top[0], "transparent");
      top.addColorStop(EDGE.top[1], "#000");
      c.fillStyle = top;
      c.fillRect(0, 0, w, h);
      c.globalCompositeOperation = "source-over";
    };

    // A hub signals a packet on: its Wi-Fi arcs face the way the packet will leave
    const signal = (node: number, { li, dir }: Hop, t0: number) => {
      const { p0, c, p1 } = links[li];
      const from = dir === 1 ? p0 : p1;
      signals.push({ node, angle: Math.atan2(c.y - from.y, c.x - from.x), t0 });
      flash[node] = t0;
    };

    const spawn = () => {
      for (let tries = 0; tries < 8; tries++) {
        const route = [Math.floor(Math.random() * nodes.length)];
        const hops: Hop[] = [];
        const want = 2 + Math.floor(Math.random() * 3);
        while (hops.length < want) {
          const next = routes[route[route.length - 1]].filter((r) => !route.includes(r.to));
          if (!next.length) break;
          const { to, hop } = pick(next);
          route.push(to);
          hops.push(hop);
        }
        if (hops.length < 2) continue;
        packets.push({ route, hops, hop: 0, flying: false, until: now + SEND, done: false });
        signal(route[0], hops[0], now);
        return;
      }
    };

    const step = () => {
      if (now >= nextSpawn) {
        if (packets.length < (w < 640 ? 4 : 8)) spawn();
        nextSpawn = now + 650 + Math.random() * 900;
      }
      for (const p of packets) {
        if (now < p.until) continue;
        if (!p.flying) {
          const hop = p.hops[p.hop];
          const dur = 500 + links[hop.li].len / SPEED;
          flights.push({ ...hop, t0: p.until, dur });
          p.flying = true;
          p.until += dur;
        } else {
          const node = p.route[++p.hop];
          p.flying = false;
          if (p.hop === p.hops.length) {
            ripples.push({ node, t0: p.until });
            flash[node] = p.until;
            p.done = true;
          } else {
            signal(node, p.hops[p.hop], p.until);
            p.until += SEND;
          }
        }
      }
      packets = packets.filter((p) => !p.done);
      flights = flights.filter((f) => now - f.t0 < f.dur);
      signals = signals.filter((s) => now - s.t0 < SIGNAL);
      ripples = ripples.filter((r) => now - r.t0 < RIPPLE);
    };

    // Fills in the current fillStyle; callers vary only globalAlpha, so the canvas isn't re-parsing a colour per dot
    const dot = (x: number, y: number, r: number) => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };

    const paintLive = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";
      const lineInk = rgba(pal.line, 1), glowInk = rgba(pal.glow, 1), headInk = rgba(pal.head, 1);

      // Background traffic: a couple of faint dots always drifting between each pair of hubs, glimmering as they go
      ctx.fillStyle = lineInk;
      links.forEach((l, li) => {
        for (let k = 0; k < 2; k++) {
          const f = ((now * FLOW) / l.len + k / 2 + li * 0.37) % 1;
          const pt = at(l, li % 2 ? f : 1 - f);
          const glimmer = 0.35 + 0.65 * wave(now / 420 + li * 2.3 + k * 3.1);
          for (const s of l.shifts) {
            ctx.globalAlpha = fade(pt.x + s, pt.y) * glimmer * (pal.dark ? 0.5 : 0.4);
            dot(pt.x + s, pt.y, 1.2);
          }
        }
      });

      ctx.globalCompositeOperation = pal.dark ? "lighter" : "source-over";

      // Wi-Fi signals: three arcs lighting one after another from the hub outward, then fading
      ctx.strokeStyle = rgba(pal.line, pal.dark ? 0.85 : 0.7);
      ctx.lineWidth = 1.8;
      for (const sg of signals) {
        const { x, y } = nodes[sg.node];
        const edge = fade(x, y);
        for (let i = 0; i < 3; i++) {
          const e = (now - sg.t0 - i * 130) / (SIGNAL - 2 * 130);
          if (e < 0 || e >= 1) continue;
          ctx.globalAlpha = edge * (e < 0.15 ? e / 0.15 : 1 - (e - 0.15) / 0.85);
          ctx.beginPath();
          ctx.arc(x, y, 6.5 + i * 5.5 + e * 3, sg.angle - 0.8, sg.angle + 0.8);
          ctx.stroke();
        }
      }

      // Packets: a softly blinking dot with a short wake of fainter dots
      for (const f of flights) {
        const k = (now - f.t0) / f.dur;
        if (k < 0) continue;
        const l = links[f.li];
        const t = easeInOut(Math.min(k, 1));
        const along = (u: number) => at(l, f.dir === 1 ? u : 1 - u);
        const head = along(t);
        const blink = wave((now - f.t0) / BLINK - Math.PI / 2);
        for (const s of l.shifts) {
          const edge = fade(head.x + s, head.y);
          if (!edge) continue;
          ctx.fillStyle = lineInk;
          for (let j = 3; j >= 1; j--) {
            const u = t - j * 0.035;
            if (u <= 0) continue;
            const pt = along(u);
            ctx.globalAlpha = edge * (0.6 - j * 0.16) * 0.9;
            dot(pt.x + s, pt.y, 2.3 - j * 0.4);
          }
          ctx.globalAlpha = edge;
          const r = 10 + blink * 6;
          const halo = ctx.createRadialGradient(head.x + s, head.y, 0, head.x + s, head.y, r);
          halo.addColorStop(0, rgba(pal.glow, 0.35 + blink * 0.45));
          halo.addColorStop(1, rgba(pal.glow, 0));
          ctx.fillStyle = halo;
          ctx.fillRect(head.x + s - r, head.y - r, r * 2, r * 2);
          ctx.fillStyle = headInk;
          ctx.globalAlpha = edge * (0.65 + blink * 0.35);
          dot(head.x + s, head.y, 2.7);
        }
      }

      // Delivery: two soft rings spread out from the destination
      ctx.strokeStyle = rgba(pal.glow, pal.dark ? 0.7 : 0.8);
      ctx.lineWidth = 1.3;
      for (const r of ripples) {
        const { x, y } = nodes[r.node];
        const edge = fade(x, y);
        for (let i = 0; i < 2; i++) {
          const e = (now - r.t0 - i * 220) / (RIPPLE - 220);
          if (e < 0 || e >= 1) continue;
          ctx.globalAlpha = edge * (1 - e);
          ctx.beginPath();
          ctx.arc(x, y, 3 + easeOut(e) * 22, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Hubs breathe gently, each on its own beat, and brighten whenever they send or receive
      const glowOf = (n: number) => Math.max(0, 1 - (now - flash[n]) / 1000);
      ctx.fillStyle = glowInk;
      nodes.forEach(({ x, y }, n) => {
        const g = glowOf(n);
        const breath = wave(now / 900 + n * 1.7);
        ctx.globalAlpha = fade(x, y) * (0.1 + breath * 0.12 + g * 0.3);
        dot(x, y, 4 + breath * 1.5 + g * 3);
      });
      ctx.fillStyle = headInk;
      nodes.forEach(({ x, y }, n) => {
        ctx.globalAlpha = fade(x, y) * (0.7 + glowOf(n) * 0.3);
        dot(x, y, 2.1);
      });
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    let raf = 0;
    let last = 0;
    let running = false;
    const frame = (t: number) => {
      now += Math.min(t - (last || t), 64);
      last = t;
      step();
      paintLive();
      raf = requestAnimationFrame(frame);
    };
    const play = () => {
      if (running || still) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const redraw = () => {
      paintBase();
      paintLive();
    };

    layout();
    if (!still) {
      // Run the network for a few seconds up front so the first frame already has traffic on it
      for (let i = 0; i < 100; i++, now += 50) step();
    }
    redraw();

    const resize = new ResizeObserver(() => {
      if (wrap.clientWidth === w && wrap.clientHeight === h) return;
      layout();
      redraw();
    });
    resize.observe(wrap);

    const theme = new MutationObserver(() => {
      pal = palette(wrap);
      redraw();
    });
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const seen = new IntersectionObserver(([entry]) => (entry.isIntersecting ? play() : pause()));
    seen.observe(wrap);

    return () => {
      pause();
      resize.disconnect();
      theme.disconnect();
      seen.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} className="net-map pointer-events-none absolute inset-x-0 top-0" aria-hidden="true">
      <canvas ref={baseRef} />
      <canvas ref={liveRef} />
    </div>
  );
}
