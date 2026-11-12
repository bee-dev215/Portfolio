import { CSSProperties, Children, Fragment, ReactElement, ReactNode, cloneElement, isValidElement } from "react";
import { useInView } from "@/hooks/use-motion";
import { isHighlight } from "./highlight";

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

/**
 * Wraps each word of a title in a `.word` span (indexed by --w) so the words can rise in one after another.
 * Elements inside the title, such as the .gradient-text phrase, move as a single unit.
 */
function splitWords(title: ReactNode) {
  let n = 0;
  const walk = (node: ReactNode): ReactNode =>
    Children.map(node, (child) => {
      if (typeof child === "string") {
        return child.split(/(\s+)/).map((part, k) =>
          part.trim() === "" ? part : (
            <span key={k} className="word" style={{ "--w": n++ } as CSSProperties}>
              {part}
            </span>
          )
        );
      }
      if (!isValidElement(child)) return child;
      const el = child as ReactElement<{ children?: ReactNode; className?: string; style?: CSSProperties }>;
      if (el.type === Fragment) return walk(el.props.children);
      // The highlighted phrase rides in an .hl wrapper, which draws the marker stroke under it
      if (isHighlight(el)) {
        return (
          <span className="word" style={{ "--w": n++ } as CSSProperties}>
            <span className="hl">{el}</span>
          </span>
        );
      }
      return cloneElement(el, { className: `${el.props.className ?? ""} word`, style: { ...el.props.style, "--w": n++ } as CSSProperties });
    });
  return walk(title);
}

/**
 * Section header: eyebrow pill (with an optional index, "01"), a large title (wrap a phrase in .gradient-text to
 * highlight it with the marker stroke) and an optional lead.
 */
export function SectionHeading({
  index,
  label,
  title,
  children,
  center = false,
}: {
  index?: string;
  label: string;
  title: ReactNode;
  children?: ReactNode;
  center?: boolean;
}) {
  const [ref, visible] = useInView<HTMLDivElement>();

  return (
    <div ref={ref} className={`rv rv-up ${visible ? "rv-in" : ""} ${center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}`}>
      <span className="eyebrow">
        <span className="h-1.5 w-1.5 rounded-full bg-grad" />
        {index && <span className="opacity-60">{index} /</span>}
        {label}
      </span>
      <h2 className="section-title mt-6 text-balance font-display text-[clamp(2.4rem,5.4vw,4.5rem)] font-extrabold leading-[1] tracking-[-0.04em]">
        {splitWords(title)}
      </h2>
      {children}
    </div>
  );
}
