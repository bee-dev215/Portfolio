import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { JUMP_EVENT, JumpDetail, scrollToSection } from "@/lib/scroll";

export interface NavSection {
  id: string;
  label: string;
}

/** Offset for in-page jumps: the fixed navbar plus this bar. */
export const SECTION_OFFSET = 136;

/**
 * In-page section bar that sticks under the navbar and highlights the section being read with a pill that slides
 * between links. A clicked link lights up at once and stays lit while the page glides there.
 * On phones it scrolls sideways and keeps the current section in view.
 */
export default function SectionNav({ sections }: { sections: NavSection[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);
  const placed = useRef(false); // the pill appears in place first, then slides
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let jumping = false;
    const update = () => {
      raf = 0;
      if (jumping) return;
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
    // Any jump to one of these sections (this bar, a button, a #link) holds the highlight on its target until it lands
    const onJump = (e: Event) => {
      const { id, phase } = (e as CustomEvent<JumpDetail>).detail;
      if (!sections.some((s) => s.id === id)) return;
      jumping = phase === "start";
      if (jumping) setActive(id);
      else onScroll();
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener(JUMP_EVENT, onJump);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener(JUMP_EVENT, onJump);
      cancelAnimationFrame(raf);
    };
  }, [sections]);

  // Move the pill under the current link, and keep that link visible in the sideways-scrolling bar (moves the bar only)
  useLayoutEffect(() => {
    const host = bar.current;
    const measure = () => {
      const link = host?.querySelector<HTMLElement>(`[data-section="${active}"]`);
      if (link) setPill({ x: link.offsetLeft, w: link.offsetWidth });
    };
    measure();
    const link = host?.querySelector<HTMLElement>(`[data-section="${active}"]`);
    if (host && link) host.scrollTo({ left: link.offsetLeft - host.clientWidth / 2 + link.clientWidth / 2, behavior: placed.current ? "smooth" : "instant" });
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  useEffect(() => {
    if (pill) placed.current = true;
  }, [pill]);

  return (
    <div className="glass sticky top-16 z-40 border-y border-line lg:top-[72px]">
      <nav aria-label="On this page" className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div ref={bar} className="relative -mx-5 flex gap-1 overflow-x-auto px-5 py-2 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
          {pill && (
            <span
              className={`section-pill pointer-events-none absolute bottom-2 left-0 top-2 rounded-full bg-brand-soft ring-1 ring-brand/15 ${placed.current ? "is-placed" : ""}`}
              style={{ width: pill.w, transform: `translateX(${pill.x}px)` }}
              aria-hidden="true"
            />
          )}
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
                  scrollToSection(s.id);
                }}
                className={`relative shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition-colors duration-300 ${
                  on ? "text-brand-text" : "text-ink-2 hover:bg-raised/70 hover:text-ink"
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
