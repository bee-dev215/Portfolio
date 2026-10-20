import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchExperienceRows,
  fetchProjectRows,
  toJob,
  toProject,
} from "@/lib/portfolioApi";

export const PROJECTS_KEY = ["portfolio", "projects"] as const;
export const EXPERIENCE_KEY = ["portfolio", "experience"] as const;

/** Raw rows (admin) */
export function useProjectRows() {
  return useQuery({ queryKey: PROJECTS_KEY, queryFn: fetchProjectRows, staleTime: 30_000 });
}

export function useExperienceRows() {
  return useQuery({ queryKey: EXPERIENCE_KEY, queryFn: fetchExperienceRows, staleTime: 30_000 });
}

/** Mapped UI data (public site) */
export function useProjects() {
  const q = useProjectRows();
  const projects = useMemo(() => (q.data ?? []).map(toProject), [q.data]);
  return { projects, isLoading: q.isLoading, isError: q.isError };
}

export function useExperience() {
  const q = useExperienceRows();
  const experience = useMemo(() => (q.data ?? []).map(toJob), [q.data]);
  return { experience, isLoading: q.isLoading, isError: q.isError };
}
