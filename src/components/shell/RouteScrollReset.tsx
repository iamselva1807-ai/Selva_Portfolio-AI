"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Clicking an internal link always lands at the top of the destination page.
 *
 * Why this exists: Next 16's <Link> *keeps* the scroll position whenever the
 * incoming page is still "visible" at the current offset (link.md, `scroll`
 * prop). On a site of long pages that is nearly always true, so clicking Home
 * from y≈1500 dropped you at y≈1500 on the home page — mid "Selected Work",
 * with the reveals above you still unrevealed (the "blank gap").
 *
 * Why it keys off the click rather than the route change: an earlier version
 * reset on every pathname change and tried to exempt back/forward by listening
 * for `popstate`. Next's router handles popstate first and re-renders before
 * our listener runs, so Back reset to the top as well — losing the reader's
 * place. A history traversal never starts with a click on a link, so reading
 * intent at the click leaves Back/Forward to the browser by construction.
 *
 * Also handled: a link to the page you are already on (Home while on Home)
 * changes no route at all, so it scrolls to the top directly.
 *
 * Left alone: modified clicks (new tab/window), `target="_blank"`, downloads,
 * other origins, and hash links — those keep their native behaviour.
 */
export default function RouteScrollReset() {
  const pathname = usePathname();
  const pendingReset = useRef(false);

  useEffect(() => {
    const onClickCapture = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element | null)?.closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;

      // A chapter link on the page you're on (/#projects from /): let it glide.
      // Smoothing is applied for this jump only — never globally, see globals.css.
      if (url.hash) {
        if (url.pathname === window.location.pathname && !prefersReducedMotion()) {
          const root = document.documentElement;
          root.style.scrollBehavior = "smooth";
          const clear = () => {
            root.style.scrollBehavior = "";
          };
          window.addEventListener("scrollend", clear, { once: true });
          window.setTimeout(clear, 1500); // no scroll happened, or no scrollend support
        }
        return;
      }

      if (url.pathname === window.location.pathname) {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "instant" : "smooth" });
        return;
      }
      pendingReset.current = true;
    };

    const onPopState = () => {
      pendingReset.current = false;
    };

    // Capture phase: runs before React's own handlers, so a link whose onClick
    // calls preventDefault() and navigates later (the hero CTA) still counts.
    document.addEventListener("click", onClickCapture, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClickCapture, true);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  // Layout effect: the jump lands before paint, so the new page never flashes
  // at the old offset.
  useIsoLayoutEffect(() => {
    if (!pendingReset.current) return;
    pendingReset.current = false;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
