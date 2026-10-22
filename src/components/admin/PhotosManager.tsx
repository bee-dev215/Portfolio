import { FormEvent, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { photoGroups, PhotoSlot } from "@/data/site-photos";
import { explain } from "@/lib/adminApi";
import { fetchPhotoRows, PHOTOS_KEY, PhotoRow, replacePhoto, restorePhoto } from "@/lib/photosApi";
import EditorDrawer from "./EditorDrawer";
import ImageUpload from "./ImageUpload";
import { Field, FormSection, inputCls } from "./fields";

const original = (slot: PhotoSlot) => `/images/${slot.file}`;

// The photo being edited, with its replacement as it was when the form opened (a refetch mustn't reset the form)
interface Target {
  slot: PhotoSlot;
  current?: PhotoRow;
}

/** Replace one built-in photo, or bring the original back. Saving the original removes the replacement. */
function PhotoForm({
  target,
  saving,
  onClose,
  onSave,
}: {
  target: Target | null;
  saving: boolean;
  onClose: () => void;
  onSave: (slot: PhotoSlot, replacement: PhotoRow | null) => void;
}) {
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [error, setError] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!target) return;
    setUrl(target.current?.url ?? original(target.slot));
    setAlt(target.current?.alt ?? "");
    setError({});
  }, [target]);

  if (!target) return null;
  const { slot, current } = target;
  const isOriginal = url.trim() === original(slot);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!url.trim()) errs.url = "Choose a photo, or restore the original";
    // The original's description won't match a different photo
    else if (slot.alt !== undefined && !isOriginal && !alt.trim()) errs.alt = "Describe the new photo for people using screen readers";
    setError(errs);
    if (Object.keys(errs).length) return;
    onSave(slot, isOriginal ? null : { file: slot.file, url: url.trim(), alt: alt.trim() });
  };

  return (
    <EditorDrawer
      open
      title={slot.label}
      subtitle={slot.where}
      saving={saving}
      status={Object.values(error)[0]}
      onClose={() => {
        if ((url !== (current?.url ?? original(slot)) || alt !== (current?.alt ?? "")) && !window.confirm("Discard your changes to this photo?")) return;
        onClose();
      }}
      onSubmit={submit}
    >
      <FormSection title="Photo" desc={`Shown on the site at ${slot.shape}. Faces and subjects near the middle survive every crop.`}>
        <Field label={isOriginal ? "The original photo" : "New photo"} htmlFor="ph-url" error={error.url}>
          <ImageUpload id="ph-url" folder="site" shape={slot.shape} removable={false} value={url} onChange={setUrl} />
        </Field>
        {!isOriginal && (
          <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-3">
            <img src={original(slot)} alt="" className="h-14 w-20 shrink-0 rounded-xl object-cover" />
            <p className="min-w-0 flex-1 text-sm text-subtle">The original stays in the site's files, so you can bring it back at any time.</p>
            <button
              type="button"
              onClick={() => {
                setUrl(original(slot));
                setAlt("");
                setError({});
              }}
              className="btn btn-secondary shrink-0 px-4 py-2 text-sm"
            >
              <RotateCcw className="h-4 w-4" /> Use the original
            </button>
          </div>
        )}
      </FormSection>

      {slot.alt !== undefined && !isOriginal && (
        <FormSection title="Description">
          <Field label="What the photo shows" htmlFor="ph-alt" hint="Read aloud to people using screen readers" error={error.alt}>
            <input id="ph-alt" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder={slot.alt} className={inputCls} />
          </Field>
        </FormSection>
      )}
    </EditorDrawer>
  );
}

export default function PhotosManager() {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: [...PHOTOS_KEY, "admin"], queryFn: fetchPhotoRows });
  const byFile = new Map((query.data ?? []).map((r) => [r.file, r]));
  const [editing, setEditing] = useState<Target | null>(null);
  const [saving, setSaving] = useState(false);

  const slots = photoGroups.flatMap((g) => g.slots);
  const replaced = slots.filter((s) => byFile.has(s.file)).length;

  const save = async (slot: PhotoSlot, replacement: PhotoRow | null) => {
    // Saving the original when nothing was replaced is a no-op
    if (!replacement && !byFile.has(slot.file)) return setEditing(null);
    setSaving(true);
    try {
      if (replacement) await replacePhoto(replacement);
      else await restorePhoto(slot.file);
      toast.success(replacement ? "Photo replaced" : "Original photo restored", { description: "The site shows the change straight away." });
      setEditing(null);
      // Refreshes the admin's list and the site's own copy
      await qc.invalidateQueries({ queryKey: PHOTOS_KEY });
    } catch (e) {
      toast.error("Could not save the photo", { description: explain(e) });
    } finally {
      setSaving(false);
    }
  };

  if (query.isError) return <div className="card border-red-500/30 p-6 text-sm text-red-500">Couldn't load the photos. {explain(query.error)}</div>;

  return (
    <div>
      <p className="mb-8 text-sm text-subtle">
        {slots.length} photos{query.data ? ` · ${replaced} replaced` : ""} · click one to replace it
      </p>

      <div className="space-y-12">
        {photoGroups.map((g) => (
          <section key={g.title} aria-labelledby={`photos-${g.title}`}>
            <h2 id={`photos-${g.title}`} className="font-display text-lg font-bold">
              {g.title}
            </h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {g.slots.map((slot) => {
                const row = byFile.get(slot.file);
                return (
                  <li key={slot.file}>
                    <button onClick={() => setEditing({ slot, current: row })} disabled={query.isLoading} className="card card-hover group block h-full w-full overflow-hidden text-left disabled:cursor-wait">
                      <div className="relative aspect-[16/10] overflow-hidden bg-raised">
                        {!query.isLoading && <img src={row?.url ?? original(slot)} alt="" loading="lazy" className="img-zoom h-full w-full object-cover" />}
                        {row && <span className="eyebrow absolute left-3 top-3 px-2 py-0.5 text-[10px] shadow-soft">Replaced</span>}
                        <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-sm font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                          <ImagePlus className="mr-2 h-4 w-4" /> Replace
                        </span>
                      </div>
                      <div className="p-4">
                        <p className="truncate font-semibold">{slot.label}</p>
                        <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-subtle">{slot.where}</p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <PhotoForm target={editing} saving={saving} onClose={() => setEditing(null)} onSave={save} />
    </div>
  );
}
