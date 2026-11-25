import { perks } from "@/data/company";
import { perkIcons } from "./icons";
import Reveal, { SectionHeading } from "./Reveal";

const tints = ["tint-1", "tint-2", "tint-3"];

/** What you get: six pastel cards, each with an icon, a short description and an "in practice" note. */
export default function WhyJoin() {
  return (
    <section id="why" className="px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          split
          label="What you get with Jovano"
          title={
            <>
              Real remote work. <span className="gradient-text">One fair foundation.</span>
            </>
          }
        >
          <p className="text-lg leading-relaxed text-ink-2">
            A clear path in, a fair way to be rewarded and a real person on the other side — whichever role you choose.
          </p>
        </SectionHeading>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {perks.map((p, i) => {
            const Icon = perkIcons[p.key];
            return (
              <li key={p.key}>
                <Reveal delay={(i % 3) * 70} className="h-full">
                  <div className={`tint-card ${tints[i % 3]} flex h-full flex-col p-7`}>
                    <span className="tint-icon h-12 w-12">
                      <Icon className="h-[22px] w-[22px]" />
                    </span>
                    <h3 className="mt-7 font-display text-[1.45rem] font-medium leading-tight text-ink">{p.title}</h3>
                    <p className="mt-3 leading-relaxed text-ink-2">{p.desc}</p>
                    <div className="mt-auto pt-7">
                      <p className="border-t border-[rgb(var(--tl))] pt-5 text-sm leading-relaxed text-ink-2">
                        <strong className="tint-ink font-semibold">+ In practice:</strong> {p.note}
                      </p>
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
