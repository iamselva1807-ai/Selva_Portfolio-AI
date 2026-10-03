import type { Metadata } from "next";
import PageHeader from "@/components/shell/PageHeader";
import ProjectRow from "@/components/sections/ProjectRow";
import ClosingCTA from "@/components/sections/ClosingCTA";
import { Reveal } from "@/components/ui/Reveal";
import { projects } from "@/content/projects";
import { pageMeta } from "@/content/seo";

const meta = pageMeta("/work");

export const metadata: Metadata = {
  title: meta?.title ?? "Work",
  description: meta?.description,
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <>
      <PageHeader
        index="02"
        label="Selected Work"
        title="Four systems, built to be relied on."
        lede="Each of these shipped into a production workflow where a wrong answer has a cost. They are presented at a high level — the underlying systems and source code are company-owned."
      />

      <div className="shell space-y-5">
        {projects.map((project, i) => (
          <Reveal key={project.slug} delay={Math.min(i, 3) * 0.05}>
            <ProjectRow project={project} index={i} titleAs="h2" />
          </Reveal>
        ))}
      </div>

      <ClosingCTA />
    </>
  );
}
