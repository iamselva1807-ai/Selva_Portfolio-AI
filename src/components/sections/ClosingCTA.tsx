import { CTA, ArrowGlyph } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { identity } from "@/content/identity";
import { site } from "@/content/site";

/** Shared closing invitation, used at the foot of most pages. */
export default function ClosingCTA() {
  return (
    <section className="shell py-24 sm:py-32">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-line bg-surface/55 px-6 py-14 text-center sm:px-12 sm:py-20">
          <div
            aria-hidden="true"
            className="aura animate-aura top-[-40%] left-1/2 size-[32rem] -translate-x-1/2 bg-signal/14"
          />
          <div className="relative">
            <h2 className="ink-gradient mx-auto max-w-2xl text-[length:var(--text-display-sm)] font-semibold">
              {identity.contactHeadline}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[0.9375rem] leading-relaxed text-ink-2">
              {identity.contactBody}
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <CTA href={`mailto:${site.email}`} variant="primary">
                Get in touch
                <ArrowGlyph />
              </CTA>
              <CTA href="/resume" variant="secondary">
                View Resume
              </CTA>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
