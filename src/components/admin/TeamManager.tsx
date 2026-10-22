import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { explain, saveOrder } from "@/lib/adminApi";
import { createMember, deleteMember, fetchTeamRows, TEAM_KEY, TEAM_TABLE, TeamInput, TeamRow, updateMember } from "@/lib/teamApi";
import { initials } from "@/components/site/Team";
import ConfirmDelete from "./ConfirmDelete";
import SortableList from "./SortableList";
import TeamForm from "./TeamForm";
import { iconBtn } from "./fields";

export default function TeamManager() {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: [...TEAM_KEY, "admin"], queryFn: fetchTeamRows });
  const rows = query.data ?? [];
  const [editing, setEditing] = useState<TeamRow | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false); // reordering or showing/hiding
  const [toDelete, setToDelete] = useState<TeamRow | null>(null);

  // Refreshes the admin list and the site's own copy of the team
  const refresh = () => qc.invalidateQueries({ queryKey: TEAM_KEY });

  const openForm = (row: TeamRow | null) => {
    setEditing(row);
    setFormOpen(true);
  };

  const save = async (values: TeamInput) => {
    setSaving(true);
    try {
      if (editing) await updateMember(editing.id, values);
      else await createMember(values, rows.length ? Math.max(...rows.map((r) => r.sort_order)) + 1 : 0);
      toast.success(editing ? "Saved" : `${values.name} added`, {
        description: values.published ? "The site shows the change straight away." : "They're hidden from the site until you turn on “Show on the site”.",
      });
      setFormOpen(false);
      await refresh();
    } catch (e) {
      toast.error("Could not save", { description: explain(e) });
    } finally {
      setSaving(false);
    }
  };

  const reorder = async (ids: number[]) => {
    setBusy(true);
    try {
      await saveOrder(TEAM_TABLE, ids, rows);
      toast.success("New order saved");
    } catch (e) {
      toast.error("Could not save the order", { description: explain(e) });
    } finally {
      await refresh();
      setBusy(false);
    }
  };

  const togglePublished = async (row: TeamRow) => {
    setBusy(true);
    try {
      await updateMember(row.id, { published: !row.published });
      toast.success(row.published ? `${row.name} is hidden from the site` : `${row.name} is on the site`);
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
      await deleteMember(toDelete.id);
      toast.success(`${toDelete.name} removed`);
      await refresh();
    } catch (e) {
      toast.error("Could not delete them", { description: explain(e) });
    } finally {
      setToDelete(null);
    }
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <p className="flex items-center gap-2 text-sm text-subtle">
          {rows.length} {rows.length === 1 ? "person" : "people"} · drag or use the arrows to reorder
          {busy && <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-text" />}
        </p>
        <button onClick={() => openForm(null)} className="btn btn-primary px-5 py-2.5 text-sm">
          <Plus className="h-4 w-4" /> Add team member
        </button>
      </div>

      {query.isLoading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-[84px] animate-pulse rounded-[1.25rem] bg-raised" />
          ))}
        </div>
      ) : query.isError ? (
        <div className="card border-red-500/30 p-6 text-sm text-red-500">Couldn't load the team. {explain(query.error)}</div>
      ) : rows.length === 0 ? (
        <div className="card flex flex-col items-center p-12 text-center">
          <p className="font-display text-lg font-bold">No one on the team yet</p>
          <p className="mt-1 max-w-sm text-sm text-subtle">The Team page and the home page's team section stay empty until you add someone.</p>
          <button onClick={() => openForm(null)} className="btn btn-primary mt-5 px-5 py-2.5 text-sm">
            <Plus className="h-4 w-4" /> Add the first person
          </button>
        </div>
      ) : (
        <SortableList<TeamRow>
          rows={rows}
          disabled={busy}
          onEdit={openForm}
          onDelete={setToDelete}
          onReorder={reorder}
          actions={(r) => (
            <button
              onClick={() => togglePublished(r)}
              disabled={busy}
              className={`${iconBtn} hover:text-brand-text`}
              aria-label={r.published ? "Hide from the site" : "Show on the site"}
              title={r.published ? "Hide from the site" : "Show on the site"}
            >
              {r.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
          )}
          render={(r) => (
            <div className="flex items-center gap-4">
              <div className={`h-[60px] w-12 shrink-0 overflow-hidden rounded-xl bg-raised ${r.published ? "" : "opacity-40 grayscale"}`}>
                {r.photo ? (
                  <img src={r.photo} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="bg-grad grid h-full w-full place-items-center font-display text-sm font-bold text-white">{initials(r.name)}</div>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`truncate font-display font-bold ${r.published ? "" : "text-subtle"}`}>{r.name}</span>
                  {!r.published && <span className="chip px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">Hidden</span>}
                </div>
                <div className="mt-0.5 truncate text-xs text-subtle">
                  {r.role}
                  {r.focus?.length ? ` · ${r.focus.slice(0, 3).join(", ")}` : ""}
                </div>
              </div>
            </div>
          )}
        />
      )}

      <TeamForm open={formOpen} initial={editing} saving={saving} onClose={() => setFormOpen(false)} onSave={save} />

      <ConfirmDelete open={!!toDelete} title="Remove this person?" onCancel={() => setToDelete(null)} onConfirm={confirmDelete}>
        {toDelete?.name} will be removed from the site and the database. This can't be undone — to take them off the site for now, hide them instead.
      </ConfirmDelete>
    </div>
  );
}
