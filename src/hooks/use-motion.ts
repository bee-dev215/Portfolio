import { useEffect, useRef, useState, useSyncExternalStore } from "react";

// ---------- Environment checks ----------
export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** True on devices with a precise pointer that can hover (mouse / trackpad). */
export const hasFinePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

// ---------- Boot hand-off ----------
// index.html paints the boot screen and sets <html data-boot="pending">; src/boot.ts flips it to
// "done" and fires BOOT_EVENT as the bay doors part. Pages without a boot screen never set it.
export const BOOT_EVENT = "boot:done";

export const isBooted = () => typeof document === "undefined" || document.documentElement.dataset.boot !== "pending";

/** Calls `cb` once the boot screen opens (right away if it already has). Returns an unsubscribe. */
export function onBooted(cb: () => void) {
  if (isBooted()) {
    cb();
    return () => {};
  }
  window.addEventListener(BOOT_EVENT, cb, { once: true });
  return () => window.removeEventListener(BOOT_EVENT, cb);
}

const subscribeBoot = (cb: () => void) => {
  window.addEventListener(BOOT_EVENT, cb);
  return () => window.removeEventListener(BOOT_EVENT, cb);
};

/** True once the boot screen has opened, so entrances can wait for the doors. */
export const useBooted = () => useSyncExternalStore(subscribeBoot, isBooted, () => true);

// ---------- Hooks ----------

/** Flips to true once the element scrolls into view. */
export function useInView<T extends Element>({
  threshold = 0.1,
  rootMargin = "0px 0px -40px 0px",
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
