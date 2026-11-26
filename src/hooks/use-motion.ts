import { useEffect, useRef, useState } from "react";

// ---------- Environment checks ----------
export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** True on devices with a precise pointer that can hover (mouse / trackpad). */
export const hasFinePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

// ---------- Hooks ----------

/**
 * Flips to true once the element scrolls into view. By default that is as soon as its top passes the lower tenth of
 * the window, so tall blocks reveal as promptly as short ones.
 */
export function useInView<T extends Element>({
  threshold = 0,
  rootMargin = "0px 0px -10% 0px",
}: { threshold?: number; rootMargin?: string } = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, rootMargin]);

  return [ref, inView] as const;
}

/**
 * Card spotlight: as a mouse moves over a hoverable card (`.card-hover` or `.spotlight`), writes the pointer's position
 * inside it to `--mx` / `--my` so the card's soft glow follows the cursor. One listener for the whole page; skipped on
 * touch screens and under reduced motion (the glow then sits in the middle of the card).
 */
export function useSpotlight() {
  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return;
    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest?.<HTMLElement>(".card-hover, .spotlight");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);
}

/**
 * Pointer play for the whole page, from one listener (fine pointers only, off under reduced motion):
 * - Magnetic buttons: a primary button (or anything with .magnetic) drifts a few pixels toward the pointer while it is
 *   over it, through the `translate` property so the hover lift and press still apply.
 * - Tilt: a hoverable card (.card-hover, or anything with .tilt) leans toward the pointer in 3D. Big cards lean less.
 */
export function useInteractions() {
  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return;
    let magnet: HTMLElement | null = null;
    let tilted: HTMLElement | null = null;

    const releaseMagnet = () => {
      if (!magnet) return;
      magnet.style.translate = "";
      magnet = null;
    };
    const releaseTilt = () => {
      if (!tilted) return;
      tilted.style.transform = "";
      tilted = null;
    };

    const onMove = (e: PointerEvent) => {
      const target = e.target as Element | null;

      const btn = target?.closest?.<HTMLElement>(".btn-primary, .magnetic");
      if (btn !== magnet) releaseMagnet();
      if (btn && !(btn as HTMLButtonElement).disabled) {
        magnet = btn;
        btn.classList.add("is-magnetic");
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        btn.style.translate = `${(dx * 6).toFixed(1)}px ${(dy * 5).toFixed(1)}px`;
      }

      const card = target?.closest?.<HTMLElement>(".card-hover, .tilt");
      if (card !== tilted) releaseTilt();
      if (card) {
        tilted = card;
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        const max = r.width > 700 ? 1.5 : r.width > 420 ? 3.5 : 6;
        card.style.transform = `perspective(1100px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg)`;
      }
    };
    const onLeave = () => {
      releaseMagnet();
      releaseTilt();
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      onLeave();
    };
  }, []);
}

/**
 * Ripples: a ring of light spreads from the exact spot a button (.btn) is clicked or tapped. One listener for the
 * whole page, on touch screens too; off under reduced motion. The ripple sits under the label (.btn is isolated).
 */
export function useRipples() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const btn = (e.target as Element | null)?.closest?.<HTMLElement>(".btn");
      if (!btn || (btn as HTMLButtonElement).disabled) return;
      const r = btn.getBoundingClientRect();
      const host = document.createElement("span");
      host.className = "ripple-host";
      host.setAttribute("aria-hidden", "true");
      const dot = document.createElement("i");
      const size = Math.hypot(r.width, r.height) * 2;
      dot.style.cssText = `left:${e.clientX - r.left}px;top:${e.clientY - r.top}px;width:${size}px;height:${size}px`;
      host.appendChild(dot);
      btn.appendChild(host);
      dot.addEventListener("animationend", () => host.remove(), { once: true });
      window.setTimeout(() => host.remove(), 1200); // in case the animation never runs (hidden tab)
    };
    document.addEventListener("pointerdown", onDown, { passive: true });
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);
}

/**
 * Pointer depth for a scene: while a mouse is over the element, writes the pointer's offset from its centre (−1 to 1,
 * eased) to `--tx` / `--ty` on it, so layers inside can tilt and shift by different amounts and the scene reads in 3D.
 * Eases back to 0 when the pointer leaves. Fine pointers only; off under reduced motion.
 */
