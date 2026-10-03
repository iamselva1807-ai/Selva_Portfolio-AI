"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/motion";

type Node = {
  id: string;
  label: string;
  x: number;
  y: number;
  r: number;
  /** Depth 0..1 — drives pointer parallax so the cluster has real dimension. */
  depth: number;
};

/** Core discipline map. Labels are the domains the resume actually evidences. */
const NODES: Node[] = [
  { id: "core", label: "Selvakumar", x: 210, y: 210, r: 7, depth: 0.15 },
  { id: "cv", label: "Computer Vision", x: 210, y: 74, r: 5, depth: 0.9 },
  { id: "ai", label: "Applied AI", x: 336, y: 152, r: 4.5, depth: 0.65 },
  { id: "bm", label: "Behavioral Features", x: 300, y: 326, r: 4, depth: 0.8 },
  { id: "ds", label: "Data Science", x: 108, y: 318, r: 4.5, depth: 0.7 },
  { id: "ml", label: "Machine Learning", x: 78, y: 148, r: 5, depth: 0.95 },
];

const EDGES: Array<[string, string]> = [
  ["core", "cv"],
  ["core", "ai"],
  ["core", "bm"],
  ["core", "ds"],
  ["core", "ml"],
  ["ml", "cv"],
  ["cv", "ai"],
  ["ai", "bm"],
  ["bm", "ds"],
  ["ds", "ml"],
];

const byId = (id: string) => NODES.find((n) => n.id === id)!;

/**
 * The site's signature visual. A small discipline constellation that drifts
 * with the pointer and illuminates when the visitor chooses "Explore My Work",
 * handing off to the Work page in well under a second.
 */
export default function Constellation({
  activated = false,
  className = "",
  portraitCore = false,
}: {
  activated?: boolean;
  className?: string;
  /** When true the core is drawn as an open ring, framing a portrait placed over it. */
  portraitCore?: boolean;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<SVGSVGElement | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        setPointer({
          x: (e.clientX - (rect.left + rect.width / 2)) / rect.width,
          y: (e.clientY - (rect.top + rect.height / 2)) / rect.height,
        });
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const shift = (n: Node) => ({
    dx: reduced ? 0 : pointer.x * n.depth * 16,
    dy: reduced ? 0 : pointer.y * n.depth * 12,
  });

  return (
    <svg
      ref={ref}
      viewBox="0 0 420 420"
      className={className}
      role="img"
      aria-label="Constellation diagram linking computer vision, machine learning, data science, applied AI and behavioral features"
    >
      <defs>
        <radialGradient id="c-core-glow">
          <stop offset="0%" stopColor="var(--color-signal)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--color-signal)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="c-edge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-signal)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--color-violet)" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Orbit rings — the observatory frame */}
      <ellipse
        cx="210"
        cy="210"
        rx="152"
        ry="152"
        fill="none"
        stroke="var(--color-line-2)"
        strokeWidth="1"
        opacity="0.55"
      />
      <ellipse
        cx="210"
        cy="210"
        rx="178"
        ry="70"
        fill="none"
        stroke="var(--color-signal)"
        strokeWidth="0.8"
        opacity="0.16"
        transform="rotate(-24 210 210)"
      />
      <ellipse
        cx="210"
        cy="210"
        rx="178"
        ry="70"
        fill="none"
        stroke="var(--color-violet)"
        strokeWidth="0.8"
        opacity="0.14"
        transform="rotate(38 210 210)"
      />

      {/* Edges */}
      {EDGES.map(([a, b], i) => {
        const na = byId(a);
        const nb = byId(b);
        const sa = shift(na);
        const sb = shift(nb);
        const lit =
          activated || hovered === a || hovered === b;
        return (
          <motion.line
            key={`${a}-${b}`}
            x1={na.x + sa.dx}
            y1={na.y + sa.dy}
            x2={nb.x + sb.dx}
            y2={nb.y + sb.dy}
            stroke={lit ? "url(#c-edge)" : "var(--color-line-2)"}
            strokeWidth={lit ? 1.3 : 0.9}
            initial={false}
            animate={{ opacity: lit ? 1 : 0.5 }}
            transition={{
              duration: 0.32,
              delay: activated && !reduced ? i * 0.035 : 0,
            }}
          />
        );
      })}

      {/* Nodes */}
      {NODES.map((n, i) => {
        const { dx, dy } = shift(n);
        const isCore = n.id === "core";
        const lit = activated || hovered === n.id;

        // With a portrait in place, the core becomes a luminous ring that
        // frames it rather than a dot competing with it.
        if (isCore && portraitCore) {
          return (
            <g key={n.id} transform={`translate(${dx} ${dy})`}>
              <circle
                cx={n.x}
                cy={n.y}
                r={74}
                fill="url(#c-core-glow)"
                opacity={activated ? 0.9 : 0.5}
              />
              <motion.circle
                cx={n.x}
                cy={n.y}
                r={62}
                fill="none"
                stroke="var(--color-signal)"
                strokeWidth="1"
                initial={false}
                animate={{ opacity: activated ? 0.85 : 0.35 }}
                transition={{ duration: 0.4 }}
              />
            </g>
          );
        }

        return (
          <g
            key={n.id}
            transform={`translate(${dx} ${dy})`}
            onPointerEnter={() => setHovered(n.id)}
            onPointerLeave={() => setHovered(null)}
            className="cursor-default"
          >
            {/* Generous invisible hit area */}
            <circle cx={n.x} cy={n.y} r={22} fill="transparent" />

            <motion.circle
              cx={n.x}
              cy={n.y}
              r={isCore ? 34 : 20}
              fill="url(#c-core-glow)"
              initial={false}
              animate={{ opacity: lit ? 0.95 : isCore ? 0.6 : 0.3 }}
              transition={{
                duration: 0.4,
                delay: activated && !reduced ? 0.12 + i * 0.05 : 0,
              }}
            />
            <motion.circle
              cx={n.x}
              cy={n.y}
              r={n.r}
              fill={isCore ? "var(--color-signal-pale)" : "var(--color-signal)"}
              initial={false}
              animate={{ scale: lit ? 1.3 : 1 }}
              style={{ transformOrigin: `${n.x}px ${n.y}px` }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 20,
                delay: activated && !reduced ? 0.12 + i * 0.05 : 0,
              }}
            />
            {/* Label appears on hover only, so the hero stays uncluttered */}
            <motion.text
              x={n.x}
              y={n.y - (isCore ? 20 : 15)}
              textAnchor="middle"
              className="font-mono"
              fontSize="11"
              letterSpacing="0.06em"
              fill="var(--color-signal-pale)"
              initial={false}
              animate={{ opacity: hovered === n.id ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {n.label}
            </motion.text>
          </g>
        );
      })}
    </svg>
  );
}
