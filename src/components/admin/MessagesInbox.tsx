import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format, formatDistanceToNow, isThisYear, isToday } from "date-fns";
import { Archive, ArrowDown, ArrowLeft, ArrowUp, ArrowUpDown, Copy, Download, Inbox, LayoutList, Loader2, LucideIcon, Mail, MailOpen, MessageSquare, Phone, Reply, Search, Send, Table2, Tag, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { company } from "@/data/company";
import { explain } from "@/lib/adminApi";
import { downloadCsv } from "@/lib/csv";
import { deleteMessage, fetchMessages, MESSAGES_KEY, MessageRow, MessageStatus, ReplyRow, sendReply, setMessageStatus } from "@/lib/messagesApi";
import ConfirmDelete from "./ConfirmDelete";

type View = "inbox" | "archived";
type Layout = "list" | "table";
type SortKey = "created_at" | "name" | "organisation" | "topic";
type Sort = { key: SortKey; dir: "asc" | "desc" };

const LAYOUT_KEY = "gsedu-admin-messages-layout";
const STATUS_LABEL: Record<MessageStatus, string> = { new: "Unread", read: "Read", archived: "Archived" };

// The layout is remembered in this browser; storage can be unavailable (private windows), so it falls back to the list
function savedLayout(): Layout {
  try {
    return localStorage.getItem(LAYOUT_KEY) === "table" ? "table" : "list";
  } catch {
    return "list";
  }
}

/** Every message, checked again each minute so new ones turn up while the admin is open. */
export const useInbox = () => useQuery({ queryKey: MESSAGES_KEY, queryFn: fetchMessages, refetchInterval: 60_000 });

// A time today, a date this year, or a full date
function shortDate(iso: string) {
  const d = new Date(iso);
  return format(d, isToday(d) ? "HH:mm" : isThisYear(d) ? "d MMM" : "d MMM yyyy");
}

/** Downloads messages as a spreadsheet, one row each, in the order given. */
function exportCsv(rows: MessageRow[], view: View) {
  downloadCsv(
    `${company.shortName.toLowerCase()}-messages${view === "archived" ? "-archived" : ""}-${format(new Date(), "yyyy-MM-dd")}.csv`,
    ["Received", "Name", "Email", "Organisation", "Phone", "Topic", "Message", "SMS updates", "Status", "Replies", "Last reply"],
    rows.map((m) => {
      const last = m.replies[m.replies.length - 1];
      return [
        format(new Date(m.created_at), "yyyy-MM-dd HH:mm"),
        m.name,
        m.email,
        m.organisation,
        m.phone,
        m.topic,
        m.message,
        m.sms_opt_in ? "Yes" : "No",
        STATUS_LABEL[m.status],
        m.replies.length,
        last ? format(new Date(last.created_at), "yyyy-MM-dd HH:mm") : "",
      ];
    }),
  );
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

// Where a reply can be finished by hand if sending from here fails: Gmail for a Gmail address, else the email app
const composeLink = (to: string, subject: string, body: string) =>
  company.email.endsWith("@gmail.com")
    ? `https://mail.google.com/mail/?authuser=${encodeURIComponent(company.email)}&view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    : `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

/** Writes and sends a reply by email; it goes from the company's address, with their message quoted underneath. */
function ReplyBox({ m, onSent, onClose }: { m: MessageRow; onSent: (reply?: ReplyRow) => void; onClose: () => void }) {
  const greeting = `Hi ${m.name.split(/\s+/)[0]},\n\n`;
  const draft = `${greeting}\n\nBest regards,\n${company.name}`;
  const [subject, setSubject] = useState(`Re: ${m.topic ?? "Your enquiry"} — ${company.shortName}`);
  const [body, setBody] = useState(draft);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const textRef = useRef<HTMLTextAreaElement>(null);

  // Start typing right after the greeting
  useEffect(() => {
    textRef.current?.focus();
    textRef.current?.setSelectionRange(greeting.length, greeting.length);
  }, [greeting]);

  const send = async (e?: FormEvent) => {
    e?.preventDefault();
    if (sending) return;
    if (!subject.trim() || body.trim() === draft.trim() || !body.trim()) return setError("Write your reply first.");
    setSending(true);
    setError("");
    try {
      const { reply, warning } = await sendReply(m.id, subject.trim(), body.trim());
      toast.success(`Reply sent to ${m.email}`, warning ? { description: warning } : undefined);
      onSent(reply);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSending(false);
    }
  };

  const cancel = () => {
    if (body !== draft && !window.confirm("Discard this reply?")) return;
    onClose();
  };

  return (
    <form
      onSubmit={send}
      onKeyDown={(e) => {
        // Escape leaves the reply, not the panel around it
        if (e.key !== "Escape") return;
        e.stopPropagation();
        if (!sending) cancel();
      }}
      className="border-t border-line p-5 sm:p-6"
    >
      <h3 className="font-display text-base font-bold">Reply</h3>
      <p className="mt-1 truncate text-sm text-subtle">
        To <span className="font-semibold text-ink">{m.name}</span> &lt;{m.email}&gt; · from {company.email}
      </p>
      <label htmlFor={`reply-subject-${m.id}`} className="sr-only">
        Subject
      </label>
      <input id={`reply-subject-${m.id}`} value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={200} className="field mt-4 text-sm" />
      <label htmlFor={`reply-body-${m.id}`} className="sr-only">
        Your reply
      </label>
      <textarea
        id={`reply-body-${m.id}`}
        ref={textRef}
        rows={8}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={(e) => (e.metaKey || e.ctrlKey) && e.key === "Enter" && send()}
        className="field mt-2 resize-y text-sm leading-relaxed"
      />
      <p className="mt-2 text-xs text-subtle">Their message is quoted underneath your reply. Ctrl + Enter sends.</p>
      {error && (
        <div role="alert" className="mt-3 rounded-xl border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-500">
          {error}{" "}
          <a href={composeLink(m.email, subject, body)} target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-2">
            Finish it in {company.email.endsWith("@gmail.com") ? "Gmail" : "your email app"} instead
          </a>
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="submit" disabled={sending} className="btn btn-primary px-5 py-2.5 text-sm disabled:opacity-60">
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} {sending ? "Sending…" : "Send reply"}
        </button>
        <button type="button" onClick={cancel} disabled={sending} className="btn btn-secondary px-4 py-2.5 text-sm">
          Cancel
        </button>
      </div>
    </form>
  );
}

function MessageView({
  m,
  onBack,
  onStatus,
  onDelete,
  onReplied,
}: {
  m: MessageRow;
  onBack?: () => void;
  onStatus: (s: MessageStatus) => void;
  onDelete: () => void;
  onReplied: (reply?: ReplyRow) => void;
}) {
  const archived = m.status === "archived";
  const sent = new Date(m.created_at);
  const [replying, setReplying] = useState(false);

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
        {onBack && (
          <button onClick={onBack} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-text lg:hidden">
            <ArrowLeft className="h-4 w-4" /> All messages
          </button>
        )}
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

      {m.replies.length > 0 && (
        <ol aria-label="Your replies" className="space-y-3 border-t border-line bg-raised/30 p-5 sm:p-6">
          {m.replies.map((r) => (
            <li key={r.id} className="rounded-2xl border border-line bg-surface p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-xs text-subtle">
                <span className="inline-flex items-center gap-1.5 font-semibold text-brand-text">
                  <Reply className="h-3.5 w-3.5" /> Replied by {r.sent_by}
                </span>
                <time dateTime={r.created_at}>{format(new Date(r.created_at), "d MMM yyyy, HH:mm")}</time>
              </div>
              <p className="mt-2 text-sm font-semibold">{r.subject}</p>
              <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-ink-2">{r.body}</p>
            </li>
          ))}
        </ol>
      )}

      {replying && (
        <ReplyBox
          m={m}
          onClose={() => setReplying(false)}
          onSent={(reply) => {
            setReplying(false);
            onReplied(reply);
          }}
        />
      )}

      <footer className="flex flex-wrap items-center gap-2 border-t border-line bg-raised/40 p-4 sm:px-6">
        {!replying && (
          <button onClick={() => setReplying(true)} className="btn btn-primary px-5 py-2.5 text-sm">
            <Reply className="h-4 w-4" /> {m.replies.length ? "Reply again" : "Reply"}
          </button>
        )}
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

const th = "whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-subtle";

function SortHeader({ label, k, sort, onSort }: { label: string; k: SortKey; sort: Sort; onSort: (k: SortKey) => void }) {
  const on = sort.key === k;
  const Icon = on ? (sort.dir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th scope="col" aria-sort={on ? (sort.dir === "asc" ? "ascending" : "descending") : undefined} className={th}>
      <button onClick={() => onSort(k)} className={`inline-flex items-center gap-1 uppercase tracking-wider hover:text-ink ${on ? "text-ink" : ""}`}>
        {label}
        <Icon className={`h-3.5 w-3.5 ${on ? "" : "opacity-40"}`} />
      </button>
    </th>
  );
}

/** Every message as a row with all its details; clicking one opens it. */
function MessagesTable({ rows, sort, onSort, openId, onOpen }: { rows: MessageRow[]; sort: Sort; onSort: (k: SortKey) => void; openId: number | null; onOpen: (m: MessageRow) => void }) {
  const none = <span className="text-subtle">—</span>;
  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[56rem] text-sm">
        <thead className="border-b border-line bg-raised/50">
          <tr>
            <SortHeader label="Received" k="created_at" sort={sort} onSort={onSort} />
            <SortHeader label="Name" k="name" sort={sort} onSort={onSort} />
            <SortHeader label="Organisation" k="organisation" sort={sort} onSort={onSort} />
            <th scope="col" className={th}>
              Phone
            </th>
            <SortHeader label="Topic" k="topic" sort={sort} onSort={onSort} />
            <th scope="col" className={th}>
              SMS
            </th>
            <th scope="col" className={th}>
              Replied
            </th>
            <th scope="col" className={th}>
              Message
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((m) => {
            const isNew = m.status === "new";
            const d = new Date(m.created_at);
            return (
              <tr key={m.id} onClick={() => onOpen(m)} className={`cursor-pointer align-top transition-colors hover:bg-raised ${m.id === openId ? "bg-brand-soft" : ""}`}>
                <td className="whitespace-nowrap px-4 py-3 text-subtle">
                  <time dateTime={m.created_at}>{format(d, isThisYear(d) ? "d MMM, HH:mm" : "d MMM yyyy")}</time>
                </td>
                <td className="px-4 py-3">
                  {/* The row opens the message too; this button makes it reachable by keyboard */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpen(m);
                    }}
                    className={`flex items-center gap-2 whitespace-nowrap text-left hover:text-brand-text ${isNew ? "font-bold text-ink" : "font-medium text-ink-2"}`}
                  >
                    {isNew && <span className="h-2 w-2 shrink-0 rounded-full bg-brand" aria-hidden="true" />}
                    {isNew && <span className="sr-only">Unread: </span>}
                    {m.name}
                  </button>
                  <span className={`mt-0.5 block whitespace-nowrap text-xs text-subtle ${isNew ? "pl-4" : ""}`}>{m.email}</span>
                </td>
                <td className="max-w-[11rem] truncate px-4 py-3 text-ink-2">{m.organisation || none}</td>
                <td className="whitespace-nowrap px-4 py-3 text-ink-2">{m.phone || none}</td>
                <td className="whitespace-nowrap px-4 py-3 text-ink-2">{m.topic || none}</td>
                <td className="px-4 py-3 text-ink-2">{m.sms_opt_in ? "Yes" : "No"}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  {m.replies.length ? (
                    <span className="inline-flex items-center gap-1 font-medium text-brand-text">
                      <Reply className="h-3.5 w-3.5" /> {shortDate(m.replies[m.replies.length - 1].created_at)}
                    </span>
                  ) : (
                    none
                  )}
                </td>
                {/* Takes the width left over and cuts the text to one line */}
                <td className={`w-full max-w-0 truncate px-4 py-3 ${isNew ? "text-ink-2" : "text-subtle"}`}>{m.message}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** Shows one message over the table, sliding in from the right. */
function MessageDrawer({ paused, onClose, children }: { paused: boolean; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    // While the delete dialog is open, Escape belongs to it
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !paused && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [paused, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Message">
      <div className="absolute inset-0 animate-fade-in bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative h-full w-full max-w-2xl animate-slide-in overflow-y-auto border-l border-line bg-canvas p-4 shadow-soft sm:p-6">
        <div className="mb-3 flex justify-end">
          <button autoFocus onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full text-subtle hover:bg-raised hover:text-ink" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
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
  const [layout, setLayout] = useState<Layout>(savedLayout);
  const [sort, setSort] = useState<Sort>({ key: "created_at", dir: "desc" });

  const inView = (v: View) => all.filter((m) => (m.status === "archived") === (v === "archived"));
  const q = search.trim().toLowerCase();
  const list = inView(view).filter((m) => !q || [m.name, m.email, m.organisation, m.topic, m.message].some((s) => s?.toLowerCase().includes(q)));
  const open = all.find((m) => m.id === openId) ?? null;
  // The table sorts by the chosen column; the list is always newest first
  const shown =
    layout === "table"
      ? [...list].sort((a, b) => {
          const c = String(a[sort.key] ?? "").localeCompare(String(b[sort.key] ?? ""), undefined, { sensitivity: "base", numeric: true });
          return sort.dir === "asc" ? c : -c;
        })
      : list;

  const changeLayout = (l: Layout) => {
    setLayout(l);
    setOpenId(null);
    try {
      localStorage.setItem(LAYOUT_KEY, l);
    } catch {
      // Not remembered this time; the switch still works
    }
  };

  // A new column starts newest-first for dates and A–Z for text; the same column flips direction
  const sortBy = (key: SortKey) => setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: key === "created_at" ? "desc" : "asc" }));

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
    // On a phone the message replaces the list, so start at its top (the table opens it in a panel instead)
    if (layout === "list" && window.matchMedia("(max-width: 1023px)").matches) window.scrollTo({ top: 0 });
  };

  const changeStatus = async (m: MessageRow, status: MessageStatus) => {
    // Marked unread or filed away: back to the list
    setOpenId(null);
    if (!(await setStatus(m, status))) return;
    if (status === "archived") toast.success("Message archived", { action: { label: "Undo", onClick: () => setStatus(m, m.status) } });
    else if (m.status === "archived") toast.success("Moved to the inbox");
  };

  // Shows a sent reply under its message straight away; the refetch confirms it
  const addReply = (m: MessageRow, reply?: ReplyRow) => {
    if (reply) qc.setQueryData<MessageRow[]>(MESSAGES_KEY, (rows) => rows?.map((r) => (r.id === m.id ? { ...r, replies: [...r.replies, reply] } : r)));
    qc.invalidateQueries({ queryKey: MESSAGES_KEY });
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
  const empty = (
    <div className="card p-8 text-center text-sm text-subtle">
      {q ? `No messages match “${search.trim()}”.` : view === "inbox" ? "Nothing in the inbox. Archived messages are under Archived." : "No archived messages."}
    </div>
  );

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
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          <label className="relative w-full sm:w-64">
            <span className="sr-only">Search messages</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
            <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email or text" className="field py-2 pl-10 text-sm" />
          </label>
          <div role="group" aria-label="Layout" className="inline-flex gap-0.5 rounded-full border border-line bg-surface p-1">
            {(
              [
                ["list", LayoutList, "List"],
                ["table", Table2, "Table"],
              ] as const
            ).map(([k, Icon, label]) => (
              <button
                key={k}
                aria-pressed={layout === k}
                onClick={() => changeLayout(k)}
                title={`${label} view`}
                className={`grid h-8 w-8 place-items-center rounded-full transition-colors ${layout === k ? "bg-grad text-white" : "text-subtle hover:text-ink"}`}
              >
                <Icon className="h-4 w-4" />
                <span className="sr-only">{label} view</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => exportCsv(shown, view)}
            disabled={shown.length === 0}
            title={`Download the ${shown.length} ${shown.length === 1 ? "message" : "messages"} shown, as a spreadsheet`}
            className="btn btn-secondary px-4 py-2 text-sm disabled:pointer-events-none disabled:opacity-50"
          >
            <Download className="h-4 w-4" /> Download CSV
          </button>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {unread} unread
      </p>

      {layout === "table" ? (
        shown.length === 0 ? (
          empty
        ) : (
          <MessagesTable rows={shown} sort={sort} onSort={sortBy} openId={openId} onOpen={select} />
        )
      ) : (
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,23rem)_minmax(0,1fr)]">
          <div className={open ? "hidden lg:block" : ""}>
            {list.length === 0 ? (
              empty
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
                        <span className="mt-0.5 block truncate text-xs text-subtle">
                          {m.replies.length > 0 && (
                            <span className="font-semibold text-brand-text">
                              <Reply className="mb-px mr-1 inline h-3 w-3" />
                              Replied ·{" "}
                            </span>
                          )}
                          {[m.topic, m.organisation].filter(Boolean).join(" · ") || m.email}
                        </span>
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
              <MessageView
                key={open.id}
                m={open}
                onBack={() => setOpenId(null)}
                onStatus={(s) => changeStatus(open, s)}
                onDelete={() => setToDelete(open)}
                onReplied={(reply) => addReply(open, reply)}
              />
            ) : (
              <div className="card flex flex-col items-center justify-center p-12 text-center text-subtle">
                <MailOpen className="h-8 w-8" />
                <p className="mt-3 text-sm">Choose a message to read it.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {layout === "table" && open && (
        <MessageDrawer paused={!!toDelete} onClose={() => setOpenId(null)}>
          <MessageView key={open.id} m={open} onStatus={(s) => changeStatus(open, s)} onDelete={() => setToDelete(open)} onReplied={(reply) => addReply(open, reply)} />
        </MessageDrawer>
      )}

      <ConfirmDelete open={!!toDelete} title="Delete this message?" onCancel={() => setToDelete(null)} onConfirm={confirmDelete}>
        The message from {toDelete?.name}
        {toDelete?.replies.length ? " and your replies to it" : ""} will be deleted from the database. This can't be undone — to keep it out of the inbox, archive it instead.
      </ConfirmDelete>
    </div>
  );
}
