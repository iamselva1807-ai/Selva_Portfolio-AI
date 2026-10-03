import Link from "next/link";
import { ArrowGlyph } from "@/components/ui/Button";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { projects } from "@/content/projects";

/**
 * One line per project. The home page used to reprint the full /work cards
 * verbatim; these point at them instead of repeating them.
 */
export default function WorkTeasers() {
  return (
    <ul className="mt-10 divide-y divide-line border-y border-line">
      <RevealGroup as="div" className="contents">
        {projects.map((p, i) => (
          <RevealItem as="li" key={p.slug}>
            <Link
              href={`/work/${p.slug}`}
              className="group flex items-baseline gap-5 py-6 transition-colors sm:gap-8"
            >
              <span className="mono-label shrink-0 tabular-nums text-signal/70">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[length:var(--text-fluid-xl)] font-semibold tracking-[-0.03em] text-ink transition-colors duration-300 group-hover:text-signal-pale">
                  {p.title}
                </span>
                <span className="mono-meta mt-1 block text-ink-3">
                  {p.subtitle}
                </span>
              </span>
              <ArrowGlyph className="mt-2 shrink-0 text-signal" />
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </ul>
  );
}
