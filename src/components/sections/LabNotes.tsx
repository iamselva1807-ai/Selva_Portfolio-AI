"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Tag } from "@/components/ui/Label";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/motion";
import type { LabNote } from "@/content/types";

const ALL = "All";

/** The three framed parts every note is written in. Order is the argument. */
const PARTS = [
  { key: "Q", label: "Question", field: "question" },
  { key: "A", label: "Approach", field: "approach" },
  { key: "L", label: "Learning", field: "learning" },
] as const;

/**
 * The filterable notebook. Client-side only because of the category filter —
 * everything it renders is passed down from the server page.
 */
export default function LabNotes({
  notes,
  categories,
}: {
  notes: LabNote[];
  categories: string[];
}) {
  const [active, setActive] = useState<string>(ALL);
  const reduced = useReducedMotion();

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const note of notes) {
      map.set(note.category, (map.get(note.category) ?? 0) + 1);
    }
    return map;
  }, [notes]);

  const visible = useMemo(
    () => (active === ALL ? notes : notes.filter((n) => n.category === active)),
    [notes, active],
  );

  const filters = [ALL, ...categories];

  const transition = reduced
    ? { duration: 0 }
    : { duration: 0.24, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <div>
      {/* ---------------- Filter bar ---------------- */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div
          role="group"
          aria-label="Filter lab notes by category"
          className="flex flex-wrap gap-2"
        >
          {filters.map((category) => {
            const isActive = category === active;
            const count =
              category === ALL ? notes.length : (counts.get(category) ?? 0);
            return (
              <button
                key={category}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActive(category)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[length:var(--text-mono-xs)] tracking-[0.1em] uppercase transition-all duration-300 ease-[var(--ease-out-expo)]",
                  isActive
                    ? "border-signal/45 bg-signal/10 text-signal-bright shadow-[0_0_22px_-10px_var(--color-signal)]"
                    : "border-line-2 bg-surface-2/50 text-ink-2 hover:border-line-bright hover:bg-surface-3/60 hover:text-ink",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-1.5 shrink-0 rounded-full transition-colors duration-300",
                    isActive ? "bg-signal" : "bg-ink-4",
                  )}
                />
                {category}
                <span className="tabular-nums text-ink-3">{count}</span>
              </button>
            );
          })}
        </div>

        <p
          aria-hidden="true"
          className="mono-meta shrink-0 tabular-nums text-ink-3 sm:pt-2"
        >
          {visible.length} / {notes.length} notes
        </p>
      </div>

      {/* Result count, announced rather than only shown */}
      <p role="status" aria-live="polite" className="sr-only">
        {active === ALL
          ? `Showing all ${notes.length} lab notes.`
          : `Showing ${visible.length} of ${notes.length} lab notes in ${active}.`}
      </p>

      {/* ---------------- Notes ---------------- */}
      <ol className="mt-9 space-y-5 sm:mt-12">
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map((note) => {
            const headingId = `lab-note-${note.index}`;
            const applied = note.status.toLowerCase().includes("production");

            return (
              <motion.li
                key={note.index}
                layout={!reduced}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={transition}
              >
                <article
                  aria-labelledby={headingId}
                  className="group relative overflow-hidden rounded-2xl border border-line bg-surface/90 transition-colors duration-500 ease-[var(--ease-out-expo)] hover:border-line-bright hover:bg-surface-2/70"
                >
                  {/* Soft hover glow */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-28 -right-20 size-72 rounded-full bg-signal/8 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
                  />

                  <div className="relative grid gap-7 p-5 sm:p-8 lg:grid-cols-[13rem_1fr] lg:gap-10">
                    {/* Rail: the quiet metadata column */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 lg:block lg:self-start lg:border-r lg:border-line lg:pr-8">
                      <span className="font-mono text-[length:var(--text-fluid-xl)] leading-none tabular-nums text-ink-3 transition-colors duration-500 group-hover:text-ink-3">
                        {note.index}
                      </span>

                      <span className="lg:mt-5 lg:block">
                        <Tag>{note.category}</Tag>
                      </span>

                      <span className="mono-meta inline-flex items-center gap-2 text-ink-3 lg:mt-4 lg:flex">
                        <span
                          aria-hidden="true"
                          className={cn(
                            "size-1.5 shrink-0 rounded-full",
                            applied ? "bg-ink-3" : "border border-ink-3",
                          )}
                        />
                        {note.status}
                      </span>

                      {note.companyWork && (
                        <span className="mono-meta inline-flex items-center gap-2 text-violet/90 lg:mt-2.5 lg:flex">
                          <span
                            aria-hidden="true"
                            className="size-1.5 shrink-0 rounded-full bg-violet"
                          />
                          Company work
                        </span>
                      )}
                    </div>

                    {/* Body: title, then the three framed parts */}
                    <div className="min-w-0">
                      <h3
                        id={headingId}
                        className="text-[length:var(--text-fluid-xl)] font-semibold tracking-[-0.03em] text-ink"
                      >
                        {note.title}
                      </h3>

                      <dl className="mt-6 grid gap-px overflow-hidden rounded-xl border border-line bg-line">
                        {PARTS.map((part) => {
                          const isLearning = part.key === "L";
                          return (
                            <div
                              key={part.key}
                              className={cn(
                                "p-5 sm:p-6",
                                isLearning
                                  ? "bg-surface-3/55"
                                  : "bg-surface-2/70",
                              )}
                            >
                              <dt className="flex items-center gap-2.5">
                                <span
                                  aria-hidden="true"
                                  className={cn(
                                    "grid size-5 shrink-0 place-items-center rounded border font-mono text-[length:var(--text-mono-xs)] leading-none",
                                    isLearning
                                      ? "border-signal/30 bg-signal/10 text-signal"
                                      : "border-line-2 text-ink-3",
                                  )}
                                >
                                  {part.key}
                                </span>
                                <span
                                  className={cn(
                                    "mono-label",
                                    isLearning && "text-signal/80",
                                  )}
                                >
                                  {part.label}
                                </span>
                              </dt>
                              <dd
                                className={cn(
                                  "mt-3 text-[0.9375rem] leading-relaxed",
                                  isLearning ? "text-ink" : "text-ink-2",
                                )}
                              >
                                {note[part.field]}
                              </dd>
                            </div>
                          );
                        })}
                      </dl>

                      <ul
                        aria-label={`Tags for ${note.title}`}
                        className="mt-5 flex flex-wrap gap-1.5"
                      >
                        {note.tags.map((tag) => (
                          <li key={tag}>
                            <Tag>{tag}</Tag>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ol>
    </div>
  );
}
