import {
  Award,
  BadgeCheck,
  Bug,
  CalendarClock,
  CalendarDays,
  Camera,
  CheckSquare,
  Code2,
  Database,
  Globe2,
  GraduationCap,
  Handshake,
  Headset,
  Heart,
  LayoutDashboard,
  Laptop,
  LucideIcon,
  MessagesSquare,
  Rocket,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
  Wallet,
  Wifi,
} from "lucide-react";
import type { PerkKey, ReadyKey, RoleKey, ValueKey, WorkspaceKey } from "@/data/company";

/** One icon per role, shared by the role cards, the role pages, the apply form and the top-bar menu. */
export const roleIcons: Record<RoleKey, LucideIcon> = {
  assistant: CalendarClock,
  support: Headset,
  engineer: Code2,
  growth: TrendingUp,
  qa: Bug,
  operations: Database,
};

export const perkIcons: Record<PerkKey, LucideIcon> = {
  anywhere: Globe2,
  simple: Sparkles,
  human: UserCheck,
  hours: CalendarDays,
  pay: Wallet,
  levels: Award,
};

export const workspaceIcons: Record<WorkspaceKey, LucideIcon> = {
  overview: LayoutDashboard,
  schedule: CalendarDays,
  tasks: CheckSquare,
  payments: Wallet,
  chat: MessagesSquare,
  learning: GraduationCap,
};

export const readyIcons: Record<ReadyKey, LucideIcon> = {
  computer: Laptop,
  internet: Wifi,
  camera: Camera,
  payout: Wallet,
};

export const valueIcons: Record<ValueKey, LucideIcon> = {
  integrity: ShieldCheck,
  excellence: BadgeCheck,
  collaboration: Handshake,
  empowerment: Rocket,
};

export { Heart };
