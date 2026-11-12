import { Children, Fragment, ReactElement, ReactNode, isValidElement } from "react";

/** True for the highlighted phrase of a title (an element carrying .gradient-text). */
export const isHighlight = (el: ReactElement<{ className?: string }>) => (el.props.className ?? "").split(" ").includes("gradient-text");

/** Wraps each highlighted (.gradient-text) phrase of a title in an .hl span, which draws the lime marker stroke under it. */
export function markHighlights(title: ReactNode): ReactNode {
  return Children.map(title, (child) => {
    if (!isValidElement(child)) return child;
    const el = child as ReactElement<{ children?: ReactNode; className?: string }>;
    if (el.type === Fragment) return markHighlights(el.props.children);
    return isHighlight(el) ? <span className="hl">{el}</span> : el;
  });
}