export function usePointerDepth<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !hasFinePointer() || prefersReducedMotion()) return;
    const cur = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let raf = 0;
    const tick = () => {
      cur.x += (target.x - cur.x) * 0.08;
      cur.y += (target.y - cur.y) * 0.08;
      el.style.setProperty("--tx", cur.x.toFixed(4));
      el.style.setProperty("--ty", cur.y.toFixed(4));
      raf = Math.abs(target.x - cur.x) + Math.abs(target.y - cur.y) > 0.001 ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2));
      target.y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2));
      kick();
    };
    const onLeave = () => {
      target.x = target.y = 0;
      kick();
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return ref;
}

export type ScrollMode = "through" | "enter" | "exit" | "settle";

/** An element's scroll progress, clamped to 0–1. See useScrollScenes for what each mode measures. */
function scrollProgress(r: DOMRect, vh: number, mode: ScrollMode) {
  let p: number;
  if (mode === "exit") p = -r.top / Math.max(1, r.height);
  else if (mode === "settle") p = (vh - r.top) / (vh * 0.6);
  else if (mode === "enter") p = (vh - r.top) / Math.max(1, r.height);
  else p = (vh - r.top) / (vh + r.height);
  return Math.min(1, Math.max(0, p));
}

/**
 * Scroll-linked motion for the whole page, from one scroll listener: every element marked `data-scroll` gets its
 * progress (0–1) written to `--p` each frame while it is on screen, and its children animate off that in CSS.
 * - "through" (default): 0 as its top enters the bottom of the viewport, 1 as its bottom leaves the top (parallax).
 * - "exit": 0 while its top sits at the top of the viewport, 1 once it has scrolled fully out (the hero).
 * - "settle": 0 as its top enters, 1 once its top is 40% up the viewport (tilts and zooms that land early).
 * - "enter": 0 as its top enters, 1 once its bottom is in view.
 * Put `data-scroll` on a frame that doesn't move itself, so the motion can't feed back into the measurement.
 * Skipped under reduced motion, so CSS should give `var(--p, …)` its resting value.
 */
export function useScrollScenes(key?: string) {
  useEffect(() => {
    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll]"));
    if (!els.length) return;

    const visible = new Set<HTMLElement>();
    const write = (el: HTMLElement, vh: number) => {
      const mode = (el.dataset.scroll || "through") as ScrollMode;
      el.style.setProperty("--p", scrollProgress(el.getBoundingClientRect(), vh, mode).toFixed(4));
    };
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      visible.forEach((el) => write(el, vh));
    };
    const schedule = () => {
      if (!raf && visible.size) raf = requestAnimationFrame(update);
    };

    // Place everything once up front so nothing jumps on its first frame
    els.forEach((el) => write(el, window.innerHeight));
    const obs = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const el = e.target as HTMLElement;
        if (e.isIntersecting) visible.add(el);
        else {
          // A fast scroll can skip past the last frames: pin it to where it rests off screen (0 or 1)
          visible.delete(el);
          write(el, window.innerHeight);
        }
      }
      schedule();
    });
    els.forEach((el) => obs.observe(el));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      els.forEach((el) => el.style.removeProperty("--p"));
    };
  }, [key]);
}

/**
 * Writes the element's scroll progress (0–1) to the CSS variable `--p` on it, once per frame while it is on screen.
 * "through": 0 as its top enters the bottom of the viewport, 1 as its bottom leaves the top (parallax).
 * "enter": 0 as its top enters, 1 once its bottom is in view (fills that finish at the end of the page).
 * Skipped under reduced motion, so CSS should give `var(--p, …)` a sensible resting value.
 */
export function useScrollProgress<T extends HTMLElement>(mode: "through" | "enter" = "through") {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || typeof IntersectionObserver === "undefined") return;
    let raf = 0;
    let visible = false;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = mode === "enter" ? (vh - r.top) / Math.max(1, r.height) : (vh - r.top) / (vh + r.height);
      el.style.setProperty("--p", Math.min(1, Math.max(0, p)).toFixed(4));
    };
    const schedule = () => {
      if (visible && !raf) raf = requestAnimationFrame(update);
    };
    const obs = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      schedule();
    });
    obs.observe(el);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [mode]);

  return ref;
}
