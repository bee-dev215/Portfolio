import { prefersReducedMotion } from "@/hooks/use-motion";

/**
 * In-page scrolling for the public site. Every jump (section bars, "see below" buttons, #links, back to top) goes
 * through here, so they all move the same way: a short glide that lands the target just below the fixed header,
 * stops the moment the reader scrolls themselves, then marks where they landed and moves keyboard focus there.
 */

/** Fired on window when a jump to a section starts and ends; detail is the target's id. */
export const JUMP_EVENT = "jovano:jump";
export interface JumpDetail {
  id: string;
  phase: "start" | "end";
}

// Longer jumps cut to this many viewports short of the target and glide the rest, so the reader sees the
// arrival instead of a blur of every section in between
const GLIDE_REACH = 1.25;

const clampY = (y: number) => Math.min(Math.max(0, y), document.documentElement.scrollHeight - window.innerHeight);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const instant = (top: number) => window.scrollTo({ top, behavior: "instant" });

let cancelGlide: (() => void) | null = null;

/**
 * Scrolls the window to `to` (a position, or a function re-read every frame so a layout shift mid-way is absorbed).
 * Resolves true on arrival, false if the reader took over or another glide replaced this one.
 */
export function glideTo(to: number | (() => number)): Promise<boolean> {
  cancelGlide?.();
  const target = () => clampY(typeof to === "function" ? to() : to);
  const dist = target() - window.scrollY;
  if (prefersReducedMotion() || Math.abs(dist) < 2) {
    instant(target());
    return Promise.resolve(true);
  }

  const reach = GLIDE_REACH * window.innerHeight;
  if (Math.abs(dist) > reach) instant(target() - Math.sign(dist) * reach);
  const from = window.scrollY;
  const duration = Math.min(750, 280 + (Math.abs(target() - from) / window.innerHeight) * 380);
  const start = performance.now();

  return new Promise((resolve) => {
    let raf = 0;
    const input = ["wheel", "touchstart", "pointerdown", "keydown"] as const;
    const finish = (arrived: boolean) => {
      cancelAnimationFrame(raf);
      input.forEach((type) => window.removeEventListener(type, stop));
      if (cancelGlide === stop) cancelGlide = null;
      resolve(arrived);
    };
    // The reader scrolling, tapping or pressing a key takes over at once
    const stop = () => finish(false);
    const frame = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      instant(from + (target() - from) * easeInOut(t));
      if (t < 1) raf = requestAnimationFrame(frame);
      else finish(true);
    };
    input.forEach((type) => window.addEventListener(type, stop, { passive: true }));
    cancelGlide = stop;
    raf = requestAnimationFrame(frame);
  });
}

/** Where a target should sit below the top of the window: its own scroll-margin-top, or the header's height. */
function landingOffset(el: HTMLElement) {
  const margin = parseFloat(getComputedStyle(el).scrollMarginTop);
  if (margin > 0) return margin;
  return (document.querySelector<HTMLElement>("[data-site-header]")?.offsetHeight ?? 72) + 16;
}

export const targetTop = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY - landingOffset(el);

/**
 * Briefly marks where a jump landed: an explicit [data-land] spot, else the card itself, else the section's eyebrow
 * pill, else its first card, else the whole target (see .landed in index.css).
 */
export function markLanding(el: HTMLElement) {
  const spot = el.matches(".card, [data-land]") ? el : el.querySelector<HTMLElement>("[data-land], .eyebrow, .card") ?? el;
  spot.classList.remove("landed");
  void spot.offsetWidth; // restart the animation if it is still running
  spot.classList.add("landed");
  spot.addEventListener("animationend", () => spot.classList.remove("landed"), { once: true });
}

/** On arrival: moves keyboard and screen-reader focus to the target (without scrolling again) and marks the spot. */
export function arriveAt(el: HTMLElement) {
  if (!el.matches("a[href], button, input, select, textarea, [tabindex]")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
  markLanding(el);
}

const emit = (id: string, phase: JumpDetail["phase"]) => window.dispatchEvent(new CustomEvent<JumpDetail>(JUMP_EVENT, { detail: { id, phase } }));

/**
 * Glides to an element, then focuses it and marks the landing. `hash` records the target's #id in the address
 * (keeping the router's history state), so a reload or a shared link opens at the same place.
 */
export async function scrollToElement(el: HTMLElement, { hash = true }: { hash?: boolean } = {}) {
  const id = el.id;
  if (hash && id) history.replaceState(history.state, "", `#${id}`);
  if (id) emit(id, "start");
  const arrived = await glideTo(() => targetTop(el));
  if (id) emit(id, "end");
  if (arrived) arriveAt(el);
}

/** Glides to the element with this id; false if there is none on the page. */
export function scrollToSection(id: string, options?: Parameters<typeof scrollToElement>[1]) {
  const el = document.getElementById(id);
  if (!el) return false;
  scrollToElement(el, options);
  return true;
}

export const scrollToTop = () => glideTo(0);
