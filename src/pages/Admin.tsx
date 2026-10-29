import { ReactNode, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { DatabaseZap, ExternalLink, Loader2, LogOut, ShieldAlert } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { isAdmin } from "@/lib/adminApi";
import { company } from "@/data/company";
import { Monogram } from "@/components/site/Navbar";
import ThemeToggle from "@/components/site/ThemeToggle";
import AdminLogin from "@/components/admin/AdminLogin";
import MessagesInbox, { useInbox } from "@/components/admin/MessagesInbox";

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

/** The inbox: contact-form messages and booked calls, newest first. */
function Dashboard({ email }: { email: string }) {
  const { section } = useParams();
  const unread = useInbox().data?.filter((m) => m.status === "new").length ?? 0;

  useEffect(() => {
    document.title = `${unread ? `(${unread}) ` : ""}Messages — ${company.shortName} admin`;
  }, [unread]);

  // Older links went to /admin/<section>; the inbox is all there is now
  if (section) return <Navigate to="/admin" replace />;

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
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-12">
        <h1 className="flex items-center gap-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Messages
          {unread > 0 && (
            <span className="bg-grad rounded-full px-2.5 py-0.5 text-sm font-bold tabular-nums text-white">
              {unread}
              <span className="sr-only"> unread</span>
            </span>
          )}
        </h1>
        <p className="mt-2 max-w-2xl text-ink-2">
          What visitors sent through the contact form, and the calls they booked, newest first. Opening a message marks it as read; new ones appear here within a minute.
        </p>
        <div className="mt-9">
          <MessagesInbox />
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
          <span className="font-code text-ink">src/lib/supabase.ts</span>. Until then, messages and booked calls still reach you by email.
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
