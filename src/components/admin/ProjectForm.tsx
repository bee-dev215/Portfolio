import { FormEvent, useEffect, useState } from "react";
import { industries, services, solutions } from "@/data/company";
import { Project } from "@/data/projects";
import { ProjectInput, ProjectRow, rowToProject } from "@/lib/projectsApi";
import EditorDrawer from "./EditorDrawer";
import ImageUpload from "./ImageUpload";
import { Field, FormSection, inputCls, ListInput, RowsInput, TagInput, Toggle } from "./fields";

type Values = Project & { published: boolean };

const blank = (): Values => ({
  slug: "",
  title: "",
  client: "",
  audience: industries[0].key,
  services: [],
  year: String(new Date().getFullYear()),
  duration: "",
  team: "",
  summary: "",
  challenge: "",
  brief: [],
  steps: [],
  built: [],
  flow: [],
  safeguards: [],
  measures: [],
  stack: [],
  image: "",
  imageAlt: "",
  gallery: { src: "", alt: "", caption: "" },
  featured: false,
  published: true,
});

const toValues = (row: ProjectRow | null): Values =>
  row ? { ...blank(), ...rowToProject(row), featured: Boolean(row.data.featured), published: row.published } : blank();

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Trimmed, with empty lines and empty entries dropped
const lines = (a: string[]) => a.map((s) => s.trim()).filter(Boolean);
const entries = <R extends object>(a: R[]) =>
  a.map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, String(v).trim()])) as R).filter((r) => Object.values(r).some(Boolean));

// Sections a project page shows: a draft can leave them empty, a published project can't
const PAGE_TEXT = ["challenge", "duration", "team"] as const;
const PAGE_LISTS = ["services", "brief", "steps", "built", "flow", "stack", "safeguards", "measures"] as const;
const PAGE_FIELDS: string[] = [...PAGE_TEXT, ...PAGE_LISTS];

function toInput({ slug, published, ...p }: Values): ProjectInput {
  return {
    slug: slug.trim(),
    published,
    data: {
      ...p,
      title: p.title.trim(),
      client: p.client.trim(),
      solution: p.solution || undefined,
      year: p.year.trim(),
      duration: p.duration.trim(),
      team: p.team.trim(),
      summary: p.summary.trim(),
      challenge: p.challenge.trim(),
      brief: lines(p.brief),
      steps: entries(p.steps),
      built: entries(p.built),
      flow: entries(p.flow),
      safeguards: lines(p.safeguards),
      measures: lines(p.measures),
      image: p.image.trim(),
      imageAlt: p.imageAlt.trim(),
      gallery: { src: p.gallery.src.trim(), alt: p.gallery.alt.trim(), caption: p.gallery.caption.trim() },
    },
  };
}

