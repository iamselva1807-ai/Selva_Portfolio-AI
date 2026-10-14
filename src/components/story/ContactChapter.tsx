import Link from "next/link";
import { ArrowUpRight, Briefcase, Mail } from "lucide-react";
import { CTA, ArrowGlyph } from "@/components/ui/Button";
import { LinkedInIcon } from "@/components/ui/Icons";
import { SectionLabel } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";
import { identity } from "@/content/identity";
import { contactChannels } from "@/content/site";

/**
 * The close of the story. The headline is shared with /contact (it is where
 * this leads); the longer invitation lives only there.
 */
export default function ContactChapter() {
  const email = contactChannels.find((c) => c.id === "email");
  const others = contactChannels.filter((c) => c.id !== "email");
  return (
    <section id="contact" data-chapter="Contact" aria-labelledby="contact-title" className="shell pt-8 pb-28 sm:pb-36">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-line bg-surface/55 px-6 py-16 text-center sm:px-12 sm:py-24">
          <div aria-hidden="true" className="aura animate-aura top-[-45%] left-1/2 size-[34rem] -translate-x-1/2 bg-signal/14" />
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(var(--color-line-2)_1px,transparent_1px)] [background-size:22px_22px] opacity-25 [mask-image:radial-gradient(60%_60%_at_50%_50%,black,transparent)]" />
          <div className="relative">
            <div className="flex justify-center">
              <SectionLabel index="06">Contact</SectionLabel>
            </div>
            <h2 id="contact-title" className="ink-gradient mx-auto mt-6 max-w-2xl text-[length:var(--text-display)] font-semibold text-balance">
              {identity.contactHeadline}
            </h2>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {email && (
                <CTA href={email.href} variant="primary">
                  <Mail aria-hidden="true" className="size-4" strokeWidth={1.75} />
                  {email.value}
                </CTA>
              )}
              {others.map((c) => (
                <CTA key={c.id} href={c.href} variant="secondary" external>
                  {c.id === "linkedin" ? <LinkedInIcon className="size-4" /> : <Briefcase aria-hidden="true" className="size-4" strokeWidth={1.75} />}
                  {c.label}
                  <ArrowUpRight aria-hidden="true" className="size-3.5 opacity-70" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </CTA>
              ))}
            </div>
            <Link
              href="/contact"
              className="group mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink-2 transition-colors hover:text-signal"
            >
              All contact details
              <ArrowGlyph />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
