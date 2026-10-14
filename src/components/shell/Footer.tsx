import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { contactChannels, navItems, site } from "@/content/site";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-16 border-t border-line/70">
      <div className="shell grid gap-10 py-14 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="text-[length:var(--text-fluid-lg)] max-w-xs font-medium tracking-[-0.02em] text-ink">{site.name}</p>
          <p className="mono-meta mt-2">{site.role}</p>
          <p className="mono-meta mt-1">{site.location}</p>
        </div>

        <nav aria-label="Footer">
          <p className="mono-label mb-3">Navigate</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex min-h-9 items-center text-sm text-ink-2 transition-colors hover:text-signal">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="mono-label mb-3">Elsewhere</p>
          <ul className="space-y-1">
            {contactChannels.map((c) => (
              <li key={c.id}>
                <a
                  href={c.href}
                  {...(c.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                  className="inline-flex min-h-9 items-center gap-1 text-sm break-all text-ink-2 transition-colors hover:text-signal"
                >
                  {c.id === "email" ? c.value : c.label}
                  {c.external && <ArrowUpRight aria-hidden="true" className="size-3.5" />}
                  {c.external && <span className="sr-only"> (opens in a new tab)</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="shell flex flex-col gap-2 border-t border-line/70 py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="mono-meta">
          © {year} {site.name}
        </p>
        <p className="mono-meta">Black hole ray-traced in WebGL · Built with Next.js</p>
      </div>
    </footer>
  );
}
