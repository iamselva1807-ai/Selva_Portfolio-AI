/**
 * Single source of truth for identity, links and navigation.
 * Every fact here is taken verbatim from the resume.
 */

export const site = {
  name: "Selvakumar Manoharan",
  shortName: "Selvakumar",
  initials: "SM",
  role: "AI/ML Engineer · Data Scientist",
  location: "Chennai, India",
  email: "iam.selva1807@gmail.com",
  phone: "+91 9159652515",
  linkedin: "https://www.linkedin.com/in/selvakumar-manoharan-4ab1b8215",
  /** Resume lists no public repository profile, so none is published. */
  github: null as string | null,
  resumeFile: "/Selvakumar_Manoharan_Resume.pdf",
  resumeUpdated: "October 2026",
  url: "https://selvakumar.dev",
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
  { href: "/work", label: "Work", index: "02" },
  { href: "/about", label: "About", index: "03" },
  { href: "/experience", label: "Experience", index: "04" },
  { href: "/research", label: "Notes", index: "05" },
  { href: "/resume", label: "Resume", index: "06" },
  { href: "/contact", label: "Contact", index: "07" },
];

/** Links rendered in the hero and contact page. Nulls are filtered out. */
export const socialLinks = [
  { label: "Email", href: `mailto:${site.email}`, value: site.email },
  { label: "LinkedIn", href: site.linkedin, value: "in/selvakumar-manoharan" },
  { label: "Resume", href: "/resume", value: "PDF · View & download" },
] as const;
