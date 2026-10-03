import StarField from "./StarField";
import SpaceScene from "./SpaceScene";

/**
 * Global atmosphere: a vertical void gradient, two slow aura glows and the
 * star field. Fixed behind every page so navigation never re-mounts it.
 */
export default function Backdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Layered void — never a flat black page */}
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,var(--color-surface)_0%,var(--color-void-2)_45%,var(--color-void)_100%)]" />

      {/* Atmospheric light: cyan high-left, violet low-right */}
      <div aria-hidden="true" className="aura animate-aura top-[-18%] left-[-10%] size-[46rem] bg-signal/12" />
      <div
        aria-hidden="true"
        className="aura animate-aura top-[38%] right-[-16%] size-[40rem] bg-violet/10"
        style={{ animationDelay: "-7s", animationDuration: "24s" }}
      />

      <StarField />

      {/* The page's own celestial scene — galaxy, black hole, Milky Way —
          drawn above the universal star field. */}
      <SpaceScene />

      {/* Faint orbital arcs — structure, not decoration */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full opacity-[0.5]"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1440 900"
      >
        <defs>
          <linearGradient id="orbit-a" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-signal)" stopOpacity="0" />
            <stop offset="45%" stopColor="var(--color-signal)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--color-violet)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="orbit-b" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-violet)" stopOpacity="0" />
            <stop offset="55%" stopColor="var(--color-violet)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--color-signal)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <ellipse
          cx="720"
          cy="300"
          rx="900"
          ry="300"
          fill="none"
          stroke="url(#orbit-a)"
          strokeWidth="1"
          transform="rotate(-11 720 300)"
        />
        <ellipse
          cx="760"
          cy="560"
          rx="1120"
          ry="420"
          fill="none"
          stroke="url(#orbit-b)"
          strokeWidth="1"
          transform="rotate(7 760 560)"
        />
      </svg>

      {/* Vignette: pulls focus to the center column */}
      <div className="absolute inset-0 bg-[radial-gradient(100%_60%_at_50%_40%,transparent_30%,var(--color-void)_100%)] opacity-70" />
    </div>
  );
}
