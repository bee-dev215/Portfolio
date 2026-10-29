import { Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { company } from "@/data/company";

/** Email and phone as actions. The address and number aren't printed: they show on hover and are copied when clicked. */
export const directLines = [
  { key: "email", label: "Email us", note: `Reply within ${company.responseTime}`, value: company.email, href: `mailto:${company.email}`, icon: Mail },
  { key: "phone", label: "Call us", note: "Talk it through with the team", value: company.phone, href: company.phoneHref, icon: Phone },
];

// The link still opens the mail app or dialer; the copy covers visitors who have neither set up
export const copyLine = (value: string) =>
  navigator.clipboard.writeText(value).then(
    () => toast.success(`Copied ${value}`),
    () => {},
  );

/** Hover label above a tile or link (the parent needs `group relative`). Pointer devices only. */
export const tipCls =
  "pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1 text-xs font-semibold text-canvas opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100";
