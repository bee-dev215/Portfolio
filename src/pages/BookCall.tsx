import { Code2, FileCheck2, MessageSquareText } from "lucide-react";
import PageShell from "@/components/site/PageShell";
import PageHero from "@/components/site/PageHero";
import Reveal from "@/components/site/Reveal";
import BookingWidget from "@/components/booking/BookingWidget";
import { booking, company, offer } from "@/data/company";

const lengths = booking.callTypes.map((t) => t.minutes).join(" or ");

const afterTheCall = [
  {
    icon: MessageSquareText,
    title: "The call",
    desc: `${lengths} minutes with a senior engineer. You describe the task; we ask how it's done today, which systems it touches and what "fixed" would look like.`,
  },
  {
    icon: Code2,
    title: offer.title,
    desc: "If software can take it off your plate, we build a working prototype on your own data — so you can try it before you commit to anything.",
  },
  {
    icon: FileCheck2,
    title: "A fixed-scope proposal",
    desc: "Only if the prototype proves it's worth building: milestones, a price and a timeline. If not, you've lost nothing.",
  },
];

export default function BookCall() {
  return (
    <PageShell
      title="Book a call"
      description={`Book a free ${lengths}-minute call with a senior engineer at ${company.name}. Tell us the task that eats your week — the first two weeks of building are on us.`}
    >
      <PageHero
        crumbs={[{ label: "Book a call" }]}
        eyebrow="Book a call"
        title={
          <>
            Tell us what's eating <span className="gradient-text">your week.</span>
          </>
        }
        lead="Pick a time for a free call with a senior engineer, not a salesperson. Bring the task your team keeps doing by hand, and leave knowing whether software can take it off your plate."
      />

      <section className="px-5 pb-20 sm:px-8 lg:pb-28">
        <div className="mx-auto max-w-[1240px]">
          <Reveal variant="scale">
            <BookingWidget />
          </Reveal>

          <h2 className="mt-20 font-display text-2xl font-bold tracking-tight sm:text-3xl">What happens after the call</h2>
          <ol className="mt-8 grid gap-5 md:grid-cols-3">
            {afterTheCall.map(({ icon: Icon, title, desc }, i) => (
              <li key={title}>
                <Reveal delay={i * 80} className="h-full">
                  <div className="card h-full p-6 sm:p-7">
                    <div className="flex items-center justify-between">
                      <span className="icon-tile h-11 w-11 rounded-xl">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="font-display text-sm font-bold text-subtle">0{i + 1}</span>
                    </div>
                    <h3 className="mt-5 font-display text-lg font-bold">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-2">{desc}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </PageShell>
  );
}
