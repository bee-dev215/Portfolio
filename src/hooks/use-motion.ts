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
