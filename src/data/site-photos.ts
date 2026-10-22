// ------------------------------------------------------------
//  The built-in photos the admin can replace (/admin → Site photos), grouped as the site uses them.
//  Project photos and team portraits aren't here: they're edited with their project or person.
// ------------------------------------------------------------

import { industries, phases, photoAlts, services, solutions } from "@/data/company";
import { studioGallery } from "@/data/company-pages";
import { photoFile } from "@/lib/photosApi";

/** The proportions a photo is shown at; a replacement in the same shape crops cleanly everywhere. */
export type PhotoShape = "16:10" | "16:9" | "4:3" | "4:5" | "1:1";

export interface PhotoSlot {
  file: string; // the original in public/images/
  label: string;
  where: string; // where the site shows it
  shape: PhotoShape;
  alt?: string; // the original's description; decorative photos have none
}

export interface PhotoGroup {
  title: string;
  slots: PhotoSlot[];
}

export const photoGroups: PhotoGroup[] = [
  {
    title: "Home page",
    slots: [
      { file: "hero-student.webp", label: "Hero — student", where: "Top of the home page, beside the headline", shape: "4:5" },
      { file: "hero-ai.webp", label: "Hero — AI artwork", where: "Top of the home page, and the scrolling strip under it", shape: "1:1" },
      { file: "cta-backdrop.webp", label: "Banner backdrop", where: "Faded behind the Solutions banner and the call-to-action bands", shape: "16:9" },
      { file: "trust-classroom.webp", label: "Responsible AI", where: "Responsible AI band, and the Company menu", shape: "16:10", alt: photoAlts["trust-classroom.webp"] },
    ],
  },
  {
    title: "Solutions",
    slots: solutions.map((s) => ({ file: photoFile(s.image), label: s.title, where: "Home page panels, Solutions pages and menu", shape: "16:10" })),
  },
  {
    title: "Services",
    slots: services
      .filter((s) => s.image)
      .map((s) => ({ file: photoFile(s.image!), label: s.title, where: "Service cards, its service page and the Services menu", shape: "16:10" })),
  },
  {
    title: "Audiences",
    slots: industries.map((ind) => ({ file: photoFile(ind.image), label: ind.title, where: "Who we serve — cards, its page and the menu", shape: "4:5", alt: ind.imageAlt })),
  },
  {
    title: "Delivery phases",
    slots: phases.map((p) => ({ file: photoFile(p.image), label: `${p.name} — ${p.title}`, where: "Process on the home page and How we work", shape: "16:10" })),
  },
  {
    title: "Company & About",
    slots: [
      { file: "company-team.webp", label: "Team at work", where: "Company section on the home page, and the top of About", shape: "4:3", alt: photoAlts["company-team.webp"] },
      { file: "company-learning.webp", label: "Online class", where: "Company section on the home page, and the top of About", shape: "4:3", alt: photoAlts["company-learning.webp"] },
      ...studioGallery.map((g) => ({ file: photoFile(g.src), label: g.caption, where: "“Inside the studio” on About", shape: "16:10" as const, alt: g.alt })),
    ],
  },
  {
    title: "Technology",
    slots: [
      { file: "tech-ai-abstract.webp", label: "Models chosen per task", where: "Technology section, and the Company menu", shape: "16:10" },
      { file: "tech-code.webp", label: "Code you own", where: "Technology section on the home page and Technology", shape: "16:10" },
      { file: "tech-datacenter.webp", label: "Your cloud or ours", where: "Technology section on the home page and Technology", shape: "16:10" },
    ],
  },
];
