import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

// ---------- Environment checks ----------
export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** True on devices with a precise pointer that can hover (mouse / trackpad). */
export const hasFinePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/** True where the browser can morph between DOM states (View Transitions API). */
export const supportsViewTransitions = () => typeof document !== "undefined" && "startViewTransition" in document;

let transitionRun = 0;

/**
 * Applies a React state update as a view transition: elements sharing a `view-transition-name` before and after morph
 * into each other and everything else cross-fades. `kind` is set as html[data-vt] for the duration so CSS can pick
 * the animation. Falls back to an instant update without support or under reduced motion.
 */
export function viewTransition(update: () => void, kind?: string): Promise<void> {
  if (!supportsViewTransitions() || prefersReducedMotion()) {
    update();
    return Promise.resolve();
  }
  const run = ++transitionRun;
  const html = document.documentElement;
  if (kind) html.dataset.vt = kind;
  else delete html.dataset.vt;
  const done = () => {
    if (run === transitionRun) delete html.dataset.vt;
  };
  return document.startViewTransition(() => flushSync(update)).finished.then(done, done);
}

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
