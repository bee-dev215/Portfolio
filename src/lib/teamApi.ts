import { db, supabase } from "@/lib/supabase";
import { builtInTeam, TeamMember } from "@/data/company";

export const TEAM_TABLE = "team_members";

// Everything under this key refetches after an admin edit: the site's list and the admin's
export const TEAM_KEY = ["team"] as const;

// A visitor waits this long for the database before the site falls back to the built-in team
const SITE_TIMEOUT_MS = 8000;

/** A row of the team table. Optional details are stored as empty strings. */
export interface TeamRow {
  id: number;
  name: string;
  role: string;
  bio: string;
  photo: string;
  linkedin: string;
  focus: string[];
  sort_order: number;
  published: boolean;
}

export type TeamInput = Omit<TeamRow, "id" | "sort_order">;

export const rowToMember = (r: TeamRow): TeamMember => ({
  name: r.name,
  role: r.role,
  bio: r.bio,
  photo: r.photo || undefined,
  linkedin: r.linkedin || undefined,
  // A row edited by hand in Supabase's Table Editor may have no list
  focus: Array.isArray(r.focus) ? r.focus : [],
});

// ---------- Public site ----------

/** The published team, in the admin's order; the built-in team when there's no database or it doesn't answer. */
export async function fetchSiteTeam(): Promise<TeamMember[]> {
  if (!supabase) return builtInTeam;
  const { data, error } = await supabase
    .from(TEAM_TABLE)
    .select("*")
    .eq("published", true)
    .order("sort_order")
    .order("id")
    .retry(false)
    .abortSignal(AbortSignal.timeout(SITE_TIMEOUT_MS));
  if (error) {
    console.warn("The team could not be loaded from the database, so the built-in one is shown:", error.message);
    return builtInTeam;
  }
  return (data as TeamRow[]).map(rowToMember);
}

// ---------- Admin ----------

export async function fetchTeamRows(): Promise<TeamRow[]> {
  const { data, error } = await db().from(TEAM_TABLE).select("*").order("sort_order").order("id");
  if (error) throw error;
  return data as TeamRow[];
}

export async function createMember(values: TeamInput, sortOrder: number) {
  const { error } = await db().from(TEAM_TABLE).insert({ ...values, sort_order: sortOrder });
  if (error) throw error;
}

export async function updateMember(id: number, values: Partial<TeamInput>) {
  const { error } = await db().from(TEAM_TABLE).update(values).eq("id", id);
  if (error) throw error;
}

export async function deleteMember(id: number) {
  const { error } = await db().from(TEAM_TABLE).delete().eq("id", id);
  if (error) throw error;
}
