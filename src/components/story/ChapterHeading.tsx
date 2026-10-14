import Link from "next/link";
import { SectionLabel } from "@/components/ui/Label";
import { ArrowGlyph } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

/** The opening of every home-page chapter: index, label, title, onward link. */
export default function ChapterHeading({
  index,
  label,
  title,
  id,
  link,
}: {
  index: string;
  label: string;
  title: string;
  id: string;
  link?: { href: string; label: string };
}) {
  return (
    <Reveal>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <SectionLabel index={index}>{label}</SectionLabel>
          <h2 id={id} className="mt-5 max-w-2xl text-[length:var(--text-display-sm)] font-semibold text-balance text-ink">
            {title}
          </h2>
        </div>
        {link && (
          <Link
            href={link.href}
            className="group inline-flex min-h-11 items-center gap-2 text-sm font-medium text-signal transition-colors hover:text-signal-bright"
          >
            {link.label}
            <ArrowGlyph />
          </Link>
        )}
      </div>
    </Reveal>
  );
}
