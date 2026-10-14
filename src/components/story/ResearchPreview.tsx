import Link from "next/link";
import { ArrowGlyph } from "@/components/ui/Button";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { labNotes } from "@/content/research";
import ChapterHeading from "./ChapterHeading";

/** A glance at the engineering notes: titles only, the notes live on /research. */
export default function ResearchPreview() {
  return (
    <section id="research" data-chapter="Research" aria-labelledby="research-title" className="shell py-24 sm:py-32">
      <ChapterHeading
        index="05"
        label="Research & Engineering"
        id="research-title"
        title="Questions worked through, honestly."
        link={{ href: "/research", label: "All notes" }}
      />
      <RevealGroup as="ul" className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
        {labNotes.slice(0, 3).map((note) => (
          <RevealItem as="li" key={note.index}>
            <Link
              href={`/research#note-${note.index}`}
              className="group flex h-full flex-col bg-surface/90 p-6 transition-colors duration-500 hover:bg-surface-2/90 focus-visible:-outline-offset-4 sm:p-7"
            >
              <span className="flex items-center justify-between gap-3">
                <span className="mono-label text-signal/80">{note.category}</span>
                <span className="mono-label tabular-nums">{note.index}</span>
              </span>
              <span className="mt-5 block text-[length:var(--text-fluid-lg)] font-semibold tracking-[-0.02em] text-balance text-ink transition-colors duration-300 group-hover:text-signal-pale">
                {note.title}
              </span>
              <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-medium text-signal">
                Read the note
                <ArrowGlyph />
              </span>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
