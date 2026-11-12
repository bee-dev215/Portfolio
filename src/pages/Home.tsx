import PageShell from "@/components/site/PageShell";
import Hero from "@/components/site/Hero";
import Outcomes from "@/components/site/Outcomes";
import Services from "@/components/site/Services";
import Solutions from "@/components/site/Solutions";
import Projects from "@/components/site/Projects";
import Process from "@/components/site/Process";
import Company from "@/components/site/Company";
import Faq from "@/components/site/Faq";
import Contact from "@/components/site/Contact";
import KineticBand from "@/components/site/KineticBand";
import { company, services, solutions } from "@/data/company";

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

/**
 * The landing page, in the order a visitor decides: what we do (hero), the problem (busywork), the three services,
 * the AI solutions they start from, proof (work), how it runs (process), why us (company + security), questions, contact.
 */
export default function Home() {
  return (
    <PageShell footerCta>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: orgSchema }} />
      <Hero />
      <Outcomes />
      <Services />
      <KineticBand words={[...services.map((s) => s.title), "Two-week prototypes"]} />
      <Solutions />
      <Projects />
      <KineticBand reverse words={solutions.map((s) => s.title)} />
      <Process />
      <Company />
      <Faq />
      <Contact />
    </PageShell>
  );
}
