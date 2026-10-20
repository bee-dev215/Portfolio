import { FormEvent, useEffect, useState } from "react";
import { employmentTypes } from "@/data/portfolio";
import { emptyExperience, ExperienceInput, ExperienceRow } from "@/lib/portfolioApi";
import EditorDrawer from "./EditorDrawer";
import { Field, inputCls, ListInput, TagInput } from "./fields";

const toInput = (r: ExperienceRow | null): ExperienceInput =>
  r
    ? {
        company: r.company,
        role: r.role,
        type: r.type,
        location: r.location,
        start_date: r.start_date,
        end_date: r.end_date,
        summary: r.summary,
        achievements: r.achievements ?? [],
        tech: r.tech ?? [],
      }
    : { ...emptyExperience };

export default function ExperienceForm({
  open,
  initial,
  saving,
  onClose,
  onSave,
}: {
  open: boolean;
  initial: ExperienceRow | null;
  saving: boolean;
  onClose: () => void;
  onSave: (values: ExperienceInput) => void;
}) {
  const [v, setV] = useState<ExperienceInput>(toInput(initial));
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setV(toInput(initial));
      setErrors({});
    }
  }, [open, initial]);

  const set = <K extends keyof ExperienceInput>(k: K, val: ExperienceInput[K]) => setV((p) => ({ ...p, [k]: val }));
  const current = v.end_date === "Present";

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!v.company.trim()) errs.company = "Company is required";
    if (!v.role.trim()) errs.role = "Role is required";
    if (!v.start_date.trim()) errs.start_date = "Start is required";
    if (!v.end_date.trim()) errs.end_date = "End is required (or mark as current)";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSave({ ...v, company: v.company.trim(), role: v.role.trim(), achievements: v.achievements.map((a) => a.trim()).filter(Boolean) });
  };

  return (
    <EditorDrawer
      open={open}
      title={initial ? "Edit role" : "New role"}
      subtitle={initial ? `${initial.role} · ${initial.company}` : "Add a position to your employment history"}
      saving={saving}
      onClose={onClose}
      onSubmit={submit}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Company" error={errors.company}>
          <input value={v.company} onChange={(e) => set("company", e.target.value)} placeholder="Company name" className={inputCls} />
        </Field>
        <Field label="Role / title" error={errors.role}>
          <input value={v.role} onChange={(e) => set("role", e.target.value)} placeholder="Senior Full Stack Engineer" className={inputCls} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Employment type">
          <select value={v.type} onChange={(e) => set("type", e.target.value)} className={inputCls}>
            {Array.from(new Set([...employmentTypes, v.type])).filter(Boolean).map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Location">
          <input value={v.location} onChange={(e) => set("location", e.target.value)} placeholder="Remote / City, Country" className={inputCls} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Start" hint="e.g. 2021 or Mar 2021" error={errors.start_date}>
          <input value={v.start_date} onChange={(e) => set("start_date", e.target.value)} className={inputCls} />
        </Field>
        <Field label="End" error={errors.end_date}>
          <input
            value={current ? "" : v.end_date}
            disabled={current}
            onChange={(e) => set("end_date", e.target.value)}
            placeholder={current ? "Present" : "e.g. 2024"}
            className={`${inputCls} disabled:opacity-50`}
          />
          <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs text-zinc-400">
            <input type="checkbox" checked={current} onChange={(e) => set("end_date", e.target.checked ? "Present" : "")} className="h-4 w-4 accent-emerald-400" />
            I currently work here
          </label>
        </Field>
      </div>

      <Field label="Summary">
        <textarea rows={3} value={v.summary} onChange={(e) => set("summary", e.target.value)} className={`${inputCls} resize-y`} />
      </Field>

      <Field label="Achievements">
        <ListInput value={v.achievements} onChange={(val) => set("achievements", val)} placeholder="e.g. Led migration to microservices" />
      </Field>

      <Field label="Tech used" hint="Enter or comma to add">
        <TagInput value={v.tech} onChange={(val) => set("tech", val)} placeholder="React, AWS, Kafka" />
      </Field>
    </EditorDrawer>
  );
}
