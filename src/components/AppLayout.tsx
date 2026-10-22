import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./site/Navbar";
import Hero from "./site/Hero";
import Services from "./site/Services";
import Solutions from "./site/Solutions";
import Industries from "./site/Industries";
import Process from "./site/Process";
import Technology from "./site/Technology";
import Company from "./site/Company";
import Team from "./site/Team";
import Faq from "./site/Faq";
import Contact from "./site/Contact";
import Footer from "./site/Footer";
import { company, services } from "@/data/company";

// Organization structured data, built from the same source as the page so the two never disagree
const orgSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.name,
  legalName: company.legalName,
  description: company.tagline,
  email: company.email,
  telephone: company.phone,
  knowsAbout: services.map((s) => s.title),
});

/** Arriving on "/#section" (e.g. from a legal page's footer): scroll there once the sections exist. */
function useHashScroll() {
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    const raf = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "start" }));
    return () => cancelAnimationFrame(raf);
  }, [hash]);
}

export default function AppLayout() {
  useHashScroll();

  return (
    <div className="site-root site-bg min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: orgSchema }} />
      <a
        href="#main"
        className="sr-only z-[200] rounded-full bg-brand px-4 py-3 text-sm font-semibold text-on-brand focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Services />
        <Solutions />
        <Industries />
        <Process />
        <Technology />
        <Company />
        <Team />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
