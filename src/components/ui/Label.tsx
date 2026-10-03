import { cn } from "@/lib/cn";

/**
 * The recurring "instrument readout" voice — a monospace label with an
 * optional index and a short cyan tick. Used to open every major section.
 */
export function SectionLabel({
  index,
  children,
  className,
}: {
  index?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span aria-hidden="true" className="h-px w-6 bg-signal/60" />
      {index && (
        <span className="mono-label text-signal/80 tabular-nums">{index}</span>
      )}
      <span className="mono-label">{children}</span>
    </div>
  );
}

/** Small pill used for technology families and focus areas. */
export function Tag({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "signal" | "violet";
}) {
  const tones = {
    default: "border-line-2 bg-surface-2/60 text-ink-2",
    signal: "border-signal/25 bg-signal/8 text-signal-bright",
    violet: "border-violet/25 bg-violet/8 text-violet",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-center font-mono text-[11px] tracking-[0.02em]",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

/** Ownership chip — makes company work unmistakable at a glance. */
export function OwnershipBadge({
  ownership,
  note,
}: {
  ownership: string;
  note?: string;
}) {
  const isCompany = ownership.toLowerCase().includes("company");
  return (
    <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] tracking-[0.02em]",
          isCompany
            ? "border-violet/30 bg-violet/10 text-violet"
            : "border-signal/30 bg-signal/10 text-signal-bright",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "size-1.5 rounded-full",
            isCompany ? "bg-violet" : "bg-signal",
          )}
        />
        {ownership}
      </span>
      {note && <span className="mono-meta text-ink-3">{note}</span>}
    </span>
  );
}
