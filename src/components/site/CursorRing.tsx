import { useEffect, useRef } from "react";
import { hasFinePointer, prefersReducedMotion } from "@/hooks/use-motion";

const CLICKABLE = "a, button, [role='button'], label, summary, select, .card-hover, .tilt";
const TEXT_ENTRY = "input, textarea, [contenteditable='true']";

/**
 * A ring that trails the pointer and swells over anything clickable, with a small dot right at the pointer. The native
 * cursor stays; the ring hides over text fields and when the pointer leaves the window. Fine pointers only, and off
 * under reduced motion.
 */
export default function CursorRing() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const r = ring.current;
    const d = dot.current;
    if (!r || !d || !hasFinePointer() || prefersReducedMotion()) return;

    let x = -100;
    let y = -100;
    let rx = x;
    let ry = y;
    let raf = 0;

    const tick = () => {
      rx += (x - rx) * 0.2;
      ry += (y - ry) * 0.2;
      r.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = Math.abs(x - rx) + Math.abs(y - ry) > 0.2 ? requestAnimationFrame(tick) : 0;
    };
    const setOn = (on: boolean) => {
      r.classList.toggle("is-on", on);
      d.classList.toggle("is-on", on);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      d.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      const el = e.target as Element | null;
      const typing = !!el?.closest?.(TEXT_ENTRY);
      setOn(!typing);
      r.classList.toggle("is-link", !typing && !!el?.closest?.(CLICKABLE));
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onDown = () => r.classList.add("is-down");
    const onUp = () => r.classList.remove("is-down");
    const onLeave = () => setOn(false);

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
