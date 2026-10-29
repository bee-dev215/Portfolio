import { builtInProjects } from "@/data/projects";

const state = { projects: builtInProjects, ready: true };

/** The projects the site shows: the case studies in src/data/projects.ts, in their order there. */
export function useProjects() {
  return state;
}
