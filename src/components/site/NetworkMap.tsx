import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/hooks/use-motion";
import { LAND } from "./world-land";

// Exchange points of the network, as [longitude, latitude]
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

// Land trunks and the big subsea cables between the hubs. They are never drawn; their particles sit along them.
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
const ALONG = [0.25, 0.5, 0.75]; // where each route's particles sit, as a share of the way between its hubs
// Edge fade, baked into the drawing (a CSS mask would re-composite the whole layer every frame): full strength inside
// an ellipse around the middle, easing out toward the sides and bottom, and clear of the header at the top.
// Fractions of the canvas size.
const EDGE = { x: 0.5, y: 0.46, rx: 0.68, ry: 0.78, from: 0.55, top: [0.04, 0.2] } as const;

type Pt = { x: number; y: number };
// A light at a fixed spot: its edge fade, and the period (ms per radian) and phase of its blink
type Light = Pt & { edge: number; period: number; phase: number };

const rgba = (c: string, a: number) => `rgb(${c} / ${a})`;
const wave = (t: number) => 0.5 + 0.5 * Math.sin(t); // 0…1

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
 * Hero backdrop: a dotted world map with a global broadband network on it. The hubs breathe gently and particles sit
 * along the routes between them, each softly blinking on its own beat; nothing travels. Pauses off screen; under
 * reduced motion it draws everything once and stays still.
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
    let hubs: Light[] = [];
    let particles: Light[] = [];
    let now = 0; // own clock, so a paused map picks up where it left off

    const project = (lon: number, lat: number): Pt => ({
      x: x0 + ((lon + 180) / LAND.step) * cell,
      y: y0 + ((LAND.top - lat) / LAND.step) * cell,
    });

    const fade = (x: number, y: number) => {
      const d = Math.hypot((x / w - EDGE.x) / EDGE.rx, (y / h - EDGE.y) / EDGE.ry);
      const side = (1 - d) / (1 - EDGE.from);
      const top = (y / h - EDGE.top[0]) / (EDGE.top[1] - EDGE.top[0]);
      return Math.max(0, Math.min(1, side, top));
    };

    // Fixed per index, so the lights keep their rhythm through resizes
    const light = ({ x, y }: Pt, i: number, period: number): Light => ({
      x,
      y,
      edge: fade(x, y),
      period: period * (0.75 + ((i * 37) % 11) / 20),
      phase: i * 2.39,
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

      hubs = HUB_KEYS.map((k, n) => light(project(HUBS[k][0], HUBS[k][1]), n, 900));
      particles = LINKS.flatMap(([ka, kb]) => {
        const [lonA, latA] = HUBS[ka];
        let [lonB] = HUBS[kb];
        if (lonB - lonA > 180) lonB -= 360;
        else if (lonA - lonB > 180) lonB += 360;
        const p0 = project(lonA, latA);
        const p1 = project(lonB, HUBS[kb][1]);
        // Bow each route upward, away from the map, like a great-circle path
        const dx = p1.x - p0.x, dy = p1.y - p0.y;
        const sign = dx < 0 ? -1 : 1;
        const c = { x: (p0.x + p1.x) / 2 + sign * dy * 0.22, y: (p0.y + p1.y) / 2 - sign * dx * 0.22 };
        const shifts = p1.x > x0 + mapW ? [0, -mapW] : p1.x < x0 ? [0, mapW] : [0];
        return ALONG.flatMap((t) => {
          const u = 1 - t;
          const x = u * u * p0.x + 2 * u * t * c.x + t * t * p1.x;
          const y = u * u * p0.y + 2 * u * t * c.y + t * t * p1.y;
          return shifts.map((s) => ({ x: x + s, y }));
        });
      })
        .filter(({ x }) => x > -10 && x < w + 10)
        .map((pt, i) => light(pt, i, 420))
        .filter((p) => p.edge > 0);
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

    // Fills in the current fillStyle; callers vary only globalAlpha, so the canvas isn't re-parsing a colour per dot
    const dot = (x: number, y: number, r: number) => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };
    const level = (l: Light) => wave(now / l.period + l.phase);

    const paintLive = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = pal.dark ? "lighter" : "source-over";

      // Particles: a soft glow that swells as each one blinks on, then the dot itself
      ctx.fillStyle = rgba(pal.glow, 1);
      for (const p of particles) {
        ctx.globalAlpha = p.edge * level(p) ** 2 * 0.35;
        dot(p.x, p.y, 5);
      }
      ctx.fillStyle = rgba(pal.line, 1);
      for (const p of particles) {
        ctx.globalAlpha = p.edge * (0.15 + 0.75 * level(p));
        dot(p.x, p.y, 1.6);
      }

      // Hubs breathe gently, each on its own beat
      ctx.fillStyle = rgba(pal.glow, 1);
      for (const hub of hubs) {
        const b = level(hub);
        ctx.globalAlpha = hub.edge * (0.12 + b * 0.16);
        dot(hub.x, hub.y, 4 + b * 2);
      }
      ctx.fillStyle = rgba(pal.head, 1);
      for (const hub of hubs) {
        ctx.globalAlpha = hub.edge * 0.85;
        dot(hub.x, hub.y, 2.1);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    let raf = 0;
    let last = 0;
    let running = false;
    const frame = (t: number) => {
      now += Math.min(t - (last || t), 64);
      last = t;
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
