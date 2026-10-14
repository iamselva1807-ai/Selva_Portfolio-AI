"use client";

import { useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * A few degrees of pointer-follow tilt on fine pointers only. Decoration, never
 * a requirement: touch devices and reduced-motion visitors get a flat card with
 * the same content and the same hover lift.
 */
export default function TiltCard({ children, className, max = 4 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const onMove = (e: React.PointerEvent) => {
    if (reduced || e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1100px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg)`;
    el.style.setProperty("--glare-x", `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty("--glare-y", `${((y + 0.5) * 100).toFixed(1)}%`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn("relative h-full transition-transform duration-500 ease-[var(--ease-out-expo)] will-change-transform", className)}
    >
      {children}
      {/* soft light that follows the pointer */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 [background:radial-gradient(420px_circle_at_var(--glare-x,50%)_var(--glare-y,0%),color-mix(in_oklab,var(--color-signal)_10%,transparent),transparent_60%)] group-hover:opacity-100"
      />
    </div>
  );
}
