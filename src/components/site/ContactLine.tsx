import { company } from "@/data/company";
import { copyLine } from "./reach";

/** Phone and email printed out as underlined links, for the dark call-to-action cards. */
export default function ContactLine({ className = "" }: { className?: string }) {
  const lines = [
    { key: "phone", value: company.phone, href: company.phoneHref },
    { key: "email", value: company.email, href: `mailto:${company.email}` },
  ];
  return (
    <div className={`flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-white ${className}`}>
      {lines.map((l) => (
        <a key={l.key} href={l.href} onClick={() => copyLine(l.value)} className="border-b border-white/40 pb-1 transition-colors hover:border-white">
          {l.value}
        </a>
      ))}
    </div>
  );
}
