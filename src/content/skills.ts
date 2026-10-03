import type { SkillGroup } from "./types";

/** Rendered as a compact capabilities block on /experience. No scores, no ranking. */
export const skillGroups: SkillGroup[] = [
  {
    "name": "Data & Programming",
    "description": "Pulling data out of messy places and shaping it for a model.",
    "skills": [
      "Python",
      "SQL",
      "Pandas",
      "NumPy",
      "Data Cleaning",
      "Data Preprocessing",
      "Feature Engineering",
      "Data Pipelines",
      "Web Crawling (Playwright, Selenium, Requests)"
    ]
  },
  {
    "name": "Machine Learning",
    "description": "Training, validating and calibrating models until behavior matches the risk carried.",
    "skills": [
      "Machine Learning",
      "Supervised Learning",
      "Classification",
      "Regression",
      "Model Evaluation",
      "Model Validation",
      "Hyperparameter Tuning",
      "Model Calibration",
      "Neural Networks",
      "PyTorch",
      "Scikit-learn",
      "Transfer Learning"
    ]
  },
  {
    "name": "Computer Vision",
    "description": "Turning an image into a decision — identity, liveness, document content.",
    "skills": [
      "Computer Vision",
      "OpenCV",
      "Image Preprocessing",
      "Image Classification",
      "Embeddings",
      "Similarity Matching",
      "OCR",
      "Document Data Extraction"
    ]
  },
  {
    "name": "AI Engineering & Deployment",
    "description": "Where a model stops being a notebook and becomes a callable service.",
    "skills": [
      "FastAPI",
      "REST APIs",
      "API Integration",
      "Asynchronous Processing",
      "JSON Schema Design",
      "ONNX Runtime",
      "Model Inference",
      "Model Deployment",
      "Docker",
      "AWS",
      "Git",
      "GitHub",
      "Cursor",
      "Claude Code",
      "Jira"
    ]
  },
  {
    "name": "Generative AI",
    "description": "Language models put to work where structure is missing.",
    "skills": [
      "LLMs",
      "Prompt Engineering",
      "LLM-Assisted Data Extraction",
      "RAG",
      "LangChain",
      "LangGraph",
      "Hugging Face",
      "NLP"
    ]
  },
  {
    "name": "Analytics & Visualization",
    "description": "Making the numbers legible enough to decide from a dashboard.",
    "skills": [
      "Data Analytics",
      "Power BI",
      "Microsoft Excel",
      "Data Visualization",
      "Statistical Analysis",
      "Dashboards",
      "Exploratory Data Analysis",
      "Google Analytics",
      "Google Tag Manager"
    ]
  }
];
