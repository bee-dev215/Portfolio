import { Loader2 } from "lucide-react";
import PageShell from "@/components/site/PageShell";

/** Stands in for a projects page while the projects load. */
export default function ProjectsLoading({ title }: { title: string }) {
  return (
    <PageShell title={title}>
      <div className="grid min-h-[70vh] place-items-center" role="status">
        <Loader2 className="h-7 w-7 animate-spin text-brand-text" />
        <span className="sr-only">Loading projects…</span>
      </div>
    </PageShell>
  );
}
