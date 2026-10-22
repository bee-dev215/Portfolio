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
    <div className="site-root site-bg min-h-screen antialiased">
      <header className="sticky top-0 z-50 border-b border-line bg-paper/85 px-5 backdrop-blur-md sm:px-10 lg:px-14">
        <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3" aria-label={`${company.legalName} — home`}>
            <Monogram />
            <span className="hidden leading-tight sm:block">
              <span className="block font-display text-sm font-semibold uppercase tracking-wide">{company.legalName}</span>
              <span className="block font-code text-[10px] uppercase tracking-[0.2em] text-muted2">Robotics software</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/"
              className="press key-dark group inline-flex items-center gap-2 border border-line px-4 py-2.5 font-display text-xs font-semibold uppercase tracking-wider hover:border-signal hover:text-beam"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" /> Back to site
            </Link>
          </div>
        </div>
      </header>

      <main className="px-5 py-16 sm:px-10 lg:px-14 lg:py-24">
        <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[15rem_1fr] lg:gap-20">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <nav aria-label="Legal documents" className="flex gap-2 font-display text-xs font-semibold uppercase tracking-wider lg:flex-col">
              {(Object.keys(legalDocs) as LegalDocKey[]).map((k) => (
                <Link
                  key={k}
                  to={`/${k}`}
                  aria-current={k === doc ? "page" : undefined}
                  className={`cut-sm border px-3 py-2 transition-colors ${k === doc ? "border-signal bg-signal text-on-signal" : "border-line text-muted2 hover:border-signal/60 hover:text-ink"}`}
                >
                  {legalDocs[k].title}
                </Link>
              ))}
            </nav>
            <p className="mt-8 font-code text-[10px] uppercase tracking-[0.2em] text-muted2">On this page</p>
            <ol className="mt-3 space-y-2 border-l border-line">
              {toc.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="-ml-px flex gap-3 border-l border-transparent pl-4 text-sm text-muted2 transition-colors hover:border-signal hover:text-ink">
                    <span className="font-code text-[11px] text-beam">{String(i + 1).padStart(2, "0")}</span>
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </aside>

          <article className="max-w-3xl">
            <div className="flex items-center gap-4 font-code text-xs uppercase tracking-[0.22em]">
              <span className="bevel cut-sm bg-signal px-2 py-1 font-semibold text-on-signal">Legal</span>
              <span className="text-muted2">Last updated {d.updated}</span>
            </div>
            <h1 className="extrude-sm mt-8 font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl">{d.title}</h1>
            <p className="mt-6 text-lg leading-relaxed text-muted2">{d.intro}</p>

            {d.sections.map((s, i) => (
              <section key={s.id} id={s.id} className="mt-12 scroll-mt-24 border-t border-line pt-8">
                <h2 className="flex items-baseline gap-4 font-display text-2xl font-semibold uppercase tracking-wide">
                  <span className="font-code text-xs text-beam">{String(i + 1).padStart(2, "0")}</span>
                  {s.heading}
                </h2>
                <div className="mt-4 space-y-4 leading-relaxed text-ink/85">
                  {s.blocks.map((b, bi) =>
                    Array.isArray(b) ? (
                      <ul key={bi} className="space-y-2.5">
                        {b.map((item) => (
                          <li key={item} className="flex gap-3">
                            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-signal" />
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
                <h2 className="flex items-baseline gap-4 font-display text-2xl font-semibold uppercase tracking-wide">
                  <span className="font-code text-xs text-beam">{String(toc.length).padStart(2, "0")}</span>
                  {CREDITS.heading}
                </h2>
                <p className="mt-4 leading-relaxed text-ink/85">Photography on this site is used under the free licence of Freepik (now Magnific). Thank you to the creators:</p>
                <ul className="mt-5 divide-y divide-line border-y border-line">
                  {imageCredits.map((c) => (
                    <li key={c.file} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                      <span className="text-sm text-muted2">{c.subject}</span>
                      <a href={c.href} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 text-sm text-ink/90 hover:text-beam">
                        <span className="u-link">Image by {c.author} on Magnific</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-muted2 group-hover:text-beam" />
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
