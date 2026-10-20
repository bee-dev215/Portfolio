import { useEffect, useRef } from "react";
import { hasFinePointer, prefersReducedMotion } from "@/hooks/use-motion";

// Scene geometry (SVG user units)
const W = 480;
const H = 400;
const FLOOR = 362;
const BASE = { x: 100, y: 318 }; // shoulder pivot
const L1 = 140; // shoulder → elbow
const L2 = 128; // elbow → wrist
const L3 = 46; // wrist → grip centre
const REACH = L1 + L2;
const CRATE = 12; // half size of the payload
const X_MIN = BASE.x + 66; // pedestal face (payload can't pass it)
const X_MAX = 349; // end-stop face
const BAYS = [200, 320];
const SPARKS = 28;
const TRAIL = 36;
const DEG = 180 / Math.PI;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

/** Two-link inverse kinematics for the wrist, elbow-up. Returns joint angles in radians (SVG frame, y down). */
function solve(wx: number, wy: number) {
  const dx = wx - BASE.x;
  const dy = wy - BASE.y;
  const d = clamp(Math.hypot(dx, dy), Math.abs(L1 - L2) + 4, REACH);
  const cos2 = (d * d - L1 * L1 - L2 * L2) / (2 * L1 * L2);
  const a2 = Math.acos(clamp(cos2, -1, 1));
  const a1 = Math.atan2(dy, dx) - Math.atan2(L2 * Math.sin(a2), L1 + L2 * Math.cos(a2));
  return { a1, a2 };
}

/** Highest point above floor position x the gripper can hover at while pointing straight down. */
const hoverY = (x: number) => Math.max(FLOOR - 96, BASE.y + L3 + 4 - Math.sqrt(Math.max(0, (REACH - 8) ** 2 - (x - BASE.x) ** 2)));

function gearPath(r: number, teeth: number, depth: number) {
  const s = (Math.PI * 2) / teeth;
  const pt = (rad: number, a: number) => `${(rad * Math.cos(a)).toFixed(2)} ${(rad * Math.sin(a)).toFixed(2)}`;
  let d = "";
  for (let i = 0; i < teeth; i++) {
    const a = i * s;
    d += `${i ? "L" : "M"}${pt(r, a)}L${pt(r + depth, a + s * 0.18)}L${pt(r + depth, a + s * 0.48)}L${pt(r, a + s * 0.66)}`;
  }
  return d + "Z";
}
const GEAR_S = gearPath(25, 18, 4);
const GEAR_E = gearPath(19, 14, 3.5);
const GEAR_W = gearPath(13, 10, 3);

const fmt = (n: number, w = 3) => (n < 0 ? "-" : "+") + Math.abs(n).toFixed(1).padStart(w + 2, "0");
const p = (n: number) => n.toFixed(1);

/** Hydraulic cylinder pinned at (0,0); the rod's free end is moved by setPiston. */
function Piston({ g, rod, pin, barrel }: { g: React.Ref<SVGGElement>; rod: React.Ref<SVGRectElement>; pin: React.Ref<SVGCircleElement>; barrel: number }) {
  return (
    <g ref={g}>
      <rect ref={rod} x="12" y="-2" width="40" height="4" fill="#aeb4bf" />
      <rect x="-5" y="-5.5" width={barrel} height="11" rx="2" fill="url(#arm-metal)" stroke="rgba(236,232,225,.35)" />
      <rect x={barrel - 12} y="-5.5" width="4" height="11" fill="#d9580d" opacity=".8" />
      <circle r="4" fill="#0b0c0f" stroke="#d9580d" strokeWidth="1.5" />
      <circle ref={pin} cx="52" r="3.5" fill="#0b0c0f" stroke="rgba(236,232,225,.6)" strokeWidth="1.5" />
    </g>
  );
}

/**
 * A three-axis industrial arm with hydraulics, cable hoses and a payload crate.
 * With a mouse it tracks the pointer; holding the button closes the gripper, so you can grab
 * the crate, carry it and fling it. Left alone it runs a pick-and-place cycle between two bays.
 * Everything is driven through refs in a rAF loop — no React re-renders per frame.
 */
