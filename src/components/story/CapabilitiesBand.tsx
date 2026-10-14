import { TechLogo } from "@/components/ui/Icons";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import ChapterHeading from "./ChapterHeading";

/**
 * The tools behind the work — every one taken from the resume. Logos where a
 * genuine one exists; SQL and AWS carry a neutral glyph rather than a wrong
 * logo. The full grouped list lives on /experience; this is the glance.
 */
const TOOLS = [
  "Python",
  "PyTorch",
  "OpenCV",
  "Scikit-learn",
  "ONNX Runtime",
  "FastAPI",
  "Docker",
  "Hugging Face",
  "LangChain",
  "LangGraph",
  "Pandas",
  "NumPy",
  "SQL",
  "AWS",
];

export default function CapabilitiesBand() {
  return (
    <section id="capabilities" data-chapter="Capabilities" aria-labelledby="capabilities-title" className="shell py-24 sm:py-32">
      <ChapterHeading
        index="02"
        label="Capabilities"
        id="capabilities-title"
        title="The tools behind the systems."
        link={{ href: "/experience#capabilities", label: "Full capabilities" }}
      />
      <RevealGroup as="ul" className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4 lg:grid-cols-7">
        {/* 14 tools fill 2 and 7 columns exactly; in the 4-column tablet grid the
            last two tiles widen so the final row has no empty cells. */}
        {TOOLS.map((tool) => (
          <RevealItem as="li" key={tool} className="sm:max-lg:last:col-span-2 sm:max-lg:nth-last-2:col-span-2">
            <div className="group flex h-full items-center gap-3 bg-surface/90 px-4 py-5 transition-colors duration-500 hover:bg-surface-2/90 sm:flex-col sm:items-start sm:gap-4 sm:px-5 sm:py-6">
              <TechLogo name={tool} className="size-6 text-ink-3 transition-colors duration-500 group-hover:text-signal" />
              <span className="text-sm font-medium text-ink-2 transition-colors duration-500 group-hover:text-ink">{tool}</span>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
