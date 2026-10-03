import type { LabNote } from "./types";

export const researchIntro = "Short notes on questions I worked through — some out of production systems under real constraints, some out of plain curiosity. Each says what was asked, what was tried, and what held up.";

export const labNotes: LabNote[] = [
  {
    "index": "01",
    "category": "Model Evaluation",
    "title": "Judging a Model You Did Not Train",
    "question": "When several pretrained models look comparable on paper, which one deserves a production path?",
    "approach": "Ran the candidates under identical evaluation conditions rather than trusting published claims, then read the misclassifications one by one instead of only the headline metric.",
    "learning": "A better offline score is not a better production model. Consistency across capture conditions mattered more than leaderboard position, and the individual failures said more than the aggregate.",
    "status": "Applied in production",
    "companyWork": true,
    "tags": [
      "Model Evaluation",
      "Benchmarking",
      "Embeddings",
      "PyTorch"
    ]
  },
  {
    "index": "02",
    "category": "Deployment",
    "title": "One Inference Path",
    "question": "What changes when a model goes from a script that works to a service answering every request identically?",
    "approach": "Converted models to ONNX and collapsed scattered inference code into one predictable sequence behind a single REST interface, packaged for deployment.",
    "learning": "Most of the speed came from removing duplicated work, not a cleverer model. The quieter win was reproducibility — one inference path, one place where behavior can drift.",
    "status": "Applied in production",
    "companyWork": true,
    "tags": [
      "ONNX Runtime",
      "Model Deployment",
      "FastAPI",
      "Docker"
    ]
  },
  {
    "index": "03",
    "category": "Applied LLMs",
    "title": "The Schema Is the Contract",
    "question": "Can a model reading a page against a fixed schema survive layout changes better than hand-written selectors?",
    "approach": "Replaced position-dependent extraction rules with prompt-driven parsing against an explicit output schema, so extraction asked for meaning rather than a path through markup.",
    "learning": "The schema is what makes it trustworthy — the model is dependable only because the shape of its answer is fixed and checkable. Layout drift became a non-event.",
    "status": "Applied in production",
    "companyWork": true,
    "tags": [
      "LLMs",
      "Prompt Engineering",
      "JSON Schema",
      "Web Crawling"
    ]
  },
  {
    "index": "04",
    "category": "Generative AI",
    "title": "Retrieval and Agent Graphs, Studied Not Shipped",
    "question": "What makes a retrieval-augmented system reliable, and when does an agent graph earn its complexity over one good prompt?",
    "approach": "Self-directed study rather than shipped work — reading RAG patterns and building small LangChain and LangGraph experiments to meet the failure modes first-hand.",
    "learning": "Retrieval quality sets the ceiling; no generation rescues bad context. Orchestration is a cost before it is a feature. This is exploration, and I would rather say so.",
    "status": "Exploration",
    "companyWork": false,
    "tags": [
      "RAG",
      "LangChain",
      "LangGraph",
      "NLP"
    ]
  }
];

export const labCategories = Array.from(new Set(labNotes.map((n) => n.category)));
