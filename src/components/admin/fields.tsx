import { KeyboardEvent, ReactNode, useState } from "react";
import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";

export const inputCls =
  "w-full rounded-lg border border-white/10 bg-zinc-900 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-400/10";

export function Field({
  label,
  hint,
  error,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 flex items-baseline justify-between text-sm text-zinc-300">
        <span>{label}</span>
        {hint && <span className="text-xs text-zinc-600">{hint}</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

/** Chip-style editor for short values like tech stack */
export function TagInput({
  value,
  onChange,
  placeholder = "Type and press Enter",
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
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
    <div className="flex min-h-[46px] flex-wrap items-center gap-1.5 rounded-lg border border-white/10 bg-zinc-900 px-2.5 py-2 focus-within:border-emerald-400/60">
      {value.map((t) => (
        <span key={t} className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-1 font-mono text-xs text-zinc-200">
          {t}
          <button type="button" onClick={() => onChange(value.filter((x) => x !== t))} className="text-zinc-500 hover:text-red-400" aria-label={`Remove ${t}`}>
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
        className="min-w-[120px] flex-1 bg-transparent px-1 py-0.5 text-sm text-white placeholder:text-zinc-600 outline-none"
      />
    </div>
  );
}

/** Ordered list editor for longer lines like highlights / achievements */
export function ListInput({
  value,
  onChange,
  placeholder = "Add an item",
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const v = draft.trim();
    if (!v) return;
    onChange([...value, v]);
    setDraft("");
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {value.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            value={item}
            onChange={(e) => onChange(value.map((v, idx) => (idx === i ? e.target.value : v)))}
            className={inputCls}
          />
          <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-zinc-500 hover:bg-white/5 hover:text-white disabled:opacity-30" aria-label="Move up">
            <ArrowUp className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => move(i, 1)} disabled={i === value.length - 1} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-zinc-500 hover:bg-white/5 hover:text-white disabled:opacity-30" aria-label="Move down">
            <ArrowDown className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => onChange(value.filter((_, idx) => idx !== i))} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-zinc-500 hover:bg-red-500/10 hover:text-red-400" aria-label="Remove">
            <X className="h-4 w-4" />
          </button>
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
          placeholder={placeholder}
          className={inputCls}
        />
        <button type="button" onClick={add} className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-white/10 px-3 text-sm text-zinc-300 hover:border-emerald-400/50 hover:text-white">
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>
    </div>
  );
}
