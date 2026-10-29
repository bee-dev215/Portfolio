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
const SolutionsIndex = lazyPage(["/solutions"], () => import("./pages/SolutionsIndex"));
const SolutionDetail = lazyPage(["/solutions/:slug"], () => import("./pages/SolutionDetail"));
const ProjectsIndex = lazyPage(["/projects"], () => import("./pages/ProjectsIndex"));
const ProjectDetail = lazyPage(["/projects/:slug"], () => import("./pages/ProjectDetail"));
const ServicesIndex = lazyPage(["/services"], () => import("./pages/ServicesIndex"));
const ServiceDetail = lazyPage(["/services/:slug"], () => import("./pages/ServiceDetail"));
const IndustriesIndex = lazyPage(["/industries"], () => import("./pages/IndustriesIndex"));
const IndustryDetail = lazyPage(["/industries/:slug"], () => import("./pages/IndustryDetail"));
const About = lazyPage(["/about"], () => import("./pages/About"));
const Approach = lazyPage(["/approach"], () => import("./pages/Approach"));
const TechnologyPage = lazyPage(["/technology"], () => import("./pages/TechnologyPage"));
const TeamPage = lazyPage(["/team"], () => import("./pages/TeamPage"));
const ResponsibleAi = lazyPage(["/responsible-ai"], () => import("./pages/ResponsibleAi"));
const FaqPage = lazyPage(["/faq"], () => import("./pages/FaqPage"));
const ContactPage = lazyPage(["/contact"], () => import("./pages/ContactPage"));
const BookCall = lazyPage(["/book"], () => import("./pages/BookCall"));
const Legal = lazyPage(["/privacy", "/terms"], () => import("./pages/Legal"));
const Admin = lazyPage(["/admin/:section?"], () => import("./pages/Admin"));
const NotFound = lazyPage([], () => import("./pages/NotFound"));

const queryClient = new QueryClient();

/**
 * Fetches a page's code as soon as a link to it is pointed at, focused or touched, and starts the progress bar when
 * one is clicked. The booking page, where most buttons lead, is fetched once the browser is idle.
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
    const idle = window.requestIdleCallback ? window.requestIdleCallback(() => preloadPath("/book")) : window.setTimeout(() => preloadPath("/book"), 2000);
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
                <Route path="/solutions" element={<SolutionsIndex />} />
                <Route path="/solutions/:slug" element={<SolutionDetail />} />
                <Route path="/projects" element={<ProjectsIndex />} />
                <Route path="/projects/:slug" element={<ProjectDetail />} />
                <Route path="/services" element={<ServicesIndex />} />
                <Route path="/services/:slug" element={<ServiceDetail />} />
                <Route path="/industries" element={<IndustriesIndex />} />
                <Route path="/industries/:slug" element={<IndustryDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/approach" element={<Approach />} />
                <Route path="/technology" element={<TechnologyPage />} />
                <Route path="/team" element={<TeamPage />} />
                <Route path="/responsible-ai" element={<ResponsibleAi />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/book" element={<BookCall />} />
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
