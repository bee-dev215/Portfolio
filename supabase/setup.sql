-- ============================================================
--  Database for the site's admin page (/admin: the Messages inbox) and its call booking (/book).
--  Run it in Supabase: SQL Editor → New query → paste this whole file → Run.
--  Safe to run again: it only adds what's missing and never deletes data.
--  Step-by-step setup: supabase/README.md
-- ============================================================


-- ---------- 1. Who can edit ----------
-- Sign-in accounts are created in Authentication → Users. An account can edit only if its email is listed here.

create table if not exists public.admins (
  email text primary key
);
-- No policies: visitors can't read the list; only is_admin() below looks at it
alter table public.admins enable row level security;

insert into public.admins (email) values ('terabyte5050@gmail.com') on conflict do nothing;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where lower(email) = lower(auth.jwt() ->> 'email'));
$$;

grant execute on function public.is_admin() to anon, authenticated;


-- ---------- 2. Messages from the contact form ----------
-- Anyone can send one; only admins can read, file or delete them. The admin page shows them under Messages,
-- together with the calls booked on /book (section 4).

create table if not exists public.messages (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 200),
  email text not null check (char_length(email) between 3 and 320),
  organisation text check (char_length(organisation) <= 200),
  phone text check (char_length(phone) <= 50),
  topic text check (char_length(topic) <= 100),
  message text not null check (char_length(message) between 1 and 10000),
  sms_opt_in boolean not null default false,
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

-- Visitors can only add a new, unread message; they can't read any back, not even their own
drop policy if exists "Anyone sends a message" on public.messages;
create policy "Anyone sends a message" on public.messages
  for insert to anon, authenticated with check (status = 'new');

drop policy if exists "Admins read messages" on public.messages;
create policy "Admins read messages" on public.messages
  for select to authenticated using (public.is_admin());

drop policy if exists "Admins file messages" on public.messages;
create policy "Admins file messages" on public.messages
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins delete messages" on public.messages;
create policy "Admins delete messages" on public.messages
  for delete to authenticated using (public.is_admin());

grant insert on public.messages to anon, authenticated;
grant select, update, delete on public.messages to authenticated;


-- ---------- 3. Replies to messages ----------
-- Replies written in the admin. The send-reply function (supabase/functions/send-reply) emails each one from the
-- company's Gmail and records it here, so the admin can show the conversation. Deleting a message deletes its replies.

create table if not exists public.message_replies (
  id bigint generated always as identity primary key,
  message_id bigint not null references public.messages (id) on delete cascade,
  subject text not null check (char_length(subject) between 1 and 200),
  body text not null check (char_length(body) between 1 and 20000),
  sent_by text not null, -- the admin who sent it
  created_at timestamptz not null default now()
);

create index if not exists message_replies_message_id_idx on public.message_replies (message_id);

alter table public.message_replies enable row level security;

drop policy if exists "Admins read replies" on public.message_replies;
create policy "Admins read replies" on public.message_replies
  for select to authenticated using (public.is_admin());

drop policy if exists "Admins record replies" on public.message_replies;
create policy "Admins record replies" on public.message_replies
  for insert to authenticated with check (public.is_admin());

grant select, insert on public.message_replies to authenticated;


-- ---------- 4. Booked calls ----------
-- Calls booked on the site's /book page. Visitors can't touch the table:
-- they book through book_call(), which checks the time is free and files the booking in Messages, where the admin
-- answers and can cancel it; the booking page learns which times are taken from busy_times(), which never says who took them.

create table if not exists public.bookings (
  id bigint generated always as identity primary key,
  starts_at timestamptz not null,
  minutes int not null check (minutes between 5 and 30),
  call_type text not null check (char_length(call_type) between 1 and 60),
  name text not null check (char_length(name) between 1 and 200),
  email text not null check (char_length(email) between 3 and 320),
  organisation text check (char_length(organisation) <= 200),
  phone text check (char_length(phone) <= 50),
  topic text check (char_length(topic) <= 200),
  notes text check (char_length(notes) <= 5000),
  timezone text check (char_length(timezone) <= 64), -- the visitor's
  status text not null default 'booked' check (status in ('booked', 'confirmed', 'done', 'cancelled')),
  message_id bigint references public.messages (id) on delete cascade, -- deleting the message in the admin deletes the booking
  created_at timestamptz not null default now()
);

