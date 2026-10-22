import { FocusEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Building2, ChevronDown, Cpu, LucideIcon, Mail, Menu, Phone, Route, ShieldCheck, Users, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  company,
  companyMenu,
  CompanyMenuKey,
  homeSections,
  industries,
  industryPath,
  servicePath,
  services,
  solutionPath,
  solutions,
  startEnquiry,
  team,
} from "@/data/company";
import { Project, projectPath } from "@/data/projects";
import { useProjects } from "@/hooks/use-projects";
import { serviceIcons } from "./icons";
import ThemeToggle from "./ThemeToggle";

function useScrollState() {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty("--progress", max > 0 ? (window.scrollY / max).toFixed(4) : "0");
      let current = "";
      for (const id of homeSections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.35) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { active, scrolled };
}

/** Logo mark: gradient tile with a graduation cap whose tassel ends in a spark. public/favicon.svg is the same artwork. */
export const Monogram = ({ className = "h-9 w-9" }: { className?: string }) => (
  <span className={`bg-grad grid shrink-0 place-items-center rounded-xl text-white shadow-[0_8px_18px_-8px_rgb(var(--brand-rgb)/.7)] ${className}`}>
    <svg viewBox="0 0 64 64" className="h-full w-full" fill="currentColor" aria-hidden="true">
      <path d="M32 13 54 23 32 33 10 23Z" />
      <path d="M19 30.4 32 36.3 45 30.4V39.5C40 43.8 24 43.8 19 39.5Z" />
      <path d="M50.5 25V34.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M50.5 34.7Q51.43 39.57 56.3 40.5Q51.43 41.43 50.5 46.3Q49.57 41.43 44.7 40.5Q49.57 39.57 50.5 34.7Z" />
    </svg>
  </span>
);

// ------------------------------------------------------------
//  Menus, built from the site data
// ------------------------------------------------------------

const companyIcons: Record<CompanyMenuKey, LucideIcon> = { about: Building2, approach: Route, technology: Cpu, team: Users, responsible: ShieldCheck, contact: Mail };

interface MenuItem {
  key: string;
  label: string;
  desc: string; // short line under the label
  blurb: string; // longer text in the preview
  image?: string;
  preview?: "team" | "contact"; // drawn previews for items without a photo
  icon?: LucideIcon;
  to: string;
}

interface MenuGroup {
  key: string;
  label: string;
  intro: string; // one line under the panel's heading
  paths: string[]; // the trigger lights up on these pages…
  sections: string[]; // …and while one of these home sections is in view
  all: { label: string; to: string };
  items: MenuItem[];
}

/** The Projects menu, built from the projects once they've loaded. */
const projectsMenu = (projects: Project[], ready: boolean): MenuGroup => ({
  key: "projects",
  label: "Projects",
  intro: "Selected work with schools, universities and learning teams",
  paths: ["/projects"],
  sections: ["projects"],
  all: { label: ready ? `All ${projects.length} projects` : "All projects", to: "/projects" },
  items: projects.map((p) => ({
    key: `project-${p.slug}`,
    label: p.title,
    desc: p.client,
    blurb: p.summary,
    image: p.image,
    to: projectPath(p),
  })),
});

// The menus in order; the Projects menu goes second, once the projects are known
const [solutionsMenu, ...otherMenus]: MenuGroup[] = [
  {
    key: "solutions",
    label: "Solutions",
    intro: "AI products for teaching, learning and training",
    paths: ["/solutions"],
    sections: ["solutions"],
    all: { label: `All ${solutions.length} solutions`, to: "/solutions" },
    items: solutions.map((s) => ({
      key: `solution-${s.id}`,
      label: s.title,
      desc: s.domain,
      blurb: s.summary,
      image: s.image,
      to: solutionPath(s),
    })),
  },
  {
    key: "services",
    label: "Services",
    intro: "Hands-on help from first prototype to production",
    paths: ["/services"],
    sections: ["services"],
    all: { label: `All ${services.length} services`, to: "/services" },
    items: services.map((s) => ({
      key: `service-${s.key}`,
      label: s.title,
      desc: s.includes.join(" · "),
      blurb: s.desc,
      image: s.image,
      icon: serviceIcons[s.key],
      to: servicePath(s),
    })),
  },
  {
    key: "audiences",
    label: "Who we serve",
    intro: "Built around the people who teach and learn",
    paths: ["/industries"],
    sections: ["industries", "outcomes"],
    all: { label: `All ${industries.length} audiences`, to: "/industries" },
    items: industries.map((ind) => ({
      key: `audience-${ind.key}`,
      label: ind.title,
      desc: ind.focus,
      blurb: ind.desc,
      image: ind.image,
      to: industryPath(ind),
    })),
  },
  {
    key: "company",
    label: "Company",
    intro: "Who we are, how we work and how to reach us",
    paths: [...companyMenu.map((c) => c.to), "/faq"],
    sections: ["process", "technology", "company", "team", "faq", "contact"],
    all: { label: "Questions & answers", to: "/faq" },
    items: companyMenu.map((c) => ({
      key: `company-${c.key}`,
      label: c.label,
      desc: c.desc,
      blurb: c.desc,
      image: c.image,
      preview: c.key === "team" || c.key === "contact" ? c.key : undefined,
      icon: companyIcons[c.key],
      to: c.to,
    })),
  },
];

