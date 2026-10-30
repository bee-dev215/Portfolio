import { AppWindow, BarChart3, BrainCircuit, Building2, Cloud, HardHat, LifeBuoy, LucideIcon, Monitor, Rocket, Scale, Smartphone, Stethoscope, Truck, Workflow } from "lucide-react";
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

/** One icon per industry, keyed by industry key (see `industries`). */
export const industryIcons: Record<string, LucideIcon> = {
  healthcare: Stethoscope,
  construction: HardHat,
  "real-estate": Building2,
  "professional-services": Scale,
  logistics: Truck,
  startups: Rocket,
};
