import { KeyboardEvent, ReactNode, useState } from "react";
import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";

export const inputCls = "field text-sm";
export const iconBtn =
  "grid h-9 w-9 shrink-0 place-items-center rounded-full text-subtle transition-colors hover:bg-raised hover:text-ink disabled:pointer-events-none disabled:opacity-30";
const addBtn = "btn btn-secondary shrink-0 px-4 py-2.5 text-sm";

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

/** A titled group of fields in the editor. */
export function FormSection({ title, desc, children }: { title: string; desc?: string; children: ReactNode }) {
  return (
    <section className="space-y-5 border-t border-line pt-7 first:border-0 first:pt-0">
      <div>
        <h3 className="font-display text-lg font-bold">{title}</h3>
        {desc && <p className="mt-1 text-sm text-subtle">{desc}</p>}
      </div>
      {children}
    </section>
  );
}

/** A checkbox with a label and a line of explanation. */
export function Toggle({ checked, onChange, label, desc }: { checked: boolean; onChange: (v: boolean) => void; label: string; desc: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-brand/40">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 rounded accent-brand" />
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        <span className="mt-0.5 block text-xs leading-relaxed text-subtle">{desc}</span>
      </span>
    </label>
  );
}

/** Chip-style editor for short values like the tech stack */
export function TagInput({ value, onChange, placeholder = "Type and press Enter" }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const parts = draft
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((s) => !value.includes(s));
    if (parts.length) onChange([...value, ...parts]);
    setDraft("");
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add();
    } else if (e.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="field flex min-h-[3rem] flex-wrap items-center gap-1.5 px-2.5 py-2 focus-within:border-brand/60">
      {value.map((t) => (
        <span key={t} className="chip gap-1 py-1 pl-3 pr-1.5">
          {t}
          <button type="button" onClick={() => onChange(value.filter((x) => x !== t))} className="grid h-5 w-5 place-items-center rounded-full text-subtle hover:text-red-500" aria-label={`Remove ${t}`}>
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKey}
        onBlur={add}
        placeholder={value.length ? "" : placeholder}
        className="min-w-[140px] flex-1 bg-transparent px-1.5 py-0.5 text-sm outline-none placeholder:text-subtle/70"
      />
    </div>
  );
}

/** Move/remove buttons for one entry of an ordered list. */
function RowControls({ i, count, onMove, onRemove }: { i: number; count: number; onMove: (i: number, dir: -1 | 1) => void; onRemove: (i: number) => void }) {
  return (
    <>
      <button type="button" onClick={() => onMove(i, -1)} disabled={i === 0} className={iconBtn} aria-label="Move up">
        <ArrowUp className="h-4 w-4" />
      </button>
      <button type="button" onClick={() => onMove(i, 1)} disabled={i === count - 1} className={iconBtn} aria-label="Move down">
        <ArrowDown className="h-4 w-4" />
      </button>
      <button type="button" onClick={() => onRemove(i)} className={`${iconBtn} hover:bg-red-500/10 hover:text-red-500`} aria-label="Remove">
        <X className="h-4 w-4" />
      </button>
    </>
  );
}

function useOrderedList<T>(value: T[], onChange: (v: T[]) => void) {
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const edit = (i: number, item: T) => onChange(value.map((v, idx) => (idx === i ? item : v)));
  return { move, remove, edit };
}

/** Ordered list editor for longer lines like the brief or safeguards */
export function ListInput({ value, onChange, placeholder = "Add an item" }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [draft, setDraft] = useState("");
  const { move, remove, edit } = useOrderedList(value, onChange);

  const add = () => {
    const v = draft.trim();
    if (!v) return;
    onChange([...value, v]);
    setDraft("");
  };

  return (
    <div className="space-y-2">
      {value.map((item, i) => (
        <div key={i} className="flex items-center gap-1">
          <input value={item} onChange={(e) => edit(i, e.target.value)} className={`${inputCls} mr-1`} />
          <RowControls i={i} count={value.length} onMove={move} onRemove={remove} />
        </div>
      ))}
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          onBlur={add}
          placeholder={placeholder}
          className={inputCls}
        />
        <button type="button" onClick={add} className={addBtn}>
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>
    </div>
  );
}

export interface RowField<K extends string> {
  key: K;
  placeholder: string;
  long?: boolean; // a textarea across the full width
}

/** Ordered list editor for entries with several parts, like the project's phases (phase, timing, description) */
export function RowsInput<K extends string>({
  value,
  onChange,
  fields,
  addLabel,
}: {
  value: Record<K, string>[];
  onChange: (v: Record<K, string>[]) => void;
  fields: RowField<K>[];
  addLabel: string;
}) {
  const { move, remove, edit } = useOrderedList(value, onChange);
  const empty = () => Object.fromEntries(fields.map((f) => [f.key, ""])) as Record<K, string>;

  return (
    <div className="space-y-3">
      {value.map((row, i) => (
        <div key={i} className="flex items-start gap-1 rounded-2xl border border-line bg-raised/40 p-3">
          <span className="mt-3 w-6 shrink-0 text-center font-code text-xs text-subtle">{String(i + 1).padStart(2, "0")}</span>
          <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2">
            {fields.map((f) =>
              f.long ? (
                <textarea
                  key={f.key}
                  rows={2}
                  value={row[f.key]}
                  onChange={(e) => edit(i, { ...row, [f.key]: e.target.value })}
                  placeholder={f.placeholder}
                  className={`${inputCls} resize-y sm:col-span-2`}
                />
              ) : (
                <input key={f.key} value={row[f.key]} onChange={(e) => edit(i, { ...row, [f.key]: e.target.value })} placeholder={f.placeholder} className={inputCls} />
              ),
            )}
          </div>
          <div className="ml-1 flex flex-col">
            <RowControls i={i} count={value.length} onMove={move} onRemove={remove} />
          </div>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, empty()])} className={addBtn}>
        <Plus className="h-4 w-4" /> {addLabel}
      </button>
    </div>
  );
}
