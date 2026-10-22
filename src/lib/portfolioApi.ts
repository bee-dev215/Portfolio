import { supabase } from "@/lib/supabase";

export const PROJECTS_TABLE = "portfolio_projects";
export const IMAGE_BUCKET = "portfolio-images";

// ---------- Row types (database shape) ----------
export interface ProjectRow {
  id: number;
  title: string;
  category: string;
  year: string;
  role: string;
  summary: string;
  description: string;
  highlights: string[];
  tech: string[];
  image_url: string;
  live_url: string;
  repo_url: string;
  sort_order: number;
}

export type ProjectInput = Omit<ProjectRow, "id" | "sort_order">;

export const emptyProject: ProjectInput = {
  title: "",
  category: "Manufacturing",
  year: String(new Date().getFullYear()),
  role: "",
  summary: "",
  description: "",
  highlights: [],
  tech: [],
  image_url: "",
  live_url: "",
  repo_url: "",
};

// ---------- Reads ----------
export async function fetchProjectRows(): Promise<ProjectRow[]> {
  const { data, error } = await supabase
    .from(PROJECTS_TABLE)
    .select("*")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ProjectRow[];
}

// ---------- Generic writes ----------
type Table = typeof PROJECTS_TABLE;

export async function createRow<T extends object>(table: Table, values: T, sortOrder: number) {
  const { error } = await supabase.from(table).insert({ ...values, sort_order: sortOrder });
  if (error) throw error;
}

export async function updateRow<T extends object>(table: Table, id: number, values: T) {
  const { error } = await supabase
    .from(table)
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteRow(table: Table, id: number) {
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;
}

/** Persist a new order: ids[0] gets sort_order 0, etc. Only changed rows are written. */
export async function saveOrder(table: Table, ids: number[], previous: { id: number; sort_order: number }[]) {
  const prev = new Map(previous.map((p) => [p.id, p.sort_order]));
  const changed = ids.map((id, idx) => ({ id, idx })).filter(({ id, idx }) => prev.get(id) !== idx);
  const results = await Promise.all(
    changed.map(({ id, idx }) => supabase.from(table).update({ sort_order: idx }).eq("id", id))
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) throw failed.error;
}

// ---------- Storage ----------
export async function uploadProjectImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `projects/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// ---------- Admin auth ----------
export async function adminExists(): Promise<boolean> {
  const { data, error } = await supabase.rpc("portfolio_admin_exists");
  if (error) throw error;
  return Boolean(data);
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  const { data, error } = await supabase.rpc("is_portfolio_admin");
  if (error) return false;
  return Boolean(data);
}

/** Grants admin to the signed-in user only if no admin exists yet. */
export async function claimAdmin(): Promise<boolean> {
  const { data, error } = await supabase.rpc("claim_portfolio_admin");
  if (error) throw error;
  return Boolean(data);
}
