import { Moon, Sun } from "lucide-react";
import { useSiteTheme } from "@/hooks/use-site-theme";

/** Keycap that switches the site between the light and dark themes. */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useSiteTheme();
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={`press key-dark grid h-10 w-10 shrink-0 place-items-center border border-line text-ink transition-colors hover:border-signal hover:text-beam ${className}`}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
