import { useSyncExternalStore } from "react";
import type { Variants } from "motion/react";

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Tracks the user's reduced-motion preference reactively.
 *
 * useSyncExternalStore rather than useState + useEffect: it reads the media
 * query during render instead of after mount, so there is no first paint at the
 * wrong setting and no cascading re-render. The server snapshot is `false`,
 * which matches the markup the server produces.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );
}

const EASE = [0.16, 1, 0.3, 1] as const;

/** Content rises gently into place. Short enough never to delay reading. */
export const rise: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.7, ease: EASE } },
};

/** Parent that staggers its children. Keep delays tight. */
export function stagger(delayChildren = 0, staggerChildren = 0.07): Variants {
  return {
    hidden: {},
    show: {
      transition: { delayChildren, staggerChildren },
    },
  };
}

/** Shared viewport config: animate once, trigger early so nothing pops in late. */
export const inView = { once: true, margin: "-12% 0px -12% 0px" } as const;