export default function ProjectForm({
  open,
  initial,
  takenSlugs,
  saving,
  onClose,
  onSave,
}: {
  open: boolean;
  initial: ProjectRow | null;
  takenSlugs: string[]; // the other projects' web addresses
  saving: boolean;
  onClose: () => void;
  onSave: (values: ProjectInput) => void;
}) {
  const [v, setV] = useState<Values>(() => toValues(initial));
  const [start, setStart] = useState(v);
  const [slugEdited, setSlugEdited] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    const values = toValues(initial);
    setV(values);
    setStart(values);
    // A new project's address follows its title until it's edited by hand
    setSlugEdited(Boolean(initial));
    setErrors({});
  }, [open, initial]);

  // Editing a field clears its error message
  const clearError = (...keys: string[]) => setErrors((e) => (keys.some((k) => e[k]) ? Object.fromEntries(Object.entries(e).filter(([k]) => !keys.includes(k))) : e));
  const set = <K extends keyof Values>(k: K, val: Values[K]) => {
    setV((p) => ({ ...p, [k]: val }));
    clearError(k);
  };
  const setGallery = (k: keyof Values["gallery"], val: string) => setV((p) => ({ ...p, gallery: { ...p.gallery, [k]: val } }));
  const setTitle = (title: string) => {
    setV((p) => ({ ...p, title, slug: slugEdited ? p.slug : slugify(title) }));
    clearError("title", ...(slugEdited ? [] : ["slug"]));
  };
  const problems = Object.keys(errors).length;
  const status =
    problems > 0 &&
    `${problems === 1 ? "1 field needs" : `${problems} fields need`} attention${
      Object.keys(errors).some((k) => PAGE_FIELDS.includes(k)) ? " — or turn off “Show on the site” to save a draft" : ""
    }`;
  const toggleService = (key: Values["services"][number]) =>
    set("services", v.services.includes(key) ? v.services.filter((k) => k !== key) : services.filter((s) => s.key === key || v.services.includes(s.key)).map((s) => s.key));

  const requestClose = () => {
    if (JSON.stringify(v) !== JSON.stringify(start) && !window.confirm("Discard your changes to this project?")) return;
    onClose();
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    const slug = v.slug.trim();
    if (!v.title.trim()) errs.title = "Give the project a title";
    if (!slug) errs.slug = "Choose a web address";
    else if (!SLUG.test(slug)) errs.slug = "Use lower-case letters, numbers and single hyphens, e.g. math-tutor";
    else if (takenSlugs.includes(slug)) errs.slug = "Another project already uses this address";
    if (!v.client.trim()) errs.client = "Describe the client";
    if (!v.year.trim()) errs.year = "Add the year";
    if (!v.summary.trim()) errs.summary = "Write a short summary";
    if (!v.image.trim()) errs.image = "Add a cover photo — every project card shows one";
    if (!v.imageAlt.trim()) errs.imageAlt = "Describe the photo";
    const input = toInput(v);
    if (v.published) {
      for (const k of PAGE_TEXT) if (!input.data[k]) errs[k] = "Needed to show it on the site";
      for (const k of PAGE_LISTS) if (!input.data[k].length) errs[k] = "Needed to show it on the site — add at least one";
    }
    setErrors(errs);
    if (Object.keys(errs).length) {
      // Wait for the messages to render, then bring the first one into view
      requestAnimationFrame(() => document.querySelector("[data-invalid]")?.scrollIntoView({ behavior: "smooth", block: "center" }));
      return;
    }
    onSave(input);
  };

  return (
    <EditorDrawer
      open={open}
      title={initial ? "Edit project" : "New project"}
      subtitle={initial ? initial.data.title : "Add a case study to the site"}
      saving={saving}
      status={status}
      onClose={requestClose}
      onSubmit={submit}
    >
      <FormSection title="Basics">
        <Field label="Title" htmlFor="pf-title" error={errors.title}>
          <input id="pf-title" value={v.title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Socratic Math Coach" className={inputCls} />
        </Field>

        <Field label="Web address" htmlFor="pf-slug" hint={initial ? "Changing it breaks links to the old address" : undefined} error={errors.slug}>
          <div className="flex items-center gap-2">
            <span className="shrink-0 font-code text-sm text-subtle">/projects/</span>
            <input
              id="pf-slug"
              value={v.slug}
              onChange={(e) => {
                setSlugEdited(true);
                set("slug", e.target.value);
              }}
              placeholder="filled in from the title"
              className={`${inputCls} font-code`}
            />
          </div>
        </Field>

        <Field label="Client" htmlFor="pf-client" hint="Describe the client, don't name them" error={errors.client}>
          <input id="pf-client" value={v.client} onChange={(e) => set("client", e.target.value)} placeholder="e.g. Public school district · United States" className={inputCls} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Audience" htmlFor="pf-audience">
            <select id="pf-audience" value={v.audience} onChange={(e) => set("audience", e.target.value)} className={inputCls}>
              {industries.map((i) => (
                <option key={i.key} value={i.key}>
                  {i.title}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Built on solution" htmlFor="pf-solution">
            <select id="pf-solution" value={v.solution ?? ""} onChange={(e) => set("solution", e.target.value || undefined)} className={inputCls}>
              <option value="">None</option>
              {solutions.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.title}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Year" htmlFor="pf-year" error={errors.year}>
            <input id="pf-year" value={v.year} onChange={(e) => set("year", e.target.value)} placeholder="2026" className={inputCls} />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Timeline" htmlFor="pf-duration" error={errors.duration}>
            <input id="pf-duration" value={v.duration} onChange={(e) => set("duration", e.target.value)} placeholder="e.g. 16 weeks to pilot" className={inputCls} />
          </Field>
          <Field label="Team" htmlFor="pf-team" error={errors.team}>
            <input id="pf-team" value={v.team} onChange={(e) => set("team", e.target.value)} placeholder="e.g. 4 — AI engineers and a learning designer" className={inputCls} />
          </Field>
        </div>

        <Field label="Services used" hint="The service pages list projects that used them" error={errors.services}>
          <div className="flex flex-wrap gap-2">
            {services.map((s) => {
              const on = v.services.includes(s.key);
              return (
                <button
                  key={s.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleService(s.key)}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${on ? "border-transparent bg-grad text-white" : "border-line bg-surface text-ink-2 hover:border-brand/40"}`}
                >
                  {s.title}
                </button>
              );
            })}
          </div>
        </Field>

        <div className="grid gap-3 sm:grid-cols-2">
          <Toggle
            checked={v.published}
            onChange={(on) => {
              set("published", on);
              if (!on) clearError(...PAGE_FIELDS);
            }}
            label="Show on the site"
            desc="Turn off to save a hidden draft, which doesn't need every section yet."
          />
          <Toggle checked={Boolean(v.featured)} onChange={(on) => set("featured", on)} label="Featured" desc="Featured projects lead on the home page and in the footer." />
        </div>
      </FormSection>

      <FormSection title="Photos">
        <Field label="Cover photo" htmlFor="pf-image" error={errors.image}>
          <ImageUpload id="pf-image" value={v.image} onChange={(url) => set("image", url)} />
        </Field>
        <Field label="Cover photo description" htmlFor="pf-image-alt" hint="Read aloud to people using screen readers" error={errors.imageAlt}>
          <input id="pf-image-alt" value={v.imageAlt} onChange={(e) => set("imageAlt", e.target.value)} placeholder="e.g. A student works on a laptop in a bright classroom" className={inputCls} />
        </Field>
        <Field label="Second photo" htmlFor="pf-gallery" hint="Optional — shown beside “What we built”; the cover is used if empty">
          <ImageUpload id="pf-gallery" value={v.gallery.src} onChange={(url) => setGallery("src", url)} />
        </Field>
        {v.gallery.src && (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Second photo description" htmlFor="pf-gallery-alt">
              <input id="pf-gallery-alt" value={v.gallery.alt} onChange={(e) => setGallery("alt", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Caption" htmlFor="pf-gallery-caption">
              <input id="pf-gallery-caption" value={v.gallery.caption} onChange={(e) => setGallery("caption", e.target.value)} className={inputCls} />
            </Field>
          </div>
        )}
      </FormSection>

      <FormSection title="The story">
        <Field label="Summary" htmlFor="pf-summary" hint="One or two sentences, shown on cards" error={errors.summary}>
          <textarea id="pf-summary" rows={3} value={v.summary} onChange={(e) => set("summary", e.target.value)} className={`${inputCls} resize-y`} />
        </Field>
        <Field label="The challenge" htmlFor="pf-challenge" hint="What problem the client had" error={errors.challenge}>
          <textarea id="pf-challenge" rows={5} value={v.challenge} onChange={(e) => set("challenge", e.target.value)} className={`${inputCls} resize-y`} />
        </Field>
        <Field label="The brief" hint="What the client asked for" error={errors.brief}>
          <ListInput value={v.brief} onChange={(val) => set("brief", val)} placeholder="e.g. Grounded in the district's own curriculum" />
        </Field>
      </FormSection>

      <FormSection title="How it was built">
        <Field label="Phases" error={errors.steps}>
          <RowsInput
            value={v.steps}
            onChange={(val) => set("steps", val)}
            fields={[
              { key: "phase", placeholder: "Phase, e.g. Discover" },
              { key: "when", placeholder: "When, e.g. Weeks 1–3" },
              { key: "desc", placeholder: "What happened in this phase", long: true },
            ]}
            addLabel="Add a phase"
          />
        </Field>
        <Field label="What we built" error={errors.built}>
          <RowsInput
            value={v.built}
            onChange={(val) => set("built", val)}
            fields={[
              { key: "title", placeholder: "Feature, e.g. Three-step hint ladder" },
              { key: "desc", placeholder: "What it does", long: true },
            ]}
            addLabel="Add a feature"
          />
        </Field>
        <Field label="Architecture" hint="How the system fits together, in order" error={errors.flow}>
          <RowsInput
            value={v.flow}
            onChange={(val) => set("flow", val)}
            fields={[
              { key: "label", placeholder: "Part, e.g. Retrieval" },
              { key: "detail", placeholder: "Detail, e.g. Vector index filtered by grade" },
            ]}
            addLabel="Add a part"
          />
        </Field>
        <Field label="Tech stack" hint="Enter or comma to add" error={errors.stack}>
          <TagInput value={v.stack} onChange={(val) => set("stack", val)} placeholder="Claude, FastAPI, React" />
        </Field>
      </FormSection>

      <FormSection title="Safety & results">
        <Field label="Safeguards" error={errors.safeguards}>
          <ListInput value={v.safeguards} onChange={(val) => set("safeguards", val)} placeholder="e.g. Teachers release every comment" />
        </Field>
        <Field label="What success was measured on" hint="No figures, so nothing reads as a published result" error={errors.measures}>
          <ListInput value={v.measures} onChange={(val) => set("measures", val)} placeholder="e.g. Teacher agreement with the drafts" />
        </Field>
      </FormSection>
    </EditorDrawer>
  );
}
