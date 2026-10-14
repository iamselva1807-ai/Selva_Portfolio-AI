"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { inView, rise, fade, stagger, useReducedMotion } from "@/lib/motion";

// Reduced motion: MotionConfig's "user" mode drops the movement but keeps the
// fade and the stagger delays, so a long group could sit invisible for over a
// second. These land in the final state on the frame the content enters view.
const instant: Variants = {
  hidden: { opacity: 0, y: 0 },
  show: { opacity: 1, y: 0, transition: { duration: 0 } },
};
const instantGroup: Variants = { hidden: {}, show: { transition: { delayChildren: 0, staggerChildren: 0 } } };

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "ul" | "ol" | "article" | "header";
  variant?: "rise" | "fade";
};

/**
 * Scroll reveal. Deliberately short and subtle — content must never be
 * unreadable while it animates, and reduced-motion users get it instantly.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
  variant = "rise",
}: Props) {
  const Tag = motion[as];
  const reduced = useReducedMotion();
  return (
    <Tag
      data-reveal=""
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      variants={reduced ? instant : variant === "rise" ? rise : fade}
      transition={{ delay: reduced ? 0 : delay }}
    >
      {children}
    </Tag>
  );
}

/** Reveals children one after another with a tight stagger. */
export function RevealGroup({
  children,
  className,
  delay = 0,
  step = 0.07,
  as = "div",
}: Omit<Props, "variant"> & { step?: number }) {
  const Tag = motion[as];
  const reduced = useReducedMotion();
  return (
    <Tag
      data-reveal=""
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      variants={reduced ? instantGroup : stagger(delay, step)}
    >
      {children}
    </Tag>
  );
}

/** A single item inside a RevealGroup. */
export function RevealItem({
  children,
  className,
  as = "div",
}: Omit<Props, "delay" | "variant">) {
  const Tag = motion[as];
  const reduced = useReducedMotion();
  return (
    <Tag data-reveal="" className={className} variants={reduced ? instant : rise}>
      {children}
    </Tag>
  );
}
