import { FormEvent, useEffect, useState } from "react";
import { suggestedCategories } from "@/data/company";
import { emptyProject, ProjectInput, ProjectRow } from "@/lib/portfolioApi";
import EditorDrawer from "./EditorDrawer";
import ImageUpload from "./ImageUpload";
import { Field, inputCls, ListInput, TagInput } from "./fields";

const toInput = (r: ProjectRow | null): ProjectInput =>
  r
    ? {
        title: r.title,
        category: r.category,
        year: r.year,
        role: r.role,
        summary: r.summary,
        description: r.description,
        highlights: r.highlights ?? [],
        tech: r.tech ?? [],
        image_url: r.image_url,
        live_url: r.live_url,
        repo_url: r.repo_url,
      }
    : { ...emptyProject };

export default function ProjectForm({
  open,
  initial,
  saving,
  onClose,
  onSave,
}: {
  open: boolean;
  initial: ProjectRow | null;
  saving: boolean;
  onClose: () => void;
  onSave: (values: ProjectInput) => void;
}) {
  const [v, setV] = useState<ProjectInput>(toInput(initial));
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setV(toInput(initial));
      setErrors({});
    }
  }, [open, initial]);

  const set = <K extends keyof ProjectInput>(k: K, val: ProjectInput[K]) => setV((p) => ({ ...p, [k]: val }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!v.title.trim()) errs.title = "Title is required";
    if (!v.category.trim()) errs.category = "Category is required";
    const urlOk = (u: string) => !u || u === "#" || /^https?:\/\//i.test(u);
    if (!urlOk(v.live_url)) errs.live_url = "Must start with http:// or https://";
    if (!urlOk(v.repo_url)) errs.repo_url = "Must start with http:// or https://";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSave({ ...v, title: v.title.trim(), category: v.category.trim(), highlights: v.highlights.map((h) => h.trim()).filter(Boolean) });
  };

  return (
    <EditorDrawer
      open={open}
      title={initial ? "Edit project" : "New project"}
      subtitle={initial ? initial.title : "Add a project to your horizontal showcase"}
      saving={saving}
      onClose={onClose}
      onSubmit={submit}
    >
      <Field label="Cover image">
        <ImageUpload value={v.image_url} onChange={(url) => set("image_url", url)} />
      </Field>

      <Field label="Title" error={errors.title}>
        <input value={v.title} onChange={(e) => set("title", e.target.value)} placeholder="Project name" className={inputCls} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Category" error={errors.category}>
          <input list="pf-categories" value={v.category} onChange={(e) => set("category", e.target.value)} className={inputCls} />
          <datalist id="pf-categories">
            {suggestedCategories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>
        <Field label="Year">
          <input value={v.year} onChange={(e) => set("year", e.target.value)} placeholder="2026" className={inputCls} />
        </Field>
        <Field label="Your role">
          <input value={v.role} onChange={(e) => set("role", e.target.value)} placeholder="Lead Engineer" className={inputCls} />
        </Field>
      </div>

      <Field label="Summary" hint="Shown on the card">
        <input value={v.summary} onChange={(e) => set("summary", e.target.value)} placeholder="One-line pitch" className={inputCls} />
      </Field>

      <Field label="Description" hint="Shown in the case study">
        <textarea rows={4} value={v.description} onChange={(e) => set("description", e.target.value)} className={`${inputCls} resize-y`} />
      </Field>

      <Field label="Key highlights">
        <ListInput value={v.highlights} onChange={(val) => set("highlights", val)} placeholder="e.g. Reduced latency by 70%" />
      </Field>

      <Field label="Tech stack" hint="Enter or comma to add">
        <TagInput value={v.tech} onChange={(val) => set("tech", val)} placeholder="React, Node.js, PostgreSQL" />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Live URL" error={errors.live_url}>
          <input value={v.live_url} onChange={(e) => set("live_url", e.target.value)} placeholder="https://..." className={inputCls} />
        </Field>
        <Field label="Repository URL" error={errors.repo_url}>
          <input value={v.repo_url} onChange={(e) => set("repo_url", e.target.value)} placeholder="https://github.com/..." className={inputCls} />
        </Field>
      </div>
    </EditorDrawer>
  );
}
