import { useEffect, useRef } from "react";
import { hasFinePointer, prefersReducedMotion } from "@/hooks/use-motion";

const GAP = 24; // grid spacing, CSS px
const DOT = 1.7; // resting dot radius
const REACH = 150; // how far the pointer's pull reaches
const PUSH = 16; // how far dots right under the pointer are pushed aside
const WAVE_EVERY = 5200; // ms between the rings of light that ripple out from the centre

const rgb = (el: Element, name: string, fallback: string) =>
  (getComputedStyle(el).getPropertyValue(name).trim() || fallback).split(/\s+/).map(Number) as [number, number, number];

/**
 * A field of brand dots behind the hero windows, drawn on a canvas. It fades out toward its edges and drifts slowly;
 * every few seconds a ring of light ripples out from the centre, and the dots near the pointer swell, brighten to cyan
 * and part around it. Pauses off screen; under reduced motion it draws once and stays still.
 */
export default function HeroDots({ className = "" }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const cvs = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = host.current;
    const canvas = cvs.current;
    const ctx = canvas?.getContext("2d");
    if (!el || !canvas || !ctx) return;

    const still = prefersReducedMotion();
    let w = 0;
    let h = 0;
    let dpr = 1;
    let brand = rgb(el, "--brand-text-rgb", "29 78 216");
    let sky = rgb(el, "--sky-rgb", "6 182 212");
    // Pointer in canvas space, eased toward the real one; `pull` fades the effect in and out as it enters and leaves
    const ptr = { x: -9999, y: -9999, tx: -9999, ty: -9999, pull: 0, on: false };

    const resize = () => {
      const r = el.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      draw(performance.now());
    };

    const draw = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) / 2;
      const drift = still ? 0 : ((t / 40000) * GAP) % GAP;
      const wave = still ? -1 : ((t % WAVE_EVERY) / WAVE_EVERY) * R * 1.2;

      for (let gy = -GAP + drift; gy < h + GAP; gy += GAP) {
        for (let gx = -GAP + drift; gx < w + GAP; gx += GAP) {
          const d = Math.hypot(gx - cx, gy - cy) / R;
          if (d >= 1) continue;
          // Edge fade: full strength out to 45% of the radius, then easing to nothing at the rim
          const edge = d < 0.45 ? 1 : 1 - (d - 0.45) / 0.55;
          let x = gx;
          let y = gy;
          let size = DOT;
          let heat = 0; // 0 = brand blue, 1 = bright cyan

          if (wave > 0) {
            const off = Math.abs(d * R - wave);
            if (off < 36) heat = Math.max(heat, (1 - off / 36) * 0.7 * (1 - wave / (R * 1.2)));
          }
          if (ptr.pull > 0.01) {
            const dx = gx - ptr.x;
            const dy = gy - ptr.y;
            const dist = Math.hypot(dx, dy);
            if (dist < REACH) {
              const k = (1 - dist / REACH) ** 2 * ptr.pull;
              const n = dist || 1;
              x += (dx / n) * PUSH * k;
              y += (dy / n) * PUSH * k;
              heat = Math.max(heat, k);
            }
          }
          size += heat * 1.6;
          const a = edge * (0.55 + heat * 0.45);
          const c = heat > 0 ? brand.map((v, i) => Math.round(v + (sky[i] - v) * heat)) : brand;
          ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    // Recolour when the theme flips
    const mo = new MutationObserver(() => {
      brand = rgb(el, "--brand-text-rgb", "29 78 216");
      sky = rgb(el, "--sky-rgb", "6 182 212");
      draw(performance.now());
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class"] });
    if (still) {
      return () => {
        ro.disconnect();
        mo.disconnect();
      };
    }

    let raf = 0;
    let visible = true;
    const tick = (t: number) => {
      raf = 0;
      ptr.x += (ptr.tx - ptr.x) * 0.14;
      ptr.y += (ptr.ty - ptr.y) * 0.14;
      ptr.pull += ((ptr.on ? 1 : 0) - ptr.pull) * 0.08;
      draw(t);
      if (visible && !document.hidden) raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      start();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", start);

    // The canvas sits behind the windows, so follow the pointer across the whole page and map it into canvas space
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (!ptr.on) {
        ptr.x = x;
        ptr.y = y;
      }
      ptr.tx = x;
      ptr.ty = y;
      ptr.on = x > -REACH && y > -REACH && x < w + REACH && y < h + REACH;
    };
    const onLeave = () => (ptr.on = false);
    if (hasFinePointer()) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", start);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={host} className={`hero-dots pointer-events-none ${className}`} aria-hidden="true">
      <canvas ref={cvs} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
