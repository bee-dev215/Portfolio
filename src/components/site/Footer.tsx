import { FormEvent, useState } from "react";
import { ArrowRight, ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";
import { company, legalLinks, rolePath, roles, sitePages, startApplication } from "@/data/company";
import { scrollToTop } from "@/lib/scroll";
import { Monogram, Wordmark } from "./Navbar";
import { copyLine, directLines } from "./reach";
import Reveal from "./Reveal";

const linkCls = "text-sm font-medium text-white/80 transition-colors hover:text-white";
const headCls = "text-xs font-bold uppercase tracking-[0.16em] text-sky-300";

function LinkColumn({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <p className={headCls}>{title}</p>
      <ul className="mt-5 space-y-3.5">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className={linkCls}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** "Start your application": an email field that opens the apply form with the address filled in. */
function StartApplication() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    // Empty is fine (the form opens blank); anything typed must look like an email
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("That doesn't look like an email address.");
      return;
    }
    startApplication(undefined, value || undefined);
  };
  return (
    // noValidate: the check above shows a message in the site's own style instead of the browser's pop-up
    <form onSubmit={submit} noValidate className="mt-8 max-w-sm">
      <label htmlFor="foot-email" className={headCls}>
        Start your application
      </label>
      {/* The whole pill lights up on focus; the field inside draws no ring of its own */}
      <div
        className={`mt-4 flex items-center gap-2 rounded-full border bg-white/[.06] p-1.5 transition-[border-color,box-shadow] duration-200 focus-within:shadow-[0_0_0_4px_rgb(59_130_246/.25)] ${
          error ? "border-rose-400/70" : "border-white/15 focus-within:border-sky-300/70"
        }`}
      >
        <input
          id="foot-email"
          type="email"
          inputMode="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
          }}
          placeholder="Email address"
          autoComplete="email"
          aria-invalid={!!error}
          aria-describedby="foot-email-note"
          className="foot-input h-10 min-w-0 flex-1 rounded-full bg-transparent pl-4 pr-2 text-sm text-white caret-sky-300 placeholder:text-white/45"
        />
        <button type="submit" className="btn btn-primary shrink-0 px-5 py-2.5 text-sm">
          Get started <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      <p id="foot-email-note" className={`mt-2.5 pl-4 text-xs ${error ? "text-rose-300" : "text-white/55"}`} role={error ? "alert" : undefined}>
        {error || "Free to apply. Takes about five minutes."}
      </p>
    </form>
  );
}

/** Closing call to action: a soft gradient card with everything centred. */
export function ClosingCta({
  eyebrow = "Start your application",
  title = "Your next role is one application away.",
  text = "Choose a role, tell us about yourself and we'll take it from there.",
  to = "/apply",
  label = "Apply now",
  caption = "Free to apply · About five minutes · Reviewed by a real person",
}: {
  eyebrow?: string;
  title?: string;
  text?: string;
  to?: string;
  label?: string;
  caption?: string;
}) {
  return (
    <section className="px-5 py-20 sm:px-8 lg:py-28">
      <Reveal variant="scale" className="mx-auto max-w-[1200px]">
        <div className="wash-card rounded-[2rem] border border-line px-6 py-14 text-center sm:px-12 lg:py-20">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-balance font-display text-[clamp(2rem,4.4vw,3.4rem)] font-normal leading-[1.08] tracking-[-0.02em] text-ink">{title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-ink-2">{text}</p>
          <Link to={to} className="btn btn-primary mt-8 px-8 py-4 text-base">
            {label} <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-4 text-sm text-subtle">{caption}</p>
        </div>
      </Reveal>
    </section>
  );
}

export default function Footer({ cta = true }: { cta?: boolean }) {
  const year = new Date().getFullYear();

  return (
    <>
      {cta && <ClosingCta />}
      <footer className="foot-navy foot-tucked relative px-5 text-white sm:px-8">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-[1.6fr_1.1fr_.9fr_.9fr]">
            <div className="col-span-2 sm:col-span-3 lg:col-span-1">
              <div className="flex items-center gap-3">
                <Monogram className="h-11 w-11 [--logo-mark:url('/images/logo-mark-dark.webp')]" />
                <span className="leading-tight">
                  <span className="sr-only">{company.name}</span>
                  <Wordmark className="h-[22px] text-white" />
                  <span className="mt-1 block text-xs text-white/60">{company.discipline}</span>
                </span>
              </div>
              <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/75">A remote-first team hiring capable people worldwide — fair pay, on time, and a real person on the other side.</p>
              <StartApplication />
            </div>

            <LinkColumn title="Open roles" links={roles.map((r) => ({ to: rolePath(r), label: r.title }))} />
            <LinkColumn title="Company" links={sitePages.filter((p) => p.to !== "/roles")} />
            <div className="space-y-10">
              <div>
                <p className={headCls}>Get in touch</p>
                <ul className="mt-5 space-y-3.5">
                  {directLines.map((l) => (
                    <li key={l.key}>
                      <a href={l.href} onClick={() => copyLine(l.value)} className={`${linkCls} break-all`}>
                        {l.value}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <LinkColumn title="Legal" links={[...legalLinks, { to: "/terms#credits", label: "Image credits" }]} />
            </div>
          </div>

          <div className="mt-16 flex flex-col gap-5 border-t border-white/10 py-7 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {year} {company.legalName}. All rights reserved. · Remote-first. Open to applicants worldwide.
            </p>
            <button
              onClick={() => scrollToTop()}
              data-back-to-top
              className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-[#0f1f3d]"
              aria-label="Back to top"
              title="Back to top"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}
