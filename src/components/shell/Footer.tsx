import Link from "next/link";
import { navItems, site } from "@/content/site";

export default function Footer() {
  const year = 2026;
  return (
    <footer className="relative mt-32 border-t border-line/70">
      <div className="shell grid gap-10 py-14 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="text-fluid-lg max-w-xs font-medium tracking-[-0.02em] text-ink">
            {site.name}
          </p>
          <p className="mono-meta mt-2">{site.role}</p>
          <p className="mono-meta mt-1 text-ink-3">{site.location}</p>
        </div>

        <nav aria-label="Footer">
          <p className="mono-label mb-3">Navigate</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1.5">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-ink-2 transition-colors hover:text-signal"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="mono-label mb-3">Elsewhere</p>
          <ul className="space-y-1.5">
            <li>
              <a
                href={`mailto:${site.email}`}
                className="text-sm text-ink-2 transition-colors hover:text-signal"
              >
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                className="text-sm text-ink-2 transition-colors hover:text-signal"
              >
                LinkedIn ↗
              </a>
            </li>
            <li>
              <a
                href={site.resumeFile}
                target="_blank"
                rel="noreferrer noopener"
                className="text-sm text-ink-2 transition-colors hover:text-signal"
              >
                Resume (PDF) ↗
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="shell flex flex-col gap-2 border-t border-line/70 py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="mono-meta text-ink-3">
          © {year} {site.name}
        </p>
        <p className="mono-meta text-ink-3">
          Built with Next.js · Designed and engineered from scratch
        </p>
      </div>
    </footer>
  );
}
