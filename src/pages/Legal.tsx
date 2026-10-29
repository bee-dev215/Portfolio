import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { imageCredits } from "@/data/company";
import { LegalDocKey, legalDocs } from "@/data/legal";
import PageShell from "@/components/site/PageShell";
import { Breadcrumbs } from "@/components/site/PageHero";
import { useProjects } from "@/hooks/use-projects";
import { useTeam } from "@/hooks/use-team";

const CREDITS = { id: "credits", heading: "Image credits" };

export default function Legal({ doc }: { doc: LegalDocKey }) {
  const d = legalDocs[doc];
  const toc = doc === "terms" ? [...d.sections, CREDITS] : d.sections;
  const { team } = useTeam();
  const { projects } = useProjects();

  // Credit only the photos the site still shows: not portraits or project photos it no longer uses
  const credits = imageCredits.filter(({ file }) => {
    const path = `/images/${file}`;
    if (file.startsWith("team/")) return team.some((m) => m.photo === path);
    if (file.startsWith("proj-")) return projects.some((p) => p.image === path || p.gallery.src === path);
    return true;
  });

  return (
    <PageShell title={d.title} footerCta>
      <div className="px-5 pb-16 pt-28 sm:px-8 sm:pt-32 lg:pb-24 lg:pt-36">
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
            <Breadcrumbs crumbs={[{ label: d.title }]} />
            <span className="eyebrow mt-8">Legal · Last updated {d.updated}</span>
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
                <p className="mt-4 leading-relaxed text-ink-2">Photography on this site is used under the free licenses of Freepik (now Magnific) and Pexels. Thank you to the creators:</p>
                <ul className="mt-5 divide-y divide-line rounded-2xl border border-line bg-surface">
                  {credits.map((c) => (
                    <li key={c.file} className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                      <span className="text-sm text-subtle">{c.subject}</span>
                      <a href={c.href} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-brand-text">
                        Image by {c.author} on {c.source ?? "Magnific"}
                        <ArrowUpRight className="h-3.5 w-3.5 text-subtle group-hover:text-brand-text" />
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </article>
        </div>
      </div>
    </PageShell>
  );
}
