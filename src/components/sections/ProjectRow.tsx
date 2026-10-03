import Link from "next/link";
import { ArrowGlyph } from "@/components/ui/Button";
import { OwnershipBadge, Tag } from "@/components/ui/Label";
import type { Project } from "@/content/types";

/**
 * A full-width project section. Deliberately not a three-column card grid —
 * each flagship project gets room to state its problem before asking for a click.
 */
export default function ProjectRow({
  project,
  index,
  titleAs: Title = "h3",
}: {
  project: Project;
  index: number;
  /** The page owns the heading level: h3 under a section heading, h2 directly under the h1. */
  titleAs?: "h2" | "h3";
}) {
  const href = `/work/${project.slug}`;
  const idx = String(index + 1).padStart(2, "0");

  return (
    <article className="group relative">
      <Link
        href={href}
        className="block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
        aria-label={`${project.title} — read the case study`}
      >
        <div className="relative overflow-hidden rounded-2xl border border-line bg-surface/55 transition-all duration-600 ease-[var(--ease-out-expo)] group-hover:-translate-y-1 group-hover:border-line-bright group-hover:bg-surface-2/70">
          {/* Hover glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-32 -right-24 size-80 rounded-full bg-signal/10 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
          />
          {/* Orbital pulse that sweeps the top edge on hover */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden"
          >
            <div className="h-px w-1/3 -translate-x-full bg-gradient-to-r from-transparent via-signal to-transparent transition-transform duration-1000 ease-[var(--ease-out-expo)] group-hover:translate-x-[320%]" />
          </div>

          <div className="relative grid gap-8 p-6 sm:p-9 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
            {/* Left: the story */}
            <div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="mono-label tabular-nums text-signal/70">{idx}</span>
                <OwnershipBadge
                  ownership={project.ownership}
                  note={project.ownershipNote}
                />
              </div>

              <Title className="mt-5 text-[length:var(--text-display-sm)] font-semibold tracking-[-0.035em] text-ink transition-colors duration-400 group-hover:text-signal-pale">
                {project.title}
              </Title>
              <p className="mono-meta mt-2 text-ink-3">{project.subtitle}</p>

              <p className="mt-5 max-w-xl text-[0.9375rem] leading-relaxed text-ink-2">
                {project.cardSummary}
              </p>

              <span className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-signal">
                Explore case study
                <ArrowGlyph />
              </span>
            </div>

            {/* Right: the metadata readout */}
            <dl className="grid gap-5 self-start border-t border-line pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
              <div>
                <dt className="mono-label">Role</dt>
                <dd className="mt-1.5 text-sm text-ink-2">{project.role}</dd>
              </div>
              {project.period && (
                <div>
                  <dt className="mono-label">Period</dt>
                  <dd className="mono-meta mt-1.5 text-ink-2">{project.period}</dd>
                </div>
              )}
              <div>
                <dt className="mono-label">Focus</dt>
                <dd className="mt-2 flex flex-wrap gap-1.5">
                  {project.focus.map((f) => (
                    <Tag key={f}>{f}</Tag>
                  ))}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </Link>
    </article>
  );
}
