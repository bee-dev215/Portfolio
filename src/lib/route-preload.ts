import { ComponentType, lazy } from "react";
import { matchPath } from "react-router-dom";

/**
 * Pages that load on demand, by route. Their code is fetched as soon as a link to them is pointed at, focused or
 * touched, and while a click waits on it the top of the page shows a progress bar (RouteProgress) — the current page
 * stays in place meanwhile, since the router changes page inside a transition.
 */
const pages: { path: string; load: () => Promise<unknown>; loaded: () => boolean }[] = [];

export function lazyPage<T extends ComponentType>(paths: string[], loader: () => Promise<{ default: T }>) {
  let promise: Promise<{ default: T }> | null = null;
  let loaded = false;
  const load = () =>
    (promise ??= loader().then(
      (m) => {
        loaded = true;
        return m;
      },
      (err) => {
        promise = null; // let a later attempt retry
        throw err;
      },
    ));
  for (const path of paths) pages.push({ path, load, loaded: () => loaded });
  return lazy(load);
}

const pageFor = (to: string) => {
  const pathname = new URL(to, window.location.origin).pathname;
  return pages.find((p) => matchPath(p.path, pathname));
};

/** Starts fetching the code for the page at `to` (a path or same-site URL). */
export function preloadPath(to: string) {
  pageFor(to)
    ?.load()
    .catch(() => {});
}

// ---------- Pending navigations, for the progress bar ----------
let pending = 0;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

export const subscribeNavigation = (fn: () => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};
export const isNavigating = () => pending > 0;

/** Call as a navigation to `to` begins: if its page's code isn't loaded yet, the progress bar runs until it is. */
export function startNavigation(to: string) {
  const page = pageFor(to);
  if (!page || page.loaded()) return;
  pending++;
  notify();
  page
    .load()
    .catch(() => {})
    .finally(() => {
      pending--;
      notify();
    });
}

/** The closest same-site page link to an event target, if any (not new-tab, download or #only links). */
export function internalLink(target: EventTarget | null) {
  const a = (target as Element | null)?.closest?.<HTMLAnchorElement>("a[href]");
  if (!a || a.target === "_blank" || a.hasAttribute("download")) return null;
  const href = a.getAttribute("href")!;
  if (href.startsWith("#") || a.origin !== window.location.origin) return null;
  return a;
}
