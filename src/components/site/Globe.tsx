import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/hooks/use-motion";
import { LAND } from "./world-land";
import { HUBS, HUB_KEYS, LINKS } from "./world-hubs";

const DEG = Math.PI / 180;
const TILT = 18; // latitude at the centre of the view, so the inhabited north faces us
const START_LON = -25; // the Atlantic: the Americas, Europe and Africa all in view on first paint
const SPIN = 4.5; // degrees per second, eastward like the real Earth
const LIFT = 1.24; // canvas half-size over globe radius: room for the routes that arc off the surface
const SAMPLES = 40; // points per route

type P3 = { x: number; y: number; z: number };

const rgba = (c: string, a: number) => `rgb(${c} / ${a})`;

const unit = (lon: number, lat: number): P3 => {
  const cl = Math.cos(lat * DEG);
  return { x: cl * Math.sin(lon * DEG), y: Math.sin(lat * DEG), z: cl * Math.cos(lon * DEG) };
};

/** Brand colours as RGB channels, read from the site tokens so the globe follows the light/dark theme. */
const palette = (el: Element) => {
  const css = getComputedStyle(el);
  const v = (name: string) => css.getPropertyValue(name).trim();
  const dark = document.documentElement.dataset.theme === "dark";
  return {
    dark,
    land: dark ? v("--brand-text-rgb") : v("--line-rgb"),
    grid: dark ? v("--brand-text-rgb") : v("--brand-rgb"),
    route: dark ? v("--sky-rgb") : v("--brand-rgb"),
    pulse: dark ? "224 242 254" : v("--iris-rgb"),
    glow: v("--sky-rgb"),
    hub: dark ? "224 242 254" : v("--brand-rgb"),
  };
};

/**
 * A slowly turning dotted globe with the team's cities on it and routes arcing between them, each carrying a pulse.
 * Sized to its parent (keep it square). Pauses off screen; under reduced motion it draws one still view.
 */
