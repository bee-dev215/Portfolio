import { FocusEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { Building2, CalendarDays, ChevronDown, Cpu, LucideIcon, Mail, Menu, Route, ShieldCheck, Users, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  bookCall,
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
} from "@/data/company";
import { Project, projectPath } from "@/data/projects";
import { useProjects } from "@/hooks/use-projects";
import { usePhotos } from "@/hooks/use-photos";
import { serviceIcons } from "./icons";
import ThemeToggle from "./ThemeToggle";

function useScrollState() {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
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
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { active, scrolled };
}

/** Logo mark: the tile J from public/images/logo.png, fitted inside the box. public/images/favicon.png is the same artwork. */
export const Monogram = ({ className = "h-9 w-9" }: { className?: string }) => <span aria-hidden="true" className={`logo-mark block shrink-0 ${className}`} />;

/** The "Jovano" wordmark from the logo; set its height, the width follows. */
export const Wordmark = ({ className = "h-[19px]" }: { className?: string }) => <span aria-hidden="true" className={`logo-wordmark block ${className}`} />;

// ------------------------------------------------------------
//  Menus, built from the site data
// ------------------------------------------------------------

const companyIcons: Record<CompanyMenuKey, LucideIcon> = { about: Building2, approach: Route, technology: Cpu, team: Users, responsible: ShieldCheck, contact: Mail };

interface MenuItem {
  key: string;
  label: string;
  desc: string; // short line under the label in the phone menu
  blurb: string; // caption over the photo while the item is hovered
  image?: string;
  focus?: string; // object-position for the photo, when its subject isn't centred
  icon?: LucideIcon;
  to: string;
}

interface MenuGroup {
  key: string;
  label: string;
  eyebrow: string; // small caps line above the items
  caption: string; // over the photo until an item is hovered
  image: string; // the menu's own photo
  paths: string[]; // the trigger lights up on these pages…
  sections: string[]; // …and while one of these home sections is in view
  all: { label: string; to: string };
  items: MenuItem[];
}

const numberWords = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];

/** 8 → "Eight", for the menu eyebrows */
const spell = (n: number) => numberWords[n] ?? String(n);

/** The Our work menu, built from the projects. */
const projectsMenu = (projects: Project[], ready: boolean): MenuGroup => ({
  key: "projects",
  label: "Our work",
  eyebrow: ready ? `${spell(projects.length)} case studies` : "Case studies",
  caption: "Software we've built to take busywork off people's desks, from field apps to AI assistants.",
  image: "/images/tech-code.webp",
  paths: ["/projects"],
  sections: ["projects"],
  all: { label: "All projects", to: "/projects" },
  items: projects.map((p) => ({
    key: `project-${p.slug}`,
    label: p.title,
    desc: p.client,
    blurb: p.summary,
    image: p.image,
    to: projectPath(p),
  })),
});

// The menus in order; Our work goes third, between these two and the rest
const [servicesMenu, solutionsMenu, ...otherMenus]: MenuGroup[] = [
  {
    key: "services",
    label: "Services",
    eyebrow: `${spell(services.length)} engineering services`,
    caption: "From a two-week prototype to production: AI, custom web, mobile and desktop software, automation, cloud and data.",
    image: "/images/svc-build.webp",
    paths: ["/services"],
    sections: ["services"],
    all: { label: "All services", to: "/services" },
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
    key: "solutions",
    label: "Solutions",
    eyebrow: `${spell(solutions.length)} ready-made solutions`,
    caption: "Ready-made starting points for the most common busywork, fitted to your own documents, tools and team.",
    image: "/images/about-pairing.webp",
    paths: ["/solutions"],
    sections: ["solutions"],
    all: { label: "All solutions", to: "/solutions" },
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
    key: "industries",
    label: "Industries",
    eyebrow: `${spell(industries.length)} industries we serve`,
    caption: "Teams whose weeks we give back — in clinics, on job sites, in offices and in warehouses.",
    image: "/images/hero-work.webp",
    paths: ["/industries"],
    sections: ["industries"],
    all: { label: "All industries", to: "/industries" },
    items: industries.map((ind) => ({
      key: `industry-${ind.key}`,
      label: ind.title,
      desc: ind.focus,
      blurb: ind.desc,
      image: ind.image,
      focus: ind.imageFocus,
      to: industryPath(ind),
    })),
  },
  {
    key: "company",
    label: "Company",
    eyebrow: `Inside ${company.name}`,
    caption: "Who we are, how we work and how to reach us — senior engineers you talk to directly.",
    image: "/images/company-team.webp",
    paths: [...companyMenu.map((c) => c.to), "/faq"],
    sections: ["process", "technology", "company", "faq", "contact"],
    all: { label: "Questions & answers", to: "/faq" },
    items: companyMenu.map((c) => ({
      key: `company-${c.key}`,
      label: c.label,
      desc: c.desc,
      blurb: c.desc,
      image: c.image,
      icon: companyIcons[c.key],
      to: c.to,
    })),
  },
];

const preloaded = new Set<string>();

/** Warms the browser cache for a menu's photos, so hovering never shows an empty frame. */
function preload(group: MenuGroup) {
  for (const src of [group.image, ...group.items.map((it) => it.image)]) {
    if (!src || preloaded.has(src)) continue;
    preloaded.add(src);
    new Image().src = src;
  }
}

// ------------------------------------------------------------
//  Menu photo
// ------------------------------------------------------------

