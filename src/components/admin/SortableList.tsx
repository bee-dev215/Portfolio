import { ReactNode, useEffect, useState } from "react";
import { ArrowDown, ArrowUp, GripVertical, Pencil, Trash2 } from "lucide-react";

interface Item {
  id: number;
  sort_order: number;
}

export default function SortableList<T extends Item>({
  rows,
  render,
  onEdit,
  onDelete,
  onReorder,
  disabled,
}: {
  rows: T[];
  render: (row: T) => ReactNode;
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
    <ul className="space-y-2">
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
          className={`group flex items-center gap-3 rounded-xl border bg-zinc-900/50 p-3 transition ${
            overId === row.id && dragId !== row.id ? "border-emerald-400/60 bg-emerald-400/5" : "border-white/10 hover:border-white/20"
          } ${dragId === row.id ? "opacity-40" : ""}`}
        >
          <span className="cursor-grab text-zinc-600 active:cursor-grabbing" title="Drag to reorder">
            <GripVertical className="h-5 w-5" />
          </span>
          <span className="w-6 shrink-0 text-center font-mono text-xs text-zinc-600">{String(i + 1).padStart(2, "0")}</span>
          <div className="min-w-0 flex-1">{render(row)}</div>
          <div className="flex shrink-0 items-center gap-0.5">
            <button onClick={() => move(i, -1)} disabled={disabled || i === 0} className="grid h-8 w-8 place-items-center rounded-lg text-zinc-500 hover:bg-white/5 hover:text-white disabled:opacity-30" aria-label="Move up">
              <ArrowUp className="h-4 w-4" />
            </button>
            <button onClick={() => move(i, 1)} disabled={disabled || i === order.length - 1} className="grid h-8 w-8 place-items-center rounded-lg text-zinc-500 hover:bg-white/5 hover:text-white disabled:opacity-30" aria-label="Move down">
              <ArrowDown className="h-4 w-4" />
            </button>
            <button onClick={() => onEdit(row)} className="grid h-8 w-8 place-items-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-emerald-300" aria-label="Edit">
              <Pencil className="h-4 w-4" />
            </button>
            <button onClick={() => onDelete(row)} className="grid h-8 w-8 place-items-center rounded-lg text-zinc-400 hover:bg-red-500/10 hover:text-red-400" aria-label="Delete">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
