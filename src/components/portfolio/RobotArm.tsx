import { useEffect, useRef } from "react";
import { hasFinePointer, prefersReducedMotion } from "@/hooks/use-motion";

// Scene geometry (SVG user units)
const W = 480;
const H = 400;
const BASE = { x: 116, y: 332 };
const L1 = 150;
const L2 = 128;
const REACH = L1 + L2 - 2;
const DEG = 180 / Math.PI;

/** Two-link inverse kinematics, elbow-up. Returns joint angles in radians (SVG frame, y down). */
function solve(tx: number, ty: number) {
  const dx = tx - BASE.x;
  const dy = ty - BASE.y;
  const d = Math.min(REACH, Math.max(Math.abs(L1 - L2) + 4, Math.hypot(dx, dy)));
  const cos2 = (d * d - L1 * L1 - L2 * L2) / (2 * L1 * L2);
  const a2 = Math.acos(Math.max(-1, Math.min(1, cos2)));
  const a1 = Math.atan2(dy, dx) - Math.atan2(L2 * Math.sin(a2), L1 + L2 * Math.cos(a2));
  return { a1, a2 };
}

const fmt = (n: number, w = 3) => (n < 0 ? "-" : "+") + Math.abs(n).toFixed(1).padStart(w + 2, "0");

/**
 * An articulated robot arm that tracks the pointer anywhere on the page section it lives in,
 * closes its gripper while the mouse button is held, and runs an idle scan pattern otherwise.
 * Everything is driven through refs in a rAF loop — no React re-renders per frame.
 */
