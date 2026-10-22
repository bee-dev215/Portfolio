import { db, supabase } from "@/lib/supabase";
import { builtInProjects, Project } from "@/data/projects";

export const PROJECTS_TABLE = "projects";

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
