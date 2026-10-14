/**
 * BehavioralBanner — conceptual illustration for the Behavioral Fingerprinting
 * project: interaction events on parallel lanes are windowed into a session,
 * reduced to a compact feature vector, and resolved into ONE shared profile
 * definition that several consuming services read identically.
 * Abstract only: no real fields, signals, values or product UI.
 */

const WIN_X0 = 144;
const WIN_X1 = 232;

// Irregularly spaced interaction events per lane (x positions only, no data).
const LANES: { y: number; dots: number[] }[] = [
  { y: 160, dots: [60, 96, 116, 164, 184, 220, 252] },
  { y: 200, dots: [72, 128, 156, 200, 212, 260] },
  { y: 240, dots: [56, 88, 104, 148, 176, 228, 244, 268] },
  { y: 280, dots: [80, 124, 168, 196, 204, 248] },
];

// Relative bar heights for the feature vector (shape only, not values).
const BARS = [32, 48, 20, 40, 56, 28];

const CONSUMERS = [140, 220, 300];

const label = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  letterSpacing: 1.5,
  fill: "var(--color-ink-3)",
} as const;

export default function BehavioralBanner({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 450"
      className={className}
      role="img"
      aria-label="Illustration: interaction events on parallel lanes are grouped into a session window, condensed into a feature vector, and resolved into one shared behavioral profile that fans out identically to several consuming services."
    >
      <defs>
        <radialGradient id="bhv-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="var(--color-signal)" stopOpacity="0.22" />
          <stop offset="0.6" stopColor="var(--color-signal-deep)" stopOpacity="0.08" />
          <stop offset="1" stopColor="var(--color-signal-deep)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bhv-lane" gradientUnits="userSpaceOnUse" x1="48" y1="0" x2="272" y2="0">
          <stop offset="0" stopColor="var(--color-line-2)" stopOpacity="0" />
          <stop offset="0.25" stopColor="var(--color-line-2)" stopOpacity="1" />
          <stop offset="1" stopColor="var(--color-line-2)" stopOpacity="1" />
        </linearGradient>
        <pattern id="bhv-grid" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="8" cy="8" r="0.8" fill="var(--color-line-2)" />
        </pattern>
      </defs>

      <g transform="translate(0 -8)">
        {/* Faint dot grid behind the profile + consumers region */}
        <rect x="480" y="104" width="296" height="240" fill="url(#bhv-grid)" opacity="0.6" />

        {/* ---- Events: lanes over a time axis ---- */}
        {LANES.map((lane) => (
          <line
            key={lane.y}
            x1="48"
            y1={lane.y}
            x2="272"
            y2={lane.y}
            stroke="url(#bhv-lane)"
            strokeWidth="1"
            strokeLinecap="round"
          />
        ))}

        <line x1="48" y1="320" x2="272" y2="320" stroke="var(--color-line-2)" strokeWidth="1" strokeLinecap="round" />
        {[48, 80, 112, 144, 176, 208, 240, 272].map((x) => (
          <line key={x} x1={x} y1="320" x2={x} y2="324" stroke="var(--color-line-bright)" strokeWidth="1" strokeLinecap="round" />
        ))}

        {/* Session window */}
        <rect
          x={WIN_X0}
          y="144"
          width={WIN_X1 - WIN_X0}
          height="152"
          rx="10"
          fill="var(--color-signal)"
          fillOpacity="0.04"
          stroke="var(--color-signal)"
          strokeOpacity="0.7"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <line x1={WIN_X0} y1="296" x2={WIN_X0} y2="320" stroke="var(--color-signal)" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="2 4" />
        <line x1={WIN_X1} y1="296" x2={WIN_X1} y2="320" stroke="var(--color-signal)" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="2 4" />

        {LANES.flatMap((lane) =>
          lane.dots.map((x) => {
            const inside = x > WIN_X0 && x < WIN_X1;
            return (
              <circle
                key={`${lane.y}-${x}`}
                cx={x}
                cy={lane.y}
                r={inside ? 3 : 2.5}
                fill={inside ? "var(--color-signal-bright)" : "var(--color-ink-3)"}
                opacity={inside ? 1 : x < 96 ? 0.35 : 0.6}
              />
            );
          }),
        )}

        {/* ---- Arrow: session -> features ---- */}
        <path d="M288 220 H344" stroke="var(--color-signal)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M338 214 L344 220 L338 226" stroke="var(--color-signal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

        {/* ---- Feature vector ---- */}
        <rect x="352" y="176" width="96" height="88" rx="10" fill="var(--color-surface-2)" stroke="var(--color-line-bright)" strokeWidth="1" />
        <line x1="364" y1="248" x2="436" y2="248" stroke="var(--color-line-2)" strokeWidth="1" strokeLinecap="round" />
        {BARS.map((h, i) => (
          <rect
            key={i}
            x={368 + i * 12}
            y={248 - h}
            width="6"
            height={h}
            rx="3"
            fill={i % 2 ? "var(--color-signal-bright)" : "var(--color-signal)"}
            fillOpacity="0.85"
          />
        ))}

        {/* ---- Primary path: features -> profile ---- */}
        <path d="M448 220 H512" stroke="var(--color-signal)" strokeWidth="2" strokeLinecap="round" fill="none" />
        <circle cx="448" cy="220" r="3" fill="var(--color-signal)" />

        {/* ---- Profile: the one shared definition ---- */}
        <circle cx="544" cy="220" r="96" fill="url(#bhv-glow)" />
        <circle cx="544" cy="220" r="44" fill="none" stroke="var(--color-line-bright)" strokeWidth="1" strokeDasharray="2 6" strokeLinecap="round" />
        <circle cx="544" cy="220" r="32" fill="var(--color-surface-2)" stroke="var(--color-signal)" strokeWidth="1.5" />
        <circle cx="544" cy="220" r="20" fill="none" stroke="var(--color-signal-deep)" strokeWidth="1" />
        <circle cx="544" cy="220" r="10" fill="var(--color-signal)" className="animate-node" />

        {/* ---- Fan-out to identical consumers ---- */}
        {CONSUMERS.map((cy) => (
          <g key={cy}>
            <path
              d={`M576 220 C624 220 624 ${cy} 672 ${cy}`}
              stroke="var(--color-signal)"
              strokeOpacity="0.65"
              strokeWidth="1"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="672" cy={cy} r="2.5" fill="var(--color-signal)" />
            <rect x="672" y={cy - 20} width="80" height="40" rx="8" fill="var(--color-surface-2)" stroke="var(--color-line-2)" strokeWidth="1" />
            {BARS.map((h, i) => (
              <rect
                key={i}
                x={686 + i * 6}
                y={cy + 8 - h / 4}
                width="3"
                height={h / 4}
                rx="1.5"
                fill="var(--color-signal)"
                fillOpacity="0.7"
              />
            ))}
            <rect x="728" y={cy - 3} width="12" height="6" rx="3" fill="var(--color-line-bright)" />
          </g>
        ))}

        {/* ---- Labels ---- */}
        <text x={WIN_X0} y="128" {...label}>session</text>
        <text x="48" y="352" {...label}>events</text>
        <text x="352" y="352" {...label}>features</text>
        <text x="544" y="352" textAnchor="middle" {...label} fill="var(--color-signal)">
          profile
        </text>
        <text x="672" y="352" {...label}>consumers</text>
      </g>
    </svg>
  );
}
