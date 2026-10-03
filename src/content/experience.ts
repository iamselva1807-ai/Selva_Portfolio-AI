import type { Role, Education, Certification } from "./types";

export const roles: Role[] = [
  {
    "company": "Xylium Global Services",
    "title": "Data Analyst / Data Scientist",
    "titleNote": "My employment title. The work itself is applied machine learning and computer vision engineering \u2014 training, evaluating, calibrating and deploying production models.",
    "period": "Jul 2025 — Present",
    "start": "2025-07",
    "end": "Present",
    "location": "Chennai, India",
    "current": true,
    "summary": "A bank opening an account online needs three answers fast: is this person real, are they who they claim, does their paperwork hold up. I build the models that answer those, and the services that serve them.",
    "highlights": [
      "Took real-time face verification and liveness into production — detection through ONNX-served embeddings — and calibrated the decision thresholds against the risk the business carries.",
      "Replaced manual title verification for bank loans with an OCR pipeline that reads Tamil Nadu land records and cross-checks them against government sources.",
      "Designed an API-first behavioral fingerprinting service that turns raw interaction signals into session-level features for fraud and trust-risk profiling."
    ],
    "capabilities": [
      "Computer Vision",
      "Face Verification & Liveness",
      "Threshold Calibration",
      "OCR & Document Intelligence",
      "Behavioral Feature Engineering",
      "FastAPI · ONNX · Docker"
    ],
    "constellation": []
  },
  {
    "company": "CloudHalo Technology Services",
    "title": "Software Engineer / Data Analyst",
    "period": "Apr 2024 — Jun 2025",
    "start": "2024-04",
    "end": "2025-06",
    "location": "Chennai, India",
    "current": false,
    "summary": "The data the business needed lived on other people's websites, written for human eyes and nothing else. I built crawling pipelines that read those pages with LLM assistance and handed back clean, schema-consistent records.",
    "highlights": [
      "Built LLM-assisted crawling pipelines in Playwright and Selenium, using prompt-driven parsing against a fixed schema instead of brittle, position-dependent selectors.",
      "Automated recurring collection through scheduled headless sessions, which also kept the pipelines standing when source layouts changed.",
      "Built EDA-driven dashboards so stakeholders could act on findings without waiting on an ad hoc query."
    ],
    "capabilities": [
      "Web Crawling (Playwright, Selenium)",
      "LLM-Assisted Extraction",
      "Prompt Engineering",
      "Data Pipelines",
      "Exploratory Data Analysis",
      "Dashboards & Visualization"
    ]
  },
  {
    "company": "CloudHalo Technology Services",
    "title": "Software Engineer Trainee (Intern)",
    "period": "Nov 2023 — Apr 2024",
    "start": "2023-11",
    "end": "2024-04",
    "location": "Chennai, India",
    "current": false,
    "summary": "Started where data work actually starts — collecting it and cleaning it. I replaced manual collection with repeatable Python pipelines and turned raw files into tables the reporting layer could trust.",
    "highlights": [
      "Wrote extraction scripts with Requests and BeautifulSoup to pull structured data from web sources.",
      "Turned one-off manual gathering into repeatable pipelines that produced the same result every run.",
      "Cleaned and preprocessed raw datasets with Pandas and NumPy into analysis-ready tables for downstream reporting."
    ],
    "capabilities": [
      "Python",
      "Requests & BeautifulSoup",
      "Data Cleaning",
      "Pandas · NumPy",
      "Data Preprocessing"
    ]
  }
];

/** Canonical home for education — rendered on /about only. */
export const education: Education[] = [
  {
    "institution": "University of Hertfordshire",
    "qualification": "Postgraduate Diploma, Data Science and Analytics",
    "period": "Feb 2021 — Jan 2023",
    "location": "Hatfield, United Kingdom"
  },
  {
    "institution": "SRM TRP Engineering College",
    "qualification": "B.E. Electronics and Communication Engineering",
    "period": "Jul 2015 — May 2018",
    "location": "Trichy, India"
  }
];

export const certifications: Certification[] = [
  {
    "name": "Certificate of Appreciation — Outstanding Performance",
    "issuer": "Xylium Global Services",
    "period": "Aug 2025 — Nov 2025"
  },
  {
    "name": "The Complete Python Bootcamp: From Zero to Hero in Python",
    "issuer": "Udemy · Pierian Training",
    "period": "Oct 2024"
  }
];
