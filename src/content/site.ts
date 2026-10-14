/**
 * Single source of truth for identity, links and navigation.
 * Every fact here is taken verbatim from the resume.
 */

/**
 * Absolute origin used for canonical URLs, the sitemap, robots.txt and the
 * Open Graph image.
 *
 * Resolved at build time, server-side only, in priority order:
 *  1. NEXT_PUBLIC_SITE_URL   — set this to pin a custom domain.
 *  2. VERCEL_PROJECT_PRODUCTION_URL — Vercel's stable production host. This
 *     automatically becomes the custom domain once one is attached, so the
 *     canonical and OG tags follow the domain without a code change.
 *  3. A hard-coded production constant, so a missing env var can never put a
 *     wrong origin into a production build. `next dev` uses localhost.
 *
 * Getting this wrong is not cosmetic: a canonical pointing at a domain you do
 * not control tells search engines the content belongs to someone else, and an
 * OG image on a dead host means every shared link previews blank.
 */
const PRODUCTION_URL = "https://ai-selvaportfolio.vercel.app";

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  // Stable production host. Becomes the custom domain automatically once one
  // is attached to the Vercel project.
  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelHost) return `https://${vercelHost}`;

  if (process.env.NODE_ENV === "development") return "http://localhost:3000";

  // Deterministic fallback, so a missing env var can never resurrect a
  // placeholder domain in a production build.
  return PRODUCTION_URL;
}

export const site = {
  name: "Selvakumar Manoharan",
  shortName: "Selvakumar",
  initials: "SM",
  role: "AI/ML Engineer · Data Scientist",
  location: "Chennai, India",
  email: "iam.selva1807@gmail.com",
  // NOTE: deliberately no phone number here. This module is imported by client
  // components, so every field ends up in the public JS bundle whether or not it
  // is rendered. The number stays in the resume PDF, which people choose to open.
  linkedin: "https://www.linkedin.com/in/selvakumar-manoharan-4ab1b8215",
  /** Deliberately omitted from the site at the owner's request. */
  github: null as string | null,
  /**
   * Naukri profile. Left null on purpose: the URL supplied
   * (naukri.com/mnjuser/profile?id=&altresid) is Naukri's signed-in
   * "my profile" page — logged-out visitors are redirected to /nlogin/login and
   * a signed-in recruiter sees their own profile, never this one. Put a
   * shareable profile URL here and it appears on /contact and in the footer.
   */
  naukri: null as string | null,
  resumeFile: "/Selvakumar_Manoharan_resume.pdf",
  resumeUpdated: "October 2026",
  url: resolveSiteUrl(),
  portraitAlt:
    "Portrait of Selvakumar Manoharan, AI/ML Engineer and Data Scientist",
} as const;

export type NavItem = {
  href: string;
  label: string;
  /** Short form used by the mobile drawer and skip links. */
  index: string;
};

export const navItems: NavItem[] = [
  { href: "/", label: "Home", index: "01" },
  { href: "/about", label: "About", index: "02" },
  { href: "/experience", label: "Experience", index: "03" },
  { href: "/work", label: "Projects", index: "04" },
  { href: "/research", label: "Research & Engineering", index: "05" },
  { href: "/contact", label: "Contact", index: "06" },
];

/** Links rendered in the hero and contact page. Nulls are filtered out. */
export type ContactChannel = {
  id: "email" | "linkedin" | "naukri";
  label: string;
  href: string;
  value: string;
  external: boolean;
};

/**
 * Every contact channel the site renders. Channels whose URL is not configured
 * are filtered out here, so no page can ever show a link that goes nowhere.
 */
export const contactChannels: ContactChannel[] = (
  [
    { id: "email", label: "Email", href: `mailto:${site.email}`, value: site.email, external: false },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: site.linkedin,
      value: "selvakumar-manoharan-4ab1b8215",
      external: true,
    },
    site.naukri
      ? { id: "naukri", label: "Naukri Profile", href: site.naukri, value: "View profile on Naukri", external: true }
      : null,
  ] as Array<ContactChannel | null>
).filter((c): c is ContactChannel => c !== null);
