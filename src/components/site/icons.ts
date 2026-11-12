import { AppWindow, BrainCircuit, LucideIcon, Workflow } from "lucide-react";
import { ServiceKey } from "@/data/company";

/** One icon per service, shared by the Services section, the service pages and the top-bar menu. */
export const serviceIcons: Record<ServiceKey, LucideIcon> = {
  ai: BrainCircuit,
  automation: Workflow,
  software: AppWindow,
};
