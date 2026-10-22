import { useQuery } from "@tanstack/react-query";
import { fetchProjectRows } from "@/lib/portfolioApi";

export const PROJECTS_KEY = ["portfolio", "projects"] as const;

/** Raw project rows for the admin */
export function useProjectRows() {
  return useQuery({ queryKey: PROJECTS_KEY, queryFn: fetchProjectRows, staleTime: 30_000 });
}
