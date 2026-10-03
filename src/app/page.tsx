import Link from "next/link";
import Hero from "@/components/sections/Hero";
import Snapshot from "@/components/sections/Snapshot";
import WorkTeasers from "@/components/sections/WorkTeasers";
import { SectionLabel } from "@/components/ui/Label";
import { ArrowGlyph, CTA } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { identity } from "@/content/identity";
import { site } from "@/content/site";
import { pageMeta } from "@/content/seo";

const meta = pageMeta("/");

export const metadata = {
  description: meta?.description,
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Snapshot />

      <section className="shell pb-24 sm:pb-32" aria-labelledby="featured-work">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <SectionLabel index="01">Selected Work</SectionLabel>
              <h2
                id="featured-work"
                className="mt-5 max-w-2xl text-[length:var(--text-display-sm)] font-semibold text-ink"
              >
                Systems built to make a decision, not a demo.
              </h2>
            </div>
            <Link
              href="/work"
              className="group inline-flex items-center gap-2 text-sm font-medium text-signal transition-colors hover:text-signal-bright"
            >
              All work
              <ArrowGlyph />
            </Link>
          </div>
        </Reveal>

        <WorkTeasers />

        <Reveal delay={0.05}>
          <p className="mt-10 max-w-xl text-[0.9375rem] leading-relaxed text-ink-2">
            {identity.contactBody}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <CTA href={`mailto:${site.email}`} variant="primary">
              Get in touch
              <ArrowGlyph />
            </CTA>
            <CTA href="/resume" variant="secondary">
              View Resume
            </CTA>
          </div>
        </Reveal>
      </section>
    </>
  );
}
