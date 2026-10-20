import { useEffect, useState } from "react";
import { prefersReducedMotion, useInView } from "@/hooks/use-motion";

/** Counts the number inside a value like "8+" or "20+" up from zero when it scrolls into view. */
export default function CountUp({ value, duration = 1600 }: { value: string; duration?: number }) {
  const [ref, inView] = useInView<HTMLSpanElement>({ threshold: 0.4 });
  const match = value.match(/^(\D*)(\d+)(.*)$/);
  const target = match ? Number(match[2]) : 0;
  const [n, setN] = useState(() => (prefersReducedMotion() ? target : 0));

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) {
      setN(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p); // easeOutExpo
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  if (!match) return <>{value}</>;

  return (
    <span ref={ref} className="tabular-nums">
      <span className="sr-only">{value}</span>
      <span aria-hidden="true">
        {match[1]}
        {n}
        {match[3]}
      </span>
    </span>
  );
}
