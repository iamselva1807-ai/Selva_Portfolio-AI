"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/motion";

/**
 * The site mark: a satellite running a real orbit around a luminous core.
 *
 * The orbital plane tips toward the pointer, so the mark reads as a small
 * three-dimensional system rather than a flat logo. With reduced motion it
 * settles into a composed static frame.
 */
export default function OrbitMark() {
  const reduced = useReducedMotion();
  const [angle, setAngle] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const ref = useRef<SVGSVGElement | null>(null);

  // The orbit itself.
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let last = 0;
    const loop = (now: number) => {
      const dt = last ? now - last : 16;
      last = now;
      setAngle((a) => (a + dt * 0.0009) % (Math.PI * 2));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else {
        last = 0;
        raf = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduced]);

  // Plane tilts toward the pointer.
  useEffect(() => {
    if (reduced) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
        const dy = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
        setTilt({ x: Math.max(-1, Math.min(1, dx * 2)), y: Math.max(-1, Math.min(1, dy * 2)) });
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const rx = 14.5;
  const ry = 5.6 + tilt.y * 2.6; // looking more edge-on or more face-on
  const rot = -28 + tilt.x * 26;

  const rad = (rot * Math.PI) / 180;
  const ox = Math.cos(angle) * rx;
  const oy = Math.sin(angle) * ry;
  const sx = 16 + ox * Math.cos(rad) - oy * Math.sin(rad);
  const sy = 16 + ox * Math.sin(rad) + oy * Math.cos(rad);
  // The satellite dims on the far side of the core.
  const behind = Math.sin(angle) < 0;

  return (
    <span className="relative grid size-9 shrink-0 place-items-center">
      <svg ref={ref} viewBox="0 0 32 32" className="size-9" aria-hidden="true">
        <circle cx="16" cy="16" r="12.5" fill="none" stroke="var(--color-line-2)" strokeWidth="1" />
        <ellipse
          cx="16"
          cy="16"
          rx={rx}
          ry={Math.abs(ry)}
          fill="none"
          stroke="var(--color-signal)"
          strokeWidth="0.9"
          opacity="0.5"
          transform={`rotate(${rot} 16 16)`}
        />
        {behind && <circle cx={sx} cy={sy} r="1.6" fill="var(--color-signal)" opacity="0.4" />}
        <circle cx="16" cy="16" r="5.5" fill="var(--color-signal)" opacity="0.16" />
        <circle cx="16" cy="16" r="3" fill="var(--color-signal)" />
        <circle
          cx="16"
          cy="16"
          r="7.5"
          fill="none"
          stroke="var(--color-signal)"
          strokeWidth="0.6"
          opacity="0"
          className="transition-opacity duration-500 group-hover:opacity-40"
        />
        {!behind && (
          <>
            <circle cx={sx} cy={sy} r="3.4" fill="var(--color-signal)" opacity="0.18" />
            <circle cx={sx} cy={sy} r="1.7" fill="var(--color-signal-pale)" />
          </>
        )}
      </svg>
    </span>
  );
}
