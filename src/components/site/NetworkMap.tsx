import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/hooks/use-motion";
import { LAND } from "./world-land";
import { ZONE_CITIES } from "./world-hubs";

const MIN_MAP_W = 960; // narrower screens show part of a map this wide…
const NARROW_CENTER = 10; // …centred between the Americas and Asia (longitude)
// Edge fade, baked into the drawing (a CSS mask would re-composite the whole layer every frame): full strength inside
// an ellipse around the middle, easing out toward the sides and bottom, and clear of the header at the top.
// Fractions of the canvas size.
const EDGE = { x: 0.5, y: 0.46, rx: 0.68, ry: 0.78, from: 0.55, top: [0, 0.12] } as const;
// Assembly: the land dots start scattered like sand and swirl into the map as the section scrolls up. It begins as the
// section's top rises past `from` of the viewport height and is complete by `to`. Each dot waits up to `stagger` of the
// way before setting off; `swirl` is how far (radians) its path turns on the way in; `ease` is the scroll lag (ms).
const GATHER = { from: 0.85, to: 0.1, stagger: 0.5, swirl: 1.1, ease: 180 } as const;
const SHADES = [0.15, 0.21, 0.27, 0.35]; // land dots, each a touch lighter or darker for texture

type Pt = { x: number; y: number };
// A light at a fixed spot: its edge fade, and the period (ms per radian) and phase of its blink
type Light = Pt & { edge: number; period: number; phase: number };

