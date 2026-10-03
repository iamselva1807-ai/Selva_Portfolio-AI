import type { PipelineStep } from "@/content/types";

/**
 * The approach, drawn as a traced path. Each stage is a node on a vertical
 * spine; the detail sits beside it. Conceptual only — nothing here exposes
 * component-level or threshold detail.
 */
export default function PipelineFlow({ steps }: { steps: PipelineStep[] }) {
  return (
    <ol className="relative mt-10 space-y-0">
      {steps.map((step, i) => {
        const last = i === steps.length - 1;
        return (
          <li key={step.label} className="group relative flex gap-5 sm:gap-7">
            {/* Spine */}
            <div className="relative flex w-8 shrink-0 flex-col items-center sm:w-10">
              <span className="relative z-10 grid size-8 place-items-center rounded-full border border-signal/35 bg-void sm:size-10">
                <span className="mono-label text-signal tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-signal/12 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
              </span>
              {!last && (
                <span
                  aria-hidden="true"
                  className="w-px flex-1 bg-gradient-to-b from-signal/35 via-line-2 to-line-2"
                />
              )}
            </div>

            <div className={last ? "pb-0" : "pb-9"}>
              <h3 className="text-[0.9375rem] font-semibold tracking-[-0.015em] text-ink">
                {step.label}
              </h3>
              <p className="mt-1.5 max-w-xl text-[0.9375rem] leading-relaxed text-ink-2">
                {step.detail}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
