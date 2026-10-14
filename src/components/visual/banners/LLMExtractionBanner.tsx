/**
 * LLMExtractionBanner — conceptual illustration for the
 * "llm-data-extraction" project: source pages that keep changing
 * shape converge on an LLM, which writes into one fixed schema.
 */
const mono = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  letterSpacing: 1.5,
} as const;

const rows = [
  { y: 192, w: [32, 40, 28] },
  { y: 224, w: [24, 36, 36] },
  { y: 256, w: [36, 32, 24] },
];
const cols = [572, 628, 692];

export default function LLMExtractionBanner({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 450"
      className={className}
      role="img"
      aria-label="Illustration: two overlapping web-page wireframes with different layouts feed converging arrows into a central LLM chip, which sends one arrow into a fixed schema table outlined by a dashed boundary."
    >
      <defs>
        <radialGradient id="llmx-glow" cx="432" cy="224" r="128" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--color-signal)" stopOpacity="0.22" />
          <stop offset="1" stopColor="var(--color-signal)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="llmx-fade" cx="432" cy="224" r="128" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--color-ink)" stopOpacity="1" />
          <stop offset="1" stopColor="var(--color-ink)" stopOpacity="0" />
        </radialGradient>
        <mask id="llmx-mask">
          <rect x="304" y="96" width="256" height="256" fill="url(#llmx-fade)" />
        </mask>
        <pattern id="llmx-dots" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="8" cy="8" r="0.8" fill="var(--color-line-bright)" />
        </pattern>
        <marker id="llmx-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M1 1 L7 4 L1 7" fill="none" stroke="var(--color-signal)" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>

      {/* depth: faint dot grid + glow behind the focal chip */}
      <rect x="304" y="96" width="256" height="256" fill="url(#llmx-dots)" mask="url(#llmx-mask)" opacity="0.7" />
      <circle cx="432" cy="224" r="128" fill="url(#llmx-glow)" />

      {/* ── INPUT: pages that keep changing shape ── */}
      <text x="56" y="88" fill="var(--color-ink-3)" {...mono}>PAGES</text>

      {/* back page — previous layout (sidebar + top nav), dashed */}
      <rect x="56" y="104" width="152" height="200" rx="10" fill="none" stroke="var(--color-line-bright)" strokeWidth="1" strokeDasharray="4 5" strokeLinecap="round" />
      <rect x="68" y="116" width="40" height="6" rx="3" fill="var(--color-ink-3)" opacity="0.35" />
      <rect x="124" y="116" width="32" height="6" rx="3" fill="var(--color-signal)" opacity="0.55" />
      <rect x="164" y="116" width="32" height="6" rx="3" fill="var(--color-ink-3)" opacity="0.25" />
      <rect x="68" y="132" width="20" height="40" rx="4" fill="var(--color-ink-3)" opacity="0.18" />
      <rect x="68" y="180" width="20" height="24" rx="4" fill="var(--color-ink-3)" opacity="0.18" />
      <rect x="68" y="212" width="20" height="40" rx="4" fill="var(--color-ink-3)" opacity="0.18" />
      <rect x="68" y="260" width="20" height="32" rx="4" fill="var(--color-ink-3)" opacity="0.18" />

      {/* drift guides between corresponding corners */}
      <path d="M208 104 L248 144 M56 304 L96 344" stroke="var(--color-ink-3)" strokeOpacity="0.5" strokeWidth="1" strokeDasharray="2 4" strokeLinecap="round" />

      {/* front page — current layout (hero + cards), solid */}
      <rect x="96" y="144" width="152" height="200" rx="10" fill="var(--color-surface-2)" stroke="var(--color-line-bright)" strokeWidth="1" />
      <rect x="108" y="156" width="48" height="6" rx="3" fill="var(--color-ink-3)" opacity="0.35" />
      <circle cx="220" cy="159" r="3" fill="var(--color-ink-3)" opacity="0.3" />
      <circle cx="232" cy="159" r="3" fill="var(--color-ink-3)" opacity="0.3" />
      <rect x="108" y="172" width="128" height="52" rx="6" fill="var(--color-surface-3)" stroke="var(--color-line-2)" strokeWidth="1" />
      <rect x="108" y="236" width="104" height="6" rx="3" fill="var(--color-signal)" opacity="0.75" />
      <rect x="108" y="250" width="80" height="6" rx="3" fill="var(--color-ink-3)" opacity="0.25" />
      <rect x="108" y="268" width="60" height="64" rx="6" fill="none" stroke="var(--color-line-2)" strokeWidth="1" />
      <rect x="176" y="268" width="60" height="64" rx="6" fill="none" stroke="var(--color-line-2)" strokeWidth="1" />
      <rect x="116" y="312" width="36" height="6" rx="3" fill="var(--color-ink-3)" opacity="0.25" />
      <rect x="184" y="312" width="28" height="6" rx="3" fill="var(--color-ink-3)" opacity="0.25" />

      <text x="96" y="376" fill="var(--color-ink-3)" {...mono}>LAYOUT DRIFT</text>

      {/* ── converging paths into the model ── */}
      <path d="M208 120 C 296 120, 304 224, 380 224" fill="none" stroke="var(--color-ink-3)" strokeOpacity="0.6" strokeWidth="1" strokeDasharray="3 5" strokeLinecap="round" />
      <path d="M248 240 C 312 240, 320 224, 380 224" fill="none" stroke="var(--color-signal)" strokeWidth="1.5" strokeLinecap="round" markerEnd="url(#llmx-arrow)" />

      {/* ── PROCESSING: the LLM chip ── */}
      <g stroke="var(--color-signal)" strokeOpacity="0.55" strokeWidth="1" strokeLinecap="round">
        <path d="M412 176 V184 M432 176 V184 M452 176 V184" />
        <path d="M412 264 V272 M432 264 V272 M452 264 V272" />
        <path d="M384 204 H392 M384 244 H392 M472 204 H480 M472 244 H480" />
      </g>
      <rect x="392" y="184" width="80" height="80" rx="12" fill="var(--color-surface-2)" stroke="var(--color-signal)" strokeOpacity="0.8" strokeWidth="1.5" />
      <rect x="404" y="196" width="56" height="56" rx="8" fill="var(--color-signal)" fillOpacity="0.08" stroke="var(--color-signal)" strokeOpacity="0.35" strokeWidth="1" />
      <text x="432" y="228" textAnchor="middle" fill="var(--color-signal)" {...mono} fontSize={12}>llm</text>

      {/* ── single clean output path ── */}
      <path d="M480 224 H554" fill="none" stroke="var(--color-signal)" strokeWidth="2" strokeLinecap="round" markerEnd="url(#llmx-arrow)" />

      {/* ── RESULT: the fixed schema ── */}
      <text x="544" y="120" fill="var(--color-ink-3)" {...mono}>SCHEMA</text>
      <rect x="544" y="136" width="216" height="184" rx="12" fill="none" stroke="var(--color-signal)" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="4 6" strokeLinecap="round" />

      <rect x="560" y="152" width="184" height="152" rx="8" fill="var(--color-surface-2)" stroke="var(--color-line-bright)" strokeWidth="1" />
      <path d="M560 176 V160 A8 8 0 0 1 568 152 H736 A8 8 0 0 1 744 160 V176 Z" fill="var(--color-signal)" fillOpacity="0.1" />
      <g stroke="var(--color-line-2)" strokeWidth="1">
        <path d="M560 176 H744 M560 208 H744 M560 240 H744 M560 272 H744" />
        <path d="M616 152 V304 M680 152 V304" />
      </g>
      {cols.map((x, i) => (
        <rect key={`h${x}`} x={x} y={161} width={[28, 36, 32][i]} height={6} rx={3} fill="var(--color-signal)" opacity={0.6} />
      ))}
      {rows.map((r) =>
        cols.map((x, i) => (
          <rect key={`${r.y}-${x}`} x={x} y={r.y - 3} width={r.w[i]} height={6} rx={3} fill="var(--color-ink-3)" opacity={0.3} />
        )),
      )}
      {/* newest record landing in the schema */}
      <g className="animate-node">
        {cols.map((x, i) => (
          <rect key={`n${x}`} x={x} y={285} width={[32, 28, 40][i]} height={6} rx={3} fill="var(--color-signal)" opacity={0.75} />
        ))}
      </g>
    </svg>
  );
}
