import type { Metadata } from "next";
import PageHeader from "@/components/shell/PageHeader";
import LabNotes from "@/components/sections/LabNotes";
import { SectionLabel } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";
import { researchIntro, labNotes, labCategories } from "@/content/research";
import { buildPageMetadata } from "@/content/metadata";


export const metadata: Metadata = buildPageMetadata({ route: "/research" });

/** How every note on this page is written — stated once, up front. */
const format = [
  { key: "Q", label: "Question", detail: "The thing actually being asked." },
  {
    key: "A",
    label: "Approach",
    detail: "What was tried, and under what constraints.",
  },
  {
    key: "L",
    label: "Learning",
    detail: "What held up once the work was done.",
  },
];

export default function ResearchPage() {
  return (
    <>
      <PageHeader
        index="05"
        label="Lab Notes"
        title="What I asked, what I tried, what held up."
        lede={researchIntro}
      >
        <dl className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
          {format.map((part) => (
            <div key={part.key} className="bg-surface/90 p-5">
              <dt className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="grid size-5 shrink-0 place-items-center rounded border border-line-2 font-mono text-[length:var(--text-mono-xs)] leading-none text-ink-3"
                >
                  {part.key}
                </span>
                <span className="mono-label">{part.label}</span>
              </dt>
              <dd className="mt-3 text-sm leading-relaxed text-ink-3">
                {part.detail}
              </dd>
            </div>
          ))}
        </dl>
      </PageHeader>

      <section aria-labelledby="lab-notes-heading" className="shell py-14 sm:py-20">
        <Reveal>
          <SectionLabel index="01">Lab Notes</SectionLabel>
          <h2
            id="lab-notes-heading"
            className="mt-5 max-w-3xl text-[length:var(--text-display-sm)] font-semibold text-ink"
          >
            Filter by what you came to read.
          </h2>
        </Reveal>

        <Reveal delay={0.05} className="mt-9 sm:mt-12">
          <LabNotes notes={labNotes} categories={labCategories} />
        </Reveal>
      </section>

    </>
  );
}
