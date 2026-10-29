import { db } from "@/lib/supabase";

/** Whether the signed-in account is listed in the database's admins table. */
export async function isAdmin(): Promise<boolean> {
  const { data, error } = await db().rpc("is_admin");
  if (error) throw error;
  return Boolean(data);
}

/** Database errors in words the admin can act on. `duplicate` explains a clash with a unique value. */
export function explain(e: unknown, duplicate = "That value is already taken.") {
  const err = e as { code?: string; message?: string };
  if (err.code === "23505") return duplicate;
  if (err.code === "42P01" || err.code === "PGRST205" || /does not exist|could not find the table/i.test(err.message ?? ""))
    return "This part of the database doesn't exist yet. Run supabase/setup.sql again in Supabase's SQL Editor (see supabase/README.md).";
  if (err.code === "42501" || /row-level security/i.test(err.message ?? "")) return "This account isn't allowed to make changes.";
  return err.message ?? "Something went wrong.";
}
