import { ReactNode, useEffect, useState } from "react";
import { ArrowDown, ArrowUp, GripVertical, Pencil, Trash2 } from "lucide-react";
import { iconBtn } from "./fields";

/** Rows that can be dragged (or moved with the arrows) into a new order, each with its own actions. */
export default function SortableList<T extends { id: number }>({
  rows,
  render,
  actions,
  onEdit,
  onDelete,
  onReorder,
  disabled,
}: {
  rows: T[];
  render: (row: T) => ReactNode;
  actions?: (row: T) => ReactNode; // extra buttons before Edit and Delete
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
  onReorder: (ids: number[]) => void;
  disabled?: boolean;
}) {
  const [order, setOrder] = useState<T[]>(rows);
  const [dragId, setDragId] = useState<number | null>(null);
  const [overId, setOverId] = useState<number | null>(null);

  useEffect(() => setOrder(rows), [rows]);

  const commit = (next: T[]) => {
    setOrder(next);
    onReorder(next.map((r) => r.id));
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    commit(next);
  };

  const drop = (targetId: number) => {
    if (dragId === null || dragId === targetId) return;
    const from = order.findIndex((r) => r.id === dragId);
    const to = order.findIndex((r) => r.id === targetId);
    const next = [...order];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    commit(next);
  };

  return (
    <ul className="space-y-2.5">
      {order.map((row, i) => (
        <li
          key={row.id}
          draggable={!disabled}
          onDragStart={() => setDragId(row.id)}
          onDragOver={(e) => {
            e.preventDefault();
            setOverId(row.id);
          }}
          onDragLeave={() => setOverId((o) => (o === row.id ? null : o))}
          onDrop={(e) => {
            e.preventDefault();
            drop(row.id);
            setDragId(null);
            setOverId(null);
          }}
          onDragEnd={() => {
            setDragId(null);
            setOverId(null);
          }}
          className={`card flex flex-wrap items-center gap-3 p-3 transition-colors sm:flex-nowrap ${overId === row.id && dragId !== row.id ? "border-brand/60 bg-brand-soft" : ""} ${
            dragId === row.id ? "opacity-40" : ""
          }`}
        >
          <span className="hidden cursor-grab text-subtle active:cursor-grabbing sm:block" title="Drag to reorder">
            <GripVertical className="h-5 w-5" />
          </span>
          <span className="w-6 shrink-0 text-center font-code text-xs text-subtle">{String(i + 1).padStart(2, "0")}</span>
          <div className="min-w-0 flex-1">{render(row)}</div>
          <div className="flex w-full shrink-0 items-center justify-end gap-0.5 sm:w-auto">
            <button onClick={() => move(i, -1)} disabled={disabled || i === 0} className={iconBtn} aria-label="Move up">
              <ArrowUp className="h-4 w-4" />
            </button>
            <button onClick={() => move(i, 1)} disabled={disabled || i === order.length - 1} className={iconBtn} aria-label="Move down">
              <ArrowDown className="h-4 w-4" />
            </button>
            {actions?.(row)}
            <button onClick={() => onEdit(row)} className={`${iconBtn} hover:text-brand-text`} aria-label="Edit" title="Edit">
              <Pencil className="h-4 w-4" />
            </button>
            <button onClick={() => onDelete(row)} className={`${iconBtn} hover:bg-red-500/10 hover:text-red-500`} aria-label="Delete" title="Delete">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
