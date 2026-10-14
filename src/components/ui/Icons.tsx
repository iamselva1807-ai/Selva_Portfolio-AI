import {
  siDocker,
  siFastapi,
  siGit,
  siGithub,
  siGoogleanalytics,
  siGoogletagmanager,
  siHuggingface,
  siJira,
  siLangchain,
  siLanggraph,
  siNumpy,
  siOnnx,
  siOpencv,
  siPandas,
  siPython,
  siPytorch,
  siScikitlearn,
  siSelenium,
  siCursor,
  siClaude,
} from "simple-icons";
import { AppWindow, ChartColumn, Cloud, Database, FileSpreadsheet, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

type SimpleIcon = { title: string; path: string };

/**
 * Technology → logo. Only tools that have a genuine logo appear here.
 *
 * Deliberately absent: AWS, Playwright, Power BI and Excel (their trademark
 * holders had them removed from simple-icons), and SQL — the only match is the
 * PostgreSQL elephant, which would misstate the stack. Those get a generic
 * glyph for what the tool is (GENERIC_GLYPHS), never someone else's logo.
 */
const TECH_LOGOS: Record<string, SimpleIcon> = {
  Python: siPython,
  PyTorch: siPytorch,
  OpenCV: siOpencv,
  "Scikit-learn": siScikitlearn,
  "scikit-learn": siScikitlearn,
  Pandas: siPandas,
  NumPy: siNumpy,
  FastAPI: siFastapi,
  Docker: siDocker,
  "ONNX Runtime": siOnnx,
  ONNX: siOnnx,
  "Hugging Face": siHuggingface,
  LangChain: siLangchain,
  LangGraph: siLanggraph,
  Git: siGit,
  GitHub: siGithub,
  Selenium: siSelenium,
  "Google Analytics": siGoogleanalytics,
  "Google Tag Manager": siGoogletagmanager,
  Jira: siJira,
  Cursor: siCursor,
  "Claude Code": siClaude,
};

/** Unbranded tools: a plain glyph for the kind of tool, beside its label. */
const GENERIC_GLYPHS: Record<string, LucideIcon> = {
  SQL: Database,
  AWS: Cloud,
  "Power BI": ChartColumn,
  Excel: FileSpreadsheet,
  Playwright: AppWindow,
};

export function hasTechLogo(name: string): boolean {
  return name in TECH_LOGOS || name in GENERIC_GLYPHS;
}

/** A technology logo, monochrome in the current text colour. */
export function TechLogo({ name, className }: { name: string; className?: string }) {
  const icon = TECH_LOGOS[name];
  const Glyph = GENERIC_GLYPHS[name];
  if (!icon && Glyph) {
    return <Glyph aria-hidden="true" className={cn("size-4 shrink-0", className)} strokeWidth={1.6} />;
  }
  if (!icon) {
    // Neutral glyph: a small open ring, so unbranded tools sit in the same rhythm.
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("size-4 shrink-0", className)}>
        <circle cx="12" cy="12" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.8" opacity="0.7" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("size-4 shrink-0", className)}>
      <path d={icon.path} fill="currentColor" />
    </svg>
  );
}

/**
 * LinkedIn's mark, drawn inline: Lucide dropped its brand icons in v1 and
 * simple-icons removed LinkedIn at the trademark holder's request. LinkedIn's
 * brand guidelines permit the mark when linking to a LinkedIn profile.
 */
export function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("size-4 shrink-0", className)}>
      <path
        fill="currentColor"
        d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"
      />
    </svg>
  );
}
