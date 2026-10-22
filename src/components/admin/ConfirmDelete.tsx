import { ReactNode } from "react";
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

/** Asks before something is deleted for good. Open while `open` is true; closing any way calls onCancel. */
export default function ConfirmDelete({
  open,
  title,
  children,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  children: ReactNode; // what will be lost
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <AlertDialogContent className="site-root rounded-[1.25rem] border-line bg-surface text-ink">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display text-ink">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-ink-2">{children}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* These build on the shared button styles, so their colours are set here to match the site */}
          <AlertDialogCancel className="btn h-auto rounded-full border-line bg-surface px-5 py-2.5 text-sm text-ink hover:bg-raised hover:text-ink focus-visible:ring-brand focus-visible:ring-offset-surface">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="btn h-auto rounded-full bg-red-600 px-5 py-2.5 text-sm text-white hover:bg-red-700 focus-visible:ring-red-600 focus-visible:ring-offset-surface"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
