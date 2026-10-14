import Link from "next/link";
import { ArrowGlyph } from "@/components/ui/Button";
import { OwnershipBadge } from "@/components/ui/Label";
import ProjectBanner from "@/components/visual/banners/ProjectBanner";
import type { Project } from "@/content/types";
import ProjectStack from "./ProjectStack";
import TiltCard from "./TiltCard";

const bannerBg = "bg-[radial-gradient(120%_90%_at_50%_0%,var(--color-surface-2),var(--color-void))]";

/** The flagship: banner beside the story, at twice the weight of the rest. */
export function FeaturedProject({ project }: { project: Project }) {
  return (
    <article className="group">
      <TiltCard max={2.5} className="rounded-3xl">
        <Link
          href={`/work/${project.slug}`}
          aria-label={`${project.title} — read the case study`}
          className="grid overflow-hidden rounded-3xl border border-line bg-surface/70 transition-[border-color,background-color] duration-500 hover:border-line-bright hover:bg-surface-2/70 focus-visible:outline-offset-4 lg:grid-cols-[1.25fr_1fr]"
        >
          <div className={`relative border-b border-line lg:border-r lg:border-b-0 ${bannerBg}`}>
            <span className="mono-label absolute top-5 left-5 z-10 rounded-full border border-signal/30 bg-void/70 px-2.5 py-1 text-signal backdrop-blur">Featured</span>
            <ProjectBanner slug={project.slug} className="aspect-[16/9] h-full w-full transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.02]" />
          </div>
          <div className="flex flex-col p-7 sm:p-9">
            <OwnershipBadge ownership={project.ownership} note={project.ownershipNote} />
            <h2 className="mt-5 text-[length:var(--text-display-sm)] font-semibold tracking-[-0.035em] text-balance text-ink transition-colors duration-300 group-hover:text-signal-pale">
              {project.title}
            </h2>
            <p className="mono-meta mt-2 text-ink-3">{project.subtitle}</p>
            <p className="mt-5 text-[length:var(--text-fluid-base)] leading-relaxed text-ink-2">{project.cardSummary}</p>
            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5">
              <div>
                <dt className="mono-label">Role</dt>
                <dd className="mt-1.5 text-sm text-ink-2">{project.role.split(" — ")[0]}</dd>
              </div>
              {project.period && (
                <div>
                  <dt className="mono-label">Period</dt>
                  <dd className="mono-meta mt-1.5 text-ink-2">{project.period}</dd>
                </div>
              )}
            </dl>
            <ProjectStack project={project} className="mt-6" />
            <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-medium text-signal">
              Read the case study
              <ArrowGlyph />
            </span>
          </div>
        </Link>
      </TiltCard>
    </article>
  );
}

/** Supporting projects: banner on top, compact story, the same onward link. */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group h-full">
      <TiltCard className="rounded-2xl">
        <Link
          href={`/work/${project.slug}`}
          aria-label={`${project.title} — read the case study`}
          className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface/70 transition-[border-color,background-color] duration-500 hover:border-line-bright hover:bg-surface-2/70 focus-visible:outline-offset-4"
        >
          <div className={`border-b border-line ${bannerBg}`}>
            <ProjectBanner slug={project.slug} className="aspect-[16/9] h-auto w-full transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.02]" />
          </div>
          <div className="flex flex-1 flex-col p-6">
            <OwnershipBadge ownership={project.ownership} />
            <h2 className="mt-4 text-[length:var(--text-fluid-xl)] font-semibold tracking-[-0.03em] text-balance text-ink transition-colors duration-300 group-hover:text-signal-pale">
              {project.title}
            </h2>
            <p className="mono-meta mt-1.5 text-ink-3">{project.subtitle}</p>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-2">{project.tagline}</p>
            <ProjectStack project={project} max={4} className="mt-5" />
            <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium text-signal">
              Read the case study
              <ArrowGlyph />
            </span>
          </div>
        </Link>
      </TiltCard>
    </article>
  );
}
