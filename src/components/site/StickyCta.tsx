import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { company } from "@/data/company";

// Pages that are already the booking or contact step
const HIDDEN_ON = ["/book", "/contact", "/admin"];

/**
 * Floating "Book a free call" pill along the bottom of the screen. It rises in once the reader is past the first
 * screen and steps aside while the footer (which has its own call to action) is in view.
 */
export default function StickyCta() {
  const { pathname } = useLocation();
  const [shown, setShown] = useState(false);
  const hidden = HIDDEN_ON.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (hidden) return;
    let footerInView = false;
    let raf = 0;
    const update = () => {
      raf = 0;
      setShown(window.scrollY > window.innerHeight * 0.8 && !footerInView);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const footer = document.querySelector("footer");
    const obs = new IntersectionObserver(([entry]) => {
      footerInView = entry.isIntersecting;
      schedule();
    });
    if (footer) obs.observe(footer);
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
    };
  }, [hidden, pathname]);

  if (hidden) return null;

  return (
    <div className={`sticky-cta fixed bottom-5 left-1/2 z-40 sm:bottom-7 ${shown ? "is-shown" : ""}`} aria-hidden={!shown}>
      <Link
        to="/book"
        tabIndex={shown ? 0 : -1}
        className="sticky-cta-ring group relative flex items-center gap-3 whitespace-nowrap rounded-full bg-ink py-2 pl-4 pr-2 text-sm font-semibold text-canvas shadow-[0_20px_40px_-14px_rgb(0_0_0/.55)]"
      >
        <span className="live-dot !bg-volt" />
        <span className="hidden sm:inline text-canvas/70">{company.availability}</span>
        <span className="hidden h-4 w-px bg-canvas/25 sm:block" aria-hidden="true" />
        Book a free call
        <span className="grid h-8 w-8 place-items-center rounded-full bg-volt text-[#0b1020] transition-transform duration-300 group-hover:rotate-[-45deg]">
          <ArrowRight className="h-4 w-4" />
        </span>
      </Link>
    </div>
  );
}
