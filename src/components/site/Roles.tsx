import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { roles } from "@/data/company";
import RoleCard from "@/components/roles/RoleCard";
import Reveal, { SectionHeading } from "./Reveal";

/** The career paths as photo cards on a soft gradient band, with a way in for people whose role isn't listed. */
export default function Roles() {
  return (
    <section id="roles" className="band-grad px-5 py-24 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-[1240px]">
        <SectionHeading
          split
          label="Open roles"
          title={
            <>
              Find the role that <span className="gradient-text">fits your skills.</span>
            </>
          }
        >
          <p className="text-lg leading-relaxed text-ink-2">
            {roles.length} career paths, all fully remote — with paid training before your first task and a lead who has done the job.
          </p>
        </SectionHeading>

        <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((r, i) => (
            <li key={r.key}>
              <Reveal delay={(i % 3) * 80} className="h-full">
                <RoleCard role={r} />
              </Reveal>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <p className="text-ink-2">
            Don't see your role?{" "}
            <Link to="/apply?role=open" className="font-semibold text-brand-text underline-offset-4 hover:underline">
              Send an open application
            </Link>
            .
          </p>
          <Link to="/roles" className="btn btn-secondary px-6 py-3 text-sm">
            Compare all roles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
