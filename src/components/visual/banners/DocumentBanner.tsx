const MONO = "var(--font-mono)";

/** Placeholder text lines on the scanned page: [y, width]. */
const PAGE_LINES: Array<[number, number]> = [
  [144, 152],
  [160, 136],
  [176, 112],
  [244, 148],
  [260, 128],
  [276, 140],
  [340, 120],
  [352, 88],
];

/** OCR regions on the page: box top y, and the bars inside it [y, width, height]. */
const OCR_BOXES: Array<{ y: number; bars: Array<[number, number, number]> }> = [
  { y: 100, bars: [[112, 96, 8]] },
  { y: 196, bars: [[204, 120, 6], [216, 88, 6]] },
  { y: 292, bars: [[300, 112, 6], [312, 72, 6]] },
];

/**
 * Connectors from each OCR box (right edge, after the page's -1.5deg
 * rotation) to its record row on the panel's left edge.
 */
const CONNECTORS = [
  "M261 114 C 352 114, 360 136, 448 136",
  "M264 210 C 352 210, 360 184, 448 184",
  "M266 306 C 360 306, 360 232, 448 232",
];

/** Record rows: centre y, value-bar width, flagged as mismatch. */
const ROWS: Array<{ y: number; value: number; flagged: boolean }> = [
  { y: 136, value: 96, flagged: false },
  { y: 184, value: 80, flagged: true },
  { y: 232, value: 104, flagged: false },
];

const labelProps = {
  fontFamily: MONO,
  fontSize: 11,
  letterSpacing: 1.5,
  fill: "var(--color-ink-3)",
} as const;

export default function DocumentBanner({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 450"
      className={className}
      role="img"
      aria-label="Illustration: a slightly skewed scanned page with three regions framed by OCR bounding boxes, connected to a three-row structured record that is cross-checked against a source database, with one row flagged as a mismatch."
    >
      <defs>
        <radialGradient id="docb-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-signal)" stopOpacity="0.14" />
          <stop offset="100%" stopColor="var(--color-signal)" stopOpacity="0" />
        </radialGradient>
        <pattern id="docb-dots" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="var(--color-line-2)" />
        </pattern>
        <linearGradient id="docb-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-signal)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--color-signal)" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Depth: faint dot field and a glow behind the record */}
      <rect x="400" y="56" width="336" height="352" fill="url(#docb-dots)" opacity="0.6" />
      <ellipse cx="560" cy="184" rx="208" ry="152" fill="url(#docb-glow)" />

      {/* ---- Scanned page (input) ---- */}
      <text x="96" y="56" {...labelProps}>scan</text>
      <rect
        x="104" y="80" width="208" height="304" rx="10"
        fill="var(--color-surface)" stroke="var(--color-line)" strokeWidth="1"
        transform="rotate(2 208 232)"
      />
      <g transform="rotate(-1.5 200 224)">
        <rect
          x="96" y="72" width="208" height="304" rx="10"
          fill="var(--color-surface-2)" stroke="var(--color-line-bright)" strokeWidth="1"
        />
        {PAGE_LINES.map(([y, w]) => (
          <rect key={y} x="120" y={y} width={w} height="4" rx="2" fill="var(--color-line-bright)" />
        ))}
        {OCR_BOXES.map((box) => (
          <g key={box.y}>
            <rect
              x="112" y={box.y} width="152" height="32" rx="6"
              fill="var(--color-signal)" fillOpacity="0.06"
              stroke="var(--color-signal)" strokeWidth="1"
            />
            {box.bars.map(([y, w, h]) => (
              <rect
                key={y} x="120" y={y} width={w} height={h} rx={h / 2}
                fill="var(--color-signal-bright)" fillOpacity="0.55"
              />
            ))}
          </g>
        ))}
      </g>

      {/* ---- OCR connectors (the data path) ---- */}
      <text x="352" y="88" textAnchor="middle" {...labelProps}>ocr</text>
      {CONNECTORS.map((d, i) => (
        <path
          key={d} d={d} fill="none"
          stroke="url(#docb-fade)" strokeWidth={i === 1 ? 1.5 : 1} strokeLinecap="round"
        />
      ))}
      {[[261, 114], [264, 210], [266, 306]].map(([x, y]) => (
        <circle key={y} cx={x} cy={y} r="2.5" fill="var(--color-signal)" />
      ))}

      {/* ---- Structured record (focal) ---- */}
      <text x="448" y="80" {...labelProps} fill="var(--color-signal)">record</text>
      <rect
        x="448" y="96" width="224" height="176" rx="12"
        fill="var(--color-surface-2)" stroke="var(--color-line-bright)" strokeWidth="1"
      />
      <line x1="464" y1="160" x2="656" y2="160" stroke="var(--color-line-2)" strokeWidth="1" />
      <line x1="464" y1="208" x2="656" y2="208" stroke="var(--color-line-2)" strokeWidth="1" />
      {ROWS.map((row) => (
        <g key={row.y}>
          <circle
            cx="448" cy={row.y} r="3"
            fill="var(--color-surface-2)" stroke="var(--color-signal)" strokeWidth="1.5"
          />
          <rect x="472" y={row.y - 4} width="48" height="8" rx="4" fill="var(--color-ink-3)" fillOpacity="0.35" />
          <rect
            x="536" y={row.y - 4} width={row.value} height="8" rx="4"
            fill={row.flagged ? "var(--color-violet)" : "var(--color-signal)"}
            fillOpacity={row.flagged ? 0.6 : 0.75}
          />
          {row.flagged ? (
            <>
              <rect
                x="528" y={row.y - 12} width={row.value + 16} height="24" rx="8"
                fill="none" stroke="var(--color-violet)" strokeWidth="1" strokeOpacity="0.8"
              />
              <circle cx="648" cy={row.y} r="4" fill="var(--color-violet)" className="animate-node" />
            </>
          ) : (
            <circle cx="648" cy={row.y} r="3" fill="var(--color-signal)" fillOpacity="0.8" />
          )}
        </g>
      ))}

      {/* ---- Cross-check route from source to the flagged row ---- */}
      <path
        d="M596 352 H 688 Q 704 352 704 336 V 200 Q 704 184 688 184 H 672"
        fill="none" stroke="var(--color-ink-3)" strokeOpacity="0.7"
        strokeWidth="1" strokeDasharray="4 6" strokeLinecap="round"
      />
      <circle cx="672" cy="184" r="2.5" fill="var(--color-violet)" />
      <text x="616" y="376" {...labelProps}>cross-check</text>

      {/* ---- Source database ---- */}
      <g fill="var(--color-surface-2)" stroke="var(--color-line-bright)" strokeWidth="1" strokeLinecap="round">
        <path d="M524 336 V 384 A 36 9 0 0 0 596 384 V 336" />
        <path d="M524 360 A 36 9 0 0 0 596 360" fill="none" />
        <ellipse cx="560" cy="336" rx="36" ry="9" stroke="var(--color-ink-3)" />
      </g>
      <text x="508" y="364" textAnchor="end" {...labelProps}>source</text>
    </svg>
  );
}
