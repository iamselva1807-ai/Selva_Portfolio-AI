"use client";

import { useSyncExternalStore } from "react";
import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

const subscribe = () => () => {};

/**
 * True only after hydration. React treats a differing server snapshot as an
 * expected post-hydration re-render rather than a mismatch.
 */
function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

/**
 * Motion animates in JavaScript, so the `prefers-reduced-motion` reset in
 * globals.css — which only neutralises CSS animations and transitions — cannot
 * reach it, and Motion's own default is `reducedMotion: "never"`. Without this
 * provider every scroll reveal would still translate for visitors who asked for
 * reduced motion.
 *
 * It has to be gated on hydration. With "user" active during SSR, Motion cannot
 * read the media query on the server and renders the *final* state, while the
 * client renders the *initial* state — a hydration mismatch that React refuses
 * to patch, leaving elements stuck at their server opacity. Rendering "never"
 * for the server pass and the hydration render keeps both sides identical, then
 * the preference takes effect on the re-render immediately after.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  const hydrated = useHydrated();
  return (
    <MotionConfig reducedMotion={hydrated ? "user" : "never"}>
      {children}
    </MotionConfig>
  );
}
