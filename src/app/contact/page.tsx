import type { Metadata } from "next";
import { ArrowUpRight, Briefcase, Mail, MapPin } from "lucide-react";
import PageHeader from "@/components/shell/PageHeader";
import { SectionLabel } from "@/components/ui/Label";
import { ArrowGlyph, CTA } from "@/components/ui/Button";
import { LinkedInIcon } from "@/components/ui/Icons";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { identity } from "@/content/identity";
import { buildPageMetadata } from "@/content/metadata";
import { contactChannels, site, type ContactChannel } from "@/content/site";

export const metadata: Metadata = buildPageMetadata({ route: "/contact" });

function ChannelIcon({ id }: { id: ContactChannel["id"] }) {
  const cls = "size-5";
  if (id === "email") return <Mail aria-hidden="true" className={cls} strokeWidth={1.6} />;
  if (id === "linkedin") return <LinkedInIcon className={cls} />;
  return <Briefcase aria-hidden="true" className={cls} strokeWidth={1.6} />;
}

export default function ContactPage() {
  const email = contactChannels.find((c) => c.id === "email");

  return (
    <>
      <PageHeader index="06" label="Contact" title={identity.contactHeadline} lede={identity.contactBody}>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          {email && (
            <CTA href={email.href} variant="primary">
              <Mail aria-hidden="true" className="size-4" strokeWidth={1.75} />
              Email me
            </CTA>
          )}
          <p className="mono-meta flex items-center gap-2 text-ink-3">
            <span aria-hidden="true" className="relative flex size-1.5">
              <span className="animate-node absolute inline-flex size-full rounded-full bg-signal" />
              <span className="relative inline-flex size-1.5 rounded-full bg-signal" />
            </span>
            {identity.availability}
          </p>
        </div>
      </PageHeader>

      <div className="shell pb-24 sm:pb-32">
        <section aria-labelledby="contact-channels" className="py-14 sm:py-20">
          <Reveal>
            <SectionLabel index="01">Channels</SectionLabel>
            <h2 id="contact-channels" className="mt-5 max-w-2xl text-[length:var(--text-display-sm)] font-semibold text-ink">
              Direct routes, no form.
            </h2>
          </Reveal>

          <RevealGroup as="ul" className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line">
            {contactChannels.map((c) => (
              <RevealItem as="li" key={c.id}>
                <a
                  href={c.href}
                  {...(c.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                  className="group flex items-center gap-5 bg-surface/90 px-6 py-7 transition-colors duration-500 hover:bg-surface-2/90 focus-visible:-outline-offset-4 sm:px-8 sm:py-9"
                >
                  <span
                    aria-hidden="true"
                    className="grid size-12 shrink-0 place-items-center rounded-xl border border-line-2 bg-void/50 text-ink-2 transition-[color,border-color,transform] duration-500 group-hover:-translate-y-0.5 group-hover:border-signal/40 group-hover:text-signal"
                  >
                    <ChannelIcon id={c.id} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="mono-label block">{c.label}</span>
                    <span className="mt-2 block text-[length:var(--text-fluid-lg)] font-medium tracking-[-0.02em] break-words text-ink transition-colors duration-300 group-hover:text-signal-pale">
                      {c.value}
                      {c.external && <span className="sr-only"> (opens in a new tab)</span>}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="grid size-10 shrink-0 place-items-center rounded-full border border-line-2 text-ink-3 transition-[color,border-color] duration-300 group-hover:border-signal/40 group-hover:text-signal"
                  >
                    {c.external ? <ArrowUpRight className="size-4" /> : <ArrowGlyph className="size-4" />}
                  </span>
                </a>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.05}>
            <dl className="mt-12 grid gap-8 sm:grid-cols-2">
              <div>
                <dt className="mono-label flex items-center gap-2">
                  <MapPin aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
                  Based in
                </dt>
                <dd className="mt-3 text-[length:var(--text-fluid-base)] text-ink-2">{site.location}</dd>
              </div>
              <div>
                <dt className="mono-label">Email, as plain text</dt>
                <dd className="mt-3 font-mono text-sm break-words text-ink-2 select-all">{site.email}</dd>
              </div>
            </dl>
          </Reveal>
        </section>
      </div>
    </>
  );
}
