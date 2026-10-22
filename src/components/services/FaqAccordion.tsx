import { useId, useState } from "react";
import { Plus } from "lucide-react";
import Reveal from "@/components/site/Reveal";

/** Accordion of questions with FAQPage structured data; the first one starts open. */
export default function FaqAccordion({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  });

  return (
    <ul className="space-y-3">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <li key={f.q}>
            <Reveal delay={i * 50}>
              <div className={`card overflow-hidden transition-colors ${isOpen ? "border-brand/30" : ""}`}>
                <h3>
                  <button
                    id={`${id}-q${i}`}
                    aria-controls={`${id}-a${i}`}
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center gap-4 px-6 py-5 text-left"
                  >
                    <span className="flex-1 font-display text-lg font-bold leading-snug">{f.q}</span>
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all duration-300 ${isOpen ? "rotate-45 bg-grad text-white" : "bg-raised text-ink-2"}`}>
                      <Plus className="h-4 w-4" />
                    </span>
                  </button>
                </h3>
                <div
                  id={`${id}-a${i}`}
                  role="region"
                  aria-labelledby={`${id}-q${i}`}
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
  );
}
