import { ReactNode } from "react";

export const inputCls = "field text-sm";

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className = "",
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    // data-invalid lets the form scroll to the first field with a problem
    <div className={className} data-invalid={error ? "" : undefined}>
      <label htmlFor={htmlFor} className="mb-1.5 flex items-baseline justify-between gap-3 text-sm font-semibold text-ink">
        <span>{label}</span>
        {hint && <span className="text-right text-xs font-normal text-subtle">{hint}</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
