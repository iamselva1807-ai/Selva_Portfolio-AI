"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import Constellation from "@/components/visual/Constellation";
import Portrait from "@/components/visual/Portrait";
import { SectionLabel } from "@/components/ui/Label";
import { ArrowGlyph } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/**
 * Three working principles, condensed from "How I work" on /about. Short by
 * design: this chapter previews the approach and links onward rather than
 * restating it.
 */
const BEATS = [
  {
    title: "Start from the decision",
    line: "Before anything is trained: what happens when the system says yes, and what happens when it says no?",
  },
  {
    title: "Evaluate honestly",
    line: "Clean preprocessing, honest validation, calibrated thresholds — the operating point is a risk decision.",
  },
  {
    title: "Ship the whole system",
    line: "ONNX inference, FastAPI services, Docker. A model that only lives in a notebook hasn't solved anything yet.",
  },
];

/**
 * Pinned on desktop: the principles advance as you scroll, beside the
 * portrait-constellation. Short enough (≈1.4 screens of scroll) never to feel
 * hijacked. On phones nothing pins — all three read as a plain list.
 */
export default function PhilosophyChapter() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(BEATS.length - 1, Math.max(0, Math.floor(v * BEATS.length))));
  });

  return (
    <section
      ref={ref}
      id="philosophy"
      data-chapter="How I work"
      aria-labelledby="philosophy-title"
      className="relative lg:h-[240vh]"
    >
      <div className="lg:sticky lg:top-0 lg:flex lg:h-[100svh] lg:items-center">
        <div className="shell grid w-full items-center gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pt-[4.5rem] lg:pb-4">
          <div>
            <SectionLabel index="01">How I work</SectionLabel>
            <h2 id="philosophy-title" className="mt-5 max-w-xl text-[length:var(--text-display-sm)] font-semibold text-balance text-ink">
              I start from the decision, not the model.
            </h2>

            <ol className="mt-10 space-y-2 short:mt-6">
              {BEATS.map((beat, i) => {
                const on = i === active;
                return (
                  <li
                    key={beat.title}
                    data-active={on}
                    className={cn(
                      "group/beat relative rounded-2xl border p-5 transition-[border-color,background-color] duration-500 sm:p-6 short:p-4",
                      "border-line bg-surface/60",
                      "lg:border-transparent lg:bg-transparent",
                      "lg:data-[active=true]:border-line lg:data-[active=true]:bg-surface/70",
                    )}
                  >
                    {/* progress tick that grows on the active principle */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute top-6 left-0 hidden w-0.5 rounded-full bg-signal transition-[height] duration-700 lg:block",
                        on ? "h-10" : "h-0",
                      )}
                    />
                    <p className="flex items-baseline gap-3">
                      <span className={cn("mono-label tabular-nums transition-colors duration-500", on ? "text-signal/80" : "text-ink-3 max-lg:text-signal/80")}>0{i + 1}</span>
                      <span className={cn("text-[length:var(--text-fluid-lg)] font-semibold tracking-[-0.02em] transition-colors duration-500", on ? "text-ink" : "text-ink-2 max-lg:text-ink")}>{beat.title}</span>
                    </p>
                    <p className={cn("mt-2 pl-8 text-[0.9375rem] leading-relaxed transition-colors duration-500", on ? "text-ink-2" : "text-ink-3 max-lg:text-ink-2")}>{beat.line}</p>
                  </li>
                );
              })}
            </ol>

            <Link
              href="/about"
              className="group mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-signal transition-colors hover:text-signal-bright short:mt-5"
            >
              More about how I work
              <ArrowGlyph />
            </Link>
          </div>

          {/* Portrait at the core of the discipline constellation */}
          <div className="relative mx-auto aspect-square w-full max-w-[22rem] sm:max-w-[26rem] lg:max-w-[30rem]">
            <Constellation activated={active === BEATS.length - 1} portraitCore className="absolute inset-0 h-full w-full" />
            <div className="absolute top-1/2 left-1/2 w-[26%] -translate-x-1/2 -translate-y-1/2">
              <div className="aspect-square">
                <Portrait sizes="(max-width: 1024px) 28vw, 200px" className="h-full w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
