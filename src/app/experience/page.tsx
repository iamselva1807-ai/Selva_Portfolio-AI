import type { Metadata } from "next";
import PageHeader from "@/components/shell/PageHeader";
import { SectionLabel, Tag } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";
import { roles } from "@/content/experience";
import { skillGroups } from "@/content/skills";
import { buildPageMetadata } from "@/content/metadata";


export const metadata: Metadata = buildPageMetadata({ route: "/experience" });

/** Shared section rhythm — identical to the case-study pages. */
function Section({
  index,
  label,
  title,
  id,
  children,
}: {
  index: string;
  label: string;
  title: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="py-14 sm:py-20"
    >
      <Reveal>
        <SectionLabel index={index}>{label}</SectionLabel>
        <h2
          id={id}
          className="mt-5 max-w-3xl text-[length:var(--text-display-sm)] font-semibold text-ink"
        >
          {title}
        </h2>
      </Reveal>
      {children}
    </section>
  );
}

/**
 * Corner placements for the domain constellation. Below `sm` these are inert
 * and the nodes simply stack, which is why the schematic never squashes.
 */
const NODE_POSITION = [
  "lg:col-start-1 lg:row-start-1 lg:self-end",
  "lg:col-start-3 lg:row-start-1 lg:self-end",
  "lg:col-start-1 lg:row-start-3 lg:self-start",
  "lg:col-start-3 lg:row-start-3 lg:self-start",
];

/** Where each hairline from the hub terminates, in viewBox units. */
const SPOKES = [
  { x: 20, y: 22 },
  { x: 80, y: 22 },
  { x: 20, y: 78 },
  { x: 80, y: 78 },
];

