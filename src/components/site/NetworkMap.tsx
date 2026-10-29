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

// The backbone: land trunks and the big subsea cables. Pairs more than 180° apart cross the Pacific and wrap around
// the map's edges.
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
const SPEED = 0.34; // packet speed along a link, px per ms
const DWELL = 160; // pause at each hub while it routes the packet on, ms
const LEAD = 380; // the route lights up this long before the packet leaves, ms
const TAIL = 0.4; // comet tail, as a share of the hop's duration
const FADE = 700; // the route fades this long after delivery, ms
const RIPPLE = 1100; // ms
// Edge fade, baked into the drawing (a CSS mask would re-composite the whole layer every frame): full strength inside
// an ellipse around the middle, easing out toward the sides and bottom, and clear of the header at the top.
// Fractions of the canvas size.
const EDGE = { x: 0.5, y: 0.46, rx: 0.68, ry: 0.78, from: 0.55, top: [0.04, 0.2] } as const;
const FLOW = 0.028; // speed of the faint background traffic, px per ms

type Pt = { x: number; y: number };
type Link = { a: number; b: number; p0: Pt; c: Pt; p1: Pt; len: number; shifts: number[] };
type Hop = { li: number; dir: 1 | -1 };
type Packet = { route: number[]; hops: Hop[]; hop: number; flying: boolean; until: number; t0: number; end: number };
type Trail = Hop & { t0: number; dur: number };
type Ripple = { node: number; t0: number; last: boolean };

const rgba = (c: string, a: number) => `rgb(${c} / ${a})`;
const easeInOut = (t: number) => 0.5 - Math.cos(Math.PI * t) / 2;
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];

