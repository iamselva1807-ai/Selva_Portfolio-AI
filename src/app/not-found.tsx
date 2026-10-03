import type { Metadata } from "next";
import { SectionLabel } from "@/components/ui/Label";
import { CTA, ArrowGlyph } from "@/components/ui/Button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Lost signal",
  description:
    "That route is not on the star chart. Head back to the homepage or to the case studies.",
  alternates: { canonical: "/" },
  robots: { index: false, follow: true },
};

/** Readout rows — the same instrument voice the rest of the site uses. */
const readout = [
  { term: "Status", detail: "404 · Not found" },
  { term: "Cause", detail: "Moved, renamed, or never charted" },
  { term: "Next", detail: "Re-route from the links above" },
];

export default function NotFound() {
  return (
    <section
      aria-labelledby="not-found-title"
      className="shell flex min-h-[70vh] flex-col justify-center pt-32 pb-24 sm:pt-40 sm:pb-32"
    >
      <Reveal>
        <SectionLabel index="404">Lost signal</SectionLabel>

        <p
          aria-hidden="true"
          className="mt-8 font-mono text-[length:var(--text-display-lg)] leading-none font-medium tracking-[-0.04em] text-ink-3 tabular-nums"
        >
          404
        </p>

        <h1
          id="not-found-title"
          className="ink-gradient mt-7 max-w-3xl text-[length:var(--text-display-sm)] font-semibold"
        >
          This page is off the star chart.
        </h1>

        <p className="mt-5 max-w-xl text-[length:var(--text-fluid-base)] leading-relaxed text-ink-2">
          Nothing is transmitting from this address. The page may have been
          renamed, retired, or simply never existed — either way, the rest of
          the site is still exactly where you left it.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <CTA href="/" variant="primary">
            Back to home
            <ArrowGlyph />
          </CTA>
          <CTA href="/work" variant="secondary">
            Browse the work
          </CTA>
        </div>
      </Reveal>

      <div className="rule-fade mt-14" />

      <RevealGroup
        as="div"
        className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3"
        delay={0.06}
      >
        {readout.map((row) => (
          <RevealItem key={row.term} className="bg-surface/90 p-5">
            <dl>
              <dt className="mono-label">{row.term}</dt>
              <dd className="mt-2 text-sm leading-snug text-ink-2">
                {row.detail}
              </dd>
            </dl>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal delay={0.12}>
        <p className="mono-meta mt-8 text-ink-3">
          Or write to{" "}
          <a
            href={`mailto:${site.email}`}
            className="text-ink-3 underline decoration-line-bright underline-offset-4 transition-colors hover:text-signal hover:decoration-signal/60"
          >
            {site.email}
          </a>{" "}
          and tell me what you were looking for.
        </p>
      </Reveal>
    </section>
  );
}
