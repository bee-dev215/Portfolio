import { ReactNode, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format, formatDistanceToNow, isThisYear, isToday } from "date-fns";
import { Archive, ArrowLeft, Copy, Inbox, LucideIcon, Mail, MailOpen, MessageSquare, Phone, Reply, Search, Tag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { company } from "@/data/company";
import { explain } from "@/lib/adminApi";
import { deleteMessage, fetchMessages, MESSAGES_KEY, MessageRow, MessageStatus, setMessageStatus } from "@/lib/messagesApi";
import ConfirmDelete from "./ConfirmDelete";

type View = "inbox" | "archived";

/** Every message, checked again each minute so new ones turn up while the admin is open. */
export const useInbox = () => useQuery({ queryKey: MESSAGES_KEY, queryFn: fetchMessages, refetchInterval: 60_000 });

// A time today, a date this year, or a full date
function shortDate(iso: string) {
  const d = new Date(iso);
  return format(d, isToday(d) ? "HH:mm" : isThisYear(d) ? "d MMM" : "d MMM yyyy");
}

function Detail({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <Icon className="h-4 w-4 shrink-0 text-subtle" aria-hidden="true" />
      <dt className="sr-only">{label}</dt>
      <dd className="flex min-w-0 items-center gap-1.5 text-ink-2">{children}</dd>
    </div>
  );
}

function MessageView({ m, onBack, onStatus, onDelete }: { m: MessageRow; onBack: () => void; onStatus: (s: MessageStatus) => void; onDelete: () => void }) {
  const archived = m.status === "archived";
  const sent = new Date(m.created_at);
  const reply = `mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.topic ?? "Your enquiry"} — ${company.shortName}`)}&body=${encodeURIComponent(`Hi ${m.name.split(/\s+/)[0]},\n\n`)}`;

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(m.email);
      toast.success("Email address copied");
    } catch {
      toast.error("Couldn't copy — select the address instead");
    }
  };

  return (
    <article className="card overflow-hidden">
      <header className="border-b border-line p-5 sm:p-6">
        <button onClick={onBack} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-text lg:hidden">
          <ArrowLeft className="h-4 w-4" /> All messages
        </button>
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
          <div className="min-w-0">
            <h2 className="break-words font-display text-xl font-bold">{m.name}</h2>
            {m.organisation && <p className="mt-0.5 text-sm text-ink-2">{m.organisation}</p>}
          </div>
          <time dateTime={m.created_at} className="text-sm text-subtle" title={format(sent, "EEEE d MMMM yyyy, HH:mm")}>
            {format(sent, "d MMM yyyy, HH:mm")} · {formatDistanceToNow(sent, { addSuffix: true })}
          </time>
        </div>
        <dl className="mt-5 grid gap-x-6 gap-y-2.5 text-sm sm:grid-cols-2">
          <Detail icon={Mail} label="Email">
            <a href={`mailto:${m.email}`} className="truncate hover:text-brand-text">
              {m.email}
            </a>
            <button onClick={copyEmail} className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-subtle hover:bg-raised hover:text-ink" aria-label="Copy email address" title="Copy">
              <Copy className="h-3.5 w-3.5" />
            </button>
          </Detail>
          {m.phone && (
            <Detail icon={Phone} label="Phone">
              <a href={`tel:${m.phone.replace(/[^\d+]/g, "")}`} className="truncate hover:text-brand-text">
                {m.phone}
              </a>
            </Detail>
          )}
          {m.topic && (
            <Detail icon={Tag} label="Topic">
              {m.topic}
            </Detail>
          )}
          <Detail icon={MessageSquare} label="SMS updates">
            {m.sms_opt_in ? "Agreed to SMS updates" : "No SMS updates"}
          </Detail>
        </dl>
      </header>

      <p className="whitespace-pre-wrap break-words p-5 text-[15px] leading-relaxed sm:p-6">{m.message}</p>

      <footer className="flex flex-wrap items-center gap-2 border-t border-line bg-raised/40 p-4 sm:px-6">
        <a href={reply} className="btn btn-primary px-5 py-2.5 text-sm">
          <Reply className="h-4 w-4" /> Reply by email
        </a>
        <button onClick={() => onStatus("new")} className="btn btn-secondary px-4 py-2.5 text-sm">
          <Mail className="h-4 w-4" /> Mark as unread
        </button>
        <button onClick={() => onStatus(archived ? "read" : "archived")} className="btn btn-secondary px-4 py-2.5 text-sm">
          {archived ? <Inbox className="h-4 w-4" /> : <Archive className="h-4 w-4" />} {archived ? "Move to inbox" : "Archive"}
        </button>
        <button onClick={onDelete} className="btn btn-secondary px-4 py-2.5 text-sm hover:border-red-500/40 hover:text-red-500 sm:ml-auto">
          <Trash2 className="h-4 w-4" /> Delete
        </button>
      </footer>
    </article>
  );
}

export default function MessagesInbox() {
  const qc = useQueryClient();
  const query = useInbox();
  const all = query.data ?? [];
  const [view, setView] = useState<View>("inbox");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);
  const [toDelete, setToDelete] = useState<MessageRow | null>(null);

  const inView = (v: View) => all.filter((m) => (m.status === "archived") === (v === "archived"));
  const q = search.trim().toLowerCase();
  const list = inView(view).filter((m) => !q || [m.name, m.email, m.organisation, m.topic, m.message].some((s) => s?.toLowerCase().includes(q)));
  const open = all.find((m) => m.id === openId) ?? null;

  // Shows the change straight away, then saves it; if saving fails, the list is read again
  const setStatus = async (m: MessageRow, status: MessageStatus) => {
    await qc.cancelQueries({ queryKey: MESSAGES_KEY });
    qc.setQueryData<MessageRow[]>(MESSAGES_KEY, (rows) => rows?.map((r) => (r.id === m.id ? { ...r, status } : r)));
    try {
      await setMessageStatus(m.id, status);
      return true;
    } catch (e) {
      toast.error("Could not update the message", { description: explain(e) });
      qc.invalidateQueries({ queryKey: MESSAGES_KEY });
      return false;
    }
  };

  const select = (m: MessageRow) => {
    setOpenId(m.id);
    if (m.status === "new") setStatus(m, "read");
    // On a phone the message replaces the list, so start at its top
    if (window.matchMedia("(max-width: 1023px)").matches) window.scrollTo({ top: 0 });
  };

  const changeStatus = async (m: MessageRow, status: MessageStatus) => {
    // Marked unread or filed away: back to the list
    setOpenId(null);
    if (!(await setStatus(m, status))) return;
    if (status === "archived") toast.success("Message archived", { action: { label: "Undo", onClick: () => setStatus(m, m.status) } });
    else if (m.status === "archived") toast.success("Moved to the inbox");
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteMessage(toDelete.id);
      qc.setQueryData<MessageRow[]>(MESSAGES_KEY, (rows) => rows?.filter((r) => r.id !== toDelete.id));
      if (openId === toDelete.id) setOpenId(null);
      toast.success("Message deleted");
    } catch (e) {
      toast.error("Could not delete it", { description: explain(e) });
    } finally {
      setToDelete(null);
    }
  };

  if (query.isLoading) {
    return (
      <div className="space-y-2.5">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-[1.25rem] bg-raised" />
        ))}
      </div>
    );
  }

  if (query.isError) return <div className="card border-red-500/30 p-6 text-sm text-red-500">Couldn't load the messages. {explain(query.error)}</div>;

  if (all.length === 0) {
    return (
      <div className="card flex flex-col items-center p-12 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand-text">
          <Inbox className="h-6 w-6" />
        </span>
        <p className="mt-4 font-display text-lg font-bold">No messages yet</p>
        <p className="mt-1 max-w-sm text-sm text-subtle">When someone sends the contact form on the site, their message appears here.</p>
      </div>
    );
  }

  const unread = all.filter((m) => m.status === "new").length;
  const views: { key: View; label: string; count: number }[] = [
    { key: "inbox", label: "Inbox", count: inView("inbox").length },
    { key: "archived", label: "Archived", count: inView("archived").length },
  ];

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Show" className="inline-flex gap-1 rounded-full border border-line bg-surface p-1">
          {views.map((v) => {
            const on = v.key === view;
            return (
              <button
                key={v.key}
                aria-pressed={on}
                onClick={() => {
                  setView(v.key);
                  setOpenId(null);
                }}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${on ? "bg-grad text-white" : "text-ink-2 hover:text-ink"}`}
              >
                {v.label}
                <span className={`rounded-full px-1.5 text-[11px] tabular-nums ${on ? "bg-white/20" : "bg-raised text-subtle"}`}>{v.count}</span>
              </button>
            );
          })}
        </div>
        <label className="relative w-full sm:w-72">
          <span className="sr-only">Search messages</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email or text" className="field py-2 pl-10 text-sm" />
        </label>
      </div>

      <p className="sr-only" aria-live="polite">
        {unread} unread
      </p>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,23rem)_minmax(0,1fr)]">
        <div className={open ? "hidden lg:block" : ""}>
          {list.length === 0 ? (
            <div className="card p-8 text-center text-sm text-subtle">
              {q ? `No messages match “${search.trim()}”.` : view === "inbox" ? "Nothing in the inbox. Archived messages are under Archived." : "No archived messages."}
            </div>
          ) : (
            <ul className="card divide-y divide-line overflow-hidden lg:max-h-[calc(100vh-15rem)] lg:overflow-y-auto">
              {list.map((m) => {
                const isNew = m.status === "new";
                return (
                  <li key={m.id}>
                    <button
                      onClick={() => select(m)}
                      aria-current={m.id === openId ? "true" : undefined}
                      className={`relative block w-full px-5 py-4 text-left transition-colors hover:bg-raised ${m.id === openId ? "bg-brand-soft hover:bg-brand-soft" : ""}`}
                    >
                      {isNew && (
                        <>
                          <span className="absolute left-2 top-[1.4rem] h-2 w-2 rounded-full bg-brand" aria-hidden="true" />
                          <span className="sr-only">Unread: </span>
                        </>
                      )}
                      <span className="flex items-baseline justify-between gap-3">
                        <span className={`truncate ${isNew ? "font-bold text-ink" : "font-medium text-ink-2"}`}>{m.name}</span>
                        <time dateTime={m.created_at} className={`shrink-0 text-xs ${isNew ? "font-semibold text-brand-text" : "text-subtle"}`}>
                          {shortDate(m.created_at)}
                        </time>
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-subtle">{[m.topic, m.organisation].filter(Boolean).join(" · ") || m.email}</span>
                      <span className={`mt-1.5 line-clamp-2 text-sm ${isNew ? "text-ink-2" : "text-subtle"}`}>{m.message}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className={`lg:sticky lg:top-36 ${open ? "" : "hidden lg:block"}`}>
          {open ? (
            <MessageView m={open} onBack={() => setOpenId(null)} onStatus={(s) => changeStatus(open, s)} onDelete={() => setToDelete(open)} />
          ) : (
            <div className="card flex flex-col items-center justify-center p-12 text-center text-subtle">
              <MailOpen className="h-8 w-8" />
              <p className="mt-3 text-sm">Choose a message to read it.</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDelete open={!!toDelete} title="Delete this message?" onCancel={() => setToDelete(null)} onConfirm={confirmDelete}>
        The message from {toDelete?.name} will be deleted from the database. This can't be undone — to keep it out of the inbox, archive it instead.
      </ConfirmDelete>
    </div>
  );
}
