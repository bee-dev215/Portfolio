import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { scrollToTop } from "@/lib/scroll";

/**
 * Floating back-to-top button with a ring showing how far down the page the reader is (--progress, set by the navbar).
 * It shows once the reader is well into a page and steps aside while the footer's own back-to-top button is on screen.
 */
export default function ScrollTop() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const footerButton = document.querySelector("[data-back-to-top]")?.getBoundingClientRect();
      const footerButtonVisible = footerButton ? footerButton.top < window.innerHeight : false;
      setShown(window.scrollY > window.innerHeight * 1.2 && !footerButtonVisible);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <button
      onClick={() => scrollToTop()}
      className={`scroll-top glass fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full border border-line text-ink shadow-soft sm:bottom-7 sm:right-7 ${shown ? "is-shown" : ""}`}
      aria-label="Back to top"
      title="Back to top"
      tabIndex={shown ? 0 : -1}
      aria-hidden={!shown}
    >
      <svg viewBox="0 0 48 48" className="pointer-events-none absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="24" cy="24" r="22.5" className="scroll-top-track" />
        <circle cx="24" cy="24" r="22.5" pathLength={1} className="scroll-top-ring" />
      </svg>
      <ArrowUp className="h-[18px] w-[18px]" />
    </button>
  );
}
