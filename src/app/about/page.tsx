import type { Metadata } from "next";
import PageHeader from "@/components/shell/PageHeader";
import Portrait from "@/components/visual/Portrait";
import { SectionLabel, Tag } from "@/components/ui/Label";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { identity } from "@/content/identity";
import { roles, education, certifications } from "@/content/experience";
import { site } from "@/content/site";
import { buildPageMetadata } from "@/content/metadata";


export const metadata: Metadata = buildPageMetadata({ route: "/about" });

const current = roles[0];
const focusPanel = identity.missionControl.find((p) => p.label === "FOCUS");

/** Narrative sections are numbered after the orientation block. */
const narrativeOffset = 2;

export default function AboutPage() {
  return (
    <>
      <PageHeader
        index="03"
        label="About"
        title="I build models somebody has to answer for."
        lede={identity.aboutIntro}
      />

      <div className="shell">
        {/* ---------------- 01 · Orientation ---------------- */}
        <section
          aria-labelledby="orientation-heading"
          className="py-14 sm:py-20"
        >
          <Reveal>
            <SectionLabel index="01">Orientation</SectionLabel>
          </Reveal>

          <div className="mt-9 grid items-start gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
            {/* Portrait — constrained on phones so it never owns the screen */}
            <Reveal className="relative mx-auto w-full max-w-[14rem] sm:max-w-[17rem] lg:max-w-none">
              <div
                aria-hidden="true"
                className="aura top-[12%] left-1/2 hidden size-64 -translate-x-1/2 bg-signal/10 lg:block"
              />
              <Portrait
                rounded="arch"
                priority
                sizes="(max-width: 640px) 56vw, (max-width: 1024px) 272px, 360px"
                className="relative aspect-4/5 w-full"
              />
            </Reveal>

            {/* Orientation readout */}
            <div className="min-w-0">
              <h2
                id="orientation-heading"
                className="max-w-xl text-[length:var(--text-display-sm)] font-semibold text-ink"
              >
                Where I am, and what I am building.
              </h2>

              <RevealGroup
                className="mt-9 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2"
                delay={0.05}
                as="div"
              >
                <RevealItem className="bg-surface/90 p-5">
                  <dl>
                    <dt className="mono-label">Currently</dt>
                    <dd className="mt-2 text-sm leading-snug text-ink">
                      {current.title}
                    </dd>
                    <dd className="mono-meta mt-1 text-ink-3">
                      {current.company} · since{" "}
                      <time dateTime={current.start}>
                        {current.period.split(" — ")[0]}
                      </time>
                    </dd>
                  </dl>
                </RevealItem>

                <RevealItem className="bg-surface/90 p-5">
                  <dl>
                    <dt className="mono-label">Based in</dt>
                    <dd className="mt-2 text-sm leading-snug text-ink">
                      {site.location}
                    </dd>
                    <dd className="mono-meta mt-1 text-ink-3">{site.role}</dd>
                  </dl>
                </RevealItem>

                {focusPanel && (
                  <RevealItem className="bg-surface/90 p-5 sm:col-span-2">
                    <dl>
                      <dt className="mono-label">Focus</dt>
                      <dd className="mt-3 flex flex-wrap gap-1.5">
                        {focusPanel.entries.map((entry) => (
                          <Tag key={entry} tone="signal">
                            {entry}
                          </Tag>
                        ))}
                      </dd>
                    </dl>
                  </RevealItem>
                )}
              </RevealGroup>
            </div>
          </div>
        </section>

        {/* ---------------- 02…n · The narrative ---------------- */}
        {identity.about.map((section, i) => {
          const index = String(i + narrativeOffset).padStart(2, "0");
          const id = `about-${i}`;
          return (
            <section
              key={section.heading}
              aria-labelledby={id}
              className="border-t border-line/70 py-14 sm:py-20"
            >
              <Reveal>
                <SectionLabel index={index}>Chapter</SectionLabel>
                <h2
                  id={id}
                  className="mt-5 max-w-2xl text-[length:var(--text-display-sm)] font-semibold text-ink"
                >
                  {section.heading}
                </h2>
              </Reveal>

              <Reveal delay={0.05} className="mt-7 max-w-2xl space-y-6">
                {section.body.map((paragraph, p) => (
                  <p
                    key={p}
                    className={
                      p === 0
                        ? "text-[length:var(--text-fluid-lg)] leading-[1.7] text-ink-2"
                        : "text-[length:var(--text-fluid-base)] leading-[1.75] text-ink-2"
                    }
                  >
                    {paragraph}
                  </p>
                ))}
              </Reveal>
            </section>
          );
        })}

        {/* ---------------- Credentials ---------------- */}
        <section
          aria-labelledby="credentials-heading"
          className="border-t border-line/70 py-14 sm:py-20"
        >
          <Reveal>
            <SectionLabel
              index={String(identity.about.length + narrativeOffset).padStart(
                2,
                "0",
              )}
            >
              Credentials
            </SectionLabel>
            <h2
              id="credentials-heading"
              className="mt-5 max-w-2xl text-[length:var(--text-display-sm)] font-semibold text-ink"
            >
              Where the training came from.
            </h2>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="mt-9 grid gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-2">
              <div className="bg-surface/90 p-6 sm:p-8">
                <h3 className="mono-label text-signal/80">Education</h3>
                <dl className="mt-5 space-y-6">
                  {education.map((item) => (
                    <div
                      key={item.institution}
                      className="border-l border-line-2 pl-4"
                    >
                      <dt className="text-[0.9375rem] font-semibold tracking-[-0.015em] text-ink">
                        {item.qualification}
                      </dt>
                      <dd className="mt-1.5 text-sm leading-snug text-ink-2">
                        {item.institution}
                      </dd>
                      <dd className="mono-meta mt-1.5 text-ink-3">
                        {item.period} · {item.location}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="bg-surface/90 p-6 sm:p-8">
                <h3 className="mono-label text-signal/80">Certifications</h3>
                <dl className="mt-5 space-y-6">
                  {certifications.map((item) => (
                    <div key={item.name} className="border-l border-line-2 pl-4">
                      <dt className="text-[0.9375rem] font-semibold tracking-[-0.015em] text-ink">
                        {item.name}
                      </dt>
                      <dd className="mt-1.5 text-sm leading-snug text-ink-2">
                        {item.issuer}
                      </dd>
                      <dd className="mono-meta mt-1.5 text-ink-3">
                        {item.period}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </Reveal>
        </section>
      </div>

    </>
  );
}
