import { ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { company, setNavigator } from "@/data/company";
import Navbar from "./Navbar";
import Footer from "./Footer";

const DEFAULT_TITLE = `${company.name} — AI Engineering for Education`;

/**
 * Frame for every public page: skip link, navbar, main and footer.
 * Sets the document title and description, opens each page at the top (or at its #section),
 * shows the footer's call-to-action card only on pages that don't end with their own (CtaBand),
 * and lets the site helpers (startEnquiry, openSolution) change page through the router.
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
  const { pathname, hash } = useLocation();

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

  // Open at the top, or at the requested section once it exists
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const raf = requestAnimationFrame(() => document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ block: "start" }));
    return () => cancelAnimationFrame(raf);
  }, [pathname, hash]);

  return (
    <div className="site-root site-bg min-h-screen">
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
    </div>
  );
}
