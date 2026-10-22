import { db, supabase } from "@/lib/supabase";

export const PHOTOS_TABLE = "site_photos";

// Everything under this key refetches after an admin edit: the site's copy and the admin's
export const PHOTOS_KEY = ["site-photos"] as const;

// Photos wait for this list, so a slow database holds them back only this long before the originals show
const SITE_TIMEOUT_MS = 4000;

/** A replacement for one of the photos built into the site. */
export interface PhotoRow {
  file: string; // the original's file name in public/images/, e.g. sol-ai-tutor.webp
  url: string;
  alt: string; // empty keeps the original's description
}

/** The name a built-in photo is replaced under: "/images/sol-ai-tutor.webp" → "sol-ai-tutor.webp". */
export const photoFile = (path: string) => path.replace(/^\/images\//, "");

// ---------- Public site ----------

/** The replaced photos; none when there's no database or it doesn't answer, so the originals show. */
export async function fetchSitePhotos(): Promise<PhotoRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from(PHOTOS_TABLE)
    .select("file, url, alt")
    .retry(false)
    .abortSignal(AbortSignal.timeout(SITE_TIMEOUT_MS));
  if (error) {
    console.warn("Photo replacements could not be loaded from the database, so the originals are shown:", error.message);
    return [];
  }
  return data as PhotoRow[];
}

// ---------- Admin ----------

export async function fetchPhotoRows(): Promise<PhotoRow[]> {
  const { data, error } = await db().from(PHOTOS_TABLE).select("file, url, alt");
  if (error) throw error;
  return data as PhotoRow[];
}

export async function replacePhoto(values: PhotoRow) {
  const { error } = await db()
    .from(PHOTOS_TABLE)
    .upsert({ ...values, updated_at: new Date().toISOString() });
  if (error) throw error;
}

/** Brings the original photo back. */
export async function restorePhoto(file: string) {
  const { error } = await db().from(PHOTOS_TABLE).delete().eq("file", file);
  if (error) throw error;
}
