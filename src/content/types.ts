/** Shared content types. Content lives in data modules, never inside JSX. */

export type Paragraphs = string[];

export type PipelineStep = { label: string; detail: string };
export type Contribution = { title: string; detail: string };
export type ArchLayer = { name: string; nodes: string[] };
export type TechGroup = { group: string; items: string[] };
export type Outcome = { value: string; label: string; note: string };

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  ownership: "Company Project" | "Personal Project";
  ownershipNote: string;
  category: string;
  period: string;
  role: string;
  tagline: string;
  cardSummary: string;
  focus: string[];
  challenge: { heading: string; body: Paragraphs };
  approach: { heading: string; body: Paragraphs; pipeline: PipelineStep[] };
  contribution: Contribution[];
  architecture: { caption: string; layers: ArchLayer[] };
  technologies: TechGroup[];
  outcomes: Outcome[];
  learnings: string[];
  confidentiality: string;
};

export type MissionPanel = { label: string; entries: string[] };
export type Stat = { value: string; label: string };
export type AboutSection = { heading: string; body: Paragraphs };

export type Identity = {
  heroHeadline: string;
  heroSubline: string;
  heroIntro: string;
  availability: string;
  missionControl: MissionPanel[];
  stats: Stat[];
  aboutIntro: string;
  about: AboutSection[];
  contactHeadline: string;
  contactBody: string;
};

export type ConstellationNode = { name: string; detail: string };

export type Role = {
  company: string;
  /** The employment title exactly as it appears on the resume. */
  title: string;
  /** Optional clarifier where the title and the actual scope of work differ. */
  titleNote?: string;
  period: string;
  start?: string;
  end?: string;
  location: string;
  current: boolean;
  summary: string;
  highlights: string[];
  capabilities: string[];
  constellation?: ConstellationNode[];
};

export type Education = {
  institution: string;
  qualification: string;
  period: string;
  location: string;
};

export type Certification = { name: string; issuer: string; period: string };

export type SkillGroup = { name: string; description: string; skills: string[] };

export type LabNote = {
  index: string;
  category: string;
  title: string;
  question: string;
  approach: string;
  learning: string;
  status: string;
  companyWork: boolean;
  tags: string[];
};

export type PageMeta = { route: string; title: string; description: string };

export type Seo = {
  siteTitle: string;
  siteDescription: string;
  ogTitle: string;
  ogDescription: string;
  keywords: string[];
  pages: PageMeta[];
};