export default function RobotArm() {
  const svg = useRef<SVGSVGElement>(null);
  const link1 = useRef<SVGGElement>(null);
  const link2 = useRef<SVGGElement>(null);
  const jawA = useRef<SVGGElement>(null);
  const jawB = useRef<SVGGElement>(null);
  const reticle = useRef<SVGGElement>(null);
  const laser = useRef<SVGLineElement>(null);
  const readJ1 = useRef<HTMLSpanElement>(null);
  const readJ2 = useRef<HTMLSpanElement>(null);
  const readXY = useRef<HTMLSpanElement>(null);
  const mode = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = svg.current;
    if (!el) return;

    const target = { x: 330, y: 170 };
    const cur = { ...target };
    let grip = 0; // 0 open … 1 closed
    let gripTarget = 0;
    let lastPointer = -Infinity;
    let raf = 0;
    let running = false;
    const t0 = performance.now();
    const tracking = hasFinePointer();

    const render = () => {
      const { a1, a2 } = solve(cur.x, cur.y);
      link1.current?.setAttribute("transform", `translate(${BASE.x} ${BASE.y}) rotate(${(a1 * DEG).toFixed(2)})`);
      link2.current?.setAttribute("transform", `translate(${L1} 0) rotate(${(a2 * DEG).toFixed(2)})`);
      const open = 9 - grip * 7;
      jawA.current?.setAttribute("transform", `translate(0 ${-open})`);
      jawB.current?.setAttribute("transform", `translate(0 ${open})`);

      // end effector position, for the "out of reach" laser
      const ex = BASE.x + L1 * Math.cos(a1) + L2 * Math.cos(a1 + a2);
      const ey = BASE.y + L1 * Math.sin(a1) + L2 * Math.sin(a1 + a2);
      reticle.current?.setAttribute("transform", `translate(${cur.x.toFixed(1)} ${cur.y.toFixed(1)})`);
      if (laser.current) {
        const far = Math.hypot(cur.x - ex, cur.y - ey) > 6;
        laser.current.setAttribute("x1", ex.toFixed(1));
        laser.current.setAttribute("y1", ey.toFixed(1));
        laser.current.setAttribute("x2", cur.x.toFixed(1));
        laser.current.setAttribute("y2", cur.y.toFixed(1));
        laser.current.style.opacity = far ? "1" : "0";
      }
      if (readJ1.current) readJ1.current.textContent = `${fmt(-a1 * DEG)}°`;
      if (readJ2.current) readJ2.current.textContent = `${fmt(a2 * DEG)}°`;
      if (readXY.current) readXY.current.textContent = `${String(Math.round(cur.x)).padStart(3, "0")} · ${String(Math.round(BASE.y - cur.y)).padStart(3, "0")}`;
    };

    if (prefersReducedMotion()) {
      render();
      if (mode.current) mode.current.textContent = "Standby";
      return;
    }

    const tick = (now: number) => {
      const idle = now - lastPointer > 2600;
      if (idle) {
        const t = (now - t0) / 1000;
        target.x = 300 + 120 * Math.sin(t * 0.55);
        target.y = 175 + 70 * Math.sin(t * 0.9 + 1.2);
        gripTarget = Math.sin(t * 1.1) > 0.6 ? 1 : 0;
      }
      if (mode.current) {
        const label = idle ? "Auto-scan" : "Tracking";
        if (mode.current.textContent !== label) mode.current.textContent = label;
      }
      const k = idle ? 0.05 : 0.14;
      cur.x += (target.x - cur.x) * k;
      cur.y += (target.y - cur.y) * k;
      grip += (gripTarget - grip) * 0.25;
      render();
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onMove = (e: PointerEvent) => {
      if (!tracking || e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      if (!r.width) return;
      const x = ((e.clientX - r.left) / r.width) * W;
      const y = ((e.clientY - r.top) / r.height) * H;
      target.x = Math.max(18, Math.min(W - 18, x));
      target.y = Math.max(18, Math.min(BASE.y - 24, y));
      lastPointer = performance.now();
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse") gripTarget = 1;
    };
    const onUp = () => {
      if (performance.now() - lastPointer < 2600) gripTarget = 0;
    };

    const obs = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    obs.observe(el);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    render();
    return () => {
      stop();
      obs.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <figure className="hud relative border border-line bg-paper-2/80 backdrop-blur" aria-label="Animated robot arm that follows the cursor">
      <span className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <span className="scan-line absolute inset-x-0 top-0 h-16" />
      </span>
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5 font-code text-[10px] uppercase tracking-[0.2em] text-muted2">
        <span>
          <span className="text-signal">ARM-01</span> // Kinematics
        </span>
        <span className="flex items-center gap-2 text-ink">
          <span className="led" />
          <span ref={mode}>Tracking</span>
        </span>
      </div>

      <svg ref={svg} viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" aria-hidden="true">
        <defs>
          <pattern id="arm-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M24 0H0V24" fill="none" stroke="rgba(236,232,225,.06)" strokeWidth="1" />
          </pattern>
          <pattern id="arm-hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="5" height="10" fill="#ff6b1a" />
          </pattern>
          <linearGradient id="arm-metal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2a2f39" />
            <stop offset="1" stopColor="#15181e" />
          </linearGradient>
          <radialGradient id="arm-glow">
            <stop offset="0" stopColor="rgba(255,107,26,.35)" />
            <stop offset="1" stopColor="rgba(255,107,26,0)" />
          </radialGradient>
        </defs>

        <rect width={W} height={H} fill="url(#arm-grid)" />
        {/* reach envelope */}
        <circle cx={BASE.x} cy={BASE.y} r={REACH} fill="none" stroke="rgba(255,107,26,.18)" strokeDasharray="2 6" />
        <circle cx={BASE.x} cy={BASE.y} r={L1} fill="none" stroke="rgba(236,232,225,.07)" strokeDasharray="2 6" />

        {/* floor */}
        <line x1="0" y1={BASE.y + 30} x2={W} y2={BASE.y + 30} stroke="rgba(236,232,225,.25)" />
        <rect x="0" y={BASE.y + 30} width={W} height="8" fill="url(#arm-hatch)" opacity=".35" />

        {/* target reticle */}
        <g ref={reticle}>
          <circle r="22" fill="url(#arm-glow)" />
          <g className="arm-reticle">
            <circle r="13" fill="none" stroke="#ff6b1a" strokeWidth="1.5" strokeDasharray="6 4" />
          </g>
          <path d="M-20 0h8M12 0h8M0 -20v8M0 12v8" stroke="#ff6b1a" strokeWidth="1.5" />
        </g>
        <line ref={laser} className="arm-laser" stroke="#ff6b1a" strokeWidth="1.5" style={{ opacity: 0, transition: "opacity .2s" }} />

        {/* pedestal */}
        <path d={`M${BASE.x - 52} ${BASE.y + 30} L${BASE.x - 38} ${BASE.y + 4} H${BASE.x + 38} L${BASE.x + 52} ${BASE.y + 30} Z`} fill="url(#arm-metal)" stroke="rgba(236,232,225,.3)" />
        <rect x={BASE.x - 30} y={BASE.y + 12} width="60" height="6" fill="url(#arm-hatch)" />

        {/* link 1 (shoulder → elbow) */}
        <g ref={link1} transform={`translate(${BASE.x} ${BASE.y})`}>
          <rect x="-16" y="-15" width={L1 + 32} height="30" rx="15" fill="url(#arm-metal)" stroke="rgba(236,232,225,.35)" />
          <line x1="18" y1="0" x2={L1 - 18} y2="0" stroke="#ff6b1a" strokeWidth="3" strokeLinecap="round" />
          <circle cx={L1 / 2 - 22} cy="-8" r="1.6" fill="rgba(236,232,225,.5)" />
          <circle cx={L1 / 2 + 22} cy="-8" r="1.6" fill="rgba(236,232,225,.5)" />
          {/* shoulder joint */}
          <circle r="21" fill="#0b0c0f" stroke="#ff6b1a" strokeWidth="2.5" />
          <circle r="8" fill="#ff6b1a" />

          {/* link 2 (elbow → wrist) */}
          <g ref={link2} transform={`translate(${L1} 0)`}>
            <rect x="-12" y="-11" width={L2 + 18} height="22" rx="11" fill="url(#arm-metal)" stroke="rgba(236,232,225,.35)" />
            <rect x="22" y="-3" width={L2 - 50} height="6" fill="url(#arm-hatch)" opacity=".85" />
            {/* elbow joint */}
            <circle r="16" fill="#0b0c0f" stroke="#ff6b1a" strokeWidth="2.5" />
            <circle r="5.5" fill="#ff6b1a" />

            {/* wrist + gripper */}
            <g transform={`translate(${L2} 0)`}>
              <rect x="-6" y="-14" width="12" height="28" rx="2" fill="#1d212a" stroke="#ff6b1a" strokeWidth="1.5" />
              <g ref={jawA}>
                <path d="M6 -4 H24 L30 2 H24 L22 -1 H6 Z" fill="#ff6b1a" transform="translate(0 -1) scale(1 -1)" />
              </g>
              <g ref={jawB}>
                <path d="M6 -4 H24 L30 2 H24 L22 -1 H6 Z" fill="#ff6b1a" transform="translate(0 1)" />
              </g>
            </g>
          </g>
        </g>

        {/* corner labels */}
        <text x="14" y="22" fill="rgba(236,232,225,.4)" fontFamily="IBM Plex Mono, monospace" fontSize="10" letterSpacing="2">
          ENVELOPE R{REACH}
        </text>
        <text x={W - 14} y="22" textAnchor="end" fill="rgba(255,107,26,.8)" fontFamily="IBM Plex Mono, monospace" fontSize="10" letterSpacing="2">
          DOF 2 + GRIP
        </text>
      </svg>

      <figcaption className="grid grid-cols-3 border-t border-line font-code text-[11px] uppercase tracking-wider">
        <div className="border-r border-line px-4 py-2.5">
          <div className="text-[9px] tracking-[0.2em] text-muted2">J1 · Shoulder</div>
          <span ref={readJ1} className="tabular-nums text-ink">+000.0°</span>
        </div>
        <div className="border-r border-line px-4 py-2.5">
          <div className="text-[9px] tracking-[0.2em] text-muted2">J2 · Elbow</div>
          <span ref={readJ2} className="tabular-nums text-ink">+000.0°</span>
        </div>
        <div className="px-4 py-2.5">
          <div className="text-[9px] tracking-[0.2em] text-muted2">Target X · Y</div>
          <span ref={readXY} className="tabular-nums text-signal">000 · 000</span>
        </div>
      </figcaption>
    </figure>
  );
}
