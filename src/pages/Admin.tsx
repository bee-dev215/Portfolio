import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Loader2, LogOut, ShieldAlert } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { adminExists, claimAdmin, isCurrentUserAdmin, PROJECTS_TABLE, ProjectInput, ProjectRow } from "@/lib/portfolioApi";
import { PROJECTS_KEY, useProjectRows } from "@/hooks/usePortfolioData";
import { company } from "@/data/company";
import AdminLogin from "@/components/admin/AdminLogin";
import CollectionManager from "@/components/admin/CollectionManager";
import ProjectForm from "@/components/admin/ProjectForm";

type Status = "loading" | "signed-out" | "setup" | "not-admin" | "admin";

function Dashboard({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  const projectsQ = useProjectRows();

  return (
    <div className="pf-root min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <img src="/favicon.svg" alt="" className="h-9 w-9" />
            <div>
              <div className="text-sm font-semibold text-white">{company.legalName} Admin</div>
              <div className="text-xs text-zinc-500">{email}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" target="_blank" className="hidden items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-300 hover:border-white/30 hover:text-white sm:inline-flex">
              <ExternalLink className="h-4 w-4" /> View site
            </Link>
            <button onClick={onSignOut} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-300 hover:border-red-400/40 hover:text-red-300">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight text-white">Projects</h1>
        <p className="mt-1 text-zinc-500">Project records are saved to the database. The public site's solutions are edited in src/data/company.ts.</p>

        <div className="mt-8">
          <CollectionManager<ProjectRow, ProjectInput>
            table={PROJECTS_TABLE}
            queryKey={PROJECTS_KEY}
            query={projectsQ}
            noun="Project"
            getLabel={(r) => r.title}
            Form={ProjectForm}
            render={(r) => (
              <div className="flex items-center gap-4">
                <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-white/5">
                  {r.image_url && <img src={r.image_url} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0">
                  <div className="truncate font-medium text-white">{r.title}</div>
                  <div className="mt-0.5 flex flex-wrap gap-x-2 text-xs text-zinc-500">
                    <span className="text-emerald-400">{r.category}</span>
                    <span>{r.year}</span>
                    <span className="hidden truncate sm:inline">{r.tech.slice(0, 4).join(" · ")}</span>
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      </main>
    </div>
  );
}

export default function Admin() {
  const [status, setStatus] = useState<Status>("loading");
  const [email, setEmail] = useState("");
  const [claiming, setClaiming] = useState(false);

  const evaluate = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    try {
      const exists = await adminExists();
      if (!session) {
        setStatus(exists ? "signed-out" : "setup");
        return;
      }
      setEmail(session.user.email ?? "");
      if (await isCurrentUserAdmin()) setStatus("admin");
      else setStatus(exists ? "not-admin" : "setup");
    } catch {
      setStatus(session ? "not-admin" : "signed-out");
    }
  }, []);

  useEffect(() => {
    evaluate();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") setStatus("signed-out");
    });
    return () => sub.subscription.unsubscribe();
  }, [evaluate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setEmail("");
    evaluate();
  };

  const claim = async () => {
    setClaiming(true);
    try {
      await claimAdmin();
    } finally {
      setClaiming(false);
      evaluate();
    }
  };

  if (status === "loading") {
    return (
      <div className="pf-root flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
      </div>
    );
  }

  if (status === "admin") return <Dashboard email={email} onSignOut={signOut} />;

  if (status === "not-admin" || (status === "setup" && email)) {
    return (
      <div className="pf-root flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-8 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-amber-400/10 text-amber-300">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-xl font-semibold text-white">{status === "setup" ? "Finish admin setup" : "Not authorized"}</h1>
          <p className="mt-2 text-sm text-zinc-400">
            {status === "setup"
              ? `Signed in as ${email}. No admin exists yet — claim admin access for this account.`
              : `${email} does not have admin access to this site.`}
          </p>
          <div className="mt-6 flex flex-col gap-2">
            {status === "setup" && (
              <button onClick={claim} disabled={claiming} className="flex items-center justify-center gap-2 rounded-lg bg-emerald-400 py-2.5 text-sm font-medium text-zinc-950 hover:bg-emerald-300 disabled:opacity-60">
                {claiming && <Loader2 className="h-4 w-4 animate-spin" />} Claim admin access
              </button>
            )}
            <button onClick={signOut} className="rounded-lg border border-white/10 py-2.5 text-sm text-zinc-300 hover:text-white">
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <AdminLogin setupMode={status === "setup"} onAuthed={evaluate} />;
}
