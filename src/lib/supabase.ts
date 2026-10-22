import { createClient } from "@supabase/supabase-js";

// The Supabase project behind /admin (Project Settings → API keys: the project URL and the publishable/anon key).
// Both are meant to be public: the row-level security in supabase/setup.sql decides what visitors and admins can do.
const SUPABASE_URL = "";
const SUPABASE_KEY = "";

/** The database client, or null until the project details above are filled in (the site then shows the built-in projects). */
export const supabase = SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;
