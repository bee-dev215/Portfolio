import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Mail, MessageCircleQuestion, Phone, Search, X } from "lucide-react";
import { toast } from "sonner";
import PageShell from "@/components/site/PageShell";
import PageHero from "@/components/site/PageHero";
import CtaBand from "@/components/site/CtaBand";
import Reveal from "@/components/site/Reveal";
import FaqItem from "@/components/faq/FaqItem";
import { company, startEnquiry } from "@/data/company";
import { Faq, FaqCategory, faqCategories, faqs } from "@/data/faq";

type Filter = "All" | FaqCategory;

// FAQPage structured data for every question
const faqSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

const matches = (f: Faq, query: string) => {
  const q = query.trim().toLowerCase();
  return !q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q);
};

export default function FaqPage() {
  const { hash } = useLocation();
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const [target, setTarget] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // Questions that match the search, before the category filter (the tab counts use these)
  const found = useMemo(() => faqs.filter((f) => matches(f, query)), [query]);
  const visible = filter === "All" ? found : found.filter((f) => f.category === filter);
  const groups = faqCategories.map((c) => ({ category: c, items: visible.filter((f) => f.category === c) })).filter((g) => g.items.length > 0);
  const count = (c: Filter) => (c === "All" ? found.length : found.filter((f) => f.category === c).length);
  const allOpen = visible.length > 0 && visible.every((f) => open.has(f.id));

  // Opened at /faq#id: show every question and open that one (PageShell scrolls to it)
  useEffect(() => {
    const id = decodeURIComponent(hash.slice(1));
    if (!faqs.some((f) => f.id === id)) return;
    setFilter("All");
    setQuery("");
    setOpen((prev) => new Set(prev).add(id));
    setTarget(id);
  }, [hash]);

  // While searching, open the matches so the highlighted words are visible
  useEffect(() => {
    if (query.trim().length >= 2) setOpen(new Set(faqs.filter((f) => matches(f, query)).map((f) => f.id)));
  }, [query]);

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleAll = () => setOpen(allOpen ? new Set() : new Set(visible.map((f) => f.id)));

  const copyLink = async (id: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/faq#${id}`);
      setCopied(id);
      toast.success("Link copied");
      window.setTimeout(() => setCopied((c) => (c === id ? null : c)), 1600);
    } catch {
      toast.error("Could not copy the link");
    }
  };

  const tabs: Filter[] = ["All", ...faqCategories];

  return (
    <PageShell title="Questions & answers" description={`Straight answers on how ${company.name} works: AI quality, data and privacy, pricing, timelines and working together.`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
      <PageHero
        crumbs={[{ label: "Questions" }]}
        eyebrow="Questions & answers"
        title={
          <>
            Questions, <span className="gradient-text">answered.</span>
          </>
        }
        lead={`How we work, how we keep AI accurate, what happens to your data and how projects are priced — ${faqs.length} straight answers. If yours isn't here, ask an engineer directly.`}
      >
        <div className="relative max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-subtle" aria-hidden="true" />
          <label htmlFor="faq-search" className="sr-only">
            Search the questions
          </label>
          <input
            id="faq-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setQuery("")}
            placeholder="Search, e.g. “privacy”, “LMS”, “pricing”"
            autoComplete="off"
            className="field rounded-full py-4 pl-12 pr-12 text-base shadow-soft [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-subtle transition-colors hover:bg-raised hover:text-ink"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </PageHero>

      <section className="px-5 pb-20 sm:px-8 lg:pb-28">
        <div className="mx-auto max-w-[1240px]">
          {/* Category tabs and expand all */}
          <div className="flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-center md:justify-between">
            <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
              <div className="flex w-max gap-1 rounded-full border border-line bg-surface p-1" role="tablist" aria-label="Filter questions by topic">
                {tabs.map((c) => {
                  const n = count(c);
                  const selected = filter === c;
                  return (
                    <button
                      key={c}
                      role="tab"
                      aria-selected={selected}
                      aria-controls="faq-list"
                      onClick={() => setFilter(c)}
                      className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                        selected ? "bg-grad text-white shadow-[0_8px_18px_-10px_rgb(var(--brand-rgb)/.8)]" : "text-ink-2 hover:text-ink"
                      }`}
                    >
                      {c}
                      <span className={`rounded-full px-1.5 text-xs tabular-nums ${selected ? "bg-white/20" : "bg-raised text-subtle"}`}>{n}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {visible.length > 0 && (
              <button onClick={toggleAll} className="self-start text-sm font-semibold text-brand-text md:self-auto">
                {allOpen ? "Collapse all" : "Expand all"}
              </button>
            )}
          </div>

          <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
            <div id="faq-list" role="tabpanel">
              <p className="sr-only" aria-live="polite">
                {query.trim() ? `${visible.length} ${visible.length === 1 ? "question matches" : "questions match"} your search` : ""}
              </p>
              {groups.length === 0 ? (
                <div className="card flex flex-col items-center px-6 py-16 text-center">
                  <span className="icon-tile h-14 w-14">
                    <MessageCircleQuestion className="h-7 w-7" />
                  </span>
                  <h2 className="mt-5 font-display text-2xl font-bold">No questions match “{query.trim()}”</h2>
                  <p className="mt-2 max-w-sm text-ink-2">Try a different word, or ask us directly — an engineer will answer within {company.responseTime}.</p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <button
                      onClick={() => {
                        setQuery("");
                        setFilter("All");
                      }}
                      className="btn btn-secondary px-5 py-2.5 text-sm"
                    >
                      Clear search
                    </button>
                    <button onClick={() => startEnquiry()} className="btn btn-primary px-5 py-2.5 text-sm">
                      Ask us directly <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-12">
                  {groups.map((g) => (
                    <div key={g.category}>
                      <h2 className="flex items-center gap-3 font-display text-xl font-bold tracking-tight">
                        {g.category}
                        <span className="chip text-[11px]">{g.items.length}</span>
                      </h2>
                      <ul className="mt-5 space-y-3">
                        {g.items.map((f) => (
                          <li key={f.id}>
                            <FaqItem
                              faq={f}
                              open={open.has(f.id)}
                              onToggle={() => toggle(f.id)}
                              onCopy={() => copyLink(f.id)}
                              copied={copied === f.id}
                              highlighted={target === f.id}
                              query={query}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Aside: popular questions and a direct line */}
            <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
              <Reveal>
                <div className="card p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-subtle">Most asked</p>
                  <ul className="mt-4 space-y-1">
                    {faqs
                      .filter((f) => f.featured)
                      .map((f) => (
                        <li key={f.id}>
                          <Link to={`/faq#${f.id}`} className="-mx-2 block rounded-lg px-2 py-1.5 text-sm text-ink-2 transition-colors hover:bg-raised hover:text-ink">
                            {f.q}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              </Reveal>
              <Reveal delay={80}>
                <div className="card relative overflow-hidden p-6">
                  <div className="mesh pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
                  <div className="relative">
                    <p className="font-display text-lg font-bold">Can't find your question?</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-2">An engineer, not a salesperson, replies within {company.responseTime}.</p>
                    <ul className="mt-4 space-y-2 text-sm">
                      <li>
                        <a href={`mailto:${company.email}`} className="flex items-center gap-2.5 text-ink-2 transition-colors hover:text-brand-text">
                          <Mail className="h-4 w-4 shrink-0 text-brand-text" /> <span className="truncate">{company.email}</span>
                        </a>
                      </li>
                      <li>
                        <a href={company.phoneHref} className="flex items-center gap-2.5 text-ink-2 transition-colors hover:text-brand-text">
                          <Phone className="h-4 w-4 shrink-0 text-brand-text" /> {company.phone}
                        </a>
                      </li>
                    </ul>
                    <button onClick={() => startEnquiry()} className="btn btn-primary mt-5 w-full py-3 text-sm">
                      Ask a question <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Reveal>
            </aside>
          </div>
        </div>
      </section>

      <CtaBand
        kicker="An engineer, not a salesperson, will answer."
        title="Still have a question?"
        primaryLabel="Ask us directly"
        secondary={{ label: "How we work", to: "/approach" }}
      />
    </PageShell>
  );
}