export default function ExperiencePage() {
  const currentRole = roles[0];
  const constellation = currentRole?.constellation;

  return (
    <>
      <PageHeader
        index="04"
        label="Experience"
        title="From collecting the data to deciding with it."
        lede="Three roles in Chennai since late 2023 — web crawling, pipelines and dashboards first, then production computer vision for identity, fraud and document risk. Most recent first."
      />

      <div className="shell">
        {/* ---------------- Timeline ---------------- */}
        <section
          aria-labelledby="trajectory"
          className="border-t border-line/70 py-14 sm:py-20"
        >
          <Reveal>
            <SectionLabel index="01">Trajectory</SectionLabel>
            <h2
              id="trajectory"
              className="mt-5 max-w-3xl text-[length:var(--text-display-sm)] font-semibold text-ink"
            >
              Three roles, one direction of travel.
            </h2>
          </Reveal>

          <ol className="relative mt-12">
            {/* The spine. Markers sit on it; it fades out past the last role. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-2 bottom-0 left-[7px] w-px bg-gradient-to-b from-signal/40 via-line-2 to-transparent lg:left-[9.5rem] lg:-translate-x-1/2"
            />

            {roles.map((role, i) => (
              <Reveal
                key={`${role.company}-${role.period}`}
                as="li"
                delay={Math.min(i, 3) * 0.05}
                className="relative pb-14 pl-7 last:pb-0 sm:pl-9 lg:pl-[11.5rem]"
              >
                {/* Node marker */}
                <span
                  aria-hidden="true"
                  className={[
                    "absolute top-1 left-0 grid size-[15px] place-items-center rounded-full border lg:left-[9.5rem] lg:-translate-x-[7.5px]",
                    role.current
                      ? "border-signal/55 bg-signal-abyss shadow-[0_0_18px_-2px_var(--color-signal)]"
                      : "border-line-bright bg-void",
                  ].join(" ")}
                >
                  <span
                    className={
                      role.current
                        ? "animate-node size-[5px] rounded-full bg-signal"
                        : "size-[5px] rounded-full bg-ink-4"
                    }
                  />
                </span>

                {/* Date rail — inline on mobile, anchored beside the spine on desktop */}
                <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 lg:absolute lg:top-0 lg:left-0 lg:mb-0 lg:w-36 lg:flex-col lg:items-end lg:gap-1">
                  {role.start ? (
                    <time
                      dateTime={role.start}
                      className={
                        role.current
                          ? "mono-meta text-signal/85"
                          : "mono-meta text-ink-3"
                      }
                    >
                      {role.period}
                    </time>
                  ) : (
                    <span className="mono-meta text-ink-3">{role.period}</span>
                  )}
                  <span className="mono-label lg:text-right">
                    {role.location}
                  </span>
                </div>

                <article className="rounded-2xl border border-line bg-surface/90 p-4 transition-colors duration-500 hover:border-line-2 sm:p-6">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <h3 className="text-[length:var(--text-fluid-lg)] font-semibold tracking-[-0.025em] text-ink">
                      {role.company}
                    </h3>
                    {role.current && <Tag tone="signal">Current role</Tag>}
                  </div>

                  <p className="mono-meta mt-1.5 text-ink-2">{role.title}</p>

                  {role.titleNote && (
                    <p className="mt-3 max-w-xl border-l border-signal/35 pl-3 text-sm leading-relaxed text-ink-3">
                      {role.titleNote}
                    </p>
                  )}

                  <p className="mt-5 max-w-2xl text-[length:var(--text-fluid-base)] leading-relaxed text-ink-2">
                    {role.summary}
                  </p>

                  <ul className="mt-6 max-w-2xl space-y-3">
                    {role.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-[0.6rem] size-1.5 shrink-0 rounded-full bg-signal/55"
                        />
                        <span className="text-[0.9375rem] leading-relaxed text-ink-2">
                          {highlight}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-7 border-t border-line/70 pt-5">
                    <p className="mono-label">Capabilities</p>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {role.capabilities.map((capability) => (
                        <li key={capability}>
                          <Tag>{capability}</Tag>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* ---------------- Domain constellation ---------------- */}
        {currentRole && constellation && constellation.length > 0 && (
          <Section
            index="02"
            label="Current Domains"
            title="What the work at the current role actually spans."
            id="domains"
          >
            <Reveal delay={0.05}>
              <figure className="mt-10">
                <div className="relative overflow-hidden rounded-2xl border border-line bg-surface/45 p-5 sm:p-10">
                  <div
                    aria-hidden="true"
                    className="aura top-1/2 left-1/2 size-80 -translate-x-1/2 -translate-y-1/2 bg-signal/10"
                  />

                  {/* Hairline spokes — schematic only, dropped on small screens */}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="pointer-events-none absolute inset-0 hidden size-full text-line-2 lg:block"
                  >
                    {SPOKES.map((spoke) => (
                      <line
                        key={`${spoke.x}-${spoke.y}`}
                        x1="50"
                        y1="50"
                        x2={spoke.x}
                        y2={spoke.y}
                        stroke="currentColor"
                        strokeWidth="1"
                        vectorEffect="non-scaling-stroke"
                      />
                    ))}
                  </svg>

                  {/* Hub. Restates the figcaption, so it is decorative. */}
                  <div
                    aria-hidden="true"
                    className="absolute top-1/2 left-1/2 hidden w-44 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-signal/25 bg-void/95 px-4 py-3 text-center shadow-[0_0_44px_-14px_var(--color-signal)] lg:block"
                  >
                    <span className="mono-label text-signal/80">
                      Current role
                    </span>
                    <span className="mt-1.5 block text-[0.9375rem] leading-snug font-semibold tracking-[-0.02em] text-ink">
                      {currentRole.company}
                    </span>
                  </div>

                  <ul className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[1fr_7rem_1fr] lg:gap-x-10 lg:gap-y-6">
                    {constellation.map((node, i) => (
                      <li
                        key={node.name}
                        className={[
                          "rounded-2xl border border-line bg-surface p-4 transition-colors duration-500 hover:border-signal/25",
                          NODE_POSITION[i] ?? "",
                        ].join(" ")}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            aria-hidden="true"
                            className="size-1.5 shrink-0 rounded-full bg-signal/70"
                          />
                          <h3 className="text-[0.9375rem] font-semibold tracking-[-0.015em] text-ink">
                            {node.name}
                          </h3>
                        </div>
                        <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-3">
                          {node.detail}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                <figcaption className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-3">
                  The four domains the {currentRole.title} role at{" "}
                  {currentRole.company} sits across. Schematic, not an org chart
                  — each one feeds the same question of whether an identity and
                  its paperwork can be trusted.
                </figcaption>
              </figure>
            </Reveal>
          </Section>
        )}

        {/* ---------------- Capabilities ---------------- */}
        <Section
          index="02"
          label="Capabilities"
          title="Grouped by what they are for, not scored out of ten."
          id="capabilities"
        >
          <Reveal delay={0.05}>
            <div className="mt-9 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
              {skillGroups.map((group) => (
                <div key={group.name} className="bg-surface/90 p-6">
                  <h3 className="mono-label text-signal/80">{group.name}</h3>
                  <p className="mt-2.5 text-sm leading-snug text-ink-3">
                    {group.description}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {group.skills.map((skill) => (
                      <li key={skill}>
                        <Tag>{skill}</Tag>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </Section>

      </div>

    </>
  );
}
