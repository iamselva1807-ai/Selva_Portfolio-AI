"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import Constellation from "@/components/visual/Constellation";
import Portrait from "@/components/visual/Portrait";
import { CTA, ArrowGlyph } from "@/components/ui/Button";
import { identity } from "@/content/identity";
import { site } from "@/content/site";
import { useReducedMotion } from "@/lib/motion";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [activated, setActivated] = useState(false);
  const timer = useRef<number | null>(null);

  // Cancel the hand-off if the visitor leaves before it fires.
  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  /**
   * The signature moment: the constellation illuminates, then hands off to
   * Work. Capped well under a second, and skipped entirely for reduced motion
   * so navigation is never delayed.
   */
  const explore = useCallback(
    (e: React.MouseEvent) => {
      if (reduced) return; // navigate immediately
      // Never swallow a modifier- or middle-click: those mean "open elsewhere".
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (e.button !== 0) return;
      if (timer.current !== null) return; // already activated — ignore re-clicks
      e.preventDefault();
      setActivated(true);
      timer.current = window.setTimeout(() => router.push("/work"), 620);
    },
    [reduced, router],
  );

  return (
    <section className="relative flex min-h-[calc(100svh-2rem)] items-center pt-20 pb-14 sm:pt-32 sm:pb-16">
      <div className="shell grid w-full items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        {/* ---------- Copy ---------- */}
        <div className="relative z-10 max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mono-meta flex items-center gap-2.5 text-ink-3"
          >
            <span className="relative flex size-1.5">
              <span className="animate-node absolute inline-flex size-full rounded-full bg-signal" />
              <span className="relative inline-flex size-1.5 rounded-full bg-signal" />
            </span>
            {identity.availability}
          </motion.p>

          {/* The name is the h1: a recruiter should never have to hunt for
              whose portfolio this is. The positioning line sits under it. */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: EASE, delay: 0.06 }}
            className="mt-5 text-[length:var(--text-display-lg)] leading-[0.92] font-semibold tracking-[-0.045em] sm:mt-6"
          >
            <span className="ink-gradient block">Selvakumar</span>
            <span className="ink-gradient block">Manoharan</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.12 }}
            className="mt-5 max-w-lg text-[length:var(--text-display-sm)] leading-[1.12] font-medium tracking-[-0.03em] text-balance text-ink-2"
          >
            {identity.heroHeadline}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.18 }}
            className="mono-meta mt-4 text-signal/85 sm:mt-5"
          >
            {identity.heroSubline}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
            className="mt-5 max-w-xl text-[length:var(--text-fluid-base)] leading-[1.55] text-ink-2 sm:mt-6 sm:leading-relaxed"
          >
            {identity.heroIntro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.28 }}
            className="mt-7 flex flex-wrap items-center gap-3 sm:mt-9"
          >
            <CTA href="/work" onClick={explore} variant="primary">
              Explore My Work
              <ArrowGlyph />
            </CTA>
            <CTA href="/resume" variant="secondary">
              View Resume
            </CTA>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.38 }}
            className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 sm:mt-8"
          >
            <a
              href={`mailto:${site.email}`}
              className="mono-meta transition-colors hover:text-signal"
            >
              {site.email}
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="mono-meta transition-colors hover:text-signal"
            >
              LinkedIn ↗
            </a>
          </motion.div>
        </div>

        {/* ---------- Constellation + portrait ---------- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: EASE, delay: 0.2 }}
          className="relative mx-auto aspect-square w-full max-w-[22rem] sm:max-w-[26rem] lg:max-w-none"
        >
          <Constellation
            activated={activated}
            portraitCore
            className="absolute inset-0 h-full w-full"
          />
          <div className="absolute top-1/2 left-1/2 w-[26%] -translate-x-1/2 -translate-y-1/2">
            <div className="aspect-square">
              <Portrait
                priority
                sizes="(max-width: 1024px) 28vw, 180px"
                className="h-full w-full"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll affordance */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="pointer-events-none absolute inset-x-0 bottom-5 hidden justify-center sm:flex"
      >
        <span className="mono-label flex items-center gap-2 text-ink-3">
          Scroll
          <span aria-hidden="true" className="h-6 w-px bg-gradient-to-b from-line-bright to-transparent" />
        </span>
      </motion.div>
    </section>
  );
}
