import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/shell/PageHeader";
import { SectionLabel } from "@/components/ui/Label";
import { ArrowGlyph } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { identity } from "@/content/identity";
import { pageMeta } from "@/content/seo";
import { site, socialLinks } from "@/content/site";

const meta = pageMeta("/contact");

export const metadata: Metadata = {
  title: meta?.title,
  description: meta?.description,
  alternates: { canonical: "/contact" },
};

const row =
  "group flex items-center justify-between gap-6 bg-surface/90 px-6 py-8 transition-colors duration-500 hover:bg-surface-2/90 focus-visible:-outline-offset-4 sm:px-8 sm:py-10";

/** Label + value + arrow — identical in every channel row. */
function RowBody({
  label,
  value,
  newTab,
}: {
  label: string;
  value: string;
  newTab?: boolean;
}) {
  return (
    <>
      <span className="min-w-0">
        <span className="mono-label block">{label}</span>
        <span className="mt-3 block text-[length:var(--text-fluid-lg)] font-medium tracking-[-0.02em] break-words text-ink transition-colors duration-300 group-hover:text-signal-pale">
          {value}
          {newTab && <span className="sr-only"> (opens in a new tab)</span>}
        </span>
      </span>
      <span
        aria-hidden="true"
        className="grid size-10 shrink-0 place-items-center rounded-full border border-line-2 text-ink-3 transition-colors duration-300 group-hover:border-signal/40 group-hover:text-signal"
      >
        <ArrowGlyph className="size-4" />
      </span>
    </>
  );
}

export default function ContactPage() {
  return (
    <>
      <PageHeader
        index="07"
        label="Contact"
        title={identity.contactHeadline}
        lede={identity.contactBody}
      >
        <p className="mono-meta mt-7 flex flex-wrap items-center gap-2 text-ink-3">
          <span
            aria-hidden="true"
            className="size-1.5 shrink-0 rounded-full bg-signal"
          />
          {identity.availability}
        </p>
      </PageHeader>

      <div className="shell">
        <section
          aria-labelledby="contact-channels"
          className="py-14 sm:py-20"
        >
          <Reveal>
            <SectionLabel index="01">Channels</SectionLabel>
            <h2
              id="contact-channels"
              className="mt-5 max-w-2xl text-[length:var(--text-display-sm)] font-semibold text-ink"
            >
              No form. Just the direct routes.
            </h2>
          </Reveal>

          <nav aria-label="Direct contact channels">
            <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line">
              {socialLinks.map((channel, i) => {
                const internal = channel.href.startsWith("/");
                const external = channel.href.startsWith("http");

                return (
                  <Reveal key={channel.label} as="li" delay={i * 0.06}>
                    {internal ? (
                      <Link href="/resume" className={row}>
                        <RowBody label={channel.label} value={channel.value} />
                      </Link>
                    ) : (
                      <a
                        href={channel.href}
                        className={row}
                        {...(external
                          ? { target: "_blank", rel: "noreferrer noopener" }
                          : {})}
                      >
                        <RowBody
                          label={channel.label}
                          value={channel.value}
                          newTab={external}
                        />
                      </a>
                    )}
                  </Reveal>
                );
              })}
            </ul>
          </nav>

          <div className="rule-fade mt-14" />

          <Reveal delay={0.05}>
            <dl className="mt-10 grid gap-8 sm:grid-cols-2">
              <div>
                <dt className="mono-label">Based in</dt>
                <dd className="mt-3 text-[length:var(--text-fluid-base)] text-ink-2">
                  {site.location}
                </dd>
              </div>
              <div>
                <dt className="mono-label">Email, in plain text</dt>
                <dd className="mt-3 font-mono text-sm break-words text-ink-2 select-all">
                  {site.email}
                </dd>
              </div>
            </dl>

            <p className="mt-10 max-w-xl text-sm leading-relaxed text-ink-3">
              Email is the fastest route — copy the address above, or use the
              channels listed here. I read everything that is not a template.
            </p>
          </Reveal>
        </section>
      </div>
    </>
  );
}
