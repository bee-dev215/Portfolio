import { CSSProperties } from "react";
import { Project } from "@/data/projects";
import Reveal from "@/components/site/Reveal";

/**
 * How a project's system fits together, as a left-to-right flow (top-to-bottom on phones).
 * The steps rise in one after another, then a soft pulse travels along each connector.
 */
export default function ProjectFlow({ flow }: { flow: Project["flow"] }) {
  return (
    <Reveal variant="clip">
      <ol className="flex flex-col lg:flex-row">
        {flow.map((step, i) => (
          <li key={step.label} className="flex flex-col lg:flex-1 lg:flex-row">
            <div className="flow-step card flex-1 p-5 lg:p-6" style={{ "--i": i } as CSSProperties}>
              <span
                className={`grid h-9 w-9 place-items-center rounded-xl font-display text-sm font-bold ${
                  i === 0 || i === flow.length - 1 ? "bg-grad text-white" : "bg-brand-soft text-brand-text"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-lg font-bold leading-snug">{step.label}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{step.detail}</p>
            </div>
            {i < flow.length - 1 && (
              <span className="relative h-8 shrink-0 lg:h-auto lg:w-10" aria-hidden="true">
                <span className="flow-line bg-grad absolute opacity-40" />
                <span className="flow-pulse bg-grad absolute h-2 w-2 rounded-full" style={{ "--d": `${0.8 + i * 0.35}s` } as CSSProperties} />
              </span>
            )}
          </li>
        ))}
      </ol>
    </Reveal>
  );
}
