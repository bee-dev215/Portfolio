import { builtInTeam } from "@/data/company";

const state = { team: builtInTeam, ready: true };

/** The team the site shows: `builtInTeam` in src/data/company.ts, in its order there. */
export function useTeam() {
  return state;
}