-- One call per start time; cancelling a call frees its time again
create unique index if not exists bookings_one_per_time on public.bookings (starts_at) where status <> 'cancelled';

alter table public.bookings enable row level security;

drop policy if exists "Admins read bookings" on public.bookings;
create policy "Admins read bookings" on public.bookings
  for select to authenticated using (public.is_admin());

drop policy if exists "Admins update bookings" on public.bookings;
create policy "Admins update bookings" on public.bookings
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins delete bookings" on public.bookings;
create policy "Admins delete bookings" on public.bookings
  for delete to authenticated using (public.is_admin());

grant select, update, delete on public.bookings to authenticated;

-- Time off: nobody can book a call that overlaps one of these. Add rows in Supabase's Table Editor
-- (see "Taking time off" in supabase/README.md); the site only ever sees them through busy_times().
create table if not exists public.booking_blocks (
  id bigint generated always as identity primary key,
  starts_at timestamptz not null,
  ends_at timestamptz not null check (ends_at > starts_at),
  note text check (char_length(note) <= 200),
  created_at timestamptz not null default now()
);

-- No policies: only the Supabase dashboard can read or change it
alter table public.booking_blocks enable row level security;

-- The taken stretches of time between two moments: calls not cancelled, and blocked time
create or replace function public.busy_times(p_from timestamptz, p_to timestamptz)
returns table (starts_at timestamptz, ends_at timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  select b.starts_at, b.starts_at + make_interval(mins => b.minutes)
    from public.bookings b
   where b.status <> 'cancelled' and b.starts_at < p_to and b.starts_at + make_interval(mins => b.minutes) > p_from
  union all
  select k.starts_at, k.ends_at
    from public.booking_blocks k
   where k.starts_at < p_to and k.ends_at > p_from;
$$;

grant execute on function public.busy_times(timestamptz, timestamptz) to anon, authenticated;

-- Books a call if its time is still free, and returns the booking's id. Fails with 'slot_taken' when the time has
-- gone, and 'slot_invalid' for a time the site would never offer (keep the half-hour grid in step with `booking` in
-- src/data/company.ts). p_message is the summary filed in Messages.
create or replace function public.book_call(
  p_starts_at timestamptz,
  p_minutes int,
  p_call_type text,
  p_name text,
  p_email text,
  p_organisation text,
  p_phone text,
  p_topic text,
  p_notes text,
  p_timezone text,
  p_message text
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_end timestamptz := p_starts_at + make_interval(mins => p_minutes);
  v_message bigint;
  v_id bigint;
begin
  if p_starts_at < now() or p_starts_at > now() + interval '90 days'
     or extract(epoch from p_starts_at)::numeric % 1800 <> 0 then -- on the hour or half-hour
    raise exception 'slot_invalid';
  end if;

  if exists (select 1 from public.bookings b
              where b.status <> 'cancelled' and b.starts_at < v_end and b.starts_at + make_interval(mins => b.minutes) > p_starts_at)
     or exists (select 1 from public.booking_blocks k where k.starts_at < v_end and k.ends_at > p_starts_at) then
    raise exception 'slot_taken';
  end if;

  insert into public.messages (name, email, organisation, phone, topic, message)
  values (p_name, p_email, nullif(p_organisation, ''), nullif(p_phone, ''), 'Call booked', p_message)
  returning id into v_message;

  insert into public.bookings (starts_at, minutes, call_type, name, email, organisation, phone, topic, notes, timezone, message_id)
  values (p_starts_at, p_minutes, p_call_type, p_name, p_email, nullif(p_organisation, ''), nullif(p_phone, ''),
          nullif(p_topic, ''), nullif(p_notes, ''), nullif(p_timezone, ''), v_message)
  returning id into v_id;

  return v_id;
exception
  -- Two people choosing the same time at the same moment: the second one loses, and nothing of theirs is kept
  when unique_violation then raise exception 'slot_taken';
end;
$$;

grant execute on function public.book_call(timestamptz, int, text, text, text, text, text, text, text, text, text) to anon, authenticated;
