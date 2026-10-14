// Banner for the face-verification project: an abstract landmark constellation
// is checked for liveness, compressed to an embedding, and resolved to a match.
// Purely conceptual — no real UI, no values, no identifiable face.

const P = {
  F: [200, 136], BL: [160, 176], BR: [240, 176], EL: [176, 200], ER: [224, 200],
  N1: [200, 208], N2: [200, 240], ML: [180, 272], MR: [220, 272], C: [200, 304],
  JL: [144, 232], JR: [256, 232], KL: [160, 288], KR: [240, 288],
} as const;
type K = keyof typeof P;

const MESH: [K, K][] = [
  ["F", "BL"], ["F", "BR"], ["BL", "EL"], ["BR", "ER"], ["EL", "N1"], ["ER", "N1"],
  ["N1", "N2"], ["EL", "N2"], ["ER", "N2"], ["N2", "ML"], ["N2", "MR"], ["ML", "MR"],
  ["ML", "C"], ["MR", "C"], ["BL", "JL"], ["BR", "JR"], ["JL", "EL"], ["JR", "ER"],
  ["JL", "KL"], ["JR", "KR"], ["KL", "ML"], ["KR", "MR"], ["KL", "C"], ["KR", "C"],
];

// The five canonical alignment landmarks carry the signal colour.
const KEY: K[] = ["EL", "ER", "N2", "ML", "MR"];

const BARS = [40, 24, 48, 32, 16, 44, 28, 48, 20, 36];

const label = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  letterSpacing: 1.5,
} as const;

export default function FaceVerificationBanner({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 450"
      className={className}
      role="img"
      aria-label="Illustration: a geometric constellation of facial landmark dots inside a detection frame is crossed by a liveness scan line, condensed into a column of embedding bars, and resolved into two converging circles under an arc gauge marked with a check."
    >
      <defs>
        <radialGradient id="fvb-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="var(--color-signal)" stopOpacity="0.2" />
          <stop offset="1" stopColor="var(--color-signal)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="fvb-fade" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="var(--color-ink)" stopOpacity="1" />
          <stop offset="1" stopColor="var(--color-ink)" stopOpacity="0" />
        </radialGradient>
        <mask id="fvb-grid-mask">
          <rect x="88" y="96" width="224" height="256" fill="url(#fvb-fade)" />
        </mask>
        <pattern id="fvb-grid" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="8" cy="8" r="0.75" fill="var(--color-line-bright)" />
        </pattern>
        <linearGradient id="fvb-scan" x1="112" y1="0" x2="288" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--color-signal)" stopOpacity="0" />
          <stop offset="0.5" stopColor="var(--color-signal-bright)" stopOpacity="0.9" />
          <stop offset="1" stopColor="var(--color-signal)" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g transform="translate(24 0)">
        {/* ---- Stage 1: landmarks inside a detection frame ---- */}
        <rect x="88" y="96" width="224" height="256" fill="url(#fvb-grid)" mask="url(#fvb-grid-mask)" />

        <g fill="none" stroke="var(--color-signal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M112 136 V120 Q112 112 120 112 H136" />
          <path d="M264 112 H280 Q288 112 288 120 V136" />
          <path d="M288 304 V320 Q288 328 280 328 H264" />
          <path d="M136 328 H120 Q112 328 112 320 V304" />
        </g>

        <g stroke="var(--color-line-bright)" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.8">
          {MESH.map(([a, b]) => (
            <line key={a + b} x1={P[a][0]} y1={P[a][1]} x2={P[b][0]} y2={P[b][1]} />
          ))}
        </g>

        {(Object.keys(P) as K[]).map((k) =>
          KEY.includes(k) ? (
            <g key={k}>
              <circle cx={P[k][0]} cy={P[k][1]} r="6" fill="var(--color-signal)" fillOpacity="0.15" />
              <circle cx={P[k][0]} cy={P[k][1]} r="2.5" fill="var(--color-signal-bright)" />
            </g>
          ) : (
            <circle key={k} cx={P[k][0]} cy={P[k][1]} r="2" fill="var(--color-ink-3)" />
          ),
        )}

        {/* Liveness scan — the single animated element */}
        <g className="animate-node">
          <line x1="112" y1="232" x2="288" y2="232" stroke="url(#fvb-scan)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="112" y1="228" x2="112" y2="236" stroke="var(--color-signal)" strokeWidth="1" strokeLinecap="round" />
          <line x1="288" y1="228" x2="288" y2="236" stroke="var(--color-signal)" strokeWidth="1" strokeLinecap="round" />
        </g>
        <text x="96" y="236" textAnchor="end" fill="var(--color-ink-3)" {...label}>liveness</text>
        <text x="200" y="360" textAnchor="middle" fill="var(--color-ink-3)" {...label}>landmarks</text>

        {/* ---- Flow: frame → embedding ---- */}
        <g fill="none" stroke="var(--color-signal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M304 220 H384" strokeDasharray="2 6" />
          <path d="M376 214 L384 220 L376 226" />
        </g>

        {/* ---- Stage 2: embedding vector ---- */}
        <rect x="400" y="128" width="80" height="180" rx="10" fill="var(--color-surface-2)" fillOpacity="0.6" stroke="var(--color-line-2)" strokeWidth="1" />
        {BARS.map((w, i) => (
          <g key={i}>
            <rect x="416" y={144 + i * 16} width="48" height="4" rx="2" fill="var(--color-line)" />
            <rect x="416" y={144 + i * 16} width={w} height="4" rx="2" fill="var(--color-signal)" fillOpacity={0.45 + (w / 48) * 0.5} />
          </g>
        ))}
        <text x="440" y="360" textAnchor="middle" fill="var(--color-ink-3)" {...label}>embedding</text>

        {/* ---- Flow: embedding → match ---- */}
        <g fill="none" stroke="var(--color-signal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M496 220 H536" strokeDasharray="2 6" />
          <path d="M528 214 L536 220 L528 226" />
        </g>

        {/* ---- Stage 3: match (focal) ---- */}
        <circle cx="632" cy="220" r="128" fill="url(#fvb-glow)" />
        <path d="M569.8 282.2 A88 88 0 1 1 694.2 282.2" fill="none" stroke="var(--color-line-2)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M569.8 282.2 A88 88 0 1 1 720 220" fill="none" stroke="var(--color-signal)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="720" cy="220" r="3" fill="var(--color-signal-pale)" />
        <circle cx="632" cy="220" r="104" fill="none" stroke="var(--color-line)" strokeWidth="1" strokeDasharray="1 7" strokeLinecap="round" />

        <circle cx="616" cy="220" r="44" fill="none" stroke="var(--color-ink-3)" strokeWidth="1" strokeOpacity="0.7" />
        <circle cx="648" cy="220" r="44" fill="var(--color-signal)" fillOpacity="0.06" stroke="var(--color-signal)" strokeWidth="1.5" />
        <path d="M620 221 L628 229 L645 210" fill="none" stroke="var(--color-signal-bright)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        <text x="632" y="360" textAnchor="middle" fill="var(--color-signal)" {...label}>match</text>
      </g>
    </svg>
  );
}
