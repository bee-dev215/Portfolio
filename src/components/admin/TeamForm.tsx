import { FormEvent, useEffect, useState } from "react";
import { TeamInput, TeamRow } from "@/lib/teamApi";
import EditorDrawer from "./EditorDrawer";
import ImageUpload from "./ImageUpload";
import { Field, FormSection, inputCls, TagInput, Toggle } from "./fields";

const blank = (): TeamInput => ({ name: "", role: "", bio: "", photo: "", linkedin: "", focus: [], published: true });

const toValues = (row: TeamRow | null): TeamInput =>
  row
    ? { name: row.name, role: row.role, bio: row.bio, photo: row.photo, linkedin: row.linkedin, focus: Array.isArray(row.focus) ? row.focus : [], published: row.published }
    : blank();

export default function TeamForm({
  open,
  initial,
  saving,
  onClose,
  onSave,
}: {
  open: boolean;
  initial: TeamRow | null;
  saving: boolean;
  onClose: () => void;
  onSave: (values: TeamInput) => void;
}) {
  const [v, setV] = useState<TeamInput>(() => toValues(initial));
  const [start, setStart] = useState(v);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    const values = toValues(initial);
    setV(values);
    setStart(values);
    setErrors({});
  }, [open, initial]);

  const set = <K extends keyof TeamInput>(k: K, val: TeamInput[K]) => {
    setV((p) => ({ ...p, [k]: val }));
    setErrors((e) => (e[k] ? Object.fromEntries(Object.entries(e).filter(([key]) => key !== k)) : e));
  };

  const problems = Object.keys(errors).length;
  const status = problems > 0 && `${problems === 1 ? "1 field needs" : `${problems} fields need`} attention`;

  const requestClose = () => {
    if (JSON.stringify(v) !== JSON.stringify(start) && !window.confirm("Discard your changes to this person?")) return;
    onClose();
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const values: TeamInput = {
      ...v,
      name: v.name.trim(),
      role: v.role.trim(),
      bio: v.bio.trim(),
      photo: v.photo.trim(),
      linkedin: v.linkedin.trim(),
    };
    const errs: Record<string, string> = {};
    if (!values.name) errs.name = "Add their name";
    if (!values.role) errs.role = "Add their role";
    if (!values.bio) errs.bio = "Write a sentence or two — every card shows one";
    if (values.linkedin && !/^https:\/\/([a-z]{2,3}\.)?linkedin\.com\/\S+$/i.test(values.linkedin)) errs.linkedin = "Paste their full profile link, e.g. https://www.linkedin.com/in/name";
    setErrors(errs);
    if (Object.keys(errs).length) {
      requestAnimationFrame(() => document.querySelector("[data-invalid]")?.scrollIntoView({ behavior: "smooth", block: "center" }));
      return;
    }
    onSave(values);
  };

  return (
    <EditorDrawer
      open={open}
      title={initial ? "Edit team member" : "New team member"}
      subtitle={initial ? initial.name : "Add someone to the Team page"}
      saving={saving}
      status={status}
      onClose={requestClose}
      onSubmit={submit}
    >
      <FormSection title="About them">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name" htmlFor="tf-name" error={errors.name}>
            <input id="tf-name" value={v.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Amara Nwosu" className={inputCls} />
          </Field>
          <Field label="Role" htmlFor="tf-role" error={errors.role}>
            <input id="tf-role" value={v.role} onChange={(e) => set("role", e.target.value)} placeholder="e.g. Senior ML engineer" className={inputCls} />
          </Field>
        </div>
        <p className="-mt-2 text-xs leading-relaxed text-subtle">
          The Team page's filters go by the role: words like <em>founder</em>, <em>engineer</em>, <em>data</em>, <em>design</em> or <em>education</em> put someone under
          Leadership, Engineering, Data & ML, Design or Education.
        </p>
        <Field label="Short bio" htmlFor="tf-bio" hint="One or two sentences" error={errors.bio}>
          <textarea id="tf-bio" rows={3} value={v.bio} onChange={(e) => set("bio", e.target.value)} className={`${inputCls} resize-y`} />
        </Field>
        <Field label="Specialities" hint="Enter or comma to add · the first three are shown">
          <TagInput value={v.focus} onChange={(val) => set("focus", val)} placeholder="RAG, Evaluation, PyTorch" />
        </Field>
        <Field label="LinkedIn profile" htmlFor="tf-linkedin" hint="Optional" error={errors.linkedin}>
          <input id="tf-linkedin" type="url" value={v.linkedin} onChange={(e) => set("linkedin", e.target.value)} placeholder="https://www.linkedin.com/in/…" className={inputCls} />
        </Field>
        <Toggle checked={v.published} onChange={(on) => set("published", on)} label="Show on the site" desc="Turn off to keep them in the admin without showing them." />
      </FormSection>

      <FormSection title="Portrait" desc="Optional — without one, the card shows their initials on the brand gradient.">
        <ImageUpload id="tf-photo" folder="team" shape="4:5" value={v.photo} onChange={(url) => set("photo", url)} />
      </FormSection>
    </EditorDrawer>
  );
}
