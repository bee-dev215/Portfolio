# Setting up the admin page and call booking

The admin page (`/admin`) is your inbox. It shows the messages people send through the contact form and the calls they book on `/book`. You can reply to both from there. Everything is stored in a free Supabase database that you own.

The projects, team and photos on the site are part of its code (`src/data/` and `public/images/`), not the database.

Until the database is set up, messages and booked calls still reach you by email (through FormSubmit). `/admin` says it isn't connected, and the booking page shows every working-hours time as open.

## Updating the database you already have

If you set up this database for the old site, do these three things once:

1. **Run [`setup.sql`](setup.sql) again** ([step 2](#2-run-the-setup-script)). It adds the tables and functions for booked calls and leaves your messages and replies alone.
2. **Run [`remove-old-content.sql`](remove-old-content.sql) once**, the same way. It deletes the old `projects`, `team_members` and `site_photos` tables, which the site no longer reads. This can't be undone.
3. **Delete the uploaded images.** Supabase only lets you delete storage files from the dashboard:
   1. Open **Storage** and then the **project-images** bucket.
   2. Open each folder (`projects`, `team`, `site`), select everything, and click **Delete**.
   3. Back in the bucket list, open the **⋯** menu next to *project-images* and choose **Delete bucket**.

## 1. Create the database

*Skip this if you already have one.*

1. Go to [supabase.com](https://supabase.com) and sign up. Using terabyte5050@gmail.com is simplest.
2. Click **New project**. Give it a name (for example *jovano*) and choose the region closest to your visitors.
3. It asks for a database password. Click **Generate a password** and keep it somewhere safe. The site doesn't use it, but you may need it later.
4. Click **Create new project** and wait a minute or two while it starts.

## 2. Run the setup script

1. In the left sidebar, open **SQL Editor**.
2. Start a new query, paste the whole of [`setup.sql`](setup.sql), and click **Run**.
3. If Supabase warns that the query has "destructive operations", run it anyway. The warning is about the lines that replace the script's own access rules. No data is deleted.
4. It should end with *Success. No rows returned*. This creates the tables for messages, replies and booked calls, plus their access rules.

It's safe to run again later, because it never deletes or overwrites anything.

## 3. Create your admin login

1. In the left sidebar, open **Authentication → Users**.
2. Click **Add user → Create new user**.
3. Enter **terabyte5050@gmail.com** and a password you choose. Use a new password, not your Gmail one.
4. Tick **Auto Confirm User** and click **Create user**.

Only emails listed in the `admins` table can sign in to the inbox, and the script lists terabyte5050@gmail.com. To add another admin:

1. Create their login the same way.
2. Open **Table Editor → admins** and insert a row with their email.

## 4. Turn off public sign-ups

Open **Authentication → Sign In / Providers**, switch off **Allow new users to sign up**, and save.

Strangers couldn't read anything anyway. This just stops them creating accounts.

## 5. Connect the site

1. Click **Connect** at the top of the dashboard, or open **Project Settings → API Keys**.
2. Copy the **Project URL** (it looks like `https://abcdefgh.supabase.co`).
3. Copy the **publishable** key (it starts with `sb_publishable_`), or the **anon** key if that's what you see.
4. Put both in [`src/lib/supabase.ts`](../src/lib/supabase.ts), rebuild, and deploy.

Both values are meant to be public. Never use the **secret** or **service_role** key on the site.

Then open `/admin` on the site and sign in.

## Booked calls

Visitors pick a kind of call, a day and a time on `/book`. They see the times in their own time zone. When they confirm:

- The time is held in the database, so nobody else can take it. Two people choosing the same time at the same moment can't both get it.
- The booking appears in `/admin` as a message with the topic **Call booked**. It shows the call time in your time zone and theirs, and has these buttons:
  - **Add to my calendar** puts the call in your Google Calendar.
  - **Reply** sends them the video link or a confirmation (see [Replying](#replying-from-the-admin)).
  - **Cancel call** frees the time again; **Restore call** undoes it.
  - Deleting the message deletes the booking too.
- You also get an email about it through FormSubmit, as you do for contact-form messages.
- The visitor can add the call to their own calendar straight away.

Your working hours, the kinds of call, how much notice you need, how far ahead people can book, and your video-call link (Google Meet or Zoom) are all set in `booking` in [`src/data/company.ts`](../src/data/company.ts). Calls start on the hour and half-hour, and `book_call` in `setup.sql` checks for that too.

### Taking time off

To stop people booking a day or a stretch of time:

1. Open **Table Editor → booking_blocks** and click **Insert row**.
2. Fill in `starts_at` and `ends_at` with your time zone's offset. For example, Christmas Day in Arizona is `2026-12-25 00:00-07` to `2026-12-26 00:00-07`.
3. Optionally add a `note` for yourself.

Delete the row to open the time again. Visitors only ever see that the time is taken, never why.

## Replying from the admin

The **Reply** box under a message emails your reply from your Gmail, with their message quoted underneath, and keeps it in the conversation in the admin. A small Supabase function, [`functions/send-reply`](functions/send-reply/index.ts), does the sending, using a Gmail *app password*. You set it up once, which takes about 10 minutes.

1. **Run the setup script** ([step 2](#2-run-the-setup-script)) if you haven't. It creates the table that keeps your replies.
2. **Create a Gmail app password.**
   1. Signed in as terabyte5050@gmail.com, open [Google Account → Security](https://myaccount.google.com/security). Turn on **2-Step Verification** if it's off, because Google only offers app passwords when it's on.
   2. Open [App passwords](https://myaccount.google.com/apppasswords), name it *Jovano admin* and click **Create**.
   3. Copy the 16-letter password. Google shows it only once. It lets the function send email as you, so never put it in the site's code.
3. **Give it to Supabase.** In the dashboard, open **Edge Functions → Secrets** and add two secrets:
   - `SMTP_USER`: `terabyte5050@gmail.com`
   - `SMTP_PASSWORD`: the app password (with or without the spaces)
4. **Deploy the function.**
   1. Open **Edge Functions**, click **Deploy a new function** and choose **Via Editor**.
   2. Name the function `send-reply`, exactly.
   3. Replace all the sample code with the whole of [`functions/send-reply/index.ts`](functions/send-reply/index.ts) and click **Deploy function**.
   4. Leave JWT verification on (the default). Only signed-in users get through, and the function also checks that they're an admin.

   *With the Supabase CLI instead:* run `npx supabase login`, then `npx supabase functions deploy send-reply --project-ref vmfbimauliwhbrvmfhal`.
5. **Test it.** Send a message through the site's contact form from another email address you own, open it in `/admin` and reply.

Good to know:

- Replies go out through Gmail, so they also appear in Gmail's **Sent** folder. When someone answers, the answer arrives in your Gmail inbox, not in the admin.
- A reply only ever goes to the address the message came from, and the function refuses anyone who isn't an admin.
- Gmail allows about 500 emails a day, far more than a contact form needs.
- If you revoke the app password or change your Google password, create a new app password and update `SMTP_PASSWORD`.
- Until this is set up, **Send reply** explains what's missing and offers to open your reply in Gmail, so nothing you typed is lost.

## If you forget the password

Supabase's dashboard can't show or set a password. Instead:

1. Open **Authentication → Users**, delete the user, and create it again ([step 3](#3-create-your-admin-login)) with a new password.
2. Your messages and admin access aren't affected, because admin access goes by the email address.

## Good to know

- **Messages:** every contact-form message and booked call is saved here, as well as being emailed to you and sent to the CRM.
  - *Archive* moves a message out of the inbox, and *Delete* removes it for good.
  - Visitors can send messages but can never read them.
- **Email delivery:** FormSubmit only starts delivering after terabyte5050@gmail.com clicks the one-time **Activate Form** link it sends with the first submission.
- **Pausing:** Supabase may pause a free project after about a week without activity. While it's paused:
  - The booking page shows every working-hours time as open.
  - Bookings and messages still reach you by email, but bookings arrive as *requests*: the time isn't held, so confirm it by email.
  - Restore the project from the Supabase dashboard.
