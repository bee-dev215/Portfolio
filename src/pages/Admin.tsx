import { ComponentType, ReactNode, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { DatabaseZap, ExternalLink, FolderKanban, Images, Inbox, Loader2, LogOut, LucideIcon, ShieldAlert, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { isAdmin } from "@/lib/adminApi";
import { company } from "@/data/company";
import { Monogram } from "@/components/site/Navbar";
import ThemeToggle from "@/components/site/ThemeToggle";
import AdminLogin from "@/components/admin/AdminLogin";
import MessagesInbox, { useInbox } from "@/components/admin/MessagesInbox";
import PhotosManager from "@/components/admin/PhotosManager";
import ProjectsManager from "@/components/admin/ProjectsManager";
import TeamManager from "@/components/admin/TeamManager";

// The admin's sections, each at /admin/<key>; the first one is /admin itself
const SECTIONS: { key: string; label: string; icon: LucideIcon; intro: string; body: ComponentType }[] = [
  {
    key: "messages",
    label: "Messages",
    icon: Inbox,
    intro: "What visitors sent through the contact form, newest first. Opening a message marks it as read; new ones appear here within a minute.",
    body: MessagesInbox,
  },
  {
    key: "projects",
    label: "Projects",
    icon: FolderKanban,
    intro: "The case studies on the site. Saved changes show on the site straight away, in the order listed here; featured projects lead on the home page.",
    body: ProjectsManager,
  },
  {
    key: "team",
    label: "Team",
    icon: Users,
    intro: "The people on the Team page, the home page and About, in the order listed here.",
    body: TeamManager,
  },
  {
    key: "photos",
    label: "Site photos",
    icon: Images,
    intro: "The photos built into the site's pages. Replace one and it changes everywhere it appears; the original can always be brought back.",
    body: PhotosManager,
  },
];

const signOut = () => supabase?.auth.signOut();

/** Page frame in the site's colours; the theme follows the site's light/dark choice. */
function Frame({ children }: { children: ReactNode }) {
  return <div className="site-root site-bg min-h-screen">{children}</div>;
}

/** A centred card for the states before the dashboard: not connected, checking, not allowed. */
function Notice({ icon, title, children }: { icon: ReactNode; title: string; children?: ReactNode }) {
  return (
    <Frame>
      <div className="flex min-h-screen items-center justify-center px-5 py-16">
        <div className="card shadow-soft w-full max-w-md rounded-3xl p-8 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand-text">{icon}</div>
          <h1 className="mt-5 font-display text-xl font-bold">{title}</h1>
          {children}
        </div>
      </div>
    </Frame>
  );
}

function Dashboard({ email }: { email: string }) {
  const { section: key } = useParams();
  const section = SECTIONS.find((sec) => sec.key === (key ?? SECTIONS[0].key));
  const unread = useInbox().data?.filter((m) => m.status === "new").length ?? 0;

  useEffect(() => {
    document.title = `${unread ? `(${unread}) ` : ""}${section?.label ?? "Admin"} — ${company.shortName} admin`;
  }, [unread, section]);

  if (!section) return <Navigate to="/admin" replace />;
  const Body = section.body;

  return (
    <Frame>
      <header className="glass sticky top-0 z-40 border-b border-line">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5 sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Monogram />
            <div className="min-w-0">
              <div className="font-display text-sm font-bold">{company.shortName} admin</div>
              <div className="truncate text-xs text-subtle">{email}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" target="_blank" className="btn btn-secondary hidden px-4 py-2 text-sm sm:inline-flex">
              <ExternalLink className="h-4 w-4" /> View site
            </Link>
            <ThemeToggle />
            <button onClick={signOut} className="btn btn-secondary px-4 py-2 text-sm hover:border-red-500/40 hover:text-red-500">
              <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
        <nav aria-label="Admin sections" className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-3 sm:px-6">
          {SECTIONS.map(({ key: k, label, icon: Icon }, i) => (
            <Link
              key={k}
              to={i === 0 ? "/admin" : `/admin/${k}`}
              aria-current={k === section.key ? "page" : undefined}
              className={`relative flex shrink-0 items-center gap-2 px-3 py-3 text-sm font-semibold transition-colors ${
                k === section.key ? "text-ink after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-grad" : "text-subtle hover:text-ink"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
              {k === "messages" && unread > 0 && (
                <span className="bg-grad rounded-full px-1.5 py-px text-[11px] font-bold tabular-nums text-white">
                  {unread}
                  <span className="sr-only"> unread</span>
                </span>
              )}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-12">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{section.label}</h1>
        <p className="mt-2 max-w-2xl text-ink-2">{section.intro}</p>
        <div className="mt-9">
          <Body />
        </div>
      </main>
    </Frame>
  );
}

export default function Admin() {
  // undefined while the saved session is being read
  const [session, setSession] = useState<Session | null | undefined>(supabase ? undefined : null);

  useEffect(() => {
    document.title = `Admin — ${company.name}`; // the dashboard names its section instead
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  const userId = session?.user.id;
  const admin = useQuery({ queryKey: ["is-admin", userId], queryFn: isAdmin, enabled: Boolean(userId), staleTime: Infinity, retry: false });

  if (!supabase) {
    return (
      <Notice icon={<DatabaseZap className="h-6 w-6" />} title="The admin isn't connected yet">
        <p className="mt-2 text-sm leading-relaxed text-ink-2">
          Set up the database with the steps in <span className="font-code text-ink">supabase/README.md</span>, then add its address and key to{" "}
          <span className="font-code text-ink">src/lib/supabase.ts</span>. Until then the site shows its built-in projects.
        </p>
        <Link to="/" className="btn btn-secondary mt-6 px-5 py-2.5 text-sm">
          Back to site
        </Link>
      </Notice>
    );
  }

  if (session === undefined || (session && admin.isLoading)) {
    return (
      <Frame>
        <div className="grid min-h-screen place-items-center" role="status">
          <Loader2 className="h-6 w-6 animate-spin text-brand-text" />
          <span className="sr-only">Loading…</span>
        </div>
      </Frame>
    );
  }

  if (!session) {
    return (
      <Frame>
        <AdminLogin />
      </Frame>
    );
  }

  if (!admin.data) {
    const email = session.user.email ?? "This account";
    return (
      <Notice icon={<ShieldAlert className="h-6 w-6" />} title={admin.isError ? "Couldn't check your access" : "Not an admin"}>
        <p className="mt-2 text-sm leading-relaxed text-ink-2">
          {admin.isError
            ? `${(admin.error as Error).message}. Has supabase/setup.sql been run in Supabase's SQL Editor?`
            : `${email} can sign in but can't edit this site. Only emails listed in the database's admins table can.`}
        </p>
        <button onClick={signOut} className="btn btn-secondary mt-6 px-5 py-2.5 text-sm">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </Notice>
    );
  }

  return <Dashboard email={session.user.email ?? ""} />;
}
