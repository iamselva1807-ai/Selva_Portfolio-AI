"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "group relative inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ease-[var(--ease-out-expo)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-signal";

const variants: Record<Variant, string> = {
  primary:
    "bg-signal text-void hover:bg-signal-bright hover:shadow-[0_0_28px_-6px_var(--color-signal)]",
  secondary:
    "border border-line-2 bg-surface-2/50 text-ink backdrop-blur-sm hover:border-signal/40 hover:bg-surface-3/60 hover:text-signal-pale",
  ghost:
    "text-ink-2 hover:text-signal-bright",
};

export function CTA({
  href,
  children,
  variant = "primary",
  className,
  external,
  download,
  onClick,
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
  download?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  ariaLabel?: string;
}) {
  const cls = cn(base, variants[variant], className);

  if (external || href.startsWith("mailto:") || href.startsWith("http") || download) {
    return (
      <a
        href={href}
        className={cls}
        aria-label={ariaLabel}
        onClick={onClick}
        {...(download ? { download: "" } : {})}
        {...(href.startsWith("http")
          ? { target: "_blank", rel: "noreferrer noopener" }
          : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cls} aria-label={ariaLabel} onClick={onClick}>
      {children}
    </Link>
  );
}

/** Inline arrow that slides on hover — used on every "read more" affordance. */
export function ArrowGlyph({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={cn(
        "size-3.5 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1",
        className,
      )}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
    </svg>
  );
}