/** The menu's photo and caption; the hovered item's photo and blurb fade in over them. */
function MenuPhoto({ group, peek, onClick }: { group: MenuGroup; peek: number | null; onClick: () => void }) {
  const current = peek === null ? undefined : group.items[peek];
  return (
    // Mouse users can click the photo too; keyboard and screen-reader users already have the item's own link
    <Link
      to={current?.to ?? group.all.to}
      onClick={onClick}
      tabIndex={-1}
      aria-hidden="true"
      className="mega-feature relative flex min-h-[260px] items-center overflow-hidden bg-raised p-8 text-white hover:text-white"
    >
      <img src={group.image} alt="" width={640} height={400} className="absolute inset-0 h-full w-full object-cover" />
      {group.items.map(
        (it, i) =>
          it.image && (
            <img
              key={it.key}
              src={it.image}
              alt=""
              width={640}
              height={400}
              style={{ objectPosition: it.focus }}
              className={`absolute inset-0 h-full w-full object-cover ${peek === i ? "opacity-100" : "opacity-0"}`}
            />
          ),
      )}
      {/* Keyed by item so each change cross-fades */}
      <span key={current?.key ?? "menu"} className="mega-swap relative z-[2] line-clamp-5 max-w-[440px] font-display text-lg font-semibold leading-[1.55]">
        {current?.blurb ?? group.caption}
      </span>
    </Link>
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
  const [peek, setPeek] = useState<number | null>(null); // desktop: the hovered item, shown in the photo
  const [fresh, setFresh] = useState(false); // the panel drops in only when opening from closed
  const { projects, ready } = useProjects();
  const photos = usePhotos();
  // Built-in photos swapped for any replacements chosen in the admin
  const menus = useMemo(
    () => [servicesMenu, solutionsMenu, projectsMenu(projects, ready), ...otherMenus].map((g) => ({ ...g, items: g.items.map((it) => ({ ...it, image: photos.src(it.image) })) })),
    [projects, ready, photos],
  );

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
    setPeek(null);
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

  const book = () => {
    close();
    bookCall();
  };

  const isActive = (g: MenuGroup) => (home ? g.sections.includes(active) : g.paths.some((p) => pathname === p || pathname.startsWith(`${p}/`)));

  return (
    <header
      ref={headerRef}
      data-site-header
      onPointerLeave={(e) => e.pointerType === "mouse" && menu && hideSoon()}
      onPointerEnter={cancelClose}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        menu
          ? "border-b border-line bg-surface"
          : scrolled || open
            ? "glass border-b border-line shadow-[0_8px_30px_-20px_rgb(var(--shadow-rgb)/.5)]"
            : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-4 px-5 sm:px-8 lg:h-[72px]">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2.5 text-left"
          aria-label={`${company.legalName} — home`}
        >
          <Monogram className="h-10 w-10" />
          <span className="leading-tight">
            <Wordmark />
            <span className="mt-1 hidden text-[11px] font-medium text-subtle sm:block">Software & AI engineering</span>
          </span>
        </Link>

        <nav className="mx-auto hidden self-stretch lg:flex" aria-label="Primary">
          {menus.map((g) => {
            const isOpen = menu === g.key;
            return (
              <div key={g.key} className="flex">
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
                  // The underline sits on the header's bottom edge, above the scroll progress line; while a menu is open only its trigger has one
                  className={`relative flex items-center gap-1 whitespace-nowrap px-2.5 font-display text-sm font-semibold transition-colors after:absolute after:inset-x-2 after:-bottom-px after:z-[1] after:h-0.5 after:bg-brand-text after:transition-transform after:duration-200 xl:px-4 xl:text-[15px] xl:after:inset-x-3 ${
                    isOpen || isActive(g) ? "text-brand-text" : "text-ink hover:text-brand-text"
                  } ${isOpen || (!menu && isActive(g)) ? "after:scale-x-100" : "after:scale-x-0"}`}
                >
                  {g.label}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {/* The panel follows its trigger in the DOM, so Tab walks from a trigger into its menu */}
                {isOpen && (
                  <div id={`menu-${g.key}`} onPointerLeave={() => setPeek(null)} className={`shadow-soft absolute inset-x-0 top-full border-t border-line bg-surface ${fresh ? "mega-in" : ""}`}>
                    {/* The full width of the page: the photo on the left, the items in two columns on the right */}
                    <div className="mega-swap mx-auto grid max-w-[1240px] grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-8 px-5 pb-10 pt-9 sm:px-8 xl:gap-12">
                      <MenuPhoto group={g} peek={peek} onClick={close} />
                      <div className="border-l border-line pl-7">
                        <p className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-subtle">{g.eyebrow}</p>
                        <ul className="grid grid-cols-2 gap-x-8 gap-y-1">
                          {g.items.map((it, i) => (
                            <li key={it.key}>
                              <Link
                                to={it.to}
                                onPointerEnter={() => setPeek(i)}
                                onFocus={() => setPeek(i)}
                                onClick={close}
                                className={`block py-2.5 font-display text-base font-medium leading-snug transition-[color,transform] duration-150 ${
                                  peek === i ? "translate-x-[3px] text-brand-text" : "text-ink"
                                }`}
                              >
                                {it.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <Link
                          to={g.all.to}
                          onFocus={() => setPeek(null)}
                          onClick={close}
                          className="mt-[18px] inline-flex items-center gap-1.5 font-display text-[15px] font-semibold text-brand-text"
                        >
                          {g.all.label}
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <ThemeToggle />
          <Link to="/book" className="btn btn-primary hidden whitespace-nowrap px-5 py-2.5 text-sm sm:inline-flex">
            Book a call <CalendarDays className="h-4 w-4" />
          </Link>
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
                        {g.all.label}
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
          <button onClick={book} className="btn btn-primary mt-5 w-full py-3.5">
            Book a free call <CalendarDays className="h-4 w-4" />
          </button>
        </div>
      )}
    </header>
  );
}
