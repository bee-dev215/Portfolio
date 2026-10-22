import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Eye, EyeOff, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { audienceTitle, projectPath } from "@/data/projects";
import { createProject, deleteProject, fetchProjectRows, PROJECTS_KEY, ProjectInput, ProjectRow, saveOrder, updateProject } from "@/lib/projectsApi";
import ProjectForm from "./ProjectForm";
import SortableList from "./SortableList";
import { iconBtn } from "./fields";

/** Database errors in words the admin can act on. */
function explain(e: unknown) {
  const err = e as { code?: string; message?: string };
  if (err.code === "23505") return "Another project already uses this web address.";
  if (err.code === "42P01" || err.code === "PGRST205" || /does not exist|could not find the table/i.test(err.message ?? ""))
    return "The projects table doesn't exist yet. Run supabase/setup.sql in Supabase's SQL Editor (see supabase/README.md).";
  if (err.code === "42501" || /row-level security/i.test(err.message ?? "")) return "This account isn't allowed to make changes.";
  return err.message ?? "Something went wrong.";
}

export default function ProjectsManager() {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: [...PROJECTS_KEY, "admin"], queryFn: fetchProjectRows });
  const rows = query.data ?? [];
  const [editing, setEditing] = useState<ProjectRow | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false); // reordering or showing/hiding
  const [toDelete, setToDelete] = useState<ProjectRow | null>(null);

  // Refreshes the admin list and the site's own copy of the projects
  const refresh = () => qc.invalidateQueries({ queryKey: PROJECTS_KEY });

  const openForm = (row: ProjectRow | null) => {
    setEditing(row);
    setFormOpen(true);
  };

  const save = async (values: ProjectInput) => {
    setSaving(true);
    try {
      if (editing) await updateProject(editing.id, values);
      else await createProject(values, rows.length ? Math.max(...rows.map((r) => r.sort_order)) + 1 : 0);
      toast.success(editing ? "Project saved" : "Project added", {
        description: values.published ? "The site shows the change straight away." : "It's hidden from the site until you turn on “Show on the site”.",
      });
      setFormOpen(false);
      await refresh();
    } catch (e) {
      toast.error("Could not save the project", { description: explain(e) });
    } finally {
      setSaving(false);
    }
  };

  const reorder = async (ids: number[]) => {
    setBusy(true);
    try {
      await saveOrder(ids, rows);
      toast.success("New order saved");
    } catch (e) {
      toast.error("Could not save the order", { description: explain(e) });
    } finally {
      await refresh();
      setBusy(false);
    }
  };

  const togglePublished = async (row: ProjectRow) => {
    setBusy(true);
    try {
      await updateProject(row.id, { published: !row.published });
      toast.success(row.published ? `“${row.data.title}” is hidden from the site` : `“${row.data.title}” is on the site`);
    } catch (e) {
      toast.error("Could not change it", { description: explain(e) });
    } finally {
      await refresh();
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteProject(toDelete.id);
      toast.success("Project deleted");
      await refresh();
    } catch (e) {
      toast.error("Could not delete it", { description: explain(e) });
    } finally {
      setToDelete(null);
    }
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <p className="flex items-center gap-2 text-sm text-subtle">
          {rows.length} {rows.length === 1 ? "project" : "projects"} · drag or use the arrows to reorder
          {busy && <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-text" />}
        </p>
        <button onClick={() => openForm(null)} className="btn btn-primary px-5 py-2.5 text-sm">
          <Plus className="h-4 w-4" /> Add project
        </button>
      </div>

      {query.isLoading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-[76px] animate-pulse rounded-[1.25rem] bg-raised" />
          ))}
        </div>
      ) : query.isError ? (
        <div className="card border-red-500/30 p-6 text-sm text-red-500">Couldn't load the projects. {explain(query.error)}</div>
      ) : rows.length === 0 ? (
        <div className="card flex flex-col items-center p-12 text-center">
          <p className="font-display text-lg font-bold">No projects yet</p>
          <p className="mt-1 max-w-sm text-sm text-subtle">The site's Projects pages stay empty until you add one.</p>
          <button onClick={() => openForm(null)} className="btn btn-primary mt-5 px-5 py-2.5 text-sm">
            <Plus className="h-4 w-4" /> Add your first project
          </button>
        </div>
      ) : (
        <SortableList<ProjectRow>
          rows={rows}
          disabled={busy}
          onEdit={openForm}
          onDelete={setToDelete}
          onReorder={reorder}
          actions={(r) => (
            <>
              {r.published && (
                <a href={projectPath(r)} target="_blank" rel="noreferrer" className={`${iconBtn} hover:text-brand-text`} aria-label="View on the site" title="View on the site">
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              <button
                onClick={() => togglePublished(r)}
                disabled={busy}
                className={`${iconBtn} hover:text-brand-text`}
                aria-label={r.published ? "Hide from the site" : "Show on the site"}
                title={r.published ? "Hide from the site" : "Show on the site"}
              >
                {r.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </>
          )}
          render={(r) => (
            <div className="flex items-center gap-4">
              <div className="h-12 w-[4.5rem] shrink-0 overflow-hidden rounded-xl bg-raised">
                {r.data.image && <img src={r.data.image} alt="" className={`h-full w-full object-cover ${r.published ? "" : "opacity-40 grayscale"}`} />}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`truncate font-display font-bold ${r.published ? "" : "text-subtle"}`}>{r.data.title}</span>
                  {r.data.featured && <span className="eyebrow px-2 py-0.5 text-[10px]">Featured</span>}
                  {!r.published && <span className="chip px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">Hidden</span>}
                </div>
                <div className="mt-0.5 truncate text-xs text-subtle">
                  {audienceTitle(r.data)} · {r.data.year} · /projects/{r.slug}
                </div>
              </div>
            </div>
          )}
        />
      )}

      <ProjectForm
        open={formOpen}
        initial={editing}
        takenSlugs={rows.filter((r) => r.id !== editing?.id).map((r) => r.slug)}
        saving={saving}
        onClose={() => setFormOpen(false)}
        onSave={save}
      />

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent className="site-root rounded-[1.25rem] border-line bg-surface text-ink">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-ink">Delete this project?</AlertDialogTitle>
            <AlertDialogDescription className="text-ink-2">
              “{toDelete?.data.title}” will be removed from the site and the database. This can't be undone — to take it off the site for now, hide it instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {/* These build on the shared button styles, so their colours are set here to match the site */}
            <AlertDialogCancel className="btn h-auto rounded-full border-line bg-surface px-5 py-2.5 text-sm text-ink hover:bg-raised hover:text-ink focus-visible:ring-brand focus-visible:ring-offset-surface">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="btn h-auto rounded-full bg-red-600 px-5 py-2.5 text-sm text-white hover:bg-red-700 focus-visible:ring-red-600 focus-visible:ring-offset-surface"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
