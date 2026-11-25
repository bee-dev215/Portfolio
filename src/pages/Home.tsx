import PageShell from "@/components/site/PageShell";
import Hero from "@/components/site/Hero";
import WhyJoin from "@/components/site/WhyJoin";
import Workspace from "@/components/site/Workspace";
import Process from "@/components/site/Process";
import Roles from "@/components/site/Roles";
import Pay from "@/components/site/Pay";
import GlobalTeam from "@/components/site/GlobalTeam";
import LifeOnTeam from "@/components/site/LifeOnTeam";
import ForCompanies from "@/components/site/ForCompanies";
import TrustBlock from "@/components/site/TrustBlock";
import Faq from "@/components/site/Faq";
import { company } from "@/data/company";

// Organization structured data, built from the same source as the page so the two never disagree
const orgSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.name,
  legalName: company.legalName,
  description: company.tagline,
  email: company.email,
  telephone: company.phone,
});

/**
 * The landing page, in the order an applicant decides: who we are (hero), what you get, the workspace, how the process
 * runs, the roles, pay and growth, the global team, life on the team, for companies, safety, questions.
 */
export default function Home() {
  return (
    <PageShell footerCta>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: orgSchema }} />
      <Hero />
      <WhyJoin />
      <Workspace />
      <Process />
      <Roles />
      <Pay />
      <GlobalTeam />
      <LifeOnTeam />
      <ForCompanies />
      <TrustBlock />
      <Faq />
    </PageShell>
  );
}
