import { TechLogo, hasTechLogo } from "@/components/ui/Icons";
import type { Project } from "@/content/types";
import { cn } from "@/lib/cn";

/**
 * A project's key tools as logo + label chips. Only tools with a genuine logo
 * are shown here, drawn from the case study's own technology list.
 */
export default function ProjectStack({ project, max = 5, className }: { project: Project; max?: number; className?: string }) {
  const tools = Array.from(new Set(project.technologies.flatMap((g) => g.items))).filter(hasTechLogo).slice(0, max);
  if (!tools.length) return null;
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)} aria-label="Key technologies">
      {tools.map((t) => (
        <li
          key={t}
          className="inline-flex items-center gap-1.5 rounded-full border border-line-2 bg-surface-2/60 px-2.5 py-1 text-[11px] font-medium text-ink-2"
        >
          <TechLogo name={t} className="size-3.5 text-ink-3" />
          {t}
        </li>
      ))}
    </ul>
  );
}
