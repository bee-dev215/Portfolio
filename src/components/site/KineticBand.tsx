import { Fragment, useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/hooks/use-motion";

const Star = () => (
  <svg viewBox="0 0 24 24" className="kinetic-star" aria-hidden="true">
    <path fill="currentColor" d="M12 0c.9 6.6 5.4 11.1 12 12-6.6.9-11.1 5.4-12 12-.9-6.6-5.4-11.1-12-12C6.6 11.1 11.1 6.6 12 0Z" />
  </svg>
);

/**
 * Kinetic word band: the words slide across in a loop, and scrolling speeds them up, pushes them the way the reader is
 * scrolling and leans them into the motion. Alternate words are outlined. `tape` draws it as a thin tilted ink strip in
 * mono caps instead of giant letters. Decorative: screen readers get the words once, as a plain list.
 */
export default function KineticBand({
  words,
  tape = false,
  reverse = false,
  speed = 0.6,
  className = "",
}: {
  words: string[];
  tape?: boolean;
  reverse?: boolean;
  speed?: number; // pixels per frame at rest
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = host.current;
    const el = row.current;
    if (!h || !el || prefersReducedMotion()) return;

    let offset = 0;
    let boost = 0; // extra speed from scrolling, decays each frame
    let dir = reverse ? 1 : -1;
    let lastY = window.scrollY;
    let raf = 0;
    let visible = false;

    const frame = () => {
      const half = el.scrollWidth / 2; // the words are drawn twice; looping by half is seamless
      offset += dir * (speed + boost);
      if (offset <= -half) offset += half;
      if (offset > 0) offset -= half;
      boost *= 0.92;
      const skew = Math.max(-12, Math.min(12, boost * dir * -1.4));
      el.style.transform = `translate3d(${offset.toFixed(2)}px,0,0) skewX(${skew.toFixed(2)}deg)`;
      raf = visible ? requestAnimationFrame(frame) : 0;
    };
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      if (!visible) return;
      boost = Math.min(18, boost + Math.abs(dy) * 0.12);
      // scrolling down runs the band its own way; scrolling up turns it around
      dir = (dy >= 0 ? 1 : -1) * (reverse ? 1 : -1);
    };
    const obs = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    });
    obs.observe(h);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reverse, speed]);

  // Enough copies that one half is always wider than the screen
  const run = Array.from({ length: tape ? 3 : 2 }, () => words).flat();

  return (
    <div ref={host} className={`kinetic ${tape ? "kinetic-tape" : ""} ${className}`}>
      <ul className="sr-only">
        {words.map((w) => (
          <li key={w}>{w}</li>
        ))}
      </ul>
      <div ref={row} className="kinetic-row" aria-hidden="true">
        {[0, 1].map((copy) => (
          <span key={copy}>
            {run.map((w, i) => (
              <Fragment key={`${copy}-${i}`}>
                <em className={`not-italic ${tape ? "" : i % 2 ? "kinetic-outline" : "kinetic-fill"}`}>{w}</em>
                <Star />
              </Fragment>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
