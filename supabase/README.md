# Setting up the admin page

The admin page (`/admin`) edits the projects on the site. They're stored in a free Supabase database that you own. You set it up once, which takes about 10 minutes.

Until it's set up, the site shows the projects built into the code (`src/data/projects.ts`), and `/admin` says it isn't connected.

## 1. Create the database

1. Go to [supabase.com](https://supabase.com) and sign up. Using terabyte5050@gmail.com is simplest.
2. Click **New project**. Give it a name (for example *gsedu*) and choose the region closest to your visitors.
3. It asks for a database password. Click **Generate a password** and keep it somewhere safe; the site doesn't use it, but you may need it later.
4. Click **Create new project** and wait a minute or two while it starts.

## 2. Run the setup script

1. In the left sidebar, open **SQL Editor**.
2. Start a new query, paste the whole of [`setup.sql`](setup.sql), and click **Run**.
3. If Supabase warns that the query has "destructive operations", click to run it anyway. That warning is about the lines that replace the script's own access rules, and no data is deleted.
4. It should end with *Success. No rows returned*. This creates the projects table, its access rules and the photo storage, and loads the site's 9 current projects.

It's safe to run again later: it never overwrites or re-adds projects once the table has any.

## 3. Create your admin login

1. In the left sidebar, open **Authentication → Users**.
2. Click **Add user → Create new user**.
3. Enter **terabyte5050@gmail.com** and a password you choose. Use a new password, not your Gmail one.
4. Tick **Auto Confirm User** and click **Create user**.

Only emails listed in the `admins` table can edit, and the script lists terabyte5050@gmail.com. To add another admin, create their login the same way. Then open **Table Editor → admins** and insert a row with their email.

## 4. Turn off public sign-ups

Open **Authentication → Sign In / Providers**, switch off **Allow new users to sign up**, and save.

Strangers couldn't edit anything anyway. This simply stops them creating accounts at all.

## 5. Connect the site

1. Click **Connect** at the top of the dashboard, or open **Project Settings → API Keys**.
2. Copy the **Project URL** (it looks like `https://abcdefgh.supabase.co`).
3. Copy the **publishable** key (it starts with `sb_publishable_`), or the **anon** key if that's what you see.
4. Put both in [`src/lib/supabase.ts`](../src/lib/supabase.ts), rebuild, and deploy.

Both values are meant to be public. Never use the **secret** or **service_role** key on the site.

Then open `/admin` on the site and sign in.

## If you forget the password

Supabase's dashboard can't show or set a password. Instead:

1. Open **Authentication → Users**, delete the user, and create it again (step 3) with a new password.
2. Your projects and admin access aren't affected, because admin access goes by the email address.

## Good to know

- **Hidden projects:** a project switched to "hidden" stays in the admin but disappears from the site, so you can draft new case studies before publishing.
- **Photos:** photos uploaded in the admin go to the database's `project-images` storage. Photos already on the site stay in `public/images/`.
- **Pausing:** Supabase may pause a free project after about a week without activity. While it's paused, the site falls back to the built-in projects. Restore it from the Supabase dashboard.
