"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { Binary, Camera, Gauge, GitCompareArrows, ScanFace, Send, ShieldCheck } from "lucide-react";
import { SectionLabel } from "@/components/ui/Label";
import { ArrowGlyph } from "@/components/ui/Button";
import { getProject } from "@/content/projects";
import { cn } from "@/lib/cn";

const ICONS = [Camera, ScanFace, ShieldCheck, Binary, GitCompareArrows, Gauge];

/**
 * The flagship pipeline as a scroll-driven diagram: a request travels from
 * capture to response and each stage lights as it passes. Stage names come
 * straight from the face-verification case study; the final "Response" is the
 * single API call returning a decision and confidence the resume describes.
 * Labels only — the explanations live in the case study, not here as well.
 */
export default function PipelineChapter() {
  const project = getProject("face-verification");
  const stages = [
    ...(project?.approach.pipeline.map((s, i) => ({ label: s.label, Icon: ICONS[i] ?? Binary })) ?? []),
    { label: "Response", Icon: Send },
  ];

  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // Leave a little dwell at each end so the first and last stages are seen.
  const fill = useTransform(scrollYProgress, [0.08, 0.88], ["0%", "100%"], { clamp: true });
  const [reached, setReached] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const t = Math.min(1, Math.max(0, (v - 0.08) / 0.8));
    setReached(Math.round(t * (stages.length - 1)));
  });

  if (!project) return null;

  return (
    <section ref={ref} id="architecture" data-chapter="How it's built" aria-labelledby="architecture-title" className="relative lg:h-[230vh]">
      <div className="lg:sticky lg:top-0 lg:flex lg:h-[100svh] lg:items-center">
        <div className="shell w-full py-24 lg:py-0">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <SectionLabel index="04">How it&rsquo;s built</SectionLabel>
              <h2 id="architecture-title" className="mt-5 max-w-2xl text-[length:var(--text-display-sm)] font-semibold text-balance text-ink">
                Inside the verification pipeline.
              </h2>
              <p className="mono-meta mt-3 text-ink-3">{project.title} · conceptual flow</p>
            </div>
            <Link
              href={`/work/${project.slug}`}
              className="group inline-flex min-h-11 items-center gap-2 text-sm font-medium text-signal transition-colors hover:text-signal-bright"
            >
              Read the case study
              <ArrowGlyph />
            </Link>
          </div>

          {/* Desktop: horizontal flow with a travelling packet */}
          <div className="relative mt-16 hidden lg:block">
            <div aria-hidden="true" className="absolute top-7 right-[7%] left-[7%] h-px bg-line-2" />
            <div aria-hidden="true" className="absolute top-7 right-[7%] left-[7%] h-px">
              <motion.div style={{ width: fill }} className="relative h-px bg-gradient-to-r from-signal-deep via-signal to-signal-bright">
                <span className="absolute top-1/2 right-0 size-3 translate-x-1/2 -translate-y-1/2 rounded-full bg-signal-pale shadow-[0_0_18px_4px_var(--color-signal)]" />
              </motion.div>
            </div>
            <ol className="relative grid grid-cols-7 gap-2">
              {stages.map(({ label, Icon }, i) => {
                const lit = i <= reached;
                const current = i === reached;
                return (
                  <li key={label} className="flex flex-col items-center text-center">
                    <span
                      className={cn(
                        "relative grid size-14 place-items-center rounded-2xl border transition-[border-color,background-color,color,box-shadow] duration-500",
                        lit ? "border-signal/45 bg-signal-abyss text-signal-pale" : "border-line-2 bg-surface text-ink-3",
                        current && "shadow-[0_0_28px_-6px_var(--color-signal)]",
                      )}
                    >
                      <Icon aria-hidden="true" className="size-5" strokeWidth={1.6} />
                    </span>
                    <span className="mono-label mt-4 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span className={cn("mt-1.5 text-sm font-medium transition-colors duration-500", lit ? "text-ink" : "text-ink-3")}>
                      {label}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Phones: a vertical flow, nothing pinned */}
          <ol className="relative mt-12 space-y-0 lg:hidden">
            {stages.map(({ label, Icon }, i) => (
              <li key={label} className="relative flex items-center gap-4 pb-6 last:pb-0">
                {i < stages.length - 1 && (
                  <span aria-hidden="true" className="absolute top-12 bottom-0 left-6 w-px bg-gradient-to-b from-signal/40 to-line-2" />
                )}
                <span className="relative grid size-12 shrink-0 place-items-center rounded-xl border border-signal/35 bg-signal-abyss text-signal-pale">
                  <Icon aria-hidden="true" className="size-5" strokeWidth={1.6} />
                </span>
                <span>
                  <span className="mono-label block tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mt-0.5 block font-medium text-ink">{label}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
