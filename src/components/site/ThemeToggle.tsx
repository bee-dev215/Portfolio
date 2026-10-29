import { Moon, Sun } from "lucide-react";
import { useSiteTheme } from "@/hooks/use-site-theme";

/** Round button that switches the site between the light and dark themes. */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useSiteTheme();
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line-strong bg-surface text-ink-2 transition-[color,border-color,transform] duration-300 hover:border-brand active:rotate-[30deg] hover:text-brand-text ${className}`}
    >
      {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
    </button>
  );
}
