"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FileText, Menu, X, ArrowUpRight } from "lucide-react";
import { contactChannels, navItems, site } from "@/content/site";
import OrbitMark from "@/components/visual/OrbitMark";
import { cn } from "@/lib/cn";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

/**
 * The site's one Resume action. It lives in the header at every breakpoint —
 * labelled on desktop, icon-only beside the menu button on phones — and opens
 * the PDF in a new tab, said so to screen readers.
 */
function ResumeAction({ compact = false }: { compact?: boolean }) {
  return (
    <a
      href={site.resumeFile}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={compact ? "Resume (PDF, opens in a new tab)" : undefined}
      className={cn(
        "group inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-line-2 bg-surface-2/60 text-[0.8125rem] font-medium text-ink backdrop-blur-sm",
        "transition-[color,border-color,background-color] duration-300 hover:border-signal/45 hover:bg-surface-3/70 hover:text-signal-pale",
        compact ? "w-11" : "px-4",
      )}
    >
      <FileText aria-hidden="true" className="size-4 text-signal transition-transform duration-300 group-hover:-translate-y-px" strokeWidth={1.75} />
      {!compact && (
        <>
          Resume
          <span className="sr-only"> (PDF, opens in a new tab)</span>
        </>
      )}
    </a>
  );
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

  // Close the drawer on navigation — adjusted during render, so the drawer
  // never paints open for a frame on the new route.
  const [drawerRoute, setDrawerRoute] = useState(pathname);
  if (drawerRoute !== pathname) {
    setDrawerRoute(pathname);
    if (open) setOpen(false);
  }

  // While open: lock the page, move focus in, keep Tab cycling between the
  // trigger and the drawer's links, close on Escape, restore focus on close.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const trigger = triggerRef.current;
    const focusables = () => {
      const nodes = panel?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? [];
      return [trigger, ...Array.from(nodes)].filter(Boolean) as HTMLElement[];
    };
    focusables()[1]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const i = items.indexOf(document.activeElement as HTMLElement);
      const next = e.shiftKey ? items[(i <= 0 ? items.length : i) - 1] : items[(i + 1) % items.length];
      e.preventDefault();
      next.focus();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Widening past the desktop breakpoint hides the drawer; release the lock
    // so the page can't be left frozen with no visible way out.
    const mq = window.matchMedia("(min-width: 1024px)");
    const onMq = (ev: MediaQueryListEvent) => ev.matches && setOpen(false);
    mq.addEventListener("change", onMq);

    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
      document.body.style.overflow = prev;
      if (panel?.contains(document.activeElement)) trigger?.focus();
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
          "fixed inset-x-0 top-0 z-50 transition-[padding] duration-500 ease-[var(--ease-out-expo)]",
          scrolled ? "py-2.5" : "py-4",
        )}
      >
        {/* Soft scrim: headings passing underneath stay legible without the
            floating nav turning into a solid bar. */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-0 -top-8 h-[calc(100%+4.5rem)] transition-opacity duration-500",
            "bg-gradient-to-b from-void via-void/92 to-transparent backdrop-blur-[7px]",
            "[mask-image:linear-gradient(to_bottom,black_0%,black_62%,transparent_100%)]",
            scrolled ? "opacity-100" : "opacity-0",
          )}
        />
        <nav aria-label="Primary" className="relative shell-wide flex items-center justify-between gap-3">
          <Link href="/" className="group flex min-w-0 items-center gap-2.5 rounded-full py-1 pr-2" aria-label={`${site.name} — home`}>
            <OrbitMark />
            <span className="truncate text-[1.0625rem] font-semibold tracking-[-0.025em] text-ink sm:text-[1.1875rem]">
              Selvakumar
              <span className="hidden text-ink-3 sm:inline lg:hidden xl:inline"> Manoharan</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div
            className={cn(
              "hidden items-center gap-0.5 rounded-full border p-1 transition-[background-color,border-color] duration-500 lg:flex",
              scrolled ? "border-line bg-surface/70 backdrop-blur-xl" : "border-transparent bg-transparent",
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
                    "relative whitespace-nowrap rounded-full px-3 py-1.5 text-[0.8125rem] font-medium transition-colors duration-300 xl:px-3.5",
                    active ? "text-void" : "text-ink-2 hover:text-ink",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-signal shadow-[0_0_18px_-6px_var(--color-signal)]"
                      transition={{ type: "spring", stiffness: 420, damping: 36 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden lg:block">
              <ResumeAction />
            </span>
            <span className="lg:hidden">
              <ResumeAction compact />
            </span>

            <button
              ref={triggerRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls={open ? "mobile-nav" : undefined}
              className="flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface/70 px-4 text-[0.8125rem] font-medium text-ink backdrop-blur-xl transition-colors hover:border-line-bright lg:hidden"
            >
              {open ? <X aria-hidden="true" className="size-4" strokeWidth={1.75} /> : <Menu aria-hidden="true" className="size-4" strokeWidth={1.75} />}
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </nav>
      </header>

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
            <div aria-hidden="true" className="absolute inset-0 bg-void/94 backdrop-blur-xl" onClick={() => setOpen(false)} />
            <motion.div
              ref={panelRef}
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex h-full flex-col overflow-y-auto overscroll-contain px-[var(--shell-pad)] pt-24 pb-10"
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
                            "flex items-baseline gap-4 border-b border-line/70 py-3.5 text-[1.375rem] font-medium tracking-[-0.03em] transition-colors",
                            active ? "text-signal" : "text-ink hover:text-signal-pale",
                          )}
                        >
                          <span className="mono-label w-6 shrink-0 tabular-nums">{item.index}</span>
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <ul className="mt-8 flex flex-col gap-3">
                  {contactChannels.map((c) => (
                    <li key={c.id}>
                      <a
                        href={c.href}
                        {...(c.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                        className="mono-meta inline-flex items-center gap-1.5 text-ink-2 transition-colors hover:text-signal"
                      >
                        {c.id === "email" ? c.value : c.label}
                        {c.external && <ArrowUpRight aria-hidden="true" className="size-3.5" />}
                        {c.external && <span className="sr-only"> (opens in a new tab)</span>}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
