import { whyTiles } from "@/data/company";
import Reveal, { SectionHeading } from "./Reveal";

const accents = ["bg-iris", "bg-brand", "bg-sky2"];
const chip = ["bg-[rgb(var(--tint-1))] text-[rgb(var(--tint-1-ink))]", "bg-[rgb(var(--tint-2))] text-[rgb(var(--tint-2-ink))]", "bg-[rgb(var(--tint-3))] text-[rgb(var(--tint-3-ink))]"];

/** Life on the team, in Timeline's testimonial-card format: a round photo, tag chips, a statement and a name line. */
export default function LifeOnTeam() {
  return (
    <section id="life" className="band px-5 py-24 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          split
          label="Life on the team"
          title={
            <>
              Remote work. <span className="gradient-text">Real people behind it.</span>
            </>
          }
        >
          <p className="text-lg leading-relaxed text-ink-2">Different roles, different time zones — one team that works the same way wherever you are.</p>
        </SectionHeading>

        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {whyTiles.map((t, i) => (
            <li key={t.title}>
              <Reveal delay={i * 90} className="h-full">
                <div className="relative flex h-full flex-col items-center rounded-[1.75rem] border border-line bg-surface px-7 pb-8 pt-9 text-center shadow-[0_20px_40px_-30px_rgb(15_31_61/.35)]">
                  <span className={`absolute left-1/2 top-0 h-1 w-24 -translate-x-1/2 rounded-b-full ${accents[i % 3]}`} aria-hidden="true" />
                  <span className="rounded-full p-1.5 ring-1 ring-line">
                    <img src={t.image} alt="" loading="lazy" width={240} height={240} className="h-28 w-28 rounded-full object-cover" />
                  </span>
                  <ul className="mt-5 flex flex-wrap justify-center gap-2">
                    {t.tags.map((tag) => (
                      <li key={tag} className={`rounded-full px-3 py-1 text-xs font-semibold ${chip[i % 3]}`}>
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 text-lg leading-relaxed text-ink">{t.desc}</p>
                  <span className="mt-auto block w-full pt-7">
                    <span className="mx-auto block h-px w-16 bg-line-strong" />
                    <span className="mt-5 block font-display text-lg font-medium text-ink">{t.title}</span>
                  </span>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
