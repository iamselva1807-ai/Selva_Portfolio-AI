"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { inView, rise, fade, stagger } from "@/lib/motion";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article" | "header";
  variant?: "rise" | "fade";
};

/**
 * Scroll reveal. Deliberately short and subtle — content must never be
 * unreadable while it animates, and reduced-motion users get it instantly
 * via the global motion reset in globals.css.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
  variant = "rise",
}: Props) {
  const Tag = motion[as];
  return (
    <Tag
      data-reveal=""
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      variants={variant === "rise" ? rise : fade}
      transition={{ delay }}
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
  return (
    <Tag
      data-reveal=""
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      variants={stagger(delay, step)}
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
  return (
    <Tag data-reveal="" className={className} variants={rise}>
      {children}
    </Tag>
  );
}
