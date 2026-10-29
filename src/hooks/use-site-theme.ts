import { useCallback, useEffect, useState } from "react";

export type SiteTheme = "light" | "dark";

const KEY = "jovano-theme"; // also read by the pre-paint script in index.html
const BROWSER_BAR: Record<SiteTheme, string> = { light: "#f7f8fc", dark: "#080b18" };

const current = (): SiteTheme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

const syncBrowserBar = (theme: SiteTheme) =>
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", BROWSER_BAR[theme]);

/**
 * The public site's colour theme. index.html applies the saved choice (light by default) to
 * <html data-theme> before first paint; this flips it and remembers the visitor's choice.
 */
export function useSiteTheme() {
  const [theme, setTheme] = useState<SiteTheme>(current);

  useEffect(() => syncBrowserBar(current()), []);

  const toggle = useCallback(() => {
    const next: SiteTheme = current() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    syncBrowserBar(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* storage blocked: the choice lasts for this page view */
    }
    setTheme(next);
  }, []);

  return { theme, toggle };
}
