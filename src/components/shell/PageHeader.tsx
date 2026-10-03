import { SectionLabel } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";

/** Consistent opening for every inner page: label, display title, lede. */
export default function PageHeader({
  index,
  label,
  title,
  lede,
  children,
}: {
  index?: string;
  label: string;
  title: string;
  lede?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="shell pt-32 pb-12 sm:pt-40 sm:pb-16">
      <Reveal as="header">
        <SectionLabel index={index}>{label}</SectionLabel>
        <h1 className="ink-gradient mt-6 max-w-4xl text-[length:var(--text-display)] font-semibold">
          {title}
        </h1>
        {lede && (
          <p className="mt-6 max-w-2xl text-[length:var(--text-fluid-lg)] leading-relaxed text-ink-2">
            {lede}
          </p>
        )}
        {children}
      </Reveal>
      <div className="rule-fade mt-12" />
    </header>
  );
}