export default function RobotArm() {
  const svg = useRef<SVGSVGElement>(null);
  const link1 = useRef<SVGGElement>(null);
  const link2 = useRef<SVGGElement>(null);
  const wrist = useRef<SVGGElement>(null);
  const jawA = useRef<SVGGElement>(null);
  const jawB = useRef<SVGGElement>(null);
  const gearS = useRef<SVGPathElement>(null);
  const gearE = useRef<SVGPathElement>(null);
  const gearW = useRef<SVGPathElement>(null);
  const pistS = useRef<SVGGElement>(null);
  const rodS = useRef<SVGRectElement>(null);
  const pinS = useRef<SVGCircleElement>(null);
  const pistE = useRef<SVGGElement>(null);
  const rodE = useRef<SVGRectElement>(null);
  const pinE = useRef<SVGCircleElement>(null);
  const cableA = useRef<SVGPathElement>(null);
  const cableB = useRef<SVGPathElement>(null);
  const beam = useRef<SVGPolygonElement>(null);
  const crateG = useRef<SVGGElement>(null);
  const crateGlow = useRef<SVGRectElement>(null);
  const crateShadow = useRef<SVGEllipseElement>(null);
  const spot = useRef<SVGEllipseElement>(null);
  const plumb = useRef<SVGLineElement>(null);
  const trail = useRef<SVGPolylineElement>(null);
  const sparkEls = useRef<(SVGLineElement | null)[]>([]);
  const reticle = useRef<SVGGElement>(null);
  const laser = useRef<SVGLineElement>(null);
  const warn = useRef<SVGGElement>(null);
  const cycleTxt = useRef<SVGTextElement>(null);
  const readJ = useRef<(HTMLSpanElement | null)[]>([]);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const payload = useRef<HTMLSpanElement>(null);
  const mode = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = svg.current;
    if (!el) return;

    const tracking = hasFinePointer();
    const start0 = { x: BAYS[0], y: hoverY(BAYS[0]) };
    const target = { ...start0 }; // raw pointer target (reticle)
    const ret = { ...start0 }; // smoothed reticle
    const goal = { ...start0 }; // where the gripper is heading
    const cur = { ...start0 };
    const vel = { x: 0, y: 0 };
    const tip = { ...start0 };
    const prevTip = { ...start0 };
    let phi = Math.PI / 2; // gripper approach angle
    let a1 = 0, a2 = 0, a3 = 0;
    let grip = 0; // 0 open … 1 closed
    let gripTarget = 0;
    let lastPointer = -Infinity;
    let wasAuto = false;
    let cycles = 0;
    let raf = 0;
    let running = false;
    let last = performance.now();

    const crate = { x: BAYS[0], y: FLOOR - CRATE, r: 0, vx: 0, vy: 0, vr: 0, held: false };
    const plan = { step: 0, wait: 0, from: BAYS[0], to: BAYS[1] };
    const prevJ = [0, 0, 0];
    const load = [0, 0, 0];
    const trailPts: number[] = [];
    const sparks = Array.from({ length: SPARKS }, () => ({ x: 0, y: 0, vx: 0, vy: 0, life: 0 }));

    const settled = () => !crate.held && crate.y >= FLOOR - CRATE - 0.01 && crate.vy === 0 && Math.abs(crate.vx) < 0.05;

    const burst = (x: number, y: number, n: number, power: number) => {
      for (const s of sparks) {
        if (n <= 0) break;
        if (s.life > 0) continue;
        const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.4;
        const v = power * (0.4 + Math.random() * 0.8);
        Object.assign(s, { x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1 });
        n--;
      }
    };

    // ---- autonomous pick & place ----
    const startPlan = () => {
      plan.from = crate.held ? tip.x : crate.x;
      plan.to = plan.from < 260 ? BAYS[1] : BAYS[0];
      plan.step = crate.held ? 3 : 0;
      plan.wait = 0;
    };
    const waypoint = () => {
      const { from: a, to: b } = plan;
      switch (plan.step) {
        case 0: return { x: a, y: hoverY(a), grip: 0 };
        case 1: return { x: a, y: FLOOR - CRATE, grip: 0 };
        case 2: return { x: a, y: FLOOR - CRATE, grip: 1, hold: 320 };
        case 3: return { x: a, y: hoverY(a), grip: 1, pass: true };
        case 4: return { x: (a + b) / 2, y: FLOOR - 172, grip: 1, pass: true };
        case 5: return { x: b, y: hoverY(b), grip: 1 };
        case 6: return { x: b, y: FLOOR - CRATE - 1, grip: 1 };
        case 7: return { x: b, y: FLOOR - CRATE - 1, grip: 0, hold: 260 };
        default: return { x: b, y: hoverY(b), grip: 0 };
      }
    };
    const runPlan = (dt: number) => {
      if (plan.step <= 1 && !crate.held) plan.from = clamp(crate.x, X_MIN, X_MAX);
      const wp = waypoint();
      goal.x = wp.x;
      goal.y = wp.y;
      gripTarget = wp.grip;
      const d = Math.hypot(wp.x - cur.x, wp.y - cur.y);
      let arrived = wp.pass ? d < 24 : d < 2.5 && Math.hypot(vel.x, vel.y) < 0.5;
      if (plan.step === 0 && !settled()) arrived = false;
      if (!arrived) return;
      if (wp.hold) {
        plan.wait += dt;
        if (plan.wait < wp.hold) return;
        plan.wait = 0;
      }
      if (plan.step === 2 && !crate.held) plan.step = 0;
      else if (plan.step >= 8) {
        cycles++;
        startPlan();
      } else plan.step++;
    };

    // ---- kinematics ----
    const pose = () => {
      const wx = cur.x - L3 * Math.cos(phi);
      const wy = cur.y - L3 * Math.sin(phi);
      ({ a1, a2 } = solve(wx, wy));
      a3 = wrap(phi - a1 - a2);
      const ex = BASE.x + L1 * Math.cos(a1);
      const ey = BASE.y + L1 * Math.sin(a1);
      tip.x = ex + L2 * Math.cos(a1 + a2) + L3 * Math.cos(phi);
      tip.y = ey + L2 * Math.sin(a1 + a2) + L3 * Math.sin(phi);
    };

    const setPiston = (g: SVGGElement | null, rod: SVGRectElement | null, pin: SVGCircleElement | null, ax: number, ay: number, bx: number, by: number) => {
      const len = Math.hypot(bx - ax, by - ay);
      g?.setAttribute("transform", `translate(${p(ax)} ${p(ay)}) rotate(${(Math.atan2(by - ay, bx - ax) * DEG).toFixed(2)})`);
      rod?.setAttribute("width", p(Math.max(0, len - 12)));
      pin?.setAttribute("cx", p(len));
    };

    const render = () => {
      const c1 = Math.cos(a1), s1 = Math.sin(a1);
      const c12 = Math.cos(a1 + a2), s12 = Math.sin(a1 + a2);
      const ex = BASE.x + L1 * c1, ey = BASE.y + L1 * s1;
      const on1 = (x: number, y: number) => [BASE.x + x * c1 - y * s1, BASE.y + x * s1 + y * c1];
      const on2 = (x: number, y: number) => [ex + x * c12 - y * s12, ey + x * s12 + y * c12];

      link1.current?.setAttribute("transform", `translate(${BASE.x} ${BASE.y}) rotate(${(a1 * DEG).toFixed(2)})`);
      link2.current?.setAttribute("transform", `translate(${L1} 0) rotate(${(a2 * DEG).toFixed(2)})`);
      wrist.current?.setAttribute("transform", `translate(${L2} 0) rotate(${(a3 * DEG).toFixed(2)})`);
      gearS.current?.setAttribute("transform", `translate(${BASE.x} ${BASE.y}) rotate(${(a1 * DEG * 2.4).toFixed(1)})`);
      gearE.current?.setAttribute("transform", `translate(${L1} 0) rotate(${(-a2 * DEG * 2).toFixed(1)})`);
      gearW.current?.setAttribute("transform", `translate(${L2} 0) rotate(${(a3 * DEG * 3).toFixed(1)})`);

      const open = crate.held ? Math.max(CRATE + 0.5, 21 - grip * 18) : 21 - grip * 18;
      jawA.current?.setAttribute("transform", `translate(0 ${p(-open)})`);
      jawB.current?.setAttribute("transform", `translate(0 ${p(open)})`);
      if (beam.current) beam.current.style.opacity = crate.held ? "0" : String(0.55 + 0.25 * Math.sin(performance.now() / 160));

      // hydraulics: boom cylinder from the pedestal, stick cylinder working the elbow lever
      const [sx, sy] = on1(66, 16);
      setPiston(pistS.current, rodS.current, pinS.current, BASE.x + 32, BASE.y + 30, sx, sy);
      const c2 = Math.cos(a2), s2 = Math.sin(a2);
      setPiston(pistE.current, rodE.current, pinE.current, L1 - 72, -16, L1 - 25 * c2 + 15 * s2, -25 * s2 - 15 * c2);

      // cable hose, sagging between clamp points
      const pts = [[BASE.x - 34, BASE.y + 30], on1(L1 * 0.3, -21), on1(L1 - 8, -20), on2(L2 * 0.5, -15), on2(L2 - 14, -12)];
      let d = `M${p(pts[0][0])} ${p(pts[0][1])}`;
      for (let i = 1; i < pts.length; i++) {
        const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
        d += `Q${p((x0 + x1) / 2)} ${p((y0 + y1) / 2 + 14)} ${p(x1)} ${p(y1)}`;
      }
      cableA.current?.setAttribute("d", d);
      cableB.current?.setAttribute("d", d);

      // payload
      crateG.current?.setAttribute("transform", `translate(${p(crate.x)} ${p(crate.y)}) rotate(${crate.r.toFixed(1)})`);
      if (crateGlow.current) crateGlow.current.style.opacity = crate.held ? "1" : "0";
      if (crateShadow.current) {
        const h = FLOOR - CRATE - crate.y;
        crateShadow.current.setAttribute("cx", p(crate.x));
        crateShadow.current.setAttribute("rx", p(14 + h * 0.06));
        crateShadow.current.style.opacity = String(clamp(0.7 - h / 300, 0.15, 0.7));
      }

      // gripper projection on the floor
      const alt = FLOOR - tip.y;
      spot.current?.setAttribute("cx", p(tip.x));
      spot.current?.setAttribute("rx", p(16 + alt * 0.08));
      if (spot.current) spot.current.style.opacity = String(clamp(1 - alt / 320, 0.2, 1));
      if (plumb.current) {
        plumb.current.setAttribute("x1", p(tip.x));
        plumb.current.setAttribute("x2", p(tip.x));
        plumb.current.setAttribute("y1", p(tip.y + 14));
        plumb.current.style.opacity = alt > 40 ? "1" : "0";
      }

      // motion trail
      trailPts.push(tip.x, tip.y);
      if (trailPts.length > TRAIL * 2) trailPts.splice(0, 2);
      let tp = "";
      for (let i = 0; i < trailPts.length; i += 2) tp += `${p(trailPts[i])},${p(trailPts[i + 1])} `;
      trail.current?.setAttribute("points", tp);

      sparks.forEach((s, i) => {
        const l = sparkEls.current[i];
        if (!l) return;
        if (s.life <= 0) {
          if (l.style.opacity !== "0") l.style.opacity = "0";
          return;
        }
        l.setAttribute("x1", p(s.x));
        l.setAttribute("y1", p(s.y));
        l.setAttribute("x2", p(s.x - s.vx * 1.8));
        l.setAttribute("y2", p(s.y - s.vy * 1.8));
        l.style.opacity = s.life.toFixed(2);
      });

      // target + "out of reach" laser
      reticle.current?.setAttribute("transform", `translate(${p(ret.x)} ${p(ret.y)})`);
      const far = Math.hypot(ret.x - tip.x, ret.y - tip.y) > 10;
      if (laser.current) {
        laser.current.setAttribute("x1", p(tip.x));
        laser.current.setAttribute("y1", p(tip.y));
        laser.current.setAttribute("x2", p(ret.x));
        laser.current.setAttribute("y2", p(ret.y));
        laser.current.style.opacity = far ? "1" : "0";
      }
      if (warn.current) warn.current.style.opacity = far ? "1" : "0";
      if (cycleTxt.current) cycleTxt.current.textContent = `CYCLES ${String(cycles).padStart(3, "0")}`;

      // readouts
      const joints = [-a1 * DEG, a2 * DEG, a3 * DEG];
      joints.forEach((v, i) => {
        const r = readJ.current[i];
        if (r) r.textContent = `${fmt(v)}°`;
        const b = bars.current[i];
        if (b) b.style.transform = `scaleX(${clamp(load[i], 0, 1).toFixed(3)})`;
      });
      if (payload.current) {
        const [txt, col] = crate.held ? ["Locked", "var(--signal)"] : settled() ? (Math.abs(crate.x - BAYS[0]) < 4 ? ["Bay A", ""] : Math.abs(crate.x - BAYS[1]) < 4 ? ["Bay B", ""] : ["Floor", ""]) : ["Airborne", "var(--signal)"];
        if (payload.current.textContent !== txt) {
          payload.current.textContent = txt;
          payload.current.style.color = col;
        }
      }
    };

    const step = (now: number, dt: number) => {
      const f = clamp(dt / 16.67, 0.2, 3);
      const auto = !tracking || now - lastPointer > 2600;
      if (auto && !wasAuto) startPlan();
      wasAuto = auto;

      if (auto) runPlan(dt);
      else {
        goal.x = clamp(target.x, X_MIN - 10, W - 16);
        goal.y = clamp(target.y, 16, FLOOR - CRATE);
      }
      if (mode.current) {
        const label = auto ? "Auto · Pick & Place" : "Tracking";
        if (mode.current.textContent !== label) mode.current.textContent = label;
      }

      // spring-damped servo motion (slightly underdamped for a mechanical settle)
      const K = auto ? 0.03 : 0.07;
      const D = auto ? 0.3 : 0.42;
      const vmax = auto ? 6 : 14;
      vel.x += ((goal.x - cur.x) * K - vel.x * D) * f;
      vel.y += ((goal.y - cur.y) * K - vel.y * D) * f;
      const sp = Math.hypot(vel.x, vel.y);
      if (sp > vmax) {
        vel.x *= vmax / sp;
        vel.y *= vmax / sp;
      }
      cur.x += vel.x * f;
      cur.y = Math.min(FLOOR - CRATE, cur.y + vel.y * f);

      const ang = Math.atan2(cur.y - BASE.y, cur.x - BASE.x);
      const phiGoal = auto ? Math.PI / 2 : ang + wrap(Math.PI / 2 - ang) * clamp((cur.y - 110) / 180, 0, 1);
      phi += wrap(phiGoal - phi) * Math.min(1, 0.15 * f);
      grip += (gripTarget - grip) * Math.min(1, 0.22 * f);

      const t = auto ? goal : target;
      ret.x += (t.x - ret.x) * Math.min(1, 0.35 * f);
      ret.y += (t.y - ret.y) * Math.min(1, 0.35 * f);

      prevTip.x = tip.x;
      prevTip.y = tip.y;
      pose();
      [-a1, a2, a3].forEach((a, i) => {
        load[i] += (Math.abs(wrap(a - prevJ[i])) * DEG / f / 2.5 - load[i]) * 0.2;
        prevJ[i] = a;
      });

      // payload physics
      const near = Math.hypot(crate.x - tip.x, crate.y - tip.y) < 15;
      if (!crate.held && gripTarget === 1 && grip < 0.8 && near) {
        crate.held = true;
        burst(tip.x, tip.y, 6, 2.5);
      } else if (crate.held && gripTarget === 0) {
        crate.held = false;
        crate.vx = clamp((tip.x - prevTip.x) / f, -14, 14);
        crate.vy = clamp((tip.y - prevTip.y) / f, -14, 14);
        crate.vr = crate.vx * 1.6;
      }
      if (crate.held) {
        crate.x = tip.x;
        crate.y = tip.y;
        crate.r = phi * DEG - 90;
      } else {
        crate.vy += 0.42 * f;
        crate.x += crate.vx * f;
        crate.y += crate.vy * f;
        crate.r += crate.vr * f;
        if (crate.x < X_MIN || crate.x > X_MAX) {
          if (Math.abs(crate.vx) > 3) burst(crate.x < X_MIN ? X_MIN - CRATE : X_MAX + CRATE, crate.y, 5, Math.abs(crate.vx) * 0.4);
          crate.vx = (crate.x < X_MIN ? 1 : -1) * Math.abs(crate.vx) * 0.4;
          crate.x = clamp(crate.x, X_MIN, X_MAX);
        }
        if (crate.y >= FLOOR - CRATE) {
          crate.y = FLOOR - CRATE;
          if (crate.vy > 2.5) burst(crate.x, FLOOR, Math.min(14, Math.round(crate.vy * 2)), crate.vy * 0.5);
          crate.vy = crate.vy > 1.2 ? -crate.vy * 0.3 : 0;
          crate.vx *= 0.82 ** f;
          if (Math.abs(crate.vx) < 0.02) crate.vx = 0;
          crate.vr *= 0.5;
          crate.r += (Math.round(crate.r / 90) * 90 - crate.r) * Math.min(1, 0.3 * f);
        }
      }

      for (const s of sparks) {
        if (s.life <= 0) continue;
        s.vy += 0.25 * f;
        s.x += s.vx * f;
        s.y += s.vy * f;
        if (s.y > FLOOR) {
          s.y = FLOOR;
          s.vy *= -0.35;
        }
        s.life -= 0.035 * f;
      }
    };

    pose();
    if (prefersReducedMotion()) {
      render();
      if (mode.current) mode.current.textContent = "Standby";
      return;
    }

    const tick = (now: number) => {
      step(now, now - last);
      last = now;
      render();
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
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
      target.x = clamp(((e.clientX - r.left) / r.width) * W, 14, W - 14);
      target.y = clamp(((e.clientY - r.top) / r.height) * H, 14, FLOOR - CRATE);
      lastPointer = performance.now();
    };
    const onDown = (e: PointerEvent) => {
      if (!tracking || e.pointerType !== "mouse") return;
      lastPointer = performance.now();
      gripTarget = 1;
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

  const mono = { fontFamily: "IBM Plex Mono, monospace", fontSize: 10, letterSpacing: 2 };

  return (
    <figure className="hud relative border border-line bg-paper-2/80 backdrop-blur" aria-label="Animated robot arm that follows the cursor and picks up a crate">
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
            <rect width="5" height="10" fill="#d9580d" />
          </pattern>
          <linearGradient id="arm-metal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#323844" />
            <stop offset=".5" stopColor="#1f232b" />
            <stop offset="1" stopColor="#14171c" />
          </linearGradient>
          <radialGradient id="arm-glow">
            <stop offset="0" stopColor="rgba(217, 88, 13,.4)" />
            <stop offset="1" stopColor="rgba(217, 88, 13,0)" />
          </radialGradient>
          <radialGradient id="arm-shadow">
            <stop offset="0" stopColor="rgba(0,0,0,.75)" />
            <stop offset="1" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
          <linearGradient id="arm-beam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="rgba(217, 88, 13,.32)" />
            <stop offset="1" stopColor="rgba(217, 88, 13,0)" />
          </linearGradient>
        </defs>

        <rect width={W} height={H} fill="url(#arm-grid)" />
        {/* reach envelope */}
        <circle cx={BASE.x} cy={BASE.y} r={REACH + L3} fill="none" stroke="rgba(217, 88, 13,.18)" strokeDasharray="2 6" />
        <circle cx={BASE.x} cy={BASE.y} r={L1} fill="none" stroke="rgba(236,232,225,.07)" strokeDasharray="2 6" />

        {/* drop bays */}
        {BAYS.map((x, i) => (
          <g key={x}>
            <path d={`M${x - 20} ${FLOOR - 6}v6h8M${x + 20} ${FLOOR - 6}v6h-8`} fill="none" stroke="rgba(217, 88, 13,.6)" strokeWidth="1.5" />
            <text x={x} y={FLOOR + 26} textAnchor="middle" fill="rgba(236,232,225,.4)" {...mono} fontSize={9}>
              BAY {"AB"[i]}
            </text>
          </g>
        ))}

        <polyline ref={trail} fill="none" stroke="rgba(217, 88, 13,.45)" strokeWidth="1.5" strokeDasharray="1 4" strokeLinecap="round" />
        <line ref={plumb} y2={FLOOR} stroke="rgba(236,232,225,.18)" strokeDasharray="3 4" />
        <ellipse ref={spot} cy={FLOOR} rx="20" ry="4" fill="url(#arm-glow)" />

        {/* cable hose (behind the arm) */}
        <path ref={cableA} fill="none" stroke="rgba(236,232,225,.22)" strokeWidth="6" strokeLinecap="round" />
        <path ref={cableB} fill="none" stroke="#0b0c0f" strokeWidth="3.5" strokeLinecap="round" />

        {/* pedestal + shoulder housing */}
        <ellipse cx={BASE.x} cy={FLOOR} rx="66" ry="5" fill="url(#arm-shadow)" />
        <path d={`M${BASE.x - 54} ${FLOOR} L${BASE.x - 40} ${BASE.y + 14} H${BASE.x + 40} L${BASE.x + 54} ${FLOOR} Z`} fill="url(#arm-metal)" stroke="rgba(236,232,225,.3)" />
        <rect x={BASE.x - 32} y={BASE.y + 20} width="64" height="6" fill="url(#arm-hatch)" />
        {[0, 1, 2, 3].map((i) => (
          <line key={i} x1={BASE.x - 34 + i * 4} y1={FLOOR - 16} x2={BASE.x - 34 + i * 4} y2={FLOOR - 6} stroke="rgba(236,232,225,.18)" />
        ))}
        {[0, 1, 2].map((i) => (
          <circle key={i} className="blink" cx={BASE.x + 14 + i * 9} cy={FLOOR - 11} r="2" fill={i === 1 ? "#7bd88f" : "#d9580d"} style={{ animationDelay: `${i * 0.37}s` }} />
        ))}
        <path d={`M${BASE.x - 30} ${BASE.y + 15} V${BASE.y - 2} A30 30 0 0 1 ${BASE.x + 30} ${BASE.y - 2} V${BASE.y + 15} Z`} fill="#1a1d23" stroke="rgba(236,232,225,.3)" />
        <path ref={gearS} d={GEAR_S} fill="#262a33" stroke="rgba(217, 88, 13,.55)" strokeWidth="1" transform={`translate(${BASE.x} ${BASE.y})`} />

        {/* end stop */}
        <rect x={X_MAX + CRATE} y={FLOOR - 22} width="12" height="22" fill="url(#arm-metal)" stroke="rgba(236,232,225,.3)" />
        <rect x={X_MAX + CRATE} y={FLOOR - 22} width="12" height="5" fill="url(#arm-hatch)" />

        {/* payload */}
        <ellipse ref={crateShadow} cy={FLOOR} rx="16" ry="3.5" fill="url(#arm-shadow)" />
        <g ref={crateG}>
          <rect ref={crateGlow} x={-CRATE - 4} y={-CRATE - 4} width={CRATE * 2 + 8} height={CRATE * 2 + 8} rx="4" fill="url(#arm-glow)" style={{ opacity: 0, transition: "opacity .3s" }} />
          <rect x={-CRATE} y={-CRATE} width={CRATE * 2} height={CRATE * 2} rx="2" fill="url(#arm-metal)" stroke="rgba(236,232,225,.5)" />
          <rect x={-CRATE} y="-3.5" width={CRATE * 2} height="7" fill="url(#arm-hatch)" opacity=".9" />
          <path d={`M${-CRATE + 4} ${-CRATE + 4}h3M${CRATE - 7} ${-CRATE + 4}h3M${-CRATE + 4} ${CRATE - 4}h3M${CRATE - 7} ${CRATE - 4}h3`} stroke="rgba(236,232,225,.45)" strokeWidth="1.5" />
        </g>

        {/* boom cylinder */}
        <Piston g={pistS} rod={rodS} pin={pinS} barrel={40} />

        {/* link 1 (shoulder → elbow) */}
        <g ref={link1} transform={`translate(${BASE.x} ${BASE.y})`}>
          <path d={`M0 -18 L${L1} -13 A13 13 0 0 1 ${L1} 13 L0 18 A18 18 0 0 1 0 -18 Z`} fill="url(#arm-metal)" stroke="rgba(236,232,225,.35)" />
          <path d={`M24 -11 L${L1 - 20} -8`} stroke="rgba(236,232,225,.12)" />
          <line x1="28" y1="3" x2={L1 - 24} y2="3" stroke="#d9580d" strokeWidth="3" strokeLinecap="round" />
          {[40, 70, 100].map((x) => (
            <circle key={x} cx={x} cy="-8" r="1.6" fill="rgba(236,232,225,.5)" />
          ))}
          {/* stick cylinder */}
          <Piston g={pistE} rod={rodE} pin={pinE} barrel={36} />
          <path ref={gearE} d={GEAR_E} fill="#262a33" stroke="rgba(217, 88, 13,.55)" strokeWidth="1" transform={`translate(${L1} 0)`} />
          {/* shoulder joint */}
          <circle r="21" fill="#0b0c0f" stroke="#d9580d" strokeWidth="2.5" />
          <circle r="8" fill="#d9580d" />
          <circle cx="15" r="1.8" fill="rgba(236,232,225,.7)" />

          {/* link 2 (elbow → wrist) */}
          <g ref={link2} transform={`translate(${L1} 0)`}>
            <path d="M-2 -12 L-22 -21 A8 8 0 0 0 -30 -9 L-6 10 Z" fill="url(#arm-metal)" stroke="rgba(236,232,225,.35)" />
            <path d={`M0 -13 L${L2} -9 A9 9 0 0 1 ${L2} 9 L0 13 A13 13 0 0 1 0 -13 Z`} fill="url(#arm-metal)" stroke="rgba(236,232,225,.35)" />
            <rect x="24" y="-3" width={L2 - 52} height="6" fill="url(#arm-hatch)" opacity=".85" />
            <path ref={gearW} d={GEAR_W} fill="#262a33" stroke="rgba(217, 88, 13,.55)" strokeWidth="1" transform={`translate(${L2} 0)`} />
            {/* elbow joint */}
            <circle r="16" fill="#0b0c0f" stroke="#d9580d" strokeWidth="2.5" />
            <circle r="5.5" fill="#d9580d" />
            <circle cx="11" r="1.5" fill="rgba(236,232,225,.7)" />

            {/* wrist + gripper */}
            <g ref={wrist} transform={`translate(${L2} 0)`}>
              <polygon ref={beam} points={`${L3 - 16},-5 ${L3 + 80},-26 ${L3 + 80},26 ${L3 - 16},5`} fill="url(#arm-beam)" />
              <rect x="0" y="-9" width={L3 - 20} height="18" rx="3" fill="url(#arm-metal)" stroke="rgba(236,232,225,.35)" />
              <circle cx={L3 - 30} r="2.6" fill="#f08a4b" />
              <circle r="11" fill="#0b0c0f" stroke="#d9580d" strokeWidth="2" />
              <circle r="3.5" fill="#d9580d" />
              <rect x={L3 - 24} y="-28" width="6" height="56" rx="1.5" fill="#1d212a" stroke="#d9580d" strokeWidth="1.5" />
              <g ref={jawA}>
                <rect x={L3 - 22} y="-8" width="8" height="8" fill="#2a2f39" stroke="#d9580d" strokeWidth="1" />
                <path d={`M${L3 - 16} 0 H${L3 + 10} L${L3 + 6} -6 H${L3 - 16} Z`} fill="#d9580d" />
              </g>
              <g ref={jawB}>
                <rect x={L3 - 22} y="0" width="8" height="8" fill="#2a2f39" stroke="#d9580d" strokeWidth="1" />
                <path d={`M${L3 - 16} 0 H${L3 + 10} L${L3 + 6} 6 H${L3 - 16} Z`} fill="#d9580d" />
              </g>
            </g>
          </g>
        </g>

        {/* floor */}
        <line x1="0" y1={FLOOR} x2={W} y2={FLOOR} stroke="rgba(236,232,225,.25)" />
        <rect x="0" y={FLOOR} width={W} height="8" fill="url(#arm-hatch)" opacity=".35" />

        {/* sparks */}
        <g stroke="#f08a4b" strokeWidth="1.5" strokeLinecap="round">
          {Array.from({ length: SPARKS }, (_, i) => (
            <line key={i} ref={(n) => (sparkEls.current[i] = n)} style={{ opacity: 0 }} />
          ))}
        </g>

        {/* target reticle */}
        <g ref={reticle}>
          <circle r="22" fill="url(#arm-glow)" />
          <g className="arm-reticle">
            <circle r="13" fill="none" stroke="#d9580d" strokeWidth="1.5" strokeDasharray="6 4" />
          </g>
          <path d="M-20 0h8M12 0h8M0 -20v8M0 12v8" stroke="#d9580d" strokeWidth="1.5" />
        </g>
        <line ref={laser} className="arm-laser" stroke="#d9580d" strokeWidth="1.5" style={{ opacity: 0, transition: "opacity .2s" }} />

        {/* corner labels */}
        <text x="14" y="22" fill="rgba(236,232,225,.4)" {...mono}>
          ENVELOPE R{REACH + L3}
        </text>
        <text ref={cycleTxt} x="14" y="38" fill="rgba(236,232,225,.4)" {...mono}>
          CYCLES 000
        </text>
        <text x={W - 14} y="22" textAnchor="end" fill="rgba(217, 88, 13,.8)" {...mono}>
          DOF 3 + GRIP
        </text>
        <g ref={warn} style={{ opacity: 0, transition: "opacity .2s" }}>
          <text className="blink" x={W - 14} y="38" textAnchor="end" fill="#d9580d" {...mono}>
            ⚠ OUT OF REACH
          </text>
        </g>
      </svg>

      <figcaption className="grid grid-cols-4 border-t border-line font-code text-[11px] uppercase tracking-wider">
        {([["J1", "Shoulder"], ["J2", "Elbow"], ["J3", "Wrist"]] as const).map(([j, name], i) => (
          <div key={j} className="relative border-r border-line px-3 py-2.5 sm:px-4">
            <div className="text-[9px] tracking-[0.2em] text-muted2">
              {j}
              <span className="hidden sm:inline"> · {name}</span>
            </div>
            <span ref={(n) => (readJ.current[i] = n)} className="tabular-nums text-ink">
              +000.0°
            </span>
            <span ref={(n) => (bars.current[i] = n)} className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-signal/70" style={{ transform: "scaleX(0)" }} />
          </div>
        ))}
        <div className="px-3 py-2.5 sm:px-4">
          <div className="text-[9px] tracking-[0.2em] text-muted2">Payload</div>
          <span ref={payload} className="text-ink">
            Bay A
          </span>
        </div>
      </figcaption>
    </figure>
  );
}
