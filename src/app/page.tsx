import Hero from "@/components/sections/Hero";
import Snapshot from "@/components/sections/Snapshot";
import ChapterRail, { type Chapter } from "@/components/story/ChapterRail";
import PhilosophyChapter from "@/components/story/PhilosophyChapter";
import CapabilitiesBand from "@/components/story/CapabilitiesBand";
import ProjectsShowcase from "@/components/story/ProjectsShowcase";
import PipelineChapter from "@/components/story/PipelineChapter";
import ResearchPreview from "@/components/story/ResearchPreview";
import ContactChapter from "@/components/story/ContactChapter";
import { buildPageMetadata } from "@/content/metadata";

export const metadata = buildPageMetadata({ route: "/" });

/** Must match the `id`s on the chapter sections below, in order. */
const CHAPTERS: Chapter[] = [
  { id: "introduction", label: "Introduction" },
  { id: "philosophy", label: "How I work" },
  { id: "capabilities", label: "Capabilities" },
  { id: "projects", label: "Projects" },
  { id: "architecture", label: "How it's built" },
  { id: "research", label: "Research" },
  { id: "contact", label: "Contact" },
];

/**
 * The home page is the story: who → how → with what → what was built → how it
 * works → what's being explored → how to reach me. Each chapter previews and
 * links onward; the detail lives on its own page, stated once.
 */
export default function Home() {
  return (
    <>
      <ChapterRail chapters={CHAPTERS} />
      <Hero />
      <Snapshot />
      <PhilosophyChapter />
      <CapabilitiesBand />
      <ProjectsShowcase />
      <PipelineChapter />
      <ResearchPreview />
      <ContactChapter />
    </>
  );
}