export default function Globe({ className = "" }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const ctx = canvasRef.current?.getContext("2d");
    if (!wrap || !ctx) return;

    const still = prefersReducedMotion();
    let pal = palette(wrap);

    // Land as unit vectors, kept apart by axis so each frame's rotation is plain arithmetic
    const bits = Uint8Array.from(atob(LAND.bits), (ch) => ch.charCodeAt(0));
    const build = (stride: number) => {
      const xs: number[] = [], ys: number[] = [], zs: number[] = [];
      for (let row = 0; row < LAND.rows; row += stride) {
        const lat = LAND.top - row * LAND.step;
        // Fewer columns toward the poles, so the dots stay evenly spaced on the sphere
        const colStride = Math.max(stride, Math.round(stride / Math.max(0.2, Math.cos(lat * DEG))));
        for (let col = 0; col < LAND.cols; col += colStride) {
          const i = row * LAND.cols + col;
          if (!((bits[i >> 3] >> (7 - (i & 7))) & 1)) continue;
          const p = unit(-180 + (col + 0.5 + (row & 1) * 0.5) * LAND.step, lat);
          xs.push(p.x); ys.push(p.y); zs.push(p.z);
        }
      }
      return { xs: Float32Array.from(xs), ys: Float32Array.from(ys), zs: Float32Array.from(zs) };
    };
    const lands = new Map<number, ReturnType<typeof build>>();
    const landFor = (stride: number) => {
      if (!lands.has(stride)) lands.set(stride, build(stride));
      return lands.get(stride)!;
    };

    const hubs = HUB_KEYS.map((k) => unit(HUBS[k][0], HUBS[k][1]));

    // Each route: the great circle between two cities, lifted off the surface in proportion to its length
    const routes = LINKS.map(([a, b], n) => {
      const p = unit(HUBS[a][0], HUBS[a][1]);
      const q = unit(HUBS[b][0], HUBS[b][1]);
      const ang = Math.acos(Math.min(1, p.x * q.x + p.y * q.y + p.z * q.z));
      const s = Math.sin(ang) || 1;
      const height = 0.04 + ang * 0.16;
      const pts: P3[] = [];
      for (let k = 0; k <= SAMPLES; k++) {
        const t = k / SAMPLES;
        const wa = Math.sin((1 - t) * ang) / s, wb = Math.sin(t * ang) / s;
        const r = 1 + height * Math.sin(Math.PI * t);
        pts.push({ x: (wa * p.x + wb * q.x) * r, y: (wa * p.y + wb * q.y) * r, z: (wa * p.z + wb * q.z) * r });
      }
      return { pts, period: 2600 + ((n * 977) % 1900), phase: (n * 0.618) % 1 };
    });

    // Lines of latitude and longitude, as sampled circles
    const grid: P3[][] = [];
    for (let lat = -60; lat <= 60; lat += 30) {
      const ring: P3[] = [];
      for (let lon = -180; lon <= 180; lon += 4) ring.push(unit(lon, lat));
      grid.push(ring);
    }
    for (let lon = -180; lon < 180; lon += 30) {
      const ring: P3[] = [];
      for (let lat = -90; lat <= 90; lat += 4) ring.push(unit(lon, lat));
      grid.push(ring);
    }

    let size = 0, dpr = 1, R = 0, c = 0;
    let land = landFor(1);
    let lon0 = START_LON;
    // Rotation as a matrix: spin about the pole, then tilt toward the viewer
    let m = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    const orient = () => {
      const a = -lon0 * DEG, t = TILT * DEG;
      const ca = Math.cos(a), sa = Math.sin(a), ct = Math.cos(t), st = Math.sin(t);
      // y-axis spin, then x-axis tilt
      m = [ca, 0, sa, st * sa, ct, -st * ca, -ct * sa, st, ct * ca];
    };
    const view = (p: P3): P3 => ({
      x: m[0] * p.x + m[1] * p.y + m[2] * p.z,
      y: m[3] * p.x + m[4] * p.y + m[5] * p.z,
      z: m[6] * p.x + m[7] * p.y + m[8] * p.z,
    });
    // A point off the surface is hidden only while the globe's disc covers it
    const shown = (v: P3) => v.z > 0 || v.x * v.x + v.y * v.y > 1;

    const layout = () => {
      size = Math.min(wrap.clientWidth, wrap.clientHeight);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      R = size / 2 / LIFT;
      c = size / 2;
      ctx.canvas.width = Math.round(size * dpr);
      ctx.canvas.height = Math.round(size * dpr);
      ctx.canvas.style.width = `${size}px`;
      ctx.canvas.style.height = `${size}px`;
      // Smaller globes take every other dot, so the land stays dotted rather than solid
      land = landFor(R < 170 ? 2 : 1);
    };

    const paint = (now: number) => {
      orient();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);

      // Atmosphere: a soft halo hugging the rim
      const halo = ctx.createRadialGradient(c, c, R * 0.92, c, c, R * 1.16);
      halo.addColorStop(0, rgba(pal.glow, pal.dark ? 0.22 : 0.16));
      halo.addColorStop(1, rgba(pal.glow, 0));
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(c, c, R * 1.16, 0, Math.PI * 2);
      ctx.fill();

      // The sphere itself, lit from the upper left
      const body = ctx.createRadialGradient(c - R * 0.35, c - R * 0.4, R * 0.1, c, c, R);
      body.addColorStop(0, rgba(pal.glow, pal.dark ? 0.1 : 0.07));
      body.addColorStop(1, rgba(pal.grid, pal.dark ? 0.05 : 0.04));
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(c, c, R, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = rgba(pal.grid, pal.dark ? 0.28 : 0.18);
      ctx.lineWidth = 1;
      ctx.stroke();

      // Graticule, front half only
      ctx.strokeStyle = rgba(pal.grid, pal.dark ? 0.12 : 0.08);
      ctx.beginPath();
      for (const ring of grid) {
        let pen = false;
        for (const p of ring) {
          const v = view(p);
          if (v.z <= 0) {
            pen = false;
            continue;
          }
          const x = c + v.x * R, y = c - v.y * R;
          if (pen) ctx.lineTo(x, y);
          else ctx.moveTo(x, y);
          pen = true;
        }
      }
      ctx.stroke();

      // Land: three passes by depth, so the dots dim and shrink toward the rim
      const { xs, ys, zs } = land;
      const dotR = Math.max(0.7, R * (land === lands.get(2) ? 0.011 : 0.0075));
      const bands = [
        { from: 0, to: 0.35, a: 0.25, r: 0.7 },
        { from: 0.35, to: 0.7, a: 0.45, r: 0.85 },
        { from: 0.7, to: 1.01, a: 0.65, r: 1 },
      ];
      for (const band of bands) {
        ctx.beginPath();
        const r = dotR * band.r;
        for (let i = 0; i < xs.length; i++) {
          const z = m[6] * xs[i] + m[7] * ys[i] + m[8] * zs[i];
          if (z < band.from || z >= band.to) continue;
          const x = c + (m[0] * xs[i] + m[1] * ys[i] + m[2] * zs[i]) * R;
          const y = c - (m[3] * xs[i] + m[4] * ys[i] + m[5] * zs[i]) * R;
          ctx.moveTo(x + r, y);
          ctx.arc(x, y, r, 0, Math.PI * 2);
        }
        ctx.fillStyle = rgba(pal.land, band.a * (pal.dark ? 0.95 : 0.75));
        ctx.fill();
      }

      // Routes: a faint arc, and a pulse that runs along it on its own clock
      ctx.lineCap = "round";
      for (const route of routes) {
        const vs = route.pts.map(view);
        ctx.strokeStyle = rgba(pal.route, pal.dark ? 0.35 : 0.3);
        ctx.lineWidth = 1;
        ctx.beginPath();
        let pen = false;
        vs.forEach((v) => {
          if (!shown(v)) {
            pen = false;
            return;
          }
          const x = c + v.x * R, y = c - v.y * R;
          if (pen) ctx.lineTo(x, y);
          else ctx.moveTo(x, y);
          pen = true;
        });
        ctx.stroke();

        const head = ((now / route.period + route.phase) % 1) * 1.4 - 0.2; // rests a beat between runs
        if (head < 0 || head > 1.2) continue;
        const tail = 0.22;
        ctx.lineWidth = 1.8;
        for (let k = 1; k < vs.length; k++) {
          const t = k / SAMPLES;
          const d = head - t;
          if (d < 0 || d > tail) continue;
          const a = vs[k - 1], b = vs[k];
          if (!shown(a) || !shown(b)) continue;
          ctx.strokeStyle = rgba(pal.pulse, (1 - d / tail) * 0.9);
          ctx.beginPath();
          ctx.moveTo(c + a.x * R, c - a.y * R);
          ctx.lineTo(c + b.x * R, c - b.y * R);
          ctx.stroke();
        }
      }

      // Cities on the near side: a breathing glow and a bright core
      hubs.forEach((p, n) => {
        const v = view(p);
        if (v.z <= 0.05) return;
        const x = c + v.x * R, y = c - v.y * R;
        const edge = Math.min(1, v.z * 3);
        const b = 0.5 + 0.5 * Math.sin(now / (700 + n * 37) + n * 2.39);
        ctx.fillStyle = rgba(pal.glow, edge * (0.12 + 0.18 * b));
        ctx.beginPath();
        ctx.arc(x, y, 4 + 3 * b, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = rgba(pal.hub, edge * 0.95);
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    let raf = 0, last = 0, clock = 0, running = false;
    const frame = (t: number) => {
      const dt = Math.min(t - (last || t), 64);
      last = t;
      clock += dt;
      lon0 -= (SPIN * dt) / 1000;
      paint(clock);
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

    layout();
    paint(clock);

    const resize = new ResizeObserver(() => {
      if (Math.min(wrap.clientWidth, wrap.clientHeight) === size) return;
      layout();
      paint(clock);
    });
    resize.observe(wrap);

    const theme = new MutationObserver(() => {
      pal = palette(wrap);
      paint(clock);
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
    <div ref={wrapRef} className={`globe pointer-events-none grid place-items-center ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
