import type { Metadata } from "next";
import PageHeader from "@/components/shell/PageHeader";
import { CTA, ArrowGlyph } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/content/site";
import { pageMeta } from "@/content/seo";

const meta = pageMeta("/resume");

export const metadata: Metadata = {
  title: meta?.title ?? "Resume",
  description: meta?.description,
  alternates: { canonical: "/resume" },
};

export default function ResumePage() {
  return (
    <>
      <PageHeader
        index="06"
        label="Resume"
        title="Resume"
        lede="A concise overview of my experience across data, machine learning, computer vision and applied AI."
      >
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <CTA href={site.resumeFile} variant="primary" external>
            View Resume
            <ArrowGlyph />
          </CTA>
          <CTA href={site.resumeFile} variant="secondary" download>
            Download PDF
          </CTA>
        </div>
        <p className="mono-meta mt-5 text-ink-3">
          PDF · Last updated {site.resumeUpdated}
        </p>
      </PageHeader>

      <div className="shell pb-24 sm:pb-32">
        <Reveal>
          {/* Inline preview on larger screens only — mobile browsers render
              embedded PDFs poorly, so there the actions above are the path. */}
          <div className="hidden overflow-hidden rounded-2xl border border-line bg-surface/60 md:block">
            <object
              data={site.resumeFile}
              type="application/pdf"
              aria-label={`${site.name} — resume, PDF preview`}
              className="h-[min(78vh,56rem)] w-full"
            >
              <p className="p-8 text-[0.9375rem] leading-relaxed text-ink-2">
                Your browser can&rsquo;t display the PDF inline.{" "}
                <a
                  href={site.resumeFile}
                  className="text-signal underline underline-offset-4"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Open it in a new tab
                </a>
                .
              </p>
            </object>
          </div>

          <p className="text-[0.9375rem] leading-relaxed text-ink-2 md:hidden">
            The PDF opens best in your device&rsquo;s own reader — use View or
            Download above.
          </p>
        </Reveal>
      </div>
    </>
  );
}
