import { ReactNode } from "react";
import { Check, Link2, Plus } from "lucide-react";
import { Faq } from "@/data/faq";
import "./faq.css";

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Wraps every match of `query` in a <mark>. */
export function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (q.length < 2) return <>{text}</>;
  const parts = text.split(new RegExp(`(${escape(q)})`, "gi"));
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="rounded bg-brand-soft px-0.5 text-brand-text">
            {p}
          </mark>
        ) : (
          p
        )
      )}
    </>
  );
}

/** One question: the heading toggles the answer; the link button copies a deep link (/faq#id). */
export default function FaqItem({
  faq,
  open,
  onToggle,
  onCopy,
  copied,
  highlighted,
  query = "",
  children,
}: {
  faq: Faq;
  open: boolean;
  onToggle: () => void;
  onCopy: () => void;
  copied: boolean;
  highlighted?: boolean; // the question the page was opened at
  query?: string;
  children?: ReactNode; // extra content under the answer
}) {
  return (
    <div id={faq.id} className={`card scroll-mt-28 overflow-hidden transition-[border-color,box-shadow] duration-500 ${open ? "border-brand/30" : ""} ${highlighted ? "faq-target" : ""}`}>
      <div className="flex items-center gap-2 pr-3">
        <h3 className="flex-1">
          <button id={`${faq.id}-q`} aria-controls={`${faq.id}-a`} aria-expanded={open} onClick={onToggle} className="flex w-full items-center gap-4 py-5 pl-6 text-left">
            <span className="flex-1 font-display text-lg font-bold leading-snug">
              <Highlight text={faq.q} query={query} />
            </span>
            <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all duration-300 ${open ? "rotate-45 bg-grad text-white" : "bg-raised text-ink-2"}`}>
              <Plus className="h-4 w-4" />
            </span>
          </button>
        </h3>
        <button
          onClick={onCopy}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-subtle transition-colors hover:bg-raised hover:text-brand-text"
          aria-label={`Copy link to “${faq.q}”`}
          title="Copy link to this question"
        >
          {copied ? <Check className="h-4 w-4 text-brand-text" /> : <Link2 className="h-4 w-4" />}
        </button>
      </div>
      <div
        id={`${faq.id}-a`}
        role="region"
        aria-labelledby={`${faq.id}-q`}
        className={`grid transition-all duration-500 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6">
            <p className="leading-relaxed text-ink-2">
              <Highlight text={faq.a} query={query} />
            </p>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
