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

const Monogram = ({ className = "h-11 w-11 text-lg" }: { className?: string }) => (
  <span className={`cut-sm grid shrink-0 place-items-center bg-ink font-display font-bold tracking-tight text-signal ${className}`}>
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
    <>
      {/* Scroll progress */}
      <div className="fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent">
        <div className="h-full origin-left bg-signal" style={{ transform: `scaleX(${progress})` }} />
      </div>

      {/* Desktop rail */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-line bg-paper/60 px-8 py-10 backdrop-blur-sm lg:flex">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-3 text-left">
          <Monogram />
          <span className="font-display text-sm font-semibold uppercase leading-tight tracking-wide">
            {profile.name.split(" ")[0]}
            <br />
            {profile.name.split(" ")[1]}
          </span>
        </button>

        <nav className="mt-14 flex flex-col" aria-label="Primary">
          {navLinks.map((l, i) => {
            const isActive = active === l.id;
            return (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className={`group relative flex items-center gap-4 border-t border-line py-3.5 text-left font-display text-[15px] font-medium uppercase tracking-wide transition-colors last:border-b ${
                  isActive ? "text-ink" : "text-muted2 hover:text-ink"
                }`}
              >
                <span className={`absolute inset-y-0 left-0 w-[3px] origin-top bg-signal transition-transform duration-300 ${isActive ? "scale-y-100" : "scale-y-0"}`} />
                <span className={`pl-3 font-code text-[11px] ${isActive ? "text-signal-deep" : "text-muted2"}`}>0{i + 1}</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  <ScrambleText text={l.label} delay={400 + i * 90} duration={600} replayOnHover />
                </span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto space-y-5">
          <div className="flex items-center gap-2.5 font-code text-[11px] uppercase tracking-wider text-muted2">
            <span className="relative flex h-2 w-2">
              <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-signal" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
            {profile.availability}
          </div>
          <button
            onClick={onResume}
            className="cut-sm group flex w-full items-center justify-between bg-ink px-4 py-3 font-display text-sm font-semibold uppercase tracking-wide text-paper transition-colors hover:bg-signal hover:text-ink"
          >
            Résumé
            <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          </button>
          <a href={`mailto:${profile.email}`} className="u-link block truncate font-code text-xs text-muted2 hover:text-ink">
            {profile.email}
          </a>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-paper/90 backdrop-blur lg:hidden">
        <div className="flex h-16 items-center justify-between px-5 sm:px-8">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-3">
            <Monogram className="h-9 w-9 text-sm" />
            <span className="font-display text-sm font-semibold uppercase tracking-wide">{profile.name}</span>
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center border border-line"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open && (
          <div className="fade-up border-t border-line bg-paper px-5 pb-6 pt-2 sm:px-8" style={{ animationDuration: ".3s" }}>
            {navLinks.map((l, i) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className={`flex w-full items-center gap-4 border-b border-line py-4 text-left font-display text-lg font-medium uppercase ${
                  active === l.id ? "text-signal-deep" : "text-ink"
                }`}
              >
                <span className="font-code text-xs text-muted2">0{i + 1}</span>
                {l.label}
              </button>
            ))}
            <button
              onClick={() => {
                setOpen(false);
                onResume();
              }}
              className="cut-sm mt-5 flex w-full items-center justify-center gap-2 bg-ink py-3.5 font-display font-semibold uppercase tracking-wide text-paper"
            >
              <Download className="h-4 w-4" /> Download résumé
            </button>
          </div>
        )}
      </header>
    </>
  );
}
