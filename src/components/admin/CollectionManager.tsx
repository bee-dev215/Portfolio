import { ComponentType, ReactNode, useState } from "react";
import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
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
import { createRow, deleteRow, saveOrder, updateRow } from "@/lib/portfolioApi";
import SortableList from "./SortableList";

type Table = Parameters<typeof deleteRow>[0];

export interface FormProps<Row, Input> {
  open: boolean;
  initial: Row | null;
  saving: boolean;
  onClose: () => void;
  onSave: (values: Input) => void;
}

interface QueryLike<Row> {
  data?: Row[];
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
}

export default function CollectionManager<Row extends { id: number; sort_order: number }, Input extends object>({
  table,
  queryKey,
  query,
  noun,
  render,
  getLabel,
  Form,
}: {
  table: Table;
  queryKey: QueryKey;
  query: QueryLike<Row>;
  noun: string;
  render: (row: Row) => ReactNode;
  getLabel: (row: Row) => string;
  Form: ComponentType<FormProps<Row, Input>>;
}) {
  const qc = useQueryClient();
  const rows = query.data ?? [];
  const [editing, setEditing] = useState<Row | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [toDelete, setToDelete] = useState<Row | null>(null);

  const refresh = () => qc.invalidateQueries({ queryKey });

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const save = async (values: Input) => {
    setSaving(true);
    try {
      if (editing) {
        await updateRow(table, editing.id, values);
        toast.success(`${noun} updated`);
      } else {
        const nextOrder = rows.length ? Math.max(...rows.map((r) => r.sort_order)) + 1 : 0;
        await createRow(table, values, nextOrder);
        toast.success(`${noun} added`);
      }
      setFormOpen(false);
      await refresh();
    } catch (e) {
      toast.error(`Could not save ${noun.toLowerCase()}`, { description: (e as Error).message });
    } finally {
      setSaving(false);
    }
  };

  const reorder = async (ids: number[]) => {
    setReordering(true);
    try {
      await saveOrder(table, ids, rows);
      toast.success("Order saved");
    } catch (e) {
      toast.error("Could not save order", { description: (e as Error).message });
    } finally {
      await refresh();
      setReordering(false);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteRow(table, toDelete.id);
      toast.success(`${noun} deleted`);
      await refresh();
    } catch (e) {
      toast.error("Delete failed", { description: (e as Error).message });
    } finally {
      setToDelete(null);
    }
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="flex items-center gap-2 text-sm text-zinc-500">
          {rows.length} {rows.length === 1 ? noun.toLowerCase() : `${noun.toLowerCase()}s`} · drag or use arrows to reorder
          {reordering && <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" />}
        </p>
        <button onClick={openNew} className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-4 py-2.5 text-sm font-medium text-zinc-950 hover:bg-emerald-300">
          <Plus className="h-4 w-4" /> Add {noun.toLowerCase()}
        </button>
      </div>

      {query.isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[72px] animate-pulse rounded-xl border border-white/10 bg-white/[0.02]" />
          ))}
        </div>
      ) : query.isError ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6 text-sm text-red-300">
          Failed to load: {(query.error as Error)?.message}
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/15 p-12 text-center">
          <p className="text-white">No {noun.toLowerCase()}s yet</p>
          <button onClick={openNew} className="mt-3 text-sm text-emerald-400 hover:text-emerald-300">
            Add your first {noun.toLowerCase()}
          </button>
        </div>
      ) : (
        <SortableList
          rows={rows}
          render={render}
          disabled={reordering}
          onEdit={(r) => {
            setEditing(r);
            setFormOpen(true);
          }}
          onDelete={setToDelete}
          onReorder={reorder}
        />
      )}

      <Form open={formOpen} initial={editing} saving={saving} onClose={() => setFormOpen(false)} onSave={save} />

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent className="border-white/10 bg-zinc-950 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this {noun.toLowerCase()}?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              "{toDelete ? getLabel(toDelete) : ""}" will be permanently removed from your portfolio.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 bg-transparent text-zinc-300 hover:bg-white/5 hover:text-white">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 text-white hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
