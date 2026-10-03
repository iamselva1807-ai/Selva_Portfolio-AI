"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { navItems, site } from "@/content/site";
import OrbitMark from "@/components/visual/OrbitMark";
import { cn } from "@/lib/cn";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer on navigation. Adjusted during render rather than in an
  // effect, so the drawer never paints open for a frame on the new route.
  const [drawerRoute, setDrawerRoute] = useState(pathname);
  if (drawerRoute !== pathname) {
    setDrawerRoute(pathname);
    if (open) setOpen(false);
  }

  // While the drawer is open: lock the page, move focus into it, keep Tab
  // cycling between the trigger and the drawer's own links, and close on Escape.
  useEffect(() => {
    if (!open) return;

    // Capture the nodes now: the panel unmounts on close, so reading the refs
    // in the cleanup would miss the focus restore.
    const panel = panelRef.current;
    const trigger = triggerRef.current;

    const focusables = () => {
      const nodes =
        panel?.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled])",
        ) ?? [];
      return [trigger, ...Array.from(nodes)].filter(Boolean) as HTMLElement[];
    };

    focusables()[1]?.focus(); // first link inside the drawer

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const i = items.indexOf(document.activeElement as HTMLElement);
      const next = e.shiftKey
        ? items[(i <= 0 ? items.length : i) - 1]
        : items[(i + 1) % items.length];
      e.preventDefault();
      next.focus();
    };

    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      // Restore focus only if it is still inside the drawer. On a route-change
      // close, focus belongs to the new page rather than back on the trigger.
      if (panel?.contains(document.activeElement)) {
        trigger?.focus();
      }
    };
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="sr-only-focusable fixed top-3 left-3 z-[70] rounded-full bg-signal px-4 py-2 text-sm font-medium text-void"
      >
        Skip to content
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[var(--ease-out-expo)]",
          scrolled ? "py-2.5" : "py-4",
        )}
      >
        {/* Soft scrim so display headings passing underneath stay legible
            without turning the floating nav into a solid bar. */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-0 -top-8 h-[calc(100%+4.5rem)] transition-opacity duration-500",
            "bg-gradient-to-b from-void via-void/92 to-transparent backdrop-blur-[7px]",
            "[mask-image:linear-gradient(to_bottom,black_0%,black_62%,transparent_100%)]",
            scrolled ? "opacity-100" : "opacity-0",
          )}
        />
        <nav
          aria-label="Primary"
          className="relative shell-wide flex items-center justify-between gap-4"
        >
          {/* Wordmark */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 rounded-full py-1 pr-3"
            aria-label={`${site.name} — home`}
          >
            <OrbitMark />
            <span className="text-[1.0625rem] font-semibold tracking-[-0.025em] text-ink sm:text-[1.1875rem]">
              Selvakumar
              <span className="hidden text-ink-3 sm:inline"> Manoharan</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div
            className={cn(
              "hidden items-center gap-0.5 rounded-full border p-1 transition-all duration-500 lg:flex",
              scrolled
                ? "border-line bg-surface/70 backdrop-blur-xl"
                : "border-transparent bg-transparent",
            )}
          >
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-3.5 py-1.5 text-[0.8125rem] font-medium transition-colors duration-300",
                    active ? "text-void" : "text-ink-2 hover:text-ink",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-signal"
                      transition={{ type: "spring", stiffness: 420, damping: 36 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <a
            href={site.resumeFile}
            className="hidden rounded-full border border-line-2 bg-surface-2/60 px-4 py-2 text-[0.8125rem] font-medium text-ink backdrop-blur-sm transition-colors duration-300 hover:border-signal/40 hover:text-signal-pale lg:block"
            target="_blank"
            rel="noreferrer noopener"
          >
            Resume
          </a>

          {/* Mobile trigger */}
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface/70 px-4 py-2 text-[0.8125rem] font-medium text-ink backdrop-blur-xl lg:hidden"
          >
            <span className="relative grid h-3 w-4 place-items-center">
              <span
                aria-hidden="true"
                className={cn(
                  "absolute h-px w-4 bg-current transition-transform duration-300 ease-[var(--ease-out-expo)]",
                  open ? "rotate-45" : "-translate-y-1",
                )}
              />
              <span
                aria-hidden="true"
                className={cn(
                  "absolute h-px w-4 bg-current transition-transform duration-300 ease-[var(--ease-out-expo)]",
                  open ? "-rotate-45" : "translate-y-1",
                )}
              />
            </span>
            {open ? "Close" : "Menu"}
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 lg:hidden"
            role="dialog"
            aria-label="Site menu"
          >
            <div
              className="absolute inset-0 bg-void/92 backdrop-blur-xl"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              ref={panelRef}
              className="relative flex h-full flex-col overflow-y-auto overscroll-contain px-[var(--shell-pad)] pt-20 pb-10"
            >
              <div className="m-auto w-full">
              <ul className="space-y-1">
                {navItems.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-baseline gap-4 border-b border-line/70 py-3.5 text-2xl font-medium tracking-[-0.03em] transition-colors",
                          active ? "text-signal" : "text-ink",
                        )}
                      >
                        <span className="mono-label w-6 shrink-0 tabular-nums">
                          {item.index}
                        </span>
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-8 flex flex-col gap-2">
                <a
                  href={`mailto:${site.email}`}
                  className="mono-meta text-ink-2 hover:text-signal"
                >
                  {site.email}
                </a>
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mono-meta text-ink-2 hover:text-signal"
                >
                  LinkedIn ↗
                </a>
              </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
