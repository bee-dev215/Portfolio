import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/hooks/use-motion";

/**
 * Infinite marquee that reacts to scrolling: it speeds up and skews with scroll
 * velocity, follows the scroll direction, and slows down while hovered.
 */
export default function VelocityTicker({ items }: { items: string[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = wrap.current;
    const el = track.current;
    if (!host || !el || prefersReducedMotion()) return;

    const BASE = 45; // px per second
    let x = 0,
      boost = 0,
      dir = -1,
      hovering = false,
      lastY = window.scrollY,
      last = performance.now(),
      raf = 0;

    const tick = (now: number) => {
      const dt = Math.min(64, now - last) / 1000;
      last = now;
      boost *= 0.92;
      const speed = hovering ? BASE * 0.3 : BASE + boost;
      x += dir * speed * dt;
      const half = el.scrollWidth / 2;
      if (half > 0) {
        if (x <= -half) x += half;
        if (x > 0) x -= half;
      }
      const skew = Math.max(-8, Math.min(8, (boost / 120) * -dir));
      el.style.transform = `translate3d(${x}px, 0, 0) skewX(${skew.toFixed(2)}deg)`;
      raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      if (dy !== 0) dir = dy > 0 ? -1 : 1;
      boost = Math.min(900, boost + Math.abs(dy) * 6);
    };
    const enter = () => (hovering = true);
    const leave = () => (hovering = false);

    // Only animate while the ticker is on screen
    const obs = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    });
    obs.observe(host);
    window.addEventListener("scroll", onScroll, { passive: true });
    host.addEventListener("pointerenter", enter);
    host.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      obs.disconnect();
      window.removeEventListener("scroll", onScroll);
      host.removeEventListener("pointerenter", enter);
      host.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={wrap} className="relative overflow-hidden border-y border-ink bg-ink py-4 text-paper" aria-hidden="true">
      <div ref={track} className="flex w-max will-change-transform">
        {[0, 1].map((n) => (
          <div key={n} className="flex shrink-0 items-center gap-8 pr-8">
            {items.map((t, i) => (
              <span key={i} className="flex items-center gap-8 whitespace-nowrap font-display text-lg font-medium uppercase tracking-wider">
                {t}
                <span className="h-2 w-2 rotate-45 bg-signal" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
