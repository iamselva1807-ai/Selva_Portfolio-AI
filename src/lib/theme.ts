/**
 * Each route gets its own celestial scene, chosen so the imagery says
 * something about the page rather than just decorating it.
 */
export type SceneName =
  | "deep-field"
  | "milky-way"
  | "spiral-galaxy"
  | "black-hole"
  | "orbits"
  | "nebula"
  | "distant";

export type SceneConfig = {
  scene: SceneName;
  /** Short caption, announced to screen readers so the visual isn't silent. */
  label: string;
};

const ROUTES: Array<[RegExp, SceneConfig]> = [
  // A single case study: one object, enormous gravity, everything falling toward it.
  [/^\/work\/[^/]+$/, { scene: "black-hole", label: "A black hole and its accretion disk" }],
  // The body of work: many systems held in one structure.
  [/^\/work$/, { scene: "spiral-galaxy", label: "A spiral galaxy seen face-on" }],
  // Where he came from — the sky as you actually see it, standing on Earth.
  [/^\/about$/, { scene: "milky-way", label: "The Milky Way seen from Earth" }],
  // A trajectory over time.
  [/^\/experience$/, { scene: "orbits", label: "Bodies tracing orbital paths" }],
  // Where things are still forming.
  [/^\/research$/, { scene: "nebula", label: "A star-forming nebula" }],
  [/^\/(resume|contact)$/, { scene: "distant", label: "A distant galaxy" }],
];

export function sceneForRoute(pathname: string): SceneConfig {
  for (const [re, cfg] of ROUTES) if (re.test(pathname)) return cfg;
  return { scene: "deep-field", label: "A deep field of stars" };
}
