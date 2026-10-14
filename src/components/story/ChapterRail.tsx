"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export type Chapter = { id: string; label: string };

/**
 * A quiet chapter index on the right edge of the home page (wide screens only):
 * shows where you are in the story and jumps to any chapter. Purely a shortcut
 * — every chapter is also reachable by scrolling and from the main navigation.
 *
 * The current chapter is whichever section spans the line 40% down the
 * viewport, read from scroll position rather than an IntersectionObserver: Next
 * scrolls to a /#hash *after* hydration, and a change-based observer missed
 * that scroll, leaving the first chapter marked current on direct links.
 */
export default function ChapterRail({ chapters }: { chapters: Chapter[] }) {
  const [active, setActive] = useState<string>(chapters[0]?.id ?? "");

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const line = window.innerHeight * 0.4;
      let current = chapters[0]?.id ?? "";
      for (const c of chapters) {
        const el = document.getElementById(c.id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= line) current = c.id;
        if (r.top <= line && r.bottom > line) break;
      }
      setActive(current);
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [chapters]);

  return (
    <nav aria-label="Chapters on this page" className="pointer-events-none fixed top-1/2 right-4 z-30 hidden -translate-y-1/2 xl:block 2xl:right-8">
      <ol className="flex flex-col items-end gap-1">
        {chapters.map((c, i) => {
          const on = c.id === active;
          return (
            <li key={c.id}>
              <a
                href={`/#${c.id}`}
                aria-current={on ? "true" : undefined}
                aria-label={c.label}
                className="group pointer-events-auto relative flex min-h-8 items-center rounded-full py-1 pr-1 pl-3"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    // Out of flow and click-through: only the dash is a target.
                    "mono-label pointer-events-none absolute top-1/2 right-full mr-1 -translate-y-1/2 whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100",
                    on && "text-signal/90",
                  )}
                >
                  {/* Numbered to match the chapter labels: the introduction has none. */}
                  {i === 0 ? c.label : `${String(i).padStart(2, "0")} · ${c.label}`}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "block h-px rounded-full transition-[width,background-color] duration-500",
                    on ? "w-7 bg-signal" : "w-3.5 bg-ink-3 group-hover:w-5 group-hover:bg-ink-2",
                  )}
                />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
