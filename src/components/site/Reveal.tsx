import { CSSProperties, Children, Fragment, ReactElement, ReactNode, cloneElement, isValidElement } from "react";
import { useInView } from "@/hooks/use-motion";

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
      return cloneElement(el, { className: `${el.props.className ?? ""} word`, style: { ...el.props.style, "--w": n++ } as CSSProperties });
    });
  return walk(title);
}

/** Section header: eyebrow pill, large title (wrap a phrase in .gradient-text to highlight it) and an optional lead. */
export function SectionHeading({
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
        {label}
      </span>
      <h2 className="mt-5 text-balance font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">{splitWords(title)}</h2>
      {children}
    </div>
  );
}
