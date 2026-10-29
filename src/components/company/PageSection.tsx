import { ReactNode } from "react";

/** Standard inner-page section: padded, centered to the site width, optionally on the tinted band. */
export default function PageSection({ id, band = false, className = "", children }: { id?: string; band?: boolean; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={`px-5 py-20 sm:px-8 lg:py-28 ${band ? "band" : ""} ${className}`}>
      <div className="mx-auto max-w-[1240px]">{children}</div>
    </section>
  );
}
