"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown, Mail } from "lucide-react";
import { CTA, ArrowGlyph } from "@/components/ui/Button";
import { identity } from "@/content/identity";
import { site } from "@/content/site";

// The ray-traced black hole is client-only (WebGL) and kept off the critical
// path: the hero text renders and becomes interactive first, then the canvas
// fades in over it.
const BlackHole = dynamic(() => import("@/components/visual/blackhole/BlackHole"), {
  ssr: false,
});

const EASE = [0.16, 1, 0.3, 1] as const;

/** Positioning line revealed word by word, each word rising out of a mask. */
function RevealHeadline({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <p className="mt-6 max-w-xl text-[length:var(--text-display-sm)] leading-[1.1] font-medium tracking-[-0.03em] text-balance text-ink-2">
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            data-reveal=""
            className="inline-block"
            initial={{ y: "105%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.25 + i * 0.045 }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </p>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  // Progress through the hero = page scroll ÷ hero height. Deliberately not
  // useScroll({ target }): Motion maps that to a native ViewTimeline whose
  // default inset includes the root scroll-padding-top, which put progress at
  // ~0.1 before any scrolling — the copy rendered at 86% and the scroll cue at
  // 35%, varying from one load to the next.
  const { scrollY } = useScroll();
  const [heroHeight, setHeroHeight] = useState(1);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setHeroHeight(el.offsetHeight || 1));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const scrollYProgress = useTransform(scrollY, (y) => Math.min(1, Math.max(0, y / heroHeight)));

  // As the hero scrolls away the black hole drifts up, grows and dims, while
  // the copy lifts and fades a little faster — depth without hijacking scroll.
  const holeY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const holeScale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const holeOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.15]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <section
      ref={ref}
      id="introduction"
      data-chapter="Introduction"
      aria-labelledby="hero-name"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-24 pb-24 sm:pt-28"
    >
      {/* Black hole: right-of-centre on desktop, a backdrop above the name on
          phones. aria-hidden on the wrapper is NOT set — the canvas names
          itself for screen readers. */}
      <motion.div
        style={{ y: holeY, scale: holeScale, opacity: holeOpacity }}
        className="pointer-events-none absolute -z-10 aspect-[16/10] w-[150vw] max-w-none top-[-2%] left-1/2 -translate-x-[38%] sm:w-[120vw] lg:top-1/2 lg:left-auto lg:right-[-14vw] lg:w-[70vw] lg:-translate-x-0 lg:-translate-y-1/2"
      >
        <BlackHole />
      </motion.div>

      {/* Readability scrims: text always sits on near-black. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,var(--color-void)_0%,color-mix(in_oklab,var(--color-void)_78%,transparent)_34%,transparent_62%)] max-lg:hidden" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,transparent_0%,color-mix(in_oklab,var(--color-void)_72%,transparent)_20%,var(--color-void)_32%)] lg:hidden" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-void" />

      <motion.div style={{ y: copyY, opacity: copyOpacity }} className="shell relative w-full">
        <div className="max-w-2xl pt-[40vw] sm:pt-[28vw] lg:pt-0">
          <motion.p
            data-reveal=""
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mono-meta flex items-center gap-2.5 text-ink-3"
          >
            <span className="relative flex size-1.5 shrink-0">
              <span className="animate-node absolute inline-flex size-full rounded-full bg-signal" />
              <span className="relative inline-flex size-1.5 rounded-full bg-signal" />
            </span>
            {identity.availability}
          </motion.p>

          <motion.h1
            id="hero-name"
            data-reveal=""
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.05 }}
            className="mt-6 text-[length:var(--text-display-lg)] leading-[0.92] font-semibold tracking-[-0.045em]"
          >
            <span className="ink-gradient block">Selvakumar</span>
            <span className="ink-gradient block">Manoharan</span>
          </motion.h1>

          <RevealHeadline text={identity.heroHeadline} />

          <motion.p
            data-reveal=""
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.55 }}
            className="mono-meta mt-6 text-signal/85"
          >
            {identity.heroSubline}
          </motion.p>

          <motion.p
            data-reveal=""
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.62 }}
            className="mt-5 max-w-xl text-[length:var(--text-fluid-base)] leading-[1.6] text-ink-2"
          >
            {identity.heroIntro}
          </motion.p>

          <motion.div
            data-reveal=""
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.7 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <CTA href="/#projects" variant="primary">
              Explore projects
              <ArrowGlyph />
            </CTA>
            <CTA href={`mailto:${site.email}`} variant="secondary">
              <Mail aria-hidden="true" className="size-4" strokeWidth={1.75} />
              Get in touch
            </CTA>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue — a real link to the next chapter, so it works from the keyboard. */}
      <motion.div style={{ opacity: cueOpacity }} className="absolute inset-x-0 bottom-6 hidden justify-center sm:flex">
        <Link
          href="/#philosophy"
          className="group flex flex-col items-center gap-2 rounded-full px-3 py-2 text-ink-3 transition-colors hover:text-signal-pale"
        >
          <span className="mono-label">Scroll to explore</span>
          <span className="relative block h-9 w-px overflow-hidden bg-line-2" aria-hidden="true">
            <span className="animate-scroll-cue absolute inset-x-0 top-0 h-3 bg-signal" />
          </span>
          <ArrowDown aria-hidden="true" className="sr-only" />
        </Link>
      </motion.div>
    </section>
  );
}