const preloaded = new Set<string>();

/** Warms the browser cache for a menu's preview photos, so hovering never shows an empty frame. */
function preload(group: MenuGroup) {
  for (const it of group.items) {
    if (!it.image || preloaded.has(it.image)) continue;
    preloaded.add(it.image);
    new Image().src = it.image;
  }
}

// ------------------------------------------------------------
//  Preview column
// ------------------------------------------------------------

const frame = "relative grid aspect-[16/9] w-full place-items-center overflow-hidden rounded-2xl border border-line";

function TeamPreview() {
  const faces = team.filter((m) => m.photo).slice(0, 5);
  const more = team.length - faces.length;
  return (
    <div className={`${frame} bg-brand-soft`}>
      <div className="mesh absolute inset-0 opacity-70" />
      <div className="relative flex items-center">
        {faces.map((m, i) => (
          <img key={m.name} src={m.photo} alt="" width={52} height={52} className={`h-[52px] w-[52px] rounded-full border-[3px] border-surface object-cover ${i ? "-ml-4" : ""}`} />
        ))}
        {more > 0 && <span className="-ml-4 grid h-[52px] w-[52px] place-items-center rounded-full border-[3px] border-surface bg-grad text-sm font-bold text-white">+{more}</span>}
      </div>
    </div>
  );
}

function ContactPreview() {
  return (
    <div className={`${frame} bg-brand-soft p-5`}>
      <div className="mesh absolute inset-0 opacity-70" />
      <ul className="relative w-full space-y-2 text-sm">
        <li className="flex items-center gap-2.5 font-semibold">
          <span className="grid h-7 w-7 place-items-center">
            <span className="live-dot" />
          </span>
          {company.availability}
        </li>
        <li className="flex items-center gap-2.5 text-ink-2">
          <Mail className="h-7 w-7 rounded-lg bg-surface p-1.5 text-brand-text" /> <span className="truncate">{company.email}</span>
        </li>
        <li className="flex items-center gap-2.5 text-ink-2">
          <Phone className="h-7 w-7 rounded-lg bg-surface p-1.5 text-brand-text" /> {company.phone}
        </li>
      </ul>
    </div>
  );
}

function IconPreview({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className={`${frame} bg-brand-soft`}>
      <div className="mesh absolute inset-0 opacity-70" />
      <span className="icon-tile relative h-16 w-16 rounded-2xl">
        <Icon className="h-8 w-8" />
      </span>
    </div>
  );
}

function Preview({ item }: { item: MenuItem }) {
  return (
    // Keyed by item so each change cross-fades
    <div key={item.key} className="mega-swap">
      {item.preview === "team" ? (
        <TeamPreview />
      ) : item.preview === "contact" ? (
        <ContactPreview />
      ) : item.image ? (
        <img src={item.image} alt="" width={300} height={169} className={`${frame} bg-raised object-cover`} />
      ) : (
        item.icon && <IconPreview icon={item.icon} />
      )}
      <p className="mt-4 font-display text-base font-bold tracking-tight">{item.label}</p>
      <p className="mt-1 line-clamp-4 text-sm leading-relaxed text-subtle">{item.blurb}</p>
    </div>
  );
}

// ------------------------------------------------------------
//  Navbar
// ------------------------------------------------------------

