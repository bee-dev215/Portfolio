import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Home from "./pages/Home";

// Inner pages load on demand, so the home page stays light
const SolutionsIndex = lazy(() => import("./pages/SolutionsIndex"));
const SolutionDetail = lazy(() => import("./pages/SolutionDetail"));
const ProjectsIndex = lazy(() => import("./pages/ProjectsIndex"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const ServicesIndex = lazy(() => import("./pages/ServicesIndex"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const IndustriesIndex = lazy(() => import("./pages/IndustriesIndex"));
const IndustryDetail = lazy(() => import("./pages/IndustryDetail"));
const About = lazy(() => import("./pages/About"));
const Approach = lazy(() => import("./pages/Approach"));
const TechnologyPage = lazy(() => import("./pages/TechnologyPage"));
const TeamPage = lazy(() => import("./pages/TeamPage"));
const ResponsibleAi = lazy(() => import("./pages/ResponsibleAi"));
const FaqPage = lazy(() => import("./pages/FaqPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const Legal = lazy(() => import("./pages/Legal"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="dark">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
              <Route path="/privacy" element={<Legal doc="privacy" />} />
              <Route path="/terms" element={<Legal doc="terms" />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
