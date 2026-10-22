import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { fetchSiteProjects, PROJECTS_KEY } from "@/lib/projectsApi";
import { builtInProjects, Project } from "@/data/projects";

const NONE: Project[] = [];

/**
 * The projects the site shows, read once per visit and shared by every page.
 * `ready` is false only while the first database read is in flight; `projects` is empty until then.
 */
export function useProjects() {
  const { data } = useQuery({
    queryKey: [...PROJECTS_KEY, "site"],
    queryFn: fetchSiteProjects,
    staleTime: 5 * 60_000,
    // Without a database the built-in list is the answer, so there's nothing to wait for
    initialData: supabase ? undefined : builtInProjects,
  });
  return { projects: data ?? NONE, ready: data !== undefined };
}
