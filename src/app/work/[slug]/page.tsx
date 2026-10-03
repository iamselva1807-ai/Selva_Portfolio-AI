import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PipelineFlow from "@/components/visual/PipelineFlow";
import ArchitectureDiagram from "@/components/visual/ArchitectureDiagram";
import { SectionLabel, OwnershipBadge, Tag } from "@/components/ui/Label";
import { ArrowGlyph, CTA } from "@/components/ui/Button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { projects, getProject, adjacentProjects } from "@/content/projects";
import { buildPageMetadata } from "@/content/metadata";

/** Every case study is known at build time; anything else is a real 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Case study not found" };
  return buildPageMetadata({
    route: `/work/${project.slug}`,
    title: project.title,
    description: project.tagline,
    type: "article",
  });
}

/** Section wrapper so every case study has identical rhythm. */
function Block({
  index,
  label,
  title,
  children,
}: {
  index: string;
  label: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line/70 py-14 sm:py-20">
      <Reveal>
        <SectionLabel index={index}>{label}</SectionLabel>
        {title && (
          <h2 className="mt-5 max-w-3xl text-[length:var(--text-display-sm)] font-semibold text-ink">
            {title}
          </h2>
        )}
      </Reveal>
      <Reveal delay={0.05}>{children}</Reveal>
    </section>
  );
}

function Prose({ body }: { body: string[] }) {
  return (
    <div className="mt-6 max-w-2xl space-y-5">
      {body.map((p, i) => (
        <p key={i} className="text-[length:var(--text-fluid-base)] leading-relaxed text-ink-2">
          {p}
        </p>
      ))}
    </div>
  );
}

export default async function CaseStudy({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { prev, next } = adjacentProjects(project.slug);

  return (
    <article>
      {/* ---------------- Header ---------------- */}
      <header className="shell pt-32 pb-12 sm:pt-40">
        <Reveal>
          <Link
            href="/work"
            className="group mono-meta inline-flex items-center gap-2 text-ink-3 transition-colors hover:text-signal"
          >
            <ArrowGlyph className="rotate-180 group-hover:-translate-x-1" />
            All work
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
            <OwnershipBadge
              ownership={project.ownership}
              note={project.ownershipNote}
            />
          </div>

          <h1 className="ink-gradient mt-6 max-w-4xl text-[length:var(--text-display)] font-semibold">
            {project.title}
          </h1>
          <p className="mono-meta mt-3 text-signal/85">{project.subtitle}</p>

          <p className="mt-7 max-w-2xl text-[length:var(--text-fluid-lg)] leading-relaxed text-ink-2">
            {project.tagline}
          </p>
        </Reveal>

        {/* Metadata readout */}
        <RevealGroup
          className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4"
          delay={0.08}
        >
          {[
            { label: "Role", value: project.role },
            { label: "Category", value: project.category },
            ...(project.period
              ? [{ label: "Period", value: project.period }]
              : []),
            { label: "Ownership", value: project.ownership },
          ].map((item) => (
            <RevealItem key={item.label} className="bg-surface/90 p-5">
              <p className="mono-label">{item.label}</p>
              <p className="mt-2 text-sm leading-snug text-ink-2">{item.value}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-8 flex flex-wrap gap-2">
          {project.focus.map((f) => (
            <Tag key={f} tone="signal">
              {f}
            </Tag>
          ))}
        </div>
      </header>

      <div className="shell">
        {/* ---------------- Challenge ---------------- */}
        <Block index="01" label="The Challenge" title={project.challenge.heading}>
          <Prose body={project.challenge.body} />
        </Block>

        {/* ---------------- Approach ---------------- */}
        <Block index="02" label="The Approach" title={project.approach.heading}>
          <Prose body={project.approach.body} />
          <PipelineFlow steps={project.approach.pipeline} />
        </Block>

        {/* ---------------- Contribution ---------------- */}
        <Block index="03" label="My Contribution" title="What I actually built.">
          <RevealGroup className="mt-9 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
            {project.contribution.map((c) => (
              <RevealItem
                key={c.title}
                className="group bg-surface/90 p-6 transition-colors duration-500 hover:bg-surface-2/90"
              >
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-signal/60 transition-colors duration-500 group-hover:bg-signal"
                  />
                  <div>
                    <h3 className="text-[0.9375rem] font-semibold tracking-[-0.015em] text-ink">
                      {c.title}
                    </h3>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">
                      {c.detail}
                    </p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Block>

        {/* ---------------- Architecture ---------------- */}
        <Block
          index="04"
          label="High-Level Architecture"
          title="How the pieces fit together."
        >
          <ArchitectureDiagram
            layers={project.architecture.layers}
            caption={project.architecture.caption}
          />
        </Block>

        {/* ---------------- Technology ---------------- */}
        <Block index="05" label="Technology">
          <RevealGroup className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {project.technologies.map((group) => (
              <RevealItem key={group.group}>
                <p className="mono-label">{group.group}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <Tag key={item}>{item}</Tag>
                  ))}
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Block>

        {/* ---------------- Outcomes ---------------- */}
        <Block index="06" label="Outcome" title="What changed.">
          <RevealGroup className="mt-9 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {project.outcomes.map((o) => (
              <RevealItem key={o.label} className="bg-surface/90 p-6">
                <p className="text-[length:var(--text-fluid-xl)] font-semibold tracking-[-0.03em] text-balance text-signal-pale">
                  {o.value}
                </p>
                <p className="mt-2 text-sm font-medium text-ink">{o.label}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-3">{o.note}</p>
              </RevealItem>
            ))}
          </RevealGroup>

          <div className="mt-10 max-w-2xl space-y-5">
            <p className="mono-label">What I took from it</p>
            {project.learnings.map((l, i) => (
              <p key={i} className="text-[0.9375rem] leading-relaxed text-ink-2">
                {l}
              </p>
            ))}
          </div>
        </Block>

        {/* ---------------- Confidentiality ---------------- */}
        <section className="border-t border-line/70 py-14">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-violet/20 bg-violet-abyss/30 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className="mt-1 grid size-7 shrink-0 place-items-center rounded-full border border-violet/35 bg-violet/10"
                >
                  <svg
                    viewBox="0 0 16 16"
                    className="size-3.5 text-violet"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect x="3" y="7" width="10" height="6.5" rx="1.5" />
                    <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
                  </svg>
                </span>
                <div>
                  <p className="mono-label text-violet">Confidentiality</p>
                  <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-2">
                    {project.confidentiality}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </div>

      {/* ---------------- Prev / next ---------------- */}
      <nav aria-label="More case studies" className="shell pb-8">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {[
            { project: prev, dir: "Previous" as const },
            { project: next, dir: "Next" as const },
          ].map(({ project: p, dir }) =>
            p ? (
              <Link
                key={dir}
                href={`/work/${p.slug}`}
                className="group bg-surface/90 p-7 transition-colors duration-500 hover:bg-surface-2/90 focus-visible:-outline-offset-4"
              >
                <span className="mono-label">{dir}</span>
                <span className="mt-3 flex items-center gap-2 text-fluid-lg font-semibold tracking-[-0.025em] text-ink transition-colors group-hover:text-signal-pale">
                  {p.title}
                  <ArrowGlyph />
                </span>
                <span className="mono-meta mt-2 block text-ink-3">
                  {p.subtitle}
                </span>
              </Link>
            ) : null,
          )}
        </div>
      </nav>

      <section className="shell pb-24 text-center sm:pb-32">
        <CTA href="/work" variant="secondary">
          Back to all work
        </CTA>
      </section>
    </article>
  );
}
