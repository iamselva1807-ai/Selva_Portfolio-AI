import type { Project } from "./types";

/**
 * Flagship case studies, ordered as they appear on /work.
 * Deliberately tight: each fact is stated once, in exactly one place.
 */
export const projects: Project[] = [
  {
    "slug": "face-verification",
    "title": "Face Verification & Liveness",
    "subtitle": "Digital Identity Verification Platform",
    "ownership": "Company Project",
    "ownershipNote": "Selected details shown at a high level",
    "category": "Computer Vision",
    "period": "Jul 2025 — Present",
    "role": "Data Analyst / Data Scientist — Xylium Global Services",
    "tagline": "Turning a single selfie into a match decision a bank can act on — and proving the face is real.",
    "cardSummary": "A production computer vision pipeline turning one capture into a match decision and confidence score, guarded by a trained gate that confirms the face is real.",
    "focus": [
      "Face verification & recognition",
      "Liveness & anti-spoofing",
      "Threshold calibration (FAR/FRR)",
      "ONNX inference & API delivery"
    ],
    "challenge": {
      "heading": "A bank has one moment to answer two questions",
      "body": [
        "Digital onboarding moved identity checking to a phone camera, leaving a bank two questions to answer in the time a spinner turns: is this the person on the document, and are they actually here? A face in a dim room looks nothing like the same face photographed years earlier, so every verification system lives on a dial. Turn it one way and impostors get through — a false accept; turn it the other and genuine customers are turned away — a false reject. FAR down means FRR up, and no setting eliminates both. The second question is adversarial: to a matcher that only measures similarity, a printed photo held to the lens is an excellent match. Where that dial sits is a risk and compliance decision, not a modeling preference."
      ]
    },
    "approach": {
      "heading": "One request in, one decision out",
      "body": [
        "The design goal was deliberately narrow: one API call. A client sends a capture and receives a match decision with a confidence score; everything in between is the service's problem, not the caller's. Integrating teams should not need computer vision knowledge to use a computer vision system. Liveness runs as a gate rather than a footnote — nothing is matched until the capture is judged genuine.",
        "Speed was treated as a feature, because an onboarding flow that stalls loses the customer regardless of accuracy. I benchmarked candidate embedding models, migrated the production backbone to AuraFace, consolidated scattered inference paths into one, and served it through ONNX Runtime behind FastAPI and Docker — cutting per-request inference time by roughly 35%. Thresholds for verification and liveness were then calibrated to the FAR/FRR balance the business and its compliance obligations could actually accept, making the trade-off an agreed position rather than an inherited default."
      ],
      "pipeline": [
        {
          "label": "Capture",
          "detail": "A single image arrives through one REST endpoint. No multi-step handshake for the caller."
        },
        {
          "label": "Detect & align",
          "detail": "The face is located and normalized with landmark extraction and pose estimation, so comparison sees a consistent view."
        },
        {
          "label": "Liveness gate",
          "detail": "A trained anti-spoofing classifier separates a genuine presentation from a printed or replayed one before matching is trusted."
        },
        {
          "label": "Embed",
          "detail": "An ONNX-served model on the AuraFace backbone converts the aligned face into a compact numerical representation."
        },
        {
          "label": "Match",
          "detail": "The embedding is compared against the reference identity and scored for similarity."
        },
        {
          "label": "Calibrated decision",
          "detail": "A deliberately chosen operating threshold turns that score into a match decision and a confidence value."
        }
      ]
    },
    "contribution": [
      {
        "title": "Engineered the end-to-end verification path",
        "detail": "Detection, alignment, landmark extraction, pose estimation, embedding generation and similarity matching, delivered as one API call returning a match decision and confidence score."
      },
      {
        "title": "Benchmarked embedding models and consolidated inference",
        "detail": "Compared candidate embedding models, migrated the production backbone, and collapsed fragmented inference paths into one served behind ONNX and REST."
      },
      {
        "title": "Built and shipped the anti-spoofing gate",
        "detail": "Assembled the presentation attack dataset under standardized capture conditions, trained liveness classifiers across attack types, analyzed misclassifications case by case, and shipped the gate."
      },
      {
        "title": "Calibrated the FAR/FRR operating point",
        "detail": "Tuned verification and liveness thresholds to the risk and compliance tolerance production required — an input to fraud-risk decisions, not an accuracy exercise."
      }
    ],
    "architecture": {
      "caption": "The deployment view the pipeline above does not show: one endpoint, three models behind it, one runtime. Component and threshold detail is intentionally omitted.",
      "layers": [
        {
          "name": "API surface",
          "nodes": [
            "Onboarding / KYC client",
            "FastAPI REST endpoint"
          ]
        },
        {
          "name": "Models",
          "nodes": [
            "Face understanding",
            "Liveness classifier",
            "ONNX embedding model"
          ]
        },
        {
          "name": "Runtime",
          "nodes": [
            "ONNX Runtime",
            "Docker packaging"
          ]
        }
      ]
    },
    "technologies": [
      {
        "group": "Computer Vision",
        "items": [
          "Python",
          "OpenCV",
          "PyTorch",
          "Image Preprocessing",
          "Image Classification",
          "Transfer Learning",
          "Embeddings",
          "Similarity Matching"
        ]
      },
      {
        "group": "Modeling & Evaluation",
        "items": [
          "Neural Networks",
          "Supervised Learning",
          "Classification",
          "Model Evaluation",
          "Model Validation",
          "Hyperparameter Tuning",
          "Model Calibration"
        ]
      },
      {
        "group": "Serving & Deployment",
        "items": [
          "ONNX Runtime",
          "Model Inference",
          "FastAPI",
          "REST APIs",
          "JSON Schema Design",
          "Docker",
          "Git"
        ]
      }
    ],
    "outcomes": [
      {
        "value": "~35%",
        "label": "Faster per-request inference",
        "note": "After model benchmarking, a backbone migration and consolidated ONNX-served inference."
      },
      {
        "value": "Production",
        "label": "Anti-spoofing gate deployed",
        "note": "A trained liveness classifier shipped alongside verification, covering multiple presentation attack types."
      },
      {
        "value": "One call",
        "label": "Detection through decision",
        "note": "The whole pipeline collapsed behind a single REST request returning a decision and confidence score."
      }
    ],
    "learnings": [
      "Dataset preparation was the highest-leverage work. Standardizing capture conditions across genuine and spoof samples was slow and unglamorous, but without it the classifier would have learned the recording setup instead of the attack — metrics would have looked excellent and the deployed system would have failed. A model that scores better offline is not automatically better in production."
    ],
    "confidentiality": "Built at Xylium Global Services inside a production KYC stack; no code, endpoints, model weights, threshold values or customer data appear here."
  },
  {
    "slug": "document-intelligence",
    "title": "Unified Document Verification API",
    "subtitle": "Land Record Verification for Bank Lending",
    "ownership": "Company Project",
    "ownershipNote": "Selected details shown at a high level",
    "category": "Document Intelligence",
    "period": "Jul 2025 — Present",
    "role": "Data Analyst / Data Scientist — Xylium Global Services",
    "tagline": "Turns scanned government land records into verified, queryable data a bank can lend against.",
    "cardSummary": "A bank must prove land ownership before a property loan. This API extracts Tamil Nadu government records into structured fields, cross-checks them against source APIs, and cuts review ~40%.",
    "focus": [
      "Document intelligence",
      "Tamil-script OCR",
      "Cross-source verification",
      "API contract design"
    ],
    "challenge": {
      "heading": "The slowest hour in a property loan",
      "body": [
        "Before a bank lends against land, it has to be sure of two things: that the borrower actually owns the property, and that nobody else already has a claim on it. In Tamil Nadu that proof lives in three state government records — an ownership record (Patta) naming the registered holder of a parcel, an Encumbrance Certificate listing every registered mortgage, sale or claim against it, and a field measurement sketch (FMB) describing where its boundaries run. Checking them was manual: an officer opened the scanned PDFs, read them in Tamil, and compared them field by field against official sources by eye. One missed mismatch means a loan secured against land the borrower may not fully own."
      ]
    },
    "approach": {
      "heading": "Read the document, then prove it",
      "body": [
        "Automating it ran straight into a hard recognition problem. Tamil is an abugida — vowel markers attach above, below and beside a base consonant — so a smudge or a broken stroke changes a person's name, not just a character. And scanned government records arrive degraded, skewed and low-contrast, with print quality that varies page to page. Recognition tuned for Latin print degrades badly on this material, and a field read incorrectly is worse than a field not read at all, because it looks like an answer.",
        "So the system separates reading the paper from deciding whether to trust it. Extraction recovers Tamil values into a named field schema; verification pulls the same fields from government source APIs and compares them with field-level similarity scoring, because transliteration differences and scan noise are not ownership discrepancies."
      ],
      "pipeline": [
        {
          "label": "Intake",
          "detail": "Ownership, encumbrance and survey records arrive as scanned, unstructured government PDFs."
        },
        {
          "label": "Scan preparation",
          "detail": "Pages are normalized so degraded, rotated and low-contrast scans are legible to the recognition stage."
        },
        {
          "label": "Tamil field extraction",
          "detail": "OCR recovers Tamil values and maps them onto a defined field schema rather than raw text."
        },
        {
          "label": "Source cross-check",
          "detail": "The same fields are pulled from government source APIs to compare against what the document claims."
        },
        {
          "label": "Field-level scoring",
          "detail": "Each field is scored independently, with match thresholds separating agreement from mismatch."
        },
        {
          "label": "Risk output",
          "detail": "Mismatches and a risk score return, so a reviewer works exceptions instead of the whole file."
        }
      ]
    },
    "contribution": [
      {
        "title": "Built the Tamil OCR extraction layer",
        "detail": "Owned extraction across all three record types, recovering Tamil-language values from degraded scans into a defined field schema rather than undifferentiated text."
      },
      {
        "title": "Integrated government source APIs",
        "detail": "Connected the pipeline to official sources so every extracted field was checked against the record of truth rather than accepted at face value."
      },
      {
        "title": "Designed field-level matching",
        "detail": "Implemented per-field similarity scoring with match thresholds, so transliteration differences and scan noise did not masquerade as genuine ownership discrepancies."
      },
      {
        "title": "Authored the versioned REST API spec",
        "detail": "Defined the service contract — async endpoints, error semantics, partial results — so consuming teams could integrate against a stable, documented interface."
      }
    ],
    "architecture": {
      "caption": "Conceptual view only. Field schemas, matching rules and threshold values are internal and not shown.",
      "layers": [
        {
          "name": "Sources",
          "nodes": [
            "Ownership record (Patta)",
            "Encumbrance Certificate",
            "Field measurement sketch",
            "Government source APIs"
          ]
        },
        {
          "name": "Processing",
          "nodes": [
            "Tamil-script OCR",
            "Structured field schema",
            "Similarity scoring",
            "Match thresholds"
          ]
        },
        {
          "name": "Delivery",
          "nodes": [
            "Async REST endpoints",
            "Versioned API spec",
            "Mismatch and risk payload"
          ]
        }
      ]
    },
    "technologies": [
      {
        "group": "Extraction",
        "items": [
          "Python",
          "OCR",
          "Document Data Extraction",
          "Image Preprocessing"
        ]
      },
      {
        "group": "Verification",
        "items": [
          "Similarity Matching",
          "Field-Level Match Thresholds",
          "Risk Scoring"
        ]
      },
      {
        "group": "API & Delivery",
        "items": [
          "FastAPI",
          "REST APIs",
          "Asynchronous Processing",
          "JSON Schema Design",
          "API Integration"
        ]
      },
      {
        "group": "Engineering",
        "items": [
          "Docker",
          "Git"
        ]
      }
    ],
    "outcomes": [
      {
        "value": "~40%",
        "label": "Document review time cut",
        "note": "Reviewers moved from reading full files to working surfaced mismatches."
      },
      {
        "value": "Manual → automated",
        "label": "Title verification",
        "note": "Replaced a manual cross-check for property-loan compliance."
      },
      {
        "value": "Structured",
        "label": "Tamil fields recovered",
        "note": "Unstructured government PDFs became queryable, validated records."
      }
    ],
    "learnings": [
      "The measurable win was attention, not recognition. Automating extraction mattered less than deciding what a human still had to look at — narrowing review to surfaced mismatches is what removed the time. And exact matching is the wrong default for records typed, transliterated and re-keyed by people across several systems."
    ],
    "confidentiality": "Company-owned work at Xylium Global Services; field schemas, matching rules, threshold values and customer document data stay internal and are deliberately absent here."
  },
  {
    "slug": "behavioral-fingerprinting",
    "title": "Behavioral Fingerprinting Platform",
    "subtitle": "Behavioral Intelligence for Trust & Risk",
    "ownership": "Company Project",
    "ownershipNote": "Company-owned work — shown at a high level",
    "category": "Data Science",
    "period": "Jul 2025 — Present",
    "role": "Data Analyst / Data Scientist — Xylium Global Services",
    "tagline": "Turns how a user behaves, not just what they submit, into structured signals a risk team can reason about.",
    "cardSummary": "An API-first service that turns raw interaction telemetry into session-level behavioral features, served over REST so every consuming risk service reads the same signals the same way.",
    "focus": [
      "API-first service design",
      "Event schema design",
      "Session-level aggregation",
      "Feature engineering"
    ],
    "challenge": {
      "heading": "Identity proves who. Behavior suggests whether to trust.",
      "body": [
        "An identity check answers a narrow question: is this the right person, with the right document, present right now. It says nothing about how the session actually unfolded — two sessions can clear the same checks and look nothing alike. The harder half of the problem was organisational, not statistical: several services needed the same behavioral view, and without one shared definition each would describe behavior slightly differently, letting risk decisions across the platform quietly drift apart."
      ]
    },
    "approach": {
      "heading": "Settle the contract first. Engineer the features second.",
      "body": [
        "This was designed as an API before it was designed as a model. The opening question was not which features to compute but what a consuming service should be able to ask for and reliably get back — which forced the event schema and the session boundary to be settled before anyone argued about the maths. One line was held carefully: the platform produces signals, it does not render verdicts. Scoring and interpretation stay with the service that owns the decision."
      ],
      "pipeline": [
        {
          "label": "Interaction",
          "detail": "A real user moving through a real flow; everything downstream begins there."
        },
        {
          "label": "Behavior Signals",
          "detail": "Telemetry captured against a defined event schema, so every emitting product speaks one vocabulary."
        },
        {
          "label": "Feature Extraction",
          "detail": "Session aggregation and derived attributes turn a formless event stream into comparable structured quantities."
        },
        {
          "label": "Behavior Profile",
          "detail": "A compact session-level representation, served over REST to the services that own risk decisions."
        }
      ]
    },
    "contribution": [
      {
        "title": "Designed the service contract",
        "detail": "Settled what the API offers and where its responsibility ends — signal production inside, risk interpretation outside — before any feature work began."
      },
      {
        "title": "Authored the event schema and session boundary",
        "detail": "Gave raw interaction signals a consistent shape and defined how a stream of events collapses into one comparable session."
      },
      {
        "title": "Exposed one definition over REST",
        "detail": "Built the feature layer and served it to several consuming services from a single shared definition, not a bespoke integration per team."
      }
    ],
    "architecture": {
      "caption": "Conceptual view only. Signal definitions, feature specifications and session logic are proprietary and intentionally omitted.",
      "layers": [
        {
          "name": "Capture",
          "nodes": [
            "Interaction Telemetry",
            "Event Schema"
          ]
        },
        {
          "name": "Feature Layer",
          "nodes": [
            "Session Assembly",
            "Derived Attributes"
          ]
        },
        {
          "name": "Service Interface",
          "nodes": [
            "REST Endpoints",
            "Consuming Services"
          ]
        }
      ]
    },
    "technologies": [
      {
        "group": "Language & Data",
        "items": [
          "Python",
          "SQL",
          "Pandas",
          "NumPy"
        ]
      },
      {
        "group": "Data Science",
        "items": [
          "Feature Engineering",
          "Data Pipelines",
          "Data Preprocessing"
        ]
      },
      {
        "group": "API & Delivery",
        "items": [
          "FastAPI",
          "REST APIs",
          "JSON Schema Design",
          "Asynchronous Processing"
        ]
      },
      {
        "group": "Platform",
        "items": [
          "Docker",
          "Git"
        ]
      }
    ],
    "outcomes": [
      {
        "value": "Shared contract",
        "label": "One definition of behavior",
        "note": "Several consuming services read the same session-level features instead of each describing behavior its own way."
      },
      {
        "value": "Separated",
        "label": "Signals apart from scoring",
        "note": "The platform produces evidence; the service that owns the decision keeps the interpretation."
      }
    ],
    "learnings": [
      "The schema turned out to be the hard part, not the features — once the event vocabulary and the session boundary were agreed, feature engineering became ordinary work."
    ],
    "confidentiality": "Company-owned work at Xylium Global Services; signal definitions, session logic and risk rules stay proprietary."
  },
  {
    "slug": "llm-data-extraction",
    "title": "LLM-Assisted Data Extraction",
    "subtitle": "Resilient Web Data Pipelines",
    "ownership": "Company Project",
    "ownershipNote": "Selected details shown at a high level",
    "category": "Generative AI / Data Engineering",
    "period": "Nov 2023 — Jun 2025",
    "role": "Software Engineer Trainee → Software Engineer / Data Analyst, CloudHalo Technology Services",
    "tagline": "Turning constantly-changing web pages into schema-consistent structured data that survives the next site redesign.",
    "cardSummary": "Scrapers break on every redesign. Moving the parsing layer to an LLM working against a fixed schema kept collection running — and cut refresh time roughly 30%.",
    "focus": [
      "Applied Generative AI",
      "Web Data Pipelines",
      "Schema Design"
    ],
    "challenge": {
      "heading": "The web does not hold still",
      "body": [
        "Teams needed data from several independent source sites and were collecting it by hand — slow, inconsistent, and stale the moment the person doing it stopped. Automation has a well-known failure mode here: a conventional scraper is bound to a page's structure, so a renamed container or a routine redesign breaks it. Across multiple sites, that repair work compounds. The real problem was never how to read these pages once; it was how to keep reading them as they change."
      ]
    },
    "approach": {
      "heading": "Let the model read the page; let the schema hold the shape",
      "body": [
        "The pipeline separates two concerns scrapers usually fuse: fetching a page and understanding it. Playwright and Selenium handle retrieval, driving headless sessions through sites that only resolve once rendered. Understanding moves to a language model working against a fixed target schema — the prompt describes the fields the business needs and the shape they must arrive in. The schema is the contract, and the stable thing in the system: when a source reorganizes its markup, the extraction still lands and nothing downstream learns anything moved."
      ],
      "pipeline": [
        {
          "label": "Scheduled retrieval",
          "detail": "Recurring headless sessions driven by Playwright and Selenium render each source site on a cadence."
        },
        {
          "label": "Prompt-driven parsing",
          "detail": "An LLM reads the rendered page against a described target schema, not markup-bound selectors."
        },
        {
          "label": "Schema conformance",
          "detail": "Records are shaped to one consistent structure regardless of how each page looks."
        },
        {
          "label": "Analysis-ready output",
          "detail": "Cleaned with Pandas and NumPy, then surfaced through exploratory analysis and dashboards."
        }
      ]
    },
    "contribution": [
      {
        "title": "Built the LLM parsing layer",
        "detail": "Designed the prompt-driven extraction step that turns unstructured pages into schema-consistent records, removing manual gathering across multiple source sites."
      },
      {
        "title": "Built the collection pipelines",
        "detail": "Implemented crawling with Playwright and Selenium, including the headless session handling pages need when they only resolve once rendered."
      },
      {
        "title": "Automated recurring refresh",
        "detail": "Moved collection onto scheduled sessions and built the cleaning and dashboard layer."
      }
    ],
    "architecture": {
      "caption": "Conceptual view. Retrieval and understanding stay separate layers, with a fixed target schema as the contract between them.",
      "layers": [
        {
          "name": "Collection",
          "nodes": [
            "Scheduled headless sessions",
            "Playwright",
            "Selenium"
          ]
        },
        {
          "name": "Understanding",
          "nodes": [
            "Prompt-driven LLM parsing",
            "Target schema definition",
            "Schema-consistent records"
          ]
        },
        {
          "name": "Delivery",
          "nodes": [
            "Cleaning & preprocessing",
            "Analysis-ready tables",
            "Dashboards"
          ]
        }
      ]
    },
    "technologies": [
      {
        "group": "Generative AI",
        "items": [
          "LLMs",
          "Prompt Engineering",
          "LLM-Assisted Data Extraction",
          "NLP"
        ]
      },
      {
        "group": "Collection",
        "items": [
          "Playwright",
          "Selenium",
          "Requests",
          "BeautifulSoup",
          "Headless Browser Automation"
        ]
      },
      {
        "group": "Data",
        "items": [
          "Python",
          "Pandas",
          "NumPy",
          "Data Pipelines",
          "JSON Schema Design"
        ]
      },
      {
        "group": "Analytics",
        "items": [
          "Exploratory Data Analysis",
          "Data Visualization",
          "Dashboards"
        ]
      }
    ],
    "outcomes": [
      {
        "value": "~30%",
        "label": "Faster data refresh",
        "note": "Scheduled headless collection replaced hand-gathering across multiple source sites."
      },
      {
        "value": "Reduced",
        "label": "Upkeep on layout change",
        "note": "Parsing against a schema rather than selectors survived source redesigns."
      }
    ],
    "learnings": [
      "The most durable part of this system turned out to be the schema, not the code — a new source or a different model became a change to one layer, not a rewrite."
    ],
    "confidentiality": "Owned by CloudHalo Technology Services; source sites, prompts, schemas and business context are deliberately left out."
  }
];

export const projectSlugs = projects.map((p) => p.slug);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** Neighbouring projects, for the case-study footer. */
export function adjacentProjects(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: undefined, next: undefined };
  return {
    prev: i > 0 ? projects[i - 1] : projects[projects.length - 1],
    next: i < projects.length - 1 ? projects[i + 1] : projects[0],
  };
}
