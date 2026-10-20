import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { hasFinePointer, prefersReducedMotion } from "@/hooks/use-motion";

const INTERACTIVE = "a, button, input, textarea, select, label, [role='tab']";

/**
 * Site-wide pointer effects, mounted once:
 *  - feeds --sx/--sy to the hovered `.spotlight` element (cursor-following glow)
 *  - a blueprint crosshair cursor that trails the pointer, grows over interactive
 *    elements and turns into a "View" badge over `[data-cursor="view"]`
 * The cursor is skipped on touch devices and when reduced motion is requested.
 */
export default function MotionLayer() {
  const [cursor, setCursor] = useState(false);
  const layer = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const badge = useRef<HTMLDivElement>(null);

  // Spotlight position for any `.spotlight` element under the pointer
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.<HTMLElement>(".spotlight");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--sx", `${e.clientX - r.left}px`);
      el.style.setProperty("--sy", `${e.clientY - r.top}px`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    setCursor(hasFinePointer() && !prefersReducedMotion());
  }, []);

  useEffect(() => {
    if (!cursor) return;
    const root = layer.current!;
    let x = -100,
      y = -100,
      rx = x,
      ry = y,
      raf = 0;

    const loop = () => {
      rx += (x - rx) * 0.2;
      ry += (y - ry) * 0.2;
      dot.current!.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      const t = `translate3d(${rx}px, ${ry}px, 0)`;
      ring.current!.style.transform = t;
      badge.current!.style.transform = t;
      raf = Math.abs(x - rx) + Math.abs(y - ry) > 0.2 ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (root.dataset.visible !== "true") {
        rx = e.clientX;
        ry = e.clientY;
        root.dataset.visible = "true";
      }
      x = e.clientX;
      y = e.clientY;
      kick();
    };
    const onOver = (e: PointerEvent) => {
      const t = e.target as Element;
      root.dataset.state = t.closest("[data-cursor='view']") ? "view" : t.closest(INTERACTIVE) ? "hover" : "";
    };
    const onLeave = () => (root.dataset.visible = "false");
    const onDown = () => (root.dataset.down = "true");
    const onUp = () => (root.dataset.down = "false");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [cursor]);

  if (!cursor) return null;

  return (
    <div ref={layer} className="cursor-layer" aria-hidden="true">
      <div ref={ring} className="cursor-ring">
        <svg viewBox="0 0 40 40" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M1 11V1h10M29 1h10v10M39 29v10H29M11 39H1V29" />
        </svg>
      </div>
      <div ref={badge} className="cursor-badge">
        <span className="cut-sm flex h-full w-full items-center justify-center gap-1 bg-signal font-display text-xs font-bold uppercase tracking-wider text-ink">
          View <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
      <div ref={dot} className="cursor-dot" />
    </div>
  );
}
