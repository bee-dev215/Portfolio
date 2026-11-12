import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/hooks/use-motion";

/**
 * Cycles through phrases in place: the current one slides up and out as the next rises in, and the box eases to the
 * new phrase's width. `itemClassName` goes on each phrase (e.g. gradient-text, which must sit on the moving text
 * itself to paint it). Screen readers get the first phrase only, and under reduced motion it stays on the first.
 */
export default function RotatingWords({
  words,
  interval = 2600,
  className = "",
  itemClassName = "",
}: {
  words: string[];
  interval?: number;
  className?: string;
  itemClassName?: string;
}) {
  const [i, setI] = useState(0);
  const box = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (words.length < 2 || prefersReducedMotion()) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % words.length), interval);
    return () => window.clearInterval(t);
  }, [words.length, interval]);

  // Fit the box to the current phrase (and again once the display font has loaded and on resize)
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => {
      const cur = el.children[i] as HTMLElement | undefined;
      if (!cur) return;
      const cs = getComputedStyle(el); // border-box sizing: the width includes the box's own padding
      el.style.width = `${cur.scrollWidth + parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight)}px`;
    };
    fit();
    document.fonts?.ready.then(fit);
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [i]);

  return (
    <>
      <span className="sr-only">{words[0]}</span>
      <span ref={box} className={`rotator ${className}`} aria-hidden="true">
        {words.map((w, k) => (
          <span key={w} className={`${itemClassName} ${k === i ? "" : k === (i - 1 + words.length) % words.length ? "is-before" : "is-after"}`}>
            {w}
          </span>
        ))}
      </span>
    </>
  );
}
