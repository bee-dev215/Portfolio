import { ReactNode } from "react";
import { useInView } from "@/hooks/use-motion";
import ScrambleText from "./ScrambleText";

export type RevealVariant = "up" | "left" | "right" | "scale" | "clip";

export default function Reveal({
  children,
  delay = 0,
  variant = "up",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  variant?: RevealVariant;
  className?: string;
}) {
  const [ref, visible] = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`rv rv-${variant} ${visible ? "rv-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ["--rv-delay" as string]: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/** Section header: module tag, hairline, sector code and a large angular title. */
export function SectionHeading({
  index,
  label,
  title,
  children,
}: {
  index: string;
  label: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  const [ref, visible] = useInView<HTMLDivElement>();

  return (
    <div ref={ref} className={`rv rv-up ${visible ? "rv-in" : ""}`}>
      <div className="flex items-center gap-4 font-code text-xs uppercase tracking-[0.22em]">
        <span className="bevel cut-sm bg-signal px-2 py-1 font-semibold text-ink">{index}</span>
        <ScrambleText text={label} start={visible} delay={150} className="text-muted2" />
        <span className="rv-line h-px flex-1 bg-gradient-to-r from-signal/60 via-line to-transparent" />
        <span className="hidden text-[10px] text-muted2/70 sm:inline">[ MOD-{index} ]</span>
      </div>
      <h2 className="rv-mask extrude-sm mt-8 max-w-4xl font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
        <span>{title}</span>
      </h2>
      {children}
    </div>
  );
}
