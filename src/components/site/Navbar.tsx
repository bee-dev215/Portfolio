import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { company, navLinks, scrollToId, startEnquiry } from "@/data/company";
import ThemeToggle from "./ThemeToggle";

function useScrollState() {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      let current = "";
      for (const l of navLinks) {
        const el = document.getElementById(l.id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.35) current = l.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { active, scrolled };
}

/** Logo mark: gradient tile with a spark. */
export const Monogram = ({ className = "h-9 w-9" }: { className?: string }) => (
  <span className={`bg-grad grid shrink-0 place-items-center rounded-xl text-white shadow-[0_8px_18px_-8px_rgb(var(--brand-rgb)/.7)] ${className}`}>
    <svg viewBox="0 0 24 24" className="h-[55%] w-[55%]" fill="currentColor" aria-hidden="true">
      <path d="M12 2.5l2.3 6.2L20.5 11l-6.2 2.3L12 19.5l-2.3-6.2L3.5 11l6.2-2.3z" />
      <circle cx="19" cy="19" r="2" opacity=".85" />
    </svg>
  </span>
);

export default function Navbar() {
  const { active, scrolled } = useScrollState();
  const [open, setOpen] = useState(false);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open ? "glass border-b border-line shadow-[0_8px_30px_-20px_rgb(var(--shadow-rgb)/.5)]" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-4 px-5 sm:px-8 lg:h-[72px]">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex shrink-0 items-center gap-2.5 text-left" aria-label={`${company.legalName} — back to top`}>
          <Monogram />
          <span className="leading-tight">
            <span className="block font-display text-lg font-extrabold tracking-tight">{company.name}</span>
            <span className="hidden text-[11px] font-medium text-subtle sm:block">AI for education</span>
          </span>
        </button>

        <nav className="mx-auto hidden items-center gap-1 rounded-full border border-line bg-surface/60 p-1 lg:flex" aria-label="Primary">
          {navLinks.map((l) => {
            const isActive = active === l.id;
            return (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                aria-current={isActive ? "true" : undefined}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${isActive ? "bg-brand-soft text-brand-text" : "text-ink-2 hover:bg-raised hover:text-ink"}`}
              >
                {l.label}
              </button>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <ThemeToggle />
          <button onClick={() => startEnquiry()} className="btn btn-primary hidden px-5 py-2.5 text-sm sm:inline-flex">
            Start a project <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-brand/40 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="fade-up border-t border-line px-5 pb-6 pt-2 sm:px-8 lg:hidden" style={{ animationDuration: ".3s" }}>
          {navLinks.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className={`flex w-full items-center justify-between border-b border-line py-4 text-left font-display text-lg font-semibold ${active === l.id ? "text-brand-text" : "text-ink"}`}
            >
              {l.label}
              <ArrowRight className="h-4 w-4 text-subtle" />
            </button>
          ))}
          <div className="mt-5 flex items-center gap-2 text-sm text-subtle">
            <span className="live-dot" /> {company.availability}
          </div>
          <button
            onClick={() => {
              setOpen(false);
              startEnquiry();
            }}
            className="btn btn-primary mt-5 w-full py-3.5"
          >
            Start a project <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </header>
  );
}
