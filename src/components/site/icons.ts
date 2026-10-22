import { Bot, Cable, GraduationCap, LucideIcon, Rocket } from "lucide-react";
import { ServiceKey } from "@/data/company";

/** One icon per service, shared by the Services section and the top-bar menu. */
export const serviceIcons: Record<ServiceKey, LucideIcon> = { build: Rocket, llm: Bot, platform: Cable, academy: GraduationCap };
