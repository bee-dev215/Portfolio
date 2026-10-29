-- ============================================================
--  ONE-TIME CLEAN-UP: removes what the old admin managed — projects, team members and replacement photos.
--  The site now shows the projects, team and photos built into its code (src/data/, public/images/),
--  and the admin is just the Messages inbox.
--
--  This deletes data for good: the projects, team members and photo replacements in these tables.
--  Messages, replies and bookings are not touched.
--  Run it once in Supabase: SQL Editor → New query → paste this whole file → Run. Running it again does nothing.
--
--  The uploaded image files themselves can only be deleted from the dashboard (Supabase doesn't allow SQL to
--  delete storage files): see "Removing the old projects, team and photos" in supabase/README.md.
-- ============================================================

drop table if exists public.projects;
drop table if exists public.team_members;
drop table if exists public.site_photos;

-- Nobody uploads images any more
drop policy if exists "Admins upload project images" on storage.objects;
drop policy if exists "Admins read project images" on storage.objects;
