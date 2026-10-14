"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ArrowGlyph } from "@/components/ui/Button";
import { OwnershipBadge } from "@/components/ui/Label";
import ProjectBanner from "@/components/visual/banners/ProjectBanner";
import { projects } from "@/content/projects";
import { cn } from "@/lib/cn";
import ChapterHeading from "./ChapterHeading";

/**
 * Featured projects as a horizontal showcase.
 *
 * Built on native scroll-snap, so touch swipe, trackpad and arrow keys all work
 * without a carousel library. Visible previous/next controls and position dots
 * drive it too. It never moves on its own — readers set the pace.
 */
export default function ProjectsShowcase() {
  const track = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  /** Scroll offset of each card, clamped to what the track can actually reach. */
  const stops = useCallback(() => {
    const el = track.current;
    if (!el) return [];
    const max = el.scrollWidth - el.clientWidth;
    return Array.from(el.children, (c) => Math.min((c as HTMLElement).offsetLeft - el.offsetLeft, max));
  }, []);

  const sync = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const left = el.scrollLeft;
    setAtStart(left <= 2);
    setAtEnd(left >= max - 2);
    // At the end of the track the last card is the current one, even when
    // several cards are visible at once.
    if (left >= max - 2) {
      setIndex(projects.length - 1);
      return;
    }
    const s = stops();
    let best = 0;
    s.forEach((x, i) => {
      if (Math.abs(x - left) < Math.abs(s[best] - left)) best = i;
    });
    setIndex(best);
  }, [stops]);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(sync);
    };
    schedule();
    el.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      el.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
    };
  }, [sync]);

  const scrollToLeft = (left: number) => {
    const el = track.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left, behavior: reduce ? "instant" : "smooth" });
  };

  /** Dots: go to a card (clamped to the reachable range). */
  const goTo = (i: number) => {
    const s = stops();
    const target = s[Math.max(0, Math.min(s.length - 1, i))];
    if (target !== undefined) scrollToLeft(target);
  };

  /** Previous / next step through the distinct reachable positions. */
  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const left = el.scrollLeft;
    const s = Array.from(new Set(stops()));
    const target = dir > 0 ? s.find((x) => x > left + 2) : [...s].reverse().find((x) => x < left - 2);
    if (target !== undefined) scrollToLeft(target);
  };

  return (
    <section id="projects" data-chapter="Projects" aria-labelledby="projects-title" className="py-24 sm:py-32">
      <div className="shell">
        <ChapterHeading
          index="03"
          label="Featured Projects"
          id="projects-title"
          title="Systems built to make a decision, not a demo."
          link={{ href: "/work", label: "All projects" }}
        />
      </div>

      <div className="shell mt-12">
        <ul
          ref={track}
          tabIndex={0}
          aria-label="Featured projects — scroll horizontally, or use the previous and next buttons"
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-4 [&::-webkit-scrollbar]:hidden"
        >
          {projects.map((p, i) => (
            <li
              key={p.slug}
              className="w-[86%] shrink-0 snap-start sm:w-[68%] lg:w-[calc((100%-1.25rem)/2)]"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${projects.length}: ${p.title}`}
            >
              <Link
                href={`/work/${p.slug}`}
                aria-label={`${p.title} — read the case study`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface/70 transition-[border-color,transform,background-color] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-line-bright hover:bg-surface-2/80 focus-visible:-outline-offset-4"
              >
                <div aria-hidden="true" className="relative border-b border-line bg-[radial-gradient(120%_90%_at_50%_0%,var(--color-surface-2),var(--color-void))]">
                  <ProjectBanner slug={p.slug} className="aspect-[16/9] h-auto w-full transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.02]" />
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <OwnershipBadge ownership={p.ownership} />
                  <h3 className="mt-4 text-[length:var(--text-fluid-xl)] font-semibold tracking-[-0.03em] text-ink transition-colors duration-300 group-hover:text-signal-pale">
                    {p.title}
                  </h3>
                  <p className="mono-meta mt-1.5 text-ink-3">{p.subtitle}</p>
                  <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-2">{p.tagline}</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium text-signal">
                    Read the case study
                    <ArrowGlyph />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1" role="group" aria-label="Choose a project">
            {projects.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show project ${i + 1} of ${projects.length}: ${p.title}`}
                aria-current={i === index ? "true" : undefined}
                className="grid size-11 place-items-center rounded-full"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "block h-1.5 rounded-full transition-[width,background-color] duration-500",
                    i === index ? "w-6 bg-signal" : "w-1.5 bg-ink-3",
                  )}
                />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => step(-1)}
              disabled={atStart}
              aria-label="Previous project"
              className="grid size-11 place-items-center rounded-full border border-line-2 text-ink-2 transition-colors hover:border-signal/40 hover:text-signal disabled:pointer-events-none disabled:opacity-35"
            >
              <ChevronLeft aria-hidden="true" className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              disabled={atEnd}
              aria-label="Next project"
              className="grid size-11 place-items-center rounded-full border border-line-2 text-ink-2 transition-colors hover:border-signal/40 hover:text-signal disabled:pointer-events-none disabled:opacity-35"
            >
              <ChevronRight aria-hidden="true" className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