/** Point on a link's curve, t from 0 (hub a) to 1 (hub b). */
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
 * Hero backdrop: a dotted world map carrying a global broadband network. Faint traffic streams along every backbone
 * link while individual packets are routed hub to hub (the route lights up, the packet hops across with a comet
 * tail, each hub pulses as it hands the packet on, and the destination ripples on delivery). Pauses off screen;
 * under reduced motion it draws the map and hubs once and stays still.
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
    let trails: Trail[] = [];
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
        // Bow each link upward, away from the map, like a great-circle route
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

    const strokeLink = (c: CanvasRenderingContext2D, l: Link) => {
      for (const s of l.shifts) {
        c.moveTo(l.p0.x + s, l.p0.y);
        c.quadraticCurveTo(l.c.x + s, l.c.y, l.p1.x + s, l.p1.y);
      }
    };

    // The still layer: land dots (each a touch lighter or darker, for texture) and the backbone in hairlines
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
      c.beginPath();
      links.forEach((l) => strokeLink(c, l));
      c.strokeStyle = rgba(pal.line, pal.dark ? 0.2 : 0.17);
      c.lineWidth = 1;
      c.stroke();

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
        packets.push({ route, hops, hop: 0, flying: false, until: now + LEAD, t0: now, end: 0 });
        ripples.push({ node: route[0], t0: now, last: false });
        flash[route[0]] = now;
        return;
      }
    };

    const step = () => {
      if (now >= nextSpawn) {
        if (packets.filter((p) => !p.end).length < (w < 640 ? 3 : 6)) spawn();
        nextSpawn = now + 650 + Math.random() * 900;
      }
      for (const p of packets) {
        if (p.end || now < p.until) continue;
        if (!p.flying) {
          const hop = p.hops[p.hop];
          const dur = 420 + links[hop.li].len / SPEED;
          trails.push({ ...hop, t0: p.until, dur });
          p.flying = true;
          p.until += dur;
        } else {
          const node = p.route[++p.hop];
          const last = p.hop === p.hops.length;
          ripples.push({ node, t0: p.until, last });
          flash[node] = p.until;
          p.flying = false;
          if (last) p.end = p.until;
          else p.until += DWELL;
        }
      }
      packets = packets.filter((p) => !p.end || now - p.end < FADE);
      trails = trails.filter((t) => now - t.t0 < t.dur * (1 + TAIL));
      ripples = ripples.filter((r) => now - r.t0 < RIPPLE);
    };

    const paintLive = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";

      // Background traffic: a couple of faint bits always streaming along every link
      ctx.fillStyle = rgba(pal.line, pal.dark ? 0.4 : 0.32);
      links.forEach((l, li) => {
        for (let k = 0; k < 2; k++) {
          const f = ((now * FLOW) / l.len + k / 2 + li * 0.37) % 1;
          const pt = at(l, li % 2 ? f : 1 - f);
          for (const s of l.shifts) {
            ctx.globalAlpha = fade(pt.x + s, pt.y);
            ctx.beginPath();
            ctx.arc(pt.x + s, pt.y, 1.1, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      // Routes being served: the whole path glows while its packet is on the way
      ctx.strokeStyle = rgba(pal.line, pal.dark ? 0.42 : 0.36);
      ctx.lineWidth = 1.4;
      for (const p of packets) {
        const fadeIn = Math.min(1, (now - p.t0) / LEAD);
        const fadeOut = p.end ? Math.max(0, 1 - (now - p.end) / FADE) : 1;
        for (const hop of p.hops) {
          const l = links[hop.li];
          const mid = at(l, 0.5);
          for (const s of l.shifts) {
            ctx.globalAlpha = fadeIn * fadeOut * fade(mid.x + s, mid.y);
            ctx.beginPath();
            ctx.moveTo(l.p0.x + s, l.p0.y);
            ctx.quadraticCurveTo(l.c.x + s, l.c.y, l.p1.x + s, l.p1.y);
            ctx.stroke();
          }
        }
      }

      ctx.globalCompositeOperation = pal.dark ? "lighter" : "source-over";

      // Packets: a bright head with a tail that tapers off behind it
      for (const t of trails) {
        const k = (now - t.t0) / t.dur;
        if (k < 0) continue;
        const l = links[t.li];
        const head = easeInOut(Math.min(k, 1));
        const tail = easeInOut(Math.min(Math.max(k - TAIL, 0), 1));
        const along = (u: number) => at(l, t.dir === 1 ? u : 1 - u);
        const a = along(tail), b = along(head);
        for (const s of l.shifts) {
          ctx.globalAlpha = fade(b.x + s, b.y);
          if (!ctx.globalAlpha) continue;
          const grad = ctx.createLinearGradient(a.x + s, a.y, b.x + s, b.y);
          grad.addColorStop(0, rgba(pal.glow, 0));
          grad.addColorStop(1, rgba(pal.head, 0.9));
          ctx.beginPath();
          for (let i = 0; i <= 14; i++) {
            const pt = along(tail + ((head - tail) * i) / 14);
            if (i) ctx.lineTo(pt.x + s, pt.y);
            else ctx.moveTo(pt.x + s, pt.y);
          }
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2.2;
          ctx.stroke();
          if (k < 1) {
            const glow = ctx.createRadialGradient(b.x + s, b.y, 0, b.x + s, b.y, 12);
            glow.addColorStop(0, rgba(pal.glow, 0.7));
            glow.addColorStop(1, rgba(pal.glow, 0));
            ctx.fillStyle = glow;
            ctx.fillRect(b.x + s - 12, b.y - 12, 24, 24);
            ctx.beginPath();
            ctx.arc(b.x + s, b.y, 2.4, 0, Math.PI * 2);
            ctx.fillStyle = rgba(pal.head, 1);
            ctx.fill();
          }
        }
      }

      // Hand-offs and deliveries ripple out from the hub
      for (const r of ripples) {
        const e = (now - r.t0) / RIPPLE;
        if (e < 0) continue;
        const { x, y } = nodes[r.node];
        ctx.globalAlpha = fade(x, y);
        ctx.beginPath();
        ctx.arc(x, y, 3 + easeOut(e) * (r.last ? 24 : 13), 0, Math.PI * 2);
        ctx.strokeStyle = rgba(r.last ? pal.glow : pal.line, (1 - e) * (r.last ? 0.75 : 0.45));
        ctx.lineWidth = r.last ? 1.5 : 1.1;
        ctx.stroke();
      }

      // Hubs, brightening for a moment whenever a packet passes through
      nodes.forEach(({ x, y }, n) => {
        const g = Math.max(0, 1 - (now - flash[n]) / 1000);
        ctx.globalAlpha = fade(x, y);
        ctx.beginPath();
        ctx.arc(x, y, 4.5 + g * 3, 0, Math.PI * 2);
        ctx.fillStyle = rgba(pal.glow, 0.16 + g * 0.3);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, 2.1, 0, Math.PI * 2);
        ctx.fillStyle = rgba(pal.head, 0.75 + g * 0.25);
        ctx.fill();
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
