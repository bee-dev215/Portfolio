import { MouseEvent, ReactNode, useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigate, useNavigationType } from "react-router-dom";
import { company, setNavigator } from "@/data/company";
import { useSpotlight } from "@/hooks/use-motion";
import { arriveAt, glideTo, scrollToElement, targetTop } from "@/lib/scroll";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollTop from "./ScrollTop";

const DEFAULT_TITLE = `${company.name} — Custom Software & AI Engineering`;

// ---------- Scroll positions per history entry, so Back and Forward return the reader to where they were ----------
const POSITIONS_KEY = "jovano-scroll";
let positions: Record<string, number> = {};
try {
  positions = JSON.parse(sessionStorage.getItem(POSITIONS_KEY) ?? "{}");
} catch {
  /* storage unavailable: positions last until the tab reloads */
}
// Kept in memory as the reader scrolls; written to the tab's storage on leaving an entry or the site, for reloads
const persistPositions = () => {
  try {
    sessionStorage.setItem(POSITIONS_KEY, JSON.stringify(positions));
  } catch {
    /* ignore */
  }
};
if (typeof window !== "undefined") {
  history.scrollRestoration = "manual";
  window.addEventListener("pagehide", persistPositions);
}

// The first page shown in this tab restores its position only on a reload or Back/Forward into the site,
// not when the address was typed or a link opened it fresh
let firstPage = true;
const arrivedByHistory = () => {
  const nav = performance.getEntriesByType?.("navigation")[0] as PerformanceNavigationTiming | undefined;
  return nav?.type === "reload" || nav?.type === "back_forward";
};

/** Calls `fn` each frame until it returns true (or about a second passes), for content that is still laying out. */
const retry = (fn: () => boolean) => {
  let frames = 0;
  let raf = 0;
  const tick = () => {
    if (!fn() && ++frames < 60) raf = requestAnimationFrame(tick);
  };
  tick();
  return () => cancelAnimationFrame(raf);
};

/**
 * Frame for every public page: skip link, navbar, main, footer and the back-to-top button.
 * Sets the document title and description, opens each page at the top (at its #section, or where the reader left it
 * when they come Back), glides #links on the page to their section, shows the footer's call-to-action card only on
 * pages that don't end with their own (CtaBand), lets the site helpers (startEnquiry, openSolution) change page, and runs the card spotlight.
 */
export default function PageShell({
  title,
  description,
  footerCta = false,
  children,
}: {
  title?: string;
  description?: string;
  footerCta?: boolean;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const { pathname, search, hash, key } = useLocation();
  const lastPath = useRef<string | null>(null);
  const lastSearch = useRef<string | null>(null);
  useSpotlight();

  useEffect(() => {
    setNavigator(navigate);
    return () => setNavigator(null);
  }, [navigate]);

  useEffect(() => {
    document.title = title ? `${title} — ${company.name}` : DEFAULT_TITLE;
    const meta = document.querySelector('meta[name="description"]');
    const prev = meta?.getAttribute("content");
    if (meta && description) meta.setAttribute("content", description);
    return () => {
      if (meta && prev) meta.setAttribute("content", prev);
    };
  }, [title, description]);

  // Remember this entry's scroll position as the reader moves (a layout effect, so it stops before the next page draws)
  useLayoutEffect(() => {
    let raf = 0;
    const save = () => {
      raf = 0;
      positions[key] = Math.round(window.scrollY);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(save);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      persistPositions();
    };
  }, [key]);

  // Place the page before it is drawn: back where the reader was, at the requested #section, or at the top.
  // A new page opens there instantly; on the same page a #link glides, and a link to the page itself glides to the top.
  useLayoutEffect(() => {
    const samePage = lastPath.current === pathname;
    const sameSearch = lastSearch.current === search;
    lastPath.current = pathname;
    lastSearch.current = search;
    const restore = navigationType === "POP" && (!firstPage || arrivedByHistory()) ? positions[key] : undefined;
    firstPage = false;

    if (restore !== undefined) {
      return retry(() => {
        window.scrollTo({ top: restore, behavior: "instant" });
        return Math.abs(window.scrollY - restore) < 2;
      });
    }
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      if (samePage) {
        const el = document.getElementById(id);
        if (el) scrollToElement(el, { hash: false });
        return;
      }
      // Keep the section aligned until the page around it settles (sections above may still be opening), then land
      let last = NaN;
      let steady = 0;
      return retry(() => {
        const el = document.getElementById(id);
        if (!el) return false;
        const y = targetTop(el);
        window.scrollTo({ top: y, behavior: "instant" });
        steady = Math.abs(y - last) < 1 ? steady + 1 : 0;
        last = y;
        if (steady < 3) return false;
        arriveAt(el);
        return true;
      });
    }
    if (!samePage) window.scrollTo({ top: 0, behavior: "instant" });
    else if (sameSearch) glideTo(0);
  }, [pathname, search, hash, key, navigationType]);

  // Links to a #section of this page glide there rather than jump
  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const href = (e.target as Element).closest?.("a[href^='#']")?.getAttribute("href");
    if (!href || href === "#main") return; // the skip link keeps its native focus move
    const el = document.getElementById(decodeURIComponent(href.slice(1)));
    if (!el) return;
    e.preventDefault();
    scrollToElement(el);
  };

  return (
    <div className="site-root site-bg min-h-screen" onClick={onClick}>
      <a
        href="#main"
        className="sr-only z-[200] rounded-full bg-brand px-4 py-3 text-sm font-semibold text-on-brand focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer cta={footerCta} />
      <ScrollTop />
    </div>
  );
}
