import { useCallback, useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/hooks/use-motion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=/<>";

/**
 * Decodes text from random glyphs, left to right.
 * Runs when `start` becomes true (after `delay` ms) and, with `replayOnHover`,
 * again whenever the nearest link/button (or the text itself) is hovered.
 */
export default function ScrambleText({
  text,
  start = true,
  delay = 0,
  duration = 800,
  replayOnHover = false,
  className = "",
}: {
  text: string;
  start?: boolean;
  delay?: number;
  duration?: number;
  replayOnHover?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const frame = useRef(0);
  const [out, setOut] = useState(text);

  const run = useCallback(() => {
    cancelAnimationFrame(frame.current);
    if (prefersReducedMotion()) {
      setOut(text);
      return;
    }
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const revealed = Math.floor(p * text.length);
      let s = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        s += i < revealed || ch === " " ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setOut(s);
      if (p < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }, [text, duration]);

  useEffect(() => {
    if (!start) return;
    const id = window.setTimeout(run, delay);
    return () => {
      window.clearTimeout(id);
      cancelAnimationFrame(frame.current);
    };
  }, [start, delay, run]);

  useEffect(() => {
    if (!replayOnHover) return;
    const host = ref.current?.closest("a, button") ?? ref.current;
    if (!host) return;
    host.addEventListener("mouseenter", run);
    return () => host.removeEventListener("mouseenter", run);
  }, [replayOnHover, run]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{out}</span>
    </span>
  );
}
