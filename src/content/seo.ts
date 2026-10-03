import type { Seo, PageMeta } from "./types";

export const seo: Seo = {
  "siteTitle": "Selvakumar Manoharan — AI/ML Engineer & Data Scientist",
  "siteDescription": "AI/ML Engineer and Data Scientist in Chennai, building computer vision for identity verification — face recognition, liveness detection, OCR and ML deployment.",
  "ogTitle": "Selvakumar Manoharan — AI/ML Engineer & Data Scientist",
  "ogDescription": "Computer vision and machine learning for digital identity — face verification, liveness detection, OCR document compliance and production ML deployment.",
  "keywords": [
    "AI/ML Engineer",
    "Machine Learning Engineer",
    "Data Scientist",
    "Computer Vision",
    "Face Recognition",
    "Liveness Detection",
    "Identity Verification",
    "OCR Document Extraction",
    "ONNX Runtime",
    "FastAPI",
    "Python",
    "Chennai"
  ],
  "pages": [
    {
      "route": "/",
      "title": "AI/ML Engineer & Data Scientist",
      "description": "AI/ML Engineer and Data Scientist with 2.5 years building computer vision and identity verification systems across KYC, fraud risk and document compliance."
    },
    {
      "route": "/about",
      "title": "About",
      "description": "Selvakumar Manoharan builds machine learning systems for digital identity, from face verification to document compliance. Based in Chennai, India."
    },
    {
      "route": "/work",
      "title": "Work",
      "description": "Selected work: face recognition and liveness detection, Tamil land-record document verification, and behavioral fingerprinting for fraud and trust risk."
    },
    {
      "route": "/research",
      "title": "Lab Notes",
      "description": "Lab notes on face embeddings, threshold calibration, anti-spoofing datasets, ONNX deployment, LLM-driven extraction and retrieval — questions, not claims."
    },
    {
      "route": "/experience",
      "title": "Experience",
      "description": "Experience at Xylium Global Services and CloudHalo Technology Services across computer vision, LLM-assisted data pipelines, analytics and dashboards."
    },
    {
      "route": "/resume",
      "title": "Resume",
      "description": "Resume of Selvakumar Manoharan — AI/ML Engineer and Data Scientist, Postgraduate Diploma in Data Science and Analytics, University of Hertfordshire."
    },
    {
      "route": "/contact",
      "title": "Contact",
      "description": "Get in touch with Selvakumar Manoharan, AI/ML Engineer and Data Scientist based in Chennai, India. Available by email and on LinkedIn."
    }
  ]
};

export function pageMeta(route: string): PageMeta | undefined {
  return seo.pages.find((p) => p.route === route);
}
