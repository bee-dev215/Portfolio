import { AppWindow, BarChart3, BrainCircuit, Cloud, LifeBuoy, LucideIcon, Monitor, Smartphone, Workflow } from "lucide-react";
import { ServiceKey } from "@/data/company";

/** One icon per service, shared by the Services section, the service pages and the top-bar menu. */
export const serviceIcons: Record<ServiceKey, LucideIcon> = {
  ai: BrainCircuit,
  web: AppWindow,
  mobile: Smartphone,
  desktop: Monitor,
  automation: Workflow,
  cloud: Cloud,
  data: BarChart3,
  rescue: LifeBuoy,
};
