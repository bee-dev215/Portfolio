import { FormEvent, ReactNode, useEffect } from "react";
import { Loader2, X } from "lucide-react";

export default function EditorDrawer({
  open,
  title,
  subtitle,
  saving,
  onClose,
  onSubmit,
  children,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  saving: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !saving && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, saving, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 animate-fade-in bg-black/70 backdrop-blur-sm" onClick={() => !saving && onClose()} />
      <form onSubmit={onSubmit} noValidate className="relative flex h-full w-full max-w-2xl animate-slide-in flex-col border-l border-white/10 bg-zinc-950">
        <div className="flex items-start justify-between border-b border-white/10 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            {subtitle && <p className="mt-0.5 text-sm text-zinc-500">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} disabled={saving} className="grid h-9 w-9 place-items-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-white" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">{children}</div>
        <div className="flex justify-end gap-2 border-t border-white/10 px-6 py-4">
          <button type="button" onClick={onClose} disabled={saving} className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-zinc-300 hover:border-white/30 hover:text-white">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-5 py-2.5 text-sm font-medium text-zinc-950 hover:bg-emerald-300 disabled:opacity-60">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