const rgba = (c: string, a: number) => `rgb(${c} / ${a})`;
const wave = (t: number) => 0.5 + 0.5 * Math.sin(t); // 0…1
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** A stable pseudo-random 0…1 per (index, salt), so the scatter looks the same after a resize. */
const hash = (i: number, salt: number) => {
  let x = Math.imul(i ^ Math.imul(salt, 0x9e3779b9), 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  x ^= x >>> 16;
  return (x >>> 0) / 4294967296;
};

/** Brand colours as RGB channels, read from the site tokens so the map follows the light/dark theme. */
const palette = (el: Element) => {
  const css = getComputedStyle(el);
  const v = (name: string) => css.getPropertyValue(name).trim();
  const dark = document.documentElement.dataset.theme === "dark";
  return {
    dark,
    dot: dark ? v("--brand-text-rgb") : v("--line-rgb"),
    glow: v("--sky-rgb"),
    head: dark ? "224 242 254" : v("--brand-rgb"),
  };
};

/**
 * A dotted world map with a light in each of the world's main time zones. As the section scrolls into view the dots
 * gather from a scatter into the map (and scatter again on the way back up); once it has formed, the city lights come on
 * and breathe gently, each on its own beat. Pauses off screen; under reduced motion it draws the formed map once and
 * stays still.
 */
export default function NetworkMap({ className = "" }: { className?: string }) {
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
    let w = 0, h = 0, dpr = 1, cell = 0, x0 = 0, y0 = 0;
    let hubs: Light[] = [];
    let now = 0; // own clock, so a paused map picks up where it left off
    const section = wrap.parentElement ?? wrap; // measured instead of the wrapper, which drifts with the scroll

    // Every land dot, once: grid position and shade
    const landRow: number[] = [], landCol: number[] = [], landShade: number[] = [];
    for (let row = 0; row < LAND.rows; row++) {
      for (let col = 0; col < LAND.cols; col++) {
        const i = row * LAND.cols + col;
        if (!((land[i >> 3] >> (7 - (i & 7))) & 1)) continue;
        landRow.push(row);
        landCol.push(col);
        landShade.push(((row * 7919) ^ (col * 104729)) % SHADES.length);
      }
    }
    // The on-screen dots for the current layout: where each lands, how far off it starts, when it sets off, its shade
    let dots = {
      n: 0,
      tx: new Float32Array(0),
      ty: new Float32Array(0),
      ox: new Float32Array(0),
      oy: new Float32Array(0),
      delay: new Float32Array(0),
      shade: new Uint8Array(0),
    };

    // How formed the map should be at the current scroll position (0 scattered … 1 formed), and how formed it is shown
    const gatherGoal = () => {
      if (still) return 1;
      const vh = window.innerHeight || 1;
      return clamp01((vh * GATHER.from - section.getBoundingClientRect().top) / (vh * (GATHER.from - GATHER.to)));
    };
    let formed = gatherGoal();

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
      const mapW = Math.max(w, MIN_MAP_W);
      cell = mapW / LAND.cols;
      x0 = Math.min(0, Math.max(w - mapW, w / 2 - ((NARROW_CENTER + 180) / 360) * mapW));
      y0 = Math.max(0, (h - LAND.rows * cell) * 0.6);
      for (const cv of [baseCtx.canvas, ctx.canvas]) {
        cv.width = Math.round(w * dpr);
        cv.height = Math.round(h * dpr);
      }

      // Land dots: each starts somewhere random across the canvas and sets off a little later the farther it sits from
      // the middle, so the map forms from the centre outward with some sand-like jitter
      const r = Math.max(0.75, cell * 0.2);
      const keep: number[] = [];
      for (let k = 0; k < landRow.length; k++) {
        const x = x0 + (landCol[k] + 0.5 + (landRow[k] & 1) * 0.5) * cell;
        if (x >= -r && x <= w + r) keep.push(k);
      }
      const n = keep.length;
      // The scatter covers the map's own band (a little taller), not the whole section, so the sand reads as a cloud
      const mapH = LAND.rows * cell;
      const sy0 = Math.max(0, y0 - mapH * 0.15);
      const sy1 = Math.min(h, y0 + mapH * 1.1);
      dots = {
        n,
        tx: new Float32Array(n),
        ty: new Float32Array(n),
        ox: new Float32Array(n),
        oy: new Float32Array(n),
        delay: new Float32Array(n),
        shade: new Uint8Array(n),
      };
      keep.forEach((k, j) => {
        const tx = x0 + (landCol[k] + 0.5 + (landRow[k] & 1) * 0.5) * cell;
        const ty = y0 + landRow[k] * cell;
        const id = landRow[k] * LAND.cols + landCol[k];
        dots.tx[j] = tx;
        dots.ty[j] = ty;
        dots.ox[j] = (hash(id, 1) * 1.3 - 0.15) * w - tx;
        dots.oy[j] = sy0 + hash(id, 2) * (sy1 - sy0) - ty;
        const far = Math.min(1, Math.hypot((tx - w / 2) / (w / 2), (ty - h / 2) / (h / 2)) / 1.3);
        dots.delay[j] = GATHER.stagger * (0.55 * hash(id, 3) + 0.45 * far);
        dots.shade[j] = landShade[k];
      });

      hubs = ZONE_CITIES.map(([lon, lat], n) => light(project(lon, lat), n, 900));
    };

    // The land layer. Repainted only while the map is gathering; once formed it stays still.
    const paintBase = () => {
      const c = baseCtx;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.clearRect(0, 0, w, h);
      const r = Math.max(0.75, cell * 0.2);
      const span = 1 - GATHER.stagger;
      // Scattered grains are fainter; they firm up as they settle
      const strength = (0.7 + 0.3 * formed) * (pal.dark ? 1.3 : 1);
      SHADES.forEach((alpha, shade) => {
        c.beginPath();
        for (let j = 0; j < dots.n; j++) {
          if (dots.shade[j] !== shade) continue;
          let x = dots.tx[j], y = dots.ty[j], rr = r;
          const t = clamp01((formed - dots.delay[j]) / span);
          if (t < 1) {
            // Ease in along a gentle swirl: the leftover offset shrinks and turns as the dot closes in
            const left = (1 - t) ** 3;
            const a = GATHER.swirl * left;
            const cos = Math.cos(a), sin = Math.sin(a);
            const ox = dots.ox[j] * left, oy = dots.oy[j] * left;
            x += ox * cos - oy * sin;
            y += ox * sin + oy * cos;
            rr = r * (0.75 + 0.25 * (1 - left));
          }
          c.moveTo(x + rr, y);
          c.arc(x, y, rr, 0, Math.PI * 2);
        }
        c.fillStyle = rgba(pal.dot, alpha * strength);
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
      // The city lights come on only as the map finishes forming
      const lit = clamp01((formed - 0.8) / 0.2) ** 2;
      if (lit === 0) return;
      ctx.globalCompositeOperation = pal.dark ? "lighter" : "source-over";

      // Each city breathes gently on its own beat: a soft glow that swells, then the light itself
      ctx.fillStyle = rgba(pal.glow, 1);
      for (const hub of hubs) {
        const b = level(hub);
        ctx.globalAlpha = lit * hub.edge * (0.12 + b * 0.18);
        dot(hub.x, hub.y, 4 + b * 2.5);
      }
      ctx.fillStyle = rgba(pal.head, 1);
      for (const hub of hubs) {
        ctx.globalAlpha = lit * hub.edge * 0.85;
        dot(hub.x, hub.y, 2.2);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    let raf = 0;
    let last = 0;
    let running = false;

    const frame = (t: number) => {
      const dt = Math.min(t - (last || t), 64);
      now += dt;
      last = t;
      // Follow the scroll with a little lag, so wheel steps glide instead of jumping
      const goal = gatherGoal();
      if (goal !== formed) {
        formed += (goal - formed) * (1 - Math.exp(-dt / GATHER.ease));
        if (Math.abs(goal - formed) < 0.002) formed = goal;
        paintBase();
      }
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

    const seen = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return pause();
      // Back on screen after a jump (an anchor link, a fast fling): start from where the page now is, not mid-gather
      if (!running && !still) {
        const goal = gatherGoal();
        if (goal === 0 || goal === 1) {
          formed = goal;
          redraw();
        }
      }
      play();
    });
    seen.observe(wrap);

    return () => {
      pause();
      resize.disconnect();
      theme.disconnect();
      seen.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} className={`net-map pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      <canvas ref={baseRef} />
      <canvas ref={liveRef} />
    </div>
  );
}
