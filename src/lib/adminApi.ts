import { db } from "@/lib/supabase";

// Holds every photo uploaded from the admin, in a folder per section (projects/, team/, site/)
export const IMAGE_BUCKET = "project-images";

/** Whether the signed-in account is listed in the database's admins table. */
export async function isAdmin(): Promise<boolean> {
  const { data, error } = await db().rpc("is_admin");
  if (error) throw error;
  return Boolean(data);
}

export async function uploadImage(file: File, folder: string): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const storage = db().storage.from(IMAGE_BUCKET);
  const { error } = await storage.upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type });
  if (error) throw error;
  return storage.getPublicUrl(path).data.publicUrl;
}

/** Persist a new order for a table with a sort_order column: ids[0] gets sort_order 0, etc. Only changed rows are written. */
export async function saveOrder(table: string, ids: number[], previous: { id: number; sort_order: number }[]) {
  const prev = new Map(previous.map((p) => [p.id, p.sort_order]));
  const changed = ids.map((id, idx) => ({ id, idx })).filter(({ id, idx }) => prev.get(id) !== idx);
  const results = await Promise.all(changed.map(({ id, idx }) => db().from(table).update({ sort_order: idx }).eq("id", id)));
  const failed = results.find((r) => r.error);
  if (failed?.error) throw failed.error;
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
