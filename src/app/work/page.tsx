import type { Metadata } from "next";
import { Lock } from "lucide-react";
import PageHeader from "@/components/shell/PageHeader";
import ClosingCTA from "@/components/sections/ClosingCTA";
import { FeaturedProject, ProjectCard } from "@/components/projects/ProjectCards";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { projects } from "@/content/projects";
import { buildPageMetadata } from "@/content/metadata";

export const metadata: Metadata = buildPageMetadata({ route: "/work" });

export default function WorkPage() {
  const [featured, ...rest] = projects;
  return (
    <>
      <PageHeader
        index="04"
        label="Projects"
        title="Four systems, built to be relied on."
        lede="Each built for a workflow where a wrong answer has a cost."
      >
        <p className="mono-meta mt-6 flex items-start gap-2 text-ink-3">
          <Lock aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.75} />
          Company-owned work, shown at a conceptual level. Illustrations are original diagrams, not screenshots.
        </p>
      </PageHeader>

      <div className="shell">
        <Reveal>
          <FeaturedProject project={featured} />
        </Reveal>
        <RevealGroup as="div" className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <RevealItem key={p.slug}>
              <ProjectCard project={p} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>

      <ClosingCTA />
    </>
  );
}
