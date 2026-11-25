import { Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import RouteProgress from "@/components/site/RouteProgress";
import { internalLink, lazyPage, preloadPath, startNavigation } from "@/lib/route-preload";
import Home from "./pages/Home";

// Inner pages load on demand, so the home page stays light
const RolesIndex = lazyPage(["/roles"], () => import("./pages/RolesIndex"));
const RoleDetail = lazyPage(["/roles/:slug"], () => import("./pages/RoleDetail"));
const HowItWorks = lazyPage(["/how-it-works"], () => import("./pages/HowItWorks"));
const About = lazyPage(["/about"], () => import("./pages/About"));
const FaqPage = lazyPage(["/faq"], () => import("./pages/FaqPage"));
const Apply = lazyPage(["/apply"], () => import("./pages/Apply"));
const ContactPage = lazyPage(["/contact"], () => import("./pages/ContactPage"));
const Legal = lazyPage(["/privacy", "/terms"], () => import("./pages/Legal"));
const Admin = lazyPage(["/admin/:section?"], () => import("./pages/Admin"));
const NotFound = lazyPage([], () => import("./pages/NotFound"));

const queryClient = new QueryClient();

/**
 * Fetches a page's code as soon as a link to it is pointed at, focused or touched, and starts the progress bar when
 * one is clicked. The apply page, where most buttons lead, is fetched once the browser is idle.
 */
function usePagePreloading() {
  useEffect(() => {
    const intent = (e: Event) => {
      const a = internalLink(e.target);
      if (a) preloadPath(a.href);
    };
    const click = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = internalLink(e.target);
      if (a) startNavigation(a.href);
    };
    const idle = window.requestIdleCallback ? window.requestIdleCallback(() => preloadPath("/apply")) : window.setTimeout(() => preloadPath("/apply"), 2000);
    document.addEventListener("pointerover", intent, { passive: true });
    document.addEventListener("focusin", intent);
    document.addEventListener("touchstart", intent, { passive: true });
    document.addEventListener("click", click);
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      document.removeEventListener("pointerover", intent);
      document.removeEventListener("focusin", intent);
      document.removeEventListener("touchstart", intent);
      document.removeEventListener("click", click);
    };
  }, []);
}

const App = () => {
  usePagePreloading();
  return (
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {/* Page changes run as transitions: the current page stays on screen until the next one is ready */}
          <BrowserRouter future={{ v7_startTransition: true }}>
            <RouteProgress />
            <Suspense fallback={<div className="site-root site-bg min-h-screen" />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/roles" element={<RolesIndex />} />
                <Route path="/roles/:slug" element={<RoleDetail />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/about" element={<About />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/apply" element={<Apply />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy" element={<Legal doc="privacy" />} />
                <Route path="/terms" element={<Legal doc="terms" />} />
                <Route path="/admin/:section?" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
