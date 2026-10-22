import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { hasFinePointer, prefersReducedMotion } from "@/hooks/use-motion";

const INTERACTIVE = "a, button, input, textarea, select, label, [role='tab']";
const CORNER = 8; // bracket arm length (matches .cursor-ring > i)
const FREE = 28; // bracket frame around the bare pointer
const HOVER = 44; // …over an interactive element too big to lock onto
const PAD = 7; // gap between a locked target and its brackets
const LOCK_MAX = { w: 560, h: 160 }; // full-width rows and textareas keep the free reticle

/**
 * Site-wide pointer effects, mounted once:
 *  - feeds --sx/--sy to the hovered `.spotlight` element (cursor-following glow)
 *  - a targeting cursor: a dot pinned to the pointer inside four brackets that lock onto the
 *    interactive element under it, clamp onto it while pressed, and give way to a "View" badge
 *    over `[data-cursor="view"]`. Brackets glide only between frames (exponential approach, so
 *    they never overshoot) and otherwise sit exactly on the pointer or the target.
 * The cursor is skipped on touch devices and when reduced motion is requested.
 */
export default function MotionLayer() {
  const [cursor, setCursor] = useState(false);
  const layer = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const corners = useRef<(HTMLElement | null)[]>([]);
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
    let px = -100,
      py = -100,
      down = false,
      glide = false,
      raf = 0,
      last = 0;
    let target: Element | null = null;
    const box = { x: px, y: py, w: FREE, h: FREE }; // drawn frame: centre + size

    const goal = () => {
      if (target) {
        const r = target.getBoundingClientRect();
        const pad = down ? 2 : PAD;
        return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width + pad * 2, h: r.height + pad * 2 };
      }
      const s = (root.dataset.state === "hover" ? HOVER : FREE) * (down ? 0.75 : 1);
      return { x: px, y: py, w: s, h: s };
    };

    const draw = () => {
      const l = box.x - box.w / 2,
        t = box.y - box.h / 2,
        r = box.x + box.w / 2 - CORNER,
        b = box.y + box.h / 2 - CORNER;
      [
        [l, t],
        [r, t],
        [r, b],
        [l, b],
      ].forEach(([x, y], i) => {
        const c = corners.current[i];
        if (c) c.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
      const p = `translate3d(${px}px, ${py}px, 0)`;
      dot.current!.style.transform = p;
      badge.current!.style.transform = p;
    };

    const loop = (now: number) => {
      raf = 0;
      if (target && !target.isConnected) retarget(null);
      const g = goal();
      if (glide) {
        // rAF stamps the frame's start, which can precede the event that kicked the loop: clamp so dt never goes negative
        const dt = last ? Math.min(66, Math.max(0, now - last)) : 16.67;
        const k = 1 - Math.pow(0.62, dt / 16.67);
        let settled = true;
        for (const key of ["x", "y", "w", "h"] as const) {
          box[key] += (g[key] - box[key]) * k;
          if (Math.abs(g[key] - box[key]) > 0.4) settled = false;
        }
        if (settled) glide = false;
      }
      if (!glide) Object.assign(box, g);
      last = now;
      draw();
      // keep running while gliding, and while locked so the frame rides along with scrolling targets
      if (glide || target) raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(loop);
      }
    };

    /** Works out what the pointer is over and re-frames if that changed. */
    function retarget(el: Element | null) {
      let next: Element | null = null;
      let state = "";
      if (el?.closest("[data-cursor='view']")) state = "view";
      else {
        const hit = el?.closest(INTERACTIVE);
        if (hit) {
          const r = hit.getBoundingClientRect();
          if (r.width <= LOCK_MAX.w && r.height <= LOCK_MAX.h) {
            next = hit;
            state = "lock";
          } else state = "hover";
        }
      }
      if (next === target && state === (root.dataset.state ?? "")) return;
      target = next;
      root.dataset.state = state;
      glide = true;
      kick();
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      px = e.clientX;
      py = e.clientY;
      if (root.dataset.visible !== "true") {
        Object.assign(box, { x: px, y: py });
        root.dataset.visible = "true";
      }
      kick();
    };
    const onOver = (e: PointerEvent) => retarget(e.target as Element);
    const onScroll = () => {
      if (root.dataset.visible === "true") retarget(document.elementFromPoint(px, py));
    };
    const onLeave = () => (root.dataset.visible = "false");
    const press = (isDown: boolean) => () => {
      down = isDown;
      root.dataset.down = String(isDown);
      glide = true;
      kick();
    };
    const onDown = press(true);
    const onUp = press(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [cursor]);

  if (!cursor) return null;

  return (
    <div ref={layer} className="cursor-layer" aria-hidden="true">
      <div className="cursor-ring">
        {[0, 1, 2, 3].map((i) => (
          <i key={i} ref={(n) => (corners.current[i] = n)} />
        ))}
      </div>
      <div ref={badge} className="cursor-badge">
        <span className="cut-sm flex h-full w-full items-center justify-center gap-1 bg-signal font-display text-xs font-bold uppercase tracking-wider text-on-signal">
          View <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
      <div ref={dot} className="cursor-dot" />
    </div>
  );
}
