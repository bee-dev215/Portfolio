import { createClient } from "@supabase/supabase-js";

// The Supabase project behind /admin (Project Settings → API keys: the project URL and the publishable/anon key).
// Both are meant to be public: the row-level security in supabase/setup.sql decides what visitors and admins can do.
const SUPABASE_URL = "https://vmfbimauliwhbrvmfhal.supabase.co";
const SUPABASE_KEY = "sb_publishable_dUhnj_3yfIIT6fd99qsMVA_Jnp0e1l1";

/** The database client, or null until the project details above are filled in (the site then shows the built-in projects). */
export const supabase = SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

/** The client, for code that only runs once the database is connected (the admin). */
export function db() {
  if (!supabase) throw new Error("The database isn't connected yet (src/lib/supabase.ts).");
  return supabase;
}
