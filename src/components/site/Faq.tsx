import { useState } from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import { company, faqs, startEnquiry } from "@/data/company";
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
    <section id="faq" className="px-5 py-24 sm:px-10 lg:px-14 lg:py-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
      <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            index="07"
            label="FAQ"
            title={
              <>
                Questions, <span className="glow-text text-beam">answered.</span>
              </>
            }
          >
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted2">
              Straight answers on how {company.name} works. If yours isn't here, ask an engineer directly.
            </p>
            <button
              onClick={() => startEnquiry()}
              className="press key-dark group mt-8 inline-flex items-center gap-2 border border-line bg-paper/40 px-6 py-3.5 font-display text-sm font-semibold uppercase tracking-wide hover:border-signal hover:text-beam"
            >
              Ask a question
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
          </SectionHeading>
        </div>

        <ul className="border-t border-line">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q} className="border-b border-line">
                <Reveal delay={i * 60}>
                  <h3>
                    <button
                      id={`faq-q-${i}`}
                      aria-controls={`faq-a-${i}`}
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="group flex w-full items-start gap-4 py-6 text-left sm:gap-6"
                    >
                      <span className={`pt-1.5 font-code text-xs ${isOpen ? "text-beam" : "text-muted2"}`}>Q{String(i + 1).padStart(2, "0")}</span>
                      <span className="flex-1 font-display text-xl font-semibold uppercase leading-snug tracking-wide transition-transform duration-300 group-hover:translate-x-1 sm:text-2xl">
                        {f.q}
                      </span>
                      <span
                        className={`key-dark grid h-9 w-9 shrink-0 place-items-center border transition-all duration-300 ${
                          isOpen ? "rotate-45 border-signal bg-signal text-on-signal" : "border-line group-hover:border-signal group-hover:text-beam"
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
                      <p className="max-w-2xl pb-7 pl-10 pr-12 leading-relaxed text-muted2 sm:pl-12">{f.a}</p>
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
