import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { fetchSitePhotos, PHOTOS_KEY, photoFile, PhotoRow } from "@/lib/photosApi";
import { photoAlts } from "@/data/company";

const NONE: PhotoRow[] = [];

/**
 * The site's built-in photos, with the replacements chosen in the admin (/admin → Site photos).
 * Wrap a photo's path in `src()` wherever it's shown, so one replacement swaps it everywhere.
 */
export function usePhotos() {
  const { data } = useQuery({
    queryKey: [...PHOTOS_KEY, "site"],
    queryFn: fetchSitePhotos,
    staleTime: 5 * 60_000,
    initialData: supabase ? undefined : NONE,
  });

  return useMemo(() => {
    const byFile = new Map((data ?? NONE).map((r) => [r.file, r]));
    return {
      /**
       * Where to load a built-in photo from: its replacement, or the original.
       * Undefined while the replacements load, so a replaced photo never flashes the original first
       * (index.css hides an <img> without a src). Paths outside /images/ pass through untouched.
       */
      src: (path: string | undefined) => (!path?.startsWith("/images/") ? path : data ? byFile.get(photoFile(path))?.url ?? path : undefined),
      /** A photo's description: the replacement's when it has one, else the original's (given, or from photoAlts). */
      alt: (path: string, original?: string) => {
        const file = photoFile(path);
        return byFile.get(file)?.alt || original || (photoAlts as Record<string, string>)[file] || "";
      },
      replaced: (file: string) => byFile.has(file),
    };
  }, [data]);
}
