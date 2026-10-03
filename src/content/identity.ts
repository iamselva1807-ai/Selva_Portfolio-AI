import type { Identity } from "./types";

/** Hero, snapshot stats, About narrative and contact copy. */
export const identity: Identity = {
  "heroHeadline": "Building the systems that decide who to trust.",
  "heroSubline": "AI/ML Engineer · Data Scientist · Computer Vision · Applied AI",
  "heroIntro": "I build computer vision and machine learning systems for digital identity — face verification, liveness detection, and document checks that banks use to decide whether a person, and their paperwork, are genuine. Two and a half years of it, end to end, in production.",
  "availability": "Currently at Xylium Global Services, Chennai · Open to conversations",
  "missionControl": [],
  "stats": [
    {
      "value": "2.5 yrs",
      "label": "Building production ML and computer vision systems"
    },
    {
      "value": "Data Analyst / Data Scientist",
      "label": "Xylium Global Services · ML engineering scope"
    },
    {
      "value": "Chennai, India",
      "label": "Where I'm based"
    },
    {
      "value": "PG Dip",
      "label": "Data Science & Analytics · University of Hertfordshire, UK"
    }
  ],
  "aboutIntro": "I'm an AI/ML engineer in Chennai, building computer vision and machine learning systems for digital identity, fraud risk and document compliance. I'm drawn to problems where a model has to make a decision somebody is accountable for.",
  "about": [
    {
      "heading": "How I work",
      "body": [
        "I start from the decision, not the model. Before anything gets trained I want to know what happens when the system says yes, and what happens when it says no — because in identity and fraud work those two mistakes cost very different things. That framing shapes the dataset, the evaluation, and above all where the operating threshold ends up sitting.",
        "The rest is unglamorous and matters enormously. Clean preprocessing, honest validation, calibration, and then the plumbing: ONNX inference, FastAPI services, Docker packaging, version-controlled code. A model that only exists in a notebook hasn't solved anything yet."
      ]
    },
    {
      "heading": "What I build",
      "body": [
        "Most of my production work is digital identity verification — turning a face captured on a phone into a decision a bank can act on, and knowing whether there was a real person in front of the camera at all. Alongside it sits the document side: OCR and language-model extraction that pull structured fields out of government paperwork and check them against the source. Both come down to the same question — where does the operating point belong when being wrong is expensive? The case studies go into how."
      ]
    },
    {
      "heading": "Where I came from",
      "body": [
        "I took a Postgraduate Diploma in Data Science and Analytics at the University of Hertfordshire, UK, from February 2021 to January 2023. That is where the method came from: statistics, experimental design, and the discipline to evaluate a model honestly rather than flatteringly.",
        "Before that, a B.E. in Electronics and Communication Engineering at SRM TRP Engineering College in Trichy (Jul 2015 — May 2018) — the earlier foundation, and a useful one: signals, systems, and a tolerance for things that misbehave in the real world.",
        "I started out writing extraction scripts and cleaning datasets at CloudHalo Technology Services, moved into LLM-assisted crawling pipelines and stakeholder dashboards, and now work at Xylium Global Services on identity, fraud-risk and document compliance systems for banks."
      ]
    },
    {
      "heading": "What's next",
      "body": [
        "I want to keep working on problems where a model's output carries consequence — trust, fraud, eligibility, access. Systems where being right on average isn't good enough, because the tail is where the damage happens. Practically: evaluation that survives contact with real traffic, calibration and monitoring, and the widening overlap between classical vision models and generative systems."
      ]
    }
  ],
  "contactHeadline": "Have a problem worth exploring?",
  "contactBody": "If you're working on something in computer vision, digital identity, or applied machine learning — or you just want a second opinion on a hard modeling decision — I'm glad to talk. Email is the fastest route."
};
