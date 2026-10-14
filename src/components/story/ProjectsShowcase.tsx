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

  const syncIndex = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const cards = Array.from(el.children) as HTMLElement[];
    const left = el.scrollLeft;
    let best = 0;
    let bestDist = Infinity;
    cards.forEach((c, i) => {
      const d = Math.abs(c.offsetLeft - el.offsetLeft - left);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setIndex(best);
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(syncIndex);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [syncIndex]);

  const goTo = (i: number) => {
    const el = track.current;
    if (!el) return;
    const card = el.children[Math.max(0, Math.min(projects.length - 1, i))] as HTMLElement | undefined;
    if (!card) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: reduce ? "instant" : "smooth" });
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
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface/70 transition-[border-color,transform,background-color] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-line-bright hover:bg-surface-2/80 focus-visible:outline-offset-4"
              >
                <div className="relative border-b border-line bg-[radial-gradient(120%_90%_at_50%_0%,var(--color-surface-2),var(--color-void))]">
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
                    i === index ? "w-6 bg-signal" : "w-1.5 bg-line-bright",
                  )}
                />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              aria-label="Previous project"
              className="grid size-11 place-items-center rounded-full border border-line-2 text-ink-2 transition-colors hover:border-signal/40 hover:text-signal disabled:pointer-events-none disabled:opacity-35"
            >
              <ChevronLeft aria-hidden="true" className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              disabled={index >= projects.length - 1}
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
