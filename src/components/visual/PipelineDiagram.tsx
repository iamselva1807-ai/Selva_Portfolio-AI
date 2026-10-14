"use client";

import { useState } from "react";
import {
  Activity, Binary, CalendarClock, Camera, ChartColumn, CircleDot, Database, Fingerprint, Gauge,
  GitCompareArrows, Inbox, ListChecks, MousePointerClick, ScanFace, ScanLine, ScanText, ShieldAlert,
  ShieldCheck, SlidersHorizontal, Sparkles, Table, type LucideIcon,
} from "lucide-react";
import type { PipelineStep } from "@/content/types";
import { cn } from "@/lib/cn";

/** Pick a glyph from the stage name, so any case study's pipeline gets icons. */
const RULES: Array<[RegExp, LucideIcon]> = [
  [/liveness/i, ShieldCheck],
  [/capture/i, Camera],
  [/detect|align/i, ScanFace],
  [/embed/i, Binary],
  [/calibrat|decision/i, Gauge],
  [/match/i, GitCompareArrows],
  [/intake/i, Inbox],
  [/scan prep|scan/i, ScanLine],
  [/extract/i, ScanText],
  [/cross-check|source/i, ListChecks],
  [/scor/i, SlidersHorizontal],
  [/risk/i, ShieldAlert],
  [/interaction/i, MousePointerClick],
  [/signal/i, Activity],
  [/feature/i, ChartColumn],
  [/profile/i, Fingerprint],
  [/retriev|schedul/i, CalendarClock],
  [/pars|prompt/i, Sparkles],
  [/schema|conform/i, Table],
  [/output|analysis/i, Database],
];
const iconFor = (label: string) => RULES.find(([re]) => re.test(label))?.[1] ?? CircleDot;

/**
 * The approach as an interactive flow. Desktop: a horizontal row of stages with
 * a packet looping along the line; hovering or focusing a stage highlights it
 * and its explanation below. Every explanation is always visible — the
 * interaction adds emphasis, it never hides content.
 */
export default function PipelineDiagram({ steps }: { steps: PipelineStep[] }) {
  const [focus, setFocus] = useState<number | null>(null);
  const cols = steps.length;

  return (
    <div className="mt-10">
      {/* Diagram — decorative restatement of the list below, so hidden from AT. */}
      <div aria-hidden="true" className="relative hidden rounded-2xl border border-line bg-surface/45 px-6 pt-10 pb-8 md:block">
        <div className="absolute top-[4.25rem] right-[8%] left-[8%] h-px bg-line-2" />
        <div className="absolute top-[4.25rem] right-[8%] left-[8%] h-px overflow-hidden">
          <span className="animate-packet absolute top-0 left-0 block h-px w-24 bg-gradient-to-r from-transparent via-signal to-transparent" />
        </div>
        <ol className="relative grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {steps.map((s, i) => {
            const Icon = iconFor(s.label);
            const on = focus === null || focus === i;
            return (
              <li
                key={s.label}
                onPointerEnter={() => setFocus(i)}
                onPointerLeave={() => setFocus(null)}
                className="flex flex-col items-center text-center"
              >
                <span
                  className={cn(
                    "grid size-14 place-items-center rounded-2xl border bg-void transition-[border-color,color,box-shadow,opacity] duration-300",
                    focus === i ? "border-signal/60 text-signal-pale shadow-[0_0_26px_-6px_var(--color-signal)]" : "border-signal/25 text-signal",
                    !on && "opacity-40",
                  )}
                >
                  <Icon className="size-5" strokeWidth={1.6} />
                </span>
                <span className="mono-label mt-3 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className={cn("mt-1 text-[13px] font-medium leading-snug transition-colors", on ? "text-ink" : "text-ink-3")}>{s.label}</span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* The readable version: every stage and its explanation. */}
      <ol className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
        {steps.map((s, i) => {
          const Icon = iconFor(s.label);
          return (
            <li
              key={s.label}
              tabIndex={0}
              onFocus={() => setFocus(i)}
              onBlur={() => setFocus(null)}
              onPointerEnter={() => setFocus(i)}
              onPointerLeave={() => setFocus(null)}
              className={cn(
                "flex gap-4 bg-surface/90 p-5 transition-colors duration-300 focus-visible:-outline-offset-4 sm:p-6",
                focus === i && "bg-surface-2/90",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-10 shrink-0 place-items-center rounded-xl border transition-colors duration-300",
                  focus === i ? "border-signal/55 text-signal-pale" : "border-line-2 text-signal",
                )}
              >
                <Icon className="size-[18px]" strokeWidth={1.6} />
              </span>
              <span>
                <span className="mono-label tabular-nums">Stage {String(i + 1).padStart(2, "0")}</span>
                <span className="mt-1 block font-semibold tracking-[-0.015em] text-ink">{s.label}</span>
                <span className="mt-1.5 block text-[0.9375rem] leading-relaxed text-ink-2">{s.detail}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
