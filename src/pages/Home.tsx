import PageShell from "@/components/site/PageShell";
import Hero from "@/components/site/Hero";
import Services from "@/components/site/Services";
import Solutions from "@/components/site/Solutions";
import Projects from "@/components/site/Projects";
import Industries from "@/components/site/Industries";
import Outcomes from "@/components/site/Outcomes";
import Process from "@/components/site/Process";
import Technology from "@/components/site/Technology";
import Company from "@/components/site/Company";
import TrustBand from "@/components/site/TrustBand";
import Faq from "@/components/site/Faq";
import Contact from "@/components/site/Contact";
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

export default function Home() {
  return (
    <PageShell footerCta>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: orgSchema }} />
      <Hero />
      <Outcomes />
      <Services />
      <Solutions />
      <Projects />
      <Industries />
      <Process />
      <Technology />
      <Company />
      <TrustBand />
      <Faq />
      <Contact />
    </PageShell>
  );
}
