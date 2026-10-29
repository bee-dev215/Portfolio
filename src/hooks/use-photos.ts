import { photoAlts } from "@/data/company";

/** "/images/svc-llm.webp" → "svc-llm.webp" */
const photoFile = (path: string) => path.replace(/^\/images\//, "");

const photos = {
  /** Where to load a photo from. Photos live in public/images/, so this is the path itself. */
  src: (path: string | undefined) => path,
  /** A photo's description: the one given, else its entry in photoAlts. */
  alt: (path: string, original?: string) => original || (photoAlts as Record<string, string>)[photoFile(path)] || "",
  replaced: (_file: string) => false,
};

/** The site's photos and their descriptions (public/images/; descriptions in src/data/company.ts). */
export function usePhotos() {
  return photos;
}
