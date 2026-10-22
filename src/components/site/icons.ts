import { BarChart3, Bot, Cable, Gauge, GraduationCap, LucideIcon, Mic, PenTool, Rocket } from "lucide-react";
import { ServiceKey } from "@/data/company";

/** One icon per service, shared by the Services section, the service pages and the top-bar menu. */
export const serviceIcons: Record<ServiceKey, LucideIcon> = {
  build: Rocket,
  llm: Bot,
  platform: Cable,
  academy: GraduationCap,
  analytics: BarChart3,
  evaluation: Gauge,
  voice: Mic,
  design: PenTool,
};
