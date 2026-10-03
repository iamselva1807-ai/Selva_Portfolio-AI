import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { identity } from "@/content/identity";

/**
 * The recruiter's fast facts. Four tiles, no prose — this replaced a keyword
 * grid that restated the case studies.
 */
export default function Snapshot() {
  if (!identity.stats.length) return null;
  return (
    <section className="shell pt-4 pb-16 sm:pb-20" aria-label="At a glance">
      <RevealGroup className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {identity.stats.map((stat) => (
          <RevealItem key={stat.label} className="bg-surface/90 p-6">
            <p className="text-[length:var(--text-fluid-lg)] font-semibold tracking-[-0.025em] text-balance text-signal-pale">
              {stat.value}
            </p>
            <p className="mt-2 text-sm leading-snug text-balance text-ink-3">
              {stat.label}
            </p>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
