import { useEffect, useRef, useState } from "react";

export interface NavSection {
  id: string;
  label: string;
}

/** Offset for in-page jumps: the fixed navbar plus this bar. */
export const SECTION_OFFSET = 136;

/**
 * In-page section bar that sticks under the navbar and highlights the section being read.
 * On phones it scrolls sideways and keeps the current section in view.
 */
export default function SectionNav({ sections }: { sections: NavSection[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      let current = sections[0]?.id ?? "";
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= SECTION_OFFSET + 40) current = s.id;
      }
      // At the very bottom the last section can't reach the top, so treat it as current
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = sections[sections.length - 1]?.id ?? current;
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [sections]);

  // Keep the current link visible in the sideways-scrolling bar (moves the bar only, never the page)
  useEffect(() => {
    const host = bar.current;
    const link = host?.querySelector<HTMLElement>(`[data-section="${active}"]`);
    if (!host || !link) return;
    const left = link.offsetLeft - host.clientWidth / 2 + link.clientWidth / 2;
    host.scrollTo({ left, behavior: "smooth" });
  }, [active]);

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - SECTION_OFFSET + 8, behavior: "smooth" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <div className="glass sticky top-16 z-40 border-y border-line lg:top-[72px]">
      <nav aria-label="On this page" className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div ref={bar} className="-mx-5 flex gap-1 overflow-x-auto px-5 py-2 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
          {sections.map((s) => {
            const on = s.id === active;
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                data-section={s.id}
                aria-current={on ? "true" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  jump(s.id);
                }}
                className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  on ? "bg-brand-soft text-brand-text" : "text-ink-2 hover:bg-raised hover:text-ink"
                }`}
              >
                {s.label}
              </a>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
