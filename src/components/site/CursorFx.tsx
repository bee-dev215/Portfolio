import { useEffect, useRef } from "react";
import { hasFinePointer, prefersReducedMotion } from "@/hooks/use-motion";

const CLICKABLE = "a, button, [role='button'], label, summary, select, .card-hover";
const TEXT = "input:not([type='checkbox']):not([type='radio']), textarea, [contenteditable='true']";

/**
 * Pointer companions (mouse and trackpad only, off under reduced motion): a small dot right on the pointer, a ring that
 * trails it and swells over anything clickable, and a wide soft glow that follows behind the page content. All three
 * step aside over text fields, where the native caret matters. The native cursor stays.
 */
export default function CursorFx() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return;
    const r = ring.current!;
    const d = dot.current!;
    const g = glow.current!;
    const pos = { x: -100, y: -100 };
    const ringAt = { x: -100, y: -100 };
    const glowAt = { x: -100, y: -100 };
    let raf = 0;
    let shown = false;

    const tick = () => {
      ringAt.x += (pos.x - ringAt.x) * 0.2;
      ringAt.y += (pos.y - ringAt.y) * 0.2;
      glowAt.x += (pos.x - glowAt.x) * 0.08;
      glowAt.y += (pos.y - glowAt.y) * 0.08;
      d.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      r.style.transform = `translate3d(${ringAt.x}px, ${ringAt.y}px, 0)`;
      g.style.transform = `translate3d(${glowAt.x}px, ${glowAt.y}px, 0)`;
      const settled = Math.abs(pos.x - glowAt.x) + Math.abs(pos.y - glowAt.y) < 0.5;
      raf = settled ? 0 : requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const show = (on: boolean) => {
      shown = on;
      for (const el of [r, d, g]) el.classList.toggle("is-on", on);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!shown) {
        // Arrive in place rather than sliding in from the corner
        ringAt.x = glowAt.x = pos.x;
        ringAt.y = glowAt.y = pos.y;
        show(true);
      }
      const t = e.target as Element | null;
      const overText = !!t?.closest?.(TEXT);
      r.classList.toggle("is-link", !overText && !!t?.closest?.(CLICKABLE));
      r.classList.toggle("is-text", overText);
      d.classList.toggle("is-text", overText);
      kick();
    };
    const onDown = () => r.classList.add("is-down");
    const onUp = () => r.classList.remove("is-down");
    const onLeave = () => show(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <>
      <div ref={glow} className="cursor-glow" aria-hidden="true" />
      <div ref={ring} className="cursor-ring" aria-hidden="true">
        <span />
      </div>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
