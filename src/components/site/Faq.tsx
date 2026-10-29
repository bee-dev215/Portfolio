import { useState } from "react";
import { ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { bookCall, company } from "@/data/company";
import { faqs as allFaqs } from "@/data/faq";

// The home page shows the featured questions; /faq has them all
const faqs = allFaqs.filter((f) => f.featured);
import Reveal, { SectionHeading } from "./Reveal";

// FAQPage structured data, so search results can show the answers
const faqSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="band px-5 py-24 sm:px-8 lg:py-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
      <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            label="FAQ"
            title={
              <>
                Questions, <span className="gradient-text">answered.</span>
              </>
            }
          >
            <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-2">
              Straight answers on the free prototype, pricing, ownership and security at {company.shortName}. If yours isn't here, ask us on a call.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <button onClick={() => bookCall()} className="btn btn-secondary px-6 py-3 text-sm">
                Book a call <ArrowUpRight className="h-4 w-4" />
              </button>
              <Link to="/faq" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-text">
                All {allFaqs.length} questions <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </SectionHeading>
        </div>

        <ul className="space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.id}>
                <Reveal delay={i * 50}>
                  <div className={`card overflow-hidden transition-colors ${isOpen ? "border-brand/30" : ""}`}>
                    <h3>
                      <button
                        id={`faq-q-${i}`}
                        aria-controls={`faq-a-${i}`}
                        aria-expanded={isOpen}
                        onClick={() => setOpen(isOpen ? null : i)}
                        className="flex w-full items-center gap-4 px-6 py-5 text-left"
                      >
                        <span className="flex-1 font-display text-lg font-bold leading-snug">{f.q}</span>
                        <span
                          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                            isOpen ? "rotate-45 bg-grad text-white" : "bg-raised text-ink-2"
                          }`}
                        >
                          <Plus className="h-4 w-4" />
                        </span>
                      </button>
                    </h3>
                    <div
                      id={`faq-a-${i}`}
                      role="region"
                      aria-labelledby={`faq-q-${i}`}
                      className={`grid transition-all duration-500 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-6 pb-6 leading-relaxed text-ink-2">{f.a}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
