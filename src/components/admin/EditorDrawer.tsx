import { FormEvent, ReactNode, useEffect } from "react";
import { Loader2, X } from "lucide-react";

/** A form that slides in from the right, with Cancel and Save pinned to the bottom. */
export default function EditorDrawer({
  open,
  title,
  subtitle,
  saving,
  status,
  onClose,
  onSubmit,
  children,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  saving: boolean;
  status?: ReactNode; // a short message beside the buttons, e.g. what still needs filling in
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
    <div className="fixed inset-0 z-[100] flex justify-end" role="dialog" aria-modal="true" aria-labelledby="editor-title">
      <div className="absolute inset-0 animate-fade-in bg-black/50 backdrop-blur-sm" onClick={() => !saving && onClose()} />
      <form onSubmit={onSubmit} noValidate className="relative flex h-full w-full max-w-3xl animate-slide-in flex-col border-l border-line bg-canvas shadow-soft">
        <div className="flex items-start justify-between gap-4 border-b border-line bg-surface px-5 py-5 sm:px-8">
          <div className="min-w-0">
            <h2 id="editor-title" className="font-display text-xl font-bold">
              {title}
            </h2>
            {subtitle && <p className="mt-0.5 truncate text-sm text-subtle">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} disabled={saving} className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-subtle hover:bg-raised hover:text-ink" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 space-y-7 overflow-y-auto px-5 py-7 sm:px-8">{children}</div>
        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line bg-surface px-5 py-4 sm:flex-nowrap sm:px-8">
          {status && (
            <p role="alert" className="w-full text-sm font-medium text-red-500 sm:mr-auto sm:w-auto">
              {status}
            </p>
          )}
          <button type="button" onClick={onClose} disabled={saving} className="btn btn-secondary px-5 py-2.5 text-sm">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="btn btn-primary px-6 py-2.5 text-sm disabled:opacity-60">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
