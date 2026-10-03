"use client";

import Image from "next/image";
import { useState } from "react";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * Portrait with a graceful monogram fallback, so the layout is never broken
 * by a missing or slow image. Graded slightly cool to sit inside the palette
 * rather than fighting it.
 */
export default function Portrait({
  src = "/selva-headshot.jpg",
  priority = false,
  sizes = "(max-width: 768px) 60vw, 320px",
  className,
  rounded = "full",
}: {
  src?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  rounded?: "full" | "arch";
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-surface-2",
        rounded === "full" ? "rounded-full" : "rounded-[1.5rem]",
        className,
      )}
    >
      {/* Monogram fallback sits underneath and shows through if the file is absent */}
      <div
        aria-hidden={!failed}
        className="absolute inset-0 grid place-items-center bg-[radial-gradient(120%_120%_at_30%_15%,var(--color-surface-3),var(--color-surface))]"
      >
        <span className="font-mono text-4xl tracking-[0.1em] text-ink-3">
          {site.initials}
        </span>
      </div>

      {!failed && (
        <Image
          src={src}
          alt={site.portraitAlt}
          fill
          sizes={sizes}
          priority={priority}
          onError={() => setFailed(true)}
          className="object-cover object-[center_22%] contrast-[1.04] saturate-[0.82]"
        />
      )}

      {/* Cool grade + inner vignette, pulling the photo into the dark palette */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-signal/10 via-transparent to-void/55 mix-blend-soft-light"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_45%,var(--color-void)_125%)] opacity-70"
      />
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 border border-line-2",
          rounded === "full" ? "rounded-full" : "rounded-[1.5rem]",
        )}
      />
    </div>
  );
}
