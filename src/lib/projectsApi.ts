import { supabase } from "@/lib/supabase";
import { builtInProjects, Project } from "@/data/projects";

export const PROJECTS_TABLE = "projects";
export const IMAGE_BUCKET = "project-images";

// Everything under this key refetches after an admin edit: the site's list and the admin's
export const PROJECTS_KEY = ["projects"] as const;

// A visitor waits this long for the database before the site falls back to the built-in projects
const SITE_TIMEOUT_MS = 8000;

/** A row of the projects table: the slug and list position are columns, the rest of the project is `data`. */
export interface ProjectRow {
  id: number;
  slug: string;
  sort_order: number;
  published: boolean;
  data: Omit<Project, "slug">;
}

export type ProjectInput = Pick<ProjectRow, "slug" | "published" | "data">;

function db() {
  if (!supabase) throw new Error("The database isn't connected yet (src/lib/supabase.ts).");
  return supabase;
}

// Rows edited by hand in Supabase's Table Editor may miss a list; default them so a page never crashes on one
const list = <T>(v: T[] | undefined) => (Array.isArray(v) ? v : []);

export const rowToProject = ({ slug, data }: ProjectRow): Project => ({
  ...data,
  slug,
  services: list(data.services),
  brief: list(data.brief),
  steps: list(data.steps),
  built: list(data.built),
  flow: list(data.flow),
  safeguards: list(data.safeguards),
  measures: list(data.measures),
  stack: list(data.stack),
  gallery: data.gallery ?? { src: "", alt: "", caption: "" },
});

// ---------- Public site ----------

/** The published projects, in the admin's order; the built-in list when there's no database or it doesn't answer. */
export async function fetchSiteProjects(): Promise<Project[]> {
  if (!supabase) return builtInProjects;
  const { data, error } = await supabase
    .from(PROJECTS_TABLE)
    .select("*")
    .eq("published", true)
    .order("sort_order")
    .order("id")
    // No retries: when the database is down, the built-in projects now beat a spinner for several seconds
    .retry(false)
    .abortSignal(AbortSignal.timeout(SITE_TIMEOUT_MS));
  if (error) {
    console.warn("Projects could not be loaded from the database, so the built-in ones are shown:", error.message);
    return builtInProjects;
  }
  return (data as ProjectRow[]).map(rowToProject);
}

// ---------- Admin ----------

export async function fetchProjectRows(): Promise<ProjectRow[]> {
  const { data, error } = await db().from(PROJECTS_TABLE).select("*").order("sort_order").order("id");
  if (error) throw error;
  return data as ProjectRow[];
}

export async function createProject(values: ProjectInput, sortOrder: number) {
  const { error } = await db().from(PROJECTS_TABLE).insert({ ...values, sort_order: sortOrder });
  if (error) throw error;
}

export async function updateProject(id: number, values: Partial<ProjectInput>) {
  const { error } = await db().from(PROJECTS_TABLE).update(values).eq("id", id);
  if (error) throw error;
}

export async function deleteProject(id: number) {
  const { error } = await db().from(PROJECTS_TABLE).delete().eq("id", id);
  if (error) throw error;
}

/** Persist a new order: ids[0] gets sort_order 0, etc. Only changed rows are written. */
export async function saveOrder(ids: number[], previous: Pick<ProjectRow, "id" | "sort_order">[]) {
  const prev = new Map(previous.map((p) => [p.id, p.sort_order]));
  const changed = ids.map((id, idx) => ({ id, idx })).filter(({ id, idx }) => prev.get(id) !== idx);
  const results = await Promise.all(changed.map(({ id, idx }) => db().from(PROJECTS_TABLE).update({ sort_order: idx }).eq("id", id)));
  const failed = results.find((r) => r.error);
  if (failed?.error) throw failed.error;
}

export async function uploadProjectImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `projects/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const storage = db().storage.from(IMAGE_BUCKET);
  const { error } = await storage.upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type });
  if (error) throw error;
  return storage.getPublicUrl(path).data.publicUrl;
}

/** Whether the signed-in account is listed in the database's admins table. */
export async function isAdmin(): Promise<boolean> {
  const { data, error } = await db().rpc("is_admin");
  if (error) throw error;
  return Boolean(data);
}