export default function Navbar() {
  const { active, scrolled } = useScrollState();
  const { pathname } = useLocation();
  const home = pathname === "/";
  const [open, setOpen] = useState(false); // phone menu
  const [expanded, setExpanded] = useState<string | null>(null); // phone menu: the group shown
  const [menu, setMenu] = useState<string | null>(null); // desktop: the open group
  const [peek, setPeek] = useState(0); // desktop: the previewed item
  const [fresh, setFresh] = useState(false); // the panel drops in only when opening from closed
  const { projects, ready } = useProjects();
  const menus = useMemo(() => [solutionsMenu, projectsMenu(projects, ready), ...otherMenus], [projects, ready]);

  const headerRef = useRef<HTMLElement>(null);
  const triggers = useRef<Record<string, HTMLButtonElement | null>>({});
  const closeTimer = useRef<number>();
  const hoverOpenedAt = useRef(0);

  const cancelClose = () => window.clearTimeout(closeTimer.current);

  const show = (key: string) => {
    cancelClose();
    if (key === menu) return;
    preload(menus.find((g) => g.key === key)!);
    setFresh(menu === null);
    setMenu(key);
    setPeek(0);
  };

  const hide = () => {
    cancelClose();
    setMenu(null);
  };

  // A short grace period, so crossing the gap between a trigger and its panel doesn't close it
  const hideSoon = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setMenu(null), 180);
  };

  // A mouse opens a menu on hover, so a click that quickly follows keeps it open rather than toggling it shut
  const onTriggerClick = (key: string) => {
    if (menu === key && performance.now() - hoverOpenedAt.current < 600) return;
    if (menu === key) hide();
    else show(key);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "Escape" || !menu) return;
    triggers.current[menu]?.focus();
    hide();
  };

  // Tabbing out of the header closes the menu
  const onBlur = (e: FocusEvent) => {
    const next = e.relatedTarget as Node | null;
    if (next && !headerRef.current?.contains(next)) hide();
  };

  // Clicking anywhere else closes it too
  useEffect(() => {
    if (!menu) return;
    const onDown = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setMenu(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [menu]);

  useEffect(() => cancelClose, []);

  // Close every menu when the page changes
  useEffect(() => {
    setMenu(null);
    setOpen(false);
  }, [pathname]);

  const close = () => {
    hide();
    setOpen(false);
  };

  const enquire = () => {
    close();
    startEnquiry();
  };

  const isActive = (g: MenuGroup) => (home ? g.sections.includes(active) : g.paths.some((p) => pathname === p || pathname.startsWith(`${p}/`)));

  return (
    <header
      ref={headerRef}
      onPointerLeave={(e) => e.pointerType === "mouse" && menu && hideSoon()}
      onPointerEnter={cancelClose}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open || menu ? "glass border-b border-line shadow-[0_8px_30px_-20px_rgb(var(--shadow-rgb)/.5)]" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-4 px-5 sm:px-8 lg:h-[72px]">
        <Link
          to="/"
          onClick={() => home && window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex shrink-0 items-center gap-2.5 text-left"
          aria-label={`${company.legalName} — home`}
        >
          <Monogram />
          <span className="leading-tight">
            <span className="block font-display text-lg font-extrabold tracking-tight">{company.name}</span>
            <span className="hidden text-[11px] font-medium text-subtle sm:block">AI for education</span>
          </span>
        </Link>

        <nav className="mx-auto hidden items-center gap-1 rounded-full border border-line bg-surface/60 p-1 lg:flex" aria-label="Primary">
          {menus.map((g) => {
            const isOpen = menu === g.key;
            const current = g.items[Math.min(peek, g.items.length - 1)];
            return (
              <div key={g.key}>
                <button
                  ref={(el) => (triggers.current[g.key] = el)}
                  onPointerEnter={(e) => {
                    if (e.pointerType !== "mouse") return;
                    if (menu !== g.key) hoverOpenedAt.current = performance.now();
                    show(g.key);
                  }}
                  onClick={() => onTriggerClick(g.key)}
                  aria-expanded={isOpen}
                  aria-controls={`menu-${g.key}`}
                  className={`flex items-center gap-1 rounded-full py-1.5 pl-4 pr-3 text-sm font-medium transition-colors ${
                    isOpen ? "bg-brand-soft text-brand-text" : isActive(g) ? "text-brand-text hover:bg-raised" : "text-ink-2 hover:bg-raised hover:text-ink"
                  }`}
                >
                  {g.label}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {/* The panel follows its trigger in the DOM, so Tab walks from a trigger into its menu */}
                {isOpen && (
                  <div id={`menu-${g.key}`} className={`absolute inset-x-0 top-full px-5 pt-2 sm:px-8 ${fresh ? "mega-in" : ""}`}>
                    {/* Three columns: what the menu covers, its items (text only; photos show in the preview), and the preview */}
                    <div className="shadow-soft mx-auto grid max-w-[1240px] grid-cols-[210px_1fr_270px] overflow-hidden rounded-3xl border border-line bg-surface xl:grid-cols-[240px_1fr_300px]">
                      <div key={g.key} className="mega-swap flex flex-col justify-between gap-8 border-r border-line bg-raised/50 p-6">
                        <div>
                          <p className="font-display text-xl font-bold tracking-tight">{g.label}</p>
                          <p className="mt-2 text-sm leading-relaxed text-subtle">{g.intro}</p>
                          <Link to={g.all.to} onClick={close} className="group mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-text">
                            {g.all.label} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        </div>
                        <div className="border-t border-line pt-4 text-sm">
                          <p className="text-subtle">Not sure where to start?</p>
                          <button onClick={enquire} className="u-link mt-1 font-semibold text-ink">
                            Talk to an engineer
                          </button>
                        </div>
                      </div>
                      <ul key={`${g.key}-items`} className="mega-swap grid grid-cols-2 content-start gap-1 p-4 xl:p-5">
                        {g.items.map((it, i) => (
                          <li key={it.key}>
                            <Link
                              to={it.to}
                              onPointerEnter={() => setPeek(i)}
                              onFocus={() => setPeek(i)}
                              onClick={close}
                              className={`block h-full rounded-xl px-4 py-3 transition-colors ${peek === i ? "bg-raised" : ""}`}
                            >
                              <span className={`block font-display text-[15px] font-semibold leading-snug transition-colors ${peek === i ? "text-brand-text" : ""}`}>{it.label}</span>
                              <span className="mt-0.5 line-clamp-2 block text-[13px] leading-snug text-subtle">{it.desc}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      {/* Mouse users can click the preview too; keyboard and screen-reader users already have the item's own link */}
                      <aside className="border-l border-line p-5" aria-hidden="true">
                        {current && (
                          <Link to={current.to} onClick={close} tabIndex={-1} className="block">
                            <Preview item={current} />
                          </Link>
                        )}
                      </aside>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <ThemeToggle />
          <button onClick={() => startEnquiry()} className="btn btn-primary hidden px-5 py-2.5 text-sm sm:inline-flex">
            Start a project <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-brand/40 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <span className={`scroll-line bg-grad absolute inset-x-0 bottom-[-1px] h-[2px] transition-opacity duration-300 ${scrolled && !menu ? "opacity-100" : "opacity-0"}`} aria-hidden="true" />

      {open && (
        <div className="fade-up max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-line px-5 pb-6 pt-2 sm:px-8 lg:hidden" style={{ animationDuration: ".3s" }}>
          {menus.map((g) => {
            const isOpen = expanded === g.key;
            return (
              <div key={g.key} className="border-b border-line">
                <button
                  onClick={() => setExpanded(isOpen ? null : g.key)}
                  aria-expanded={isOpen}
                  className={`flex w-full items-center justify-between py-4 text-left font-display text-lg font-semibold ${isActive(g) || isOpen ? "text-brand-text" : "text-ink"}`}
                >
                  {g.label}
                  <ChevronDown className={`h-4 w-4 text-subtle transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <ul className="mega-in -mx-2 pb-3">
                    {g.items.map((it) => {
                      const Icon = it.icon;
                      return (
                        <li key={it.key}>
                          <Link to={it.to} onClick={close} className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-raised">
                            {Icon ? (
                              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-text">
                                <Icon className="h-[18px] w-[18px]" />
                              </span>
                            ) : (
                              it.image && <img src={it.image} alt="" loading="lazy" width={40} height={40} className="h-10 w-10 shrink-0 rounded-xl bg-raised object-cover" />
                            )}
                            <span className="min-w-0">
                              <span className="block font-semibold">{it.label}</span>
                              <span className="block truncate text-[13px] text-subtle">{it.desc}</span>
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                    <li>
                      <Link to={g.all.to} onClick={close} className="inline-flex items-center gap-1.5 px-2 pt-2 text-sm font-semibold text-brand-text">
                        {g.all.label} <ArrowRight className="h-4 w-4" />
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            );
          })}
          <div className="mt-5 flex items-center gap-2 text-sm text-subtle">
            <span className="live-dot" /> {company.availability}
          </div>
          <button onClick={enquire} className="btn btn-primary mt-5 w-full py-3.5">
            Start a project <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </header>
  );
}
