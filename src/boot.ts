import { BOOT_EVENT } from "@/hooks/use-motion";

const SEEN_KEY = "jm-boot-seen";
const TICKS = 72; // calibration dial
const CELLS = 40; // charge bar

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const stamp = (ms: number) => `[ ${(ms / 1000).toFixed(3).padStart(6, " ")} ]`;

/**
 * Drives the boot screen that index.html paints before the bundle loads: prints the power-on
 * self-test, fills the calibration dial a tick at a time, locks on and parts the bay doors onto
 * the site. The first load in a session gets the full sequence (~2.5s), later loads a quick warm
 * boot; any key, click, wheel or tap skips ahead. The last check holds until the display fonts are
 * in, so the hero never reveals in fallback type.
 * <html data-boot> flips to "done" as the doors part, which releases the hero's entrance (index.css).
 */
export function runBoot() {
  const html = document.documentElement;
  const root = document.getElementById("boot");
  if (!root) return;
  if (html.dataset.boot !== "pending") {
    root.remove();
    return;
  }

  const q = <T extends Element = HTMLElement>(k: string) => root.querySelector<T>(`[data-b="${k}"]`);
  const clock = q("clock");
  const state = q("state");
  const pct = q("pct");
  const cells = q("cells");
  const arc = q<SVGCircleElement>("arc");
  const lines = Array.from(root.querySelectorAll<HTMLElement>("[data-line]"));

  const warm = html.dataset.bootMode === "warm";
  if (warm) root.classList.add("is-quick");
  const pace = warm ? 0.3 : 1;
  const OK_AFTER = 150 * pace; // label prints, then its status
  const lineAt = (i: number) => 120 * pace + i * 250 * pace;
  const lastOk = lineAt(lines.length - 1) + OK_AFTER;
  // progress advances in bursts while each check runs and holds in between
  // (sum then divide: adding 1/7 seven times falls short of 1 in floating point)
  const progress = (t: number) => lines.reduce((sum, _, i) => sum + clamp01((t - lineAt(i)) / OK_AFTER), 0) / lines.length;

  let fontsReady = false;
  const fonts = document.fonts
    ? Promise.all([document.fonts.load('700 1em "Chakra Petch"'), document.fonts.load('400 1em "IBM Plex Sans"'), document.fonts.ready])
    : Promise.resolve();
  const fontsDone = () => (fontsReady = true);
  Promise.race([fonts, new Promise((r) => setTimeout(r, 2500))]).then(fontsDone, fontsDone);

  const t0 = performance.now();
  let phase: "run" | "lock" | "open" = "run";
  let skipped = false;
  let shown = { pct: -1, ticks: -1, cells: -1 };

  const skip = () => {
    if (phase !== "run" || skipped) return;
    skipped = true;
    root.classList.add("is-quick");
  };
  const events = ["keydown", "pointerdown", "wheel", "touchstart"] as const;
  events.forEach((e) => window.addEventListener(e, skip, { passive: true }));

  const frame = (now: number) => {
    if (clock) clock.textContent = `T+${(now / 1000).toFixed(3).padStart(6, "0")}`;
    // the final check waits on the fonts
    const t = skipped ? Infinity : Math.min(now - t0, fontsReady ? Infinity : lastOk - OK_AFTER);

    lines.forEach((li, i) => {
      if (t >= lineAt(i) && !li.classList.contains("on")) {
        const ts = li.querySelector(".ts");
        if (ts) ts.textContent = stamp(now);
        li.classList.add("on");
      }
      if (t >= lineAt(i) + OK_AFTER) li.classList.add("ok");
    });

    const p = progress(t);
    const next = { pct: Math.floor(p * 100), ticks: Math.floor(p * TICKS), cells: Math.floor(p * CELLS) };
    if (next.pct !== shown.pct && pct) pct.textContent = `${String(next.pct).padStart(3, "0")}%`;
    if (next.ticks !== shown.ticks) arc?.setAttribute("stroke-dasharray", `${next.ticks} ${TICKS}`);
    if (next.cells !== shown.cells) cells?.style.setProperty("--p", String(next.cells / CELLS));
    shown = next;

    if (p >= 1) lock();
    else requestAnimationFrame(frame);
  };

  const lock = () => {
    phase = "lock";
    root.classList.add("is-locked");
    if (state) state.textContent = "Target locked";
    setTimeout(open, skipped ? 120 : warm ? 200 : 420);
  };

  const open = () => {
    phase = "open";
    if (state) state.textContent = "Opening bay doors";
    root.classList.add("is-open");
    events.forEach((e) => window.removeEventListener(e, skip));
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* storage blocked: every load gets the full boot */
    }
    // release the site as the doors start to move, and clear the doors once they're gone
    const quick = root.classList.contains("is-quick");
    setTimeout(() => {
      html.dataset.boot = "done";
      window.dispatchEvent(new Event(BOOT_EVENT));
    }, quick ? 160 : 280);
    setTimeout(() => root.remove(), quick ? 1000 : 1400);
  };

  if (state) state.textContent = "Calibrating";
  requestAnimationFrame(frame);
}
