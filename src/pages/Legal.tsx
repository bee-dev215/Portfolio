import { useEffect } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { company, imageCredits } from "@/data/company";
import { LegalDocKey, legalDocs } from "@/data/legal";
import { Monogram } from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import ThemeToggle from "@/components/site/ThemeToggle";

const CREDITS = { id: "credits", heading: "Image credits" };

export default function Legal({ doc }: { doc: LegalDocKey }) {
  const d = legalDocs[doc];
  const { hash } = useLocation();
  const toc = doc === "terms" ? [...d.sections, CREDITS] : d.sections;

  useEffect(() => {
    const prev = document.title;
    document.title = `${d.title} — ${company.legalName}`;
    return () => {
      document.title = prev;
    };
  }, [d.title]);

  // Open at the top, or at the requested section
  useEffect(() => {
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    if (target) target.scrollIntoView({ block: "start" });
    else window.scrollTo(0, 0);
  }, [doc, hash]);

  return (
    <div className="site-root site-bg min-h-screen">
      <header className="glass sticky top-0 z-50 border-b border-line px-5 sm:px-8">
        <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5" aria-label={`${company.legalName} — home`}>
            <Monogram />
            <span className="font-display text-lg font-extrabold tracking-tight">{company.name}</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/" className="btn btn-secondary px-4 py-2.5 text-sm">
              <ArrowLeft className="h-4 w-4" /> Back to site
            </Link>
          </div>
        </div>
      </header>

      <main className="px-5 py-16 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[15rem_1fr] lg:gap-20">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <nav aria-label="Legal documents" className="flex gap-2 lg:flex-col">
              {(Object.keys(legalDocs) as LegalDocKey[]).map((k) => (
                <Link
                  key={k}
                  to={`/${k}`}
                  aria-current={k === doc ? "page" : undefined}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${k === doc ? "bg-grad text-white" : "border border-line bg-surface text-ink-2 hover:text-ink"}`}
                >
                  {legalDocs[k].title}
                </Link>
              ))}
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase tracking-wider text-subtle">On this page</p>
            <ol className="mt-3 space-y-1 border-l border-line">
              {toc.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="-ml-px block border-l-2 border-transparent py-1 pl-4 text-sm text-ink-2 transition-colors hover:border-brand hover:text-ink">
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </aside>

          <article className="max-w-3xl">
            <span className="eyebrow">Legal · Last updated {d.updated}</span>
            <h1 className="mt-6 font-display text-5xl font-extrabold tracking-tight sm:text-6xl">{d.title}</h1>
            <p className="mt-6 text-lg leading-relaxed text-ink-2">{d.intro}</p>

            {d.sections.map((s) => (
              <section key={s.id} id={s.id} className="mt-12 scroll-mt-24 border-t border-line pt-8">
                <h2 className="font-display text-2xl font-bold">{s.heading}</h2>
                <div className="mt-4 space-y-4 leading-relaxed text-ink-2">
                  {s.blocks.map((b, bi) =>
                    Array.isArray(b) ? (
                      <ul key={bi} className="space-y-2.5">
                        {b.map((item) => (
                          <li key={item} className="flex gap-3">
                            <span className="bg-grad mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p key={bi}>{b}</p>
                    )
                  )}
                </div>
              </section>
            ))}

            {doc === "terms" && (
              <section id={CREDITS.id} className="mt-12 scroll-mt-24 border-t border-line pt-8">
                <h2 className="font-display text-2xl font-bold">{CREDITS.heading}</h2>
                <p className="mt-4 leading-relaxed text-ink-2">Photography on this site is used under the free licence of Freepik (now Magnific). Thank you to the creators:</p>
                <ul className="mt-5 divide-y divide-line rounded-2xl border border-line bg-surface">
                  {imageCredits.map((c) => (
                    <li key={c.file} className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                      <span className="text-sm text-subtle">{c.subject}</span>
                      <a href={c.href} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-brand-text">
                        Image by {c.author} on Magnific
                        <ArrowUpRight className="h-3.5 w-3.5 text-subtle group-hover:text-brand-text" />
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
