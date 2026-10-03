"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/motion";

const RX = 14.5;

/**
 * The site mark: a satellite running a real orbit around a luminous core, with
 * the orbital plane tipping toward the pointer so it reads as a small
 * three-dimensional system rather than a flat logo.
 *
 * Everything animates through refs and direct attribute writes. This mark sits
 * in the nav on every page, so a per-frame setState here would re-render the
 * whole header sixty times a second for the life of the session.
 */
export default function OrbitMark() {
  const reduced = useReducedMotion();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const satRef = useRef<SVGGElement | null>(null);
  const orbitRef = useRef<SVGEllipseElement | null>(null);

  const angle = useRef(0);
  const rot = useRef(-28);
  const ry = useRef(5.6);

  useEffect(() => {
    const draw = () => {
      const a = angle.current;
      const rad = (rot.current * Math.PI) / 180;
      const ox = Math.cos(a) * RX;
      const oy = Math.sin(a) * ry.current;
      const x = 16 + ox * Math.cos(rad) - oy * Math.sin(rad);
      const y = 16 + ox * Math.sin(rad) + oy * Math.cos(rad);

      satRef.current?.setAttribute("transform", `translate(${x - 16} ${y - 16})`);
      // Dim the satellite while it passes behind the core.
      satRef.current?.setAttribute("opacity", Math.sin(a) < 0 ? "0.4" : "1");
      orbitRef.current?.setAttribute("ry", String(Math.abs(ry.current)));
      orbitRef.current?.setAttribute("transform", `rotate(${rot.current} 16 16)`);
    };

    draw();
    if (reduced) return;

    let raf = 0;
    let last = 0;
    const loop = (now: number) => {
      const dt = last ? Math.min(now - last, 48) : 16;
      last = now;
      angle.current = (angle.current + dt * 0.0009) % (Math.PI * 2);
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) {
        last = 0;
        raf = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const onMove = (e: PointerEvent) => {
      const el = svgRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
      const dy = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
      rot.current = -28 + Math.max(-1, Math.min(1, dx * 2)) * 26;
      ry.current = 5.6 + Math.max(-1, Math.min(1, dy * 2)) * 2.6;
    };
    if (!coarse) window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      if (!coarse) window.removeEventListener("pointermove", onMove);
    };
  }, [reduced]);

  return (
    <span className="relative grid size-9 shrink-0 place-items-center">
      <svg ref={svgRef} viewBox="0 0 32 32" className="size-9" aria-hidden="true">
        <circle cx="16" cy="16" r="12.5" fill="none" stroke="var(--color-line-2)" strokeWidth="1" />
        <ellipse
          ref={orbitRef}
          cx="16"
          cy="16"
          rx={RX}
          ry="5.6"
          fill="none"
          stroke="var(--color-signal)"
          strokeWidth="0.9"
          opacity="0.5"
          transform="rotate(-28 16 16)"
        />
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
        <g ref={satRef}>
          <circle cx={16 + RX} cy="16" r="3.4" fill="var(--color-signal)" opacity="0.18" />
          <circle cx={16 + RX} cy="16" r="1.7" fill="var(--color-signal-pale)" />
        </g>
      </svg>
    </span>
  );
}
