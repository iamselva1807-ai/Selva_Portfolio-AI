import FaceVerificationBanner from "./FaceVerificationBanner";
import DocumentBanner from "./DocumentBanner";
import BehavioralBanner from "./BehavioralBanner";
import LLMExtractionBanner from "./LLMExtractionBanner";

/** The original illustration for each case study, by slug. */
const BANNERS: Record<string, (props: { className?: string }) => React.ReactElement> = {
  "face-verification": FaceVerificationBanner,
  "document-intelligence": DocumentBanner,
  "behavioral-fingerprinting": BehavioralBanner,
  "llm-data-extraction": LLMExtractionBanner,
};

export default function ProjectBanner({ slug, className }: { slug: string; className?: string }) {
  const Banner = BANNERS[slug];
  return Banner ? <Banner className={className} /> : null;
}
