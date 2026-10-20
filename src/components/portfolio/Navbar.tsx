import { useEffect, useState } from "react";
import { Download, Menu, X } from "lucide-react";
import { navLinks, profile, scrollToId } from "@/data/portfolio";
import ScrambleText from "./ScrambleText";

function useScrollState() {
  const [active, setActive] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
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

  return { active, progress };
}

const Monogram = ({ className = "h-10 w-10 text-base" }: { className?: string }) => (
  <span className={`cut-sm grid shrink-0 place-items-center bg-signal font-display font-bold tracking-tight text-paper ${className}`}>
    {profile.initials}
  </span>
);

export default function Navbar({ onResume }: { onResume: () => void }) {
  const { active, progress } = useScrollState();
  const [open, setOpen] = useState(false);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-5 sm:px-8 lg:gap-6 lg:px-10">
        {/* Identity */}
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex shrink-0 items-center gap-3 text-left">
          <Monogram />
          <span className="hidden leading-tight sm:block lg:hidden xl:block">
            <span className="block font-display text-sm font-semibold uppercase tracking-wide">{profile.name}</span>
            <span className="block font-code text-[10px] uppercase tracking-[0.2em] text-muted2">Unit {profile.initials}-01 · Full-stack</span>
          </span>
        </button>

        {/* Primary nav */}
        <nav className="mx-auto hidden h-full items-stretch lg:flex" aria-label="Primary">
          {navLinks.map((l, i) => {
            const isActive = active === l.id;
            return (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                aria-current={isActive ? "true" : undefined}
                className={`group relative flex items-center gap-1.5 px-3 font-display text-[13px] font-medium uppercase tracking-wider transition-colors xl:px-4 ${
                  isActive ? "text-ink" : "text-muted2 hover:text-ink"
                }`}
              >
                <span className={`hidden font-code text-[10px] xl:inline ${isActive ? "text-signal" : "text-muted2/70 group-hover:text-signal"}`}>0{i + 1}</span>
                <ScrambleText text={l.label} delay={300 + i * 90} duration={600} replayOnHover />
                {/* active indicator: orange rail with a glow, pinned to the bar's bottom edge */}
                <span
                  className={`absolute inset-x-3 -bottom-px h-[2px] origin-center bg-signal shadow-[0_0_10px_rgba(217, 88, 13,.8)] transition-transform duration-300 xl:inset-x-4 ${
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Status + actions */}
        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <span className="hidden items-center gap-2 font-code text-[10px] uppercase tracking-[0.2em] text-muted2 2xl:flex">
            <span className="led" /> Online
          </span>
          <button
            onClick={onResume}
            className="btn-signal cut-sm group hidden items-center gap-2 bg-signal px-4 py-2.5 font-display text-xs font-semibold uppercase tracking-wider text-paper transition-colors hover:bg-signal-hi sm:inline-flex"
          >
            <Download className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />
            Résumé
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center border border-line text-ink transition-colors hover:border-signal hover:text-signal lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Scroll progress — a charge bar along the bottom edge */}
      <div className="absolute inset-x-0 -bottom-px h-[2px]" aria-hidden="true">
        <div className="h-full origin-left bg-signal/70" style={{ transform: `scaleX(${progress})` }} />
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="fade-up border-t border-line bg-paper-2 px-5 pb-6 pt-2 sm:px-8 lg:hidden" style={{ animationDuration: ".3s" }}>
          {navLinks.map((l, i) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className={`flex w-full items-center gap-4 border-b border-line py-4 text-left font-display text-lg font-medium uppercase tracking-wide ${
                active === l.id ? "text-signal" : "text-ink"
              }`}
            >
              <span className="font-code text-xs text-muted2">0{i + 1}</span>
              {l.label}
            </button>
          ))}
          <div className="mt-5 flex items-center gap-2 font-code text-[11px] uppercase tracking-[0.18em] text-muted2">
            <span className="led" /> {profile.availability}
          </div>
          <button
            onClick={() => {
              setOpen(false);
              onResume();
            }}
            className="cut-sm mt-5 flex w-full items-center justify-center gap-2 bg-signal py-3.5 font-display font-semibold uppercase tracking-wide text-paper"
          >
            <Download className="h-4 w-4" /> Download résumé
          </button>
        </div>
      )}
    </header>
  );
}
