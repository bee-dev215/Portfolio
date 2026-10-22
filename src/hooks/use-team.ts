import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { fetchSiteTeam, TEAM_KEY } from "@/lib/teamApi";
import { builtInTeam, TeamMember } from "@/data/company";

const NONE: TeamMember[] = [];

/**
 * The team the site shows, read once per visit and shared by every page.
 * `ready` is false only while the first database read is in flight; `team` is empty until then.
 */
export function useTeam() {
  const { data } = useQuery({
    queryKey: [...TEAM_KEY, "site"],
    queryFn: fetchSiteTeam,
    staleTime: 5 * 60_000,
    // Without a database the built-in team is the answer, so there's nothing to wait for
    initialData: supabase ? undefined : builtInTeam,
  });
  return { team: data ?? NONE, ready: data !== undefined };
}
