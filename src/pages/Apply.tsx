import { CSSProperties, useMemo } from "react";
import { Clock3, Globe2, ShieldCheck, UserCheck, Wallet } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import PageShell from "@/components/site/PageShell";
import { Breadcrumbs } from "@/components/site/PageHero";
import ApplyForm from "@/components/apply/ApplyForm";
import { roleIcons } from "@/components/site/icons";
import { company, promises, roleBySlug, rolePath, steps } from "@/data/company";

const points = [
  { icon: Globe2, title: "100% remote", desc: "Apply, interview, train and work from home." },
  { icon: Wallet, title: "Paid twice a month", desc: "By bank, Wise, Payoneer or USDT." },
  { icon: UserCheck, title: "1:1 support", desc: "A real person reads every application." },
];

/** The application: what to expect beside the four-step form. */
export default function Apply() {
  const [params] = useSearchParams();
  const slug = params.get("role") ?? undefined;
  const role = useMemo(() => roleBySlug(slug), [slug]);
  const RoleIcon = role ? roleIcons[role.key] : null;

  return (
    <PageShell
      title={role ? `Apply — ${role.title}` : "Apply"}
      description={`Apply to join ${company.name}'s global remote team. Free, about five minutes, and every application is read by a real person.`}
    >
      <section className="relative overflow-hidden px-5 pb-20 pt-28 sm:px-8 sm:pt-32 lg:pb-28 lg:pt-36">
        <div className="wash pointer-events-none absolute inset-0" aria-hidden="true" />

        <div className="relative mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] lg:gap-14">
          {/* What to expect */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Breadcrumbs crumbs={[{ label: "Apply" }]} />
            <p className="fade-up eyebrow eyebrow-pill mt-8" style={{ animationDelay: ".05s" }}>
              <span className="h-1.5 w-1.5 rounded-full bg-grad" />
              Free · About 5 minutes
            </p>
            <h1
              className="hero-title fade-up mt-6 text-balance font-display text-[clamp(2.4rem,5vw,4rem)] font-normal leading-[1.06] tracking-[-0.02em]"
              style={{ animationDelay: ".1s" }}
            >
              Join our global <span className="hl"><span className="gradient-text">remote team.</span></span>
            </h1>
            <p className="fade-up mt-6 max-w-md text-lg leading-relaxed text-ink-2" style={{ animationDelay: ".18s" }}>
              Four quick steps. A real person reads every application, and you'll hear back within {company.reviewTime}.
            </p>

            {role && RoleIcon && (
              <Link
                to={rolePath(role)}
                className="fade-up mt-7 flex items-center gap-3 rounded-2xl border border-line bg-surface/80 p-3 backdrop-blur transition-colors hover:border-brand/40"
                style={{ animationDelay: ".22s" }}
              >
                <img src={role.image} alt="" width={96} height={64} className="h-14 w-20 shrink-0 rounded-xl object-cover" style={{ objectPosition: role.focus }} />
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-brand-text">
                    <RoleIcon className="h-3.5 w-3.5" /> {role.category}
                  </span>
                  <span className="block font-display font-bold">{role.title}</span>
                  <span className="flex items-center gap-1 text-xs text-subtle">
                    <Clock3 className="h-3 w-3" /> {role.commitment}
                  </span>
                </span>
              </Link>
            )}

            <ul className="stagger is-in mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {points.map((p, i) => (
                <li key={p.title} className="flex items-start gap-3" style={{ "--i": i } as CSSProperties}>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-text">
                    <p.icon className="h-[18px] w-[18px]" />
                  </span>
                  <span>
                    <span className="block font-display font-bold">{p.title}</span>
                    <span className="block text-sm text-subtle">{p.desc}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 hidden rounded-2xl border border-line bg-surface/70 p-5 backdrop-blur lg:block">
              <p className="text-xs font-semibold uppercase tracking-wider text-subtle">After you apply</p>
              <ol className="mt-4 space-y-3">
                {steps.slice(1).map((s, i) => (
                  <li key={s.id} className="flex items-center gap-3 text-sm">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-raised text-xs font-bold text-subtle">{i + 2}</span>
                    <span className="font-semibold">{s.name}</span>
                    <span className="ml-auto text-xs text-subtle">{s.time}</span>
                  </li>
                ))}
              </ol>
            </div>

            <p className="mt-6 flex items-start gap-2.5 rounded-2xl border border-emerald-500/25 bg-emerald-500/[.07] p-4 text-sm leading-relaxed text-ink-2">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span>
                <strong className="text-ink">{promises.free}.</strong> If anyone asks you to pay to apply or to start, it isn't us —{" "}
                <Link to="/faq#spot-scams" className="font-semibold text-ink underline underline-offset-2 hover:text-brand-text">
                  how to spot it
                </Link>
                .
              </span>
            </p>
          </aside>

          <div className="fade-up min-w-0" style={{ animationDelay: ".2s" }}>
            <ApplyForm />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
