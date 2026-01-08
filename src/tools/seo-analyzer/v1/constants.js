// src/tools/seoAnalyzer/v1/constants.js

export const SCORE_WEIGHTS = {
  indexability: 0.4,
  content: 0.35,
  technical: 0.25
};

export const SCORE_CAPS = {
  indexabilityFail: 60,   // max score if any critical indexability issue fails
  minimumScore: 0,
  maximumScore: 100
};

export const THRESHOLDS = {
  title: {
    min: 30,
    max: 60
  },
  metaDescription: {
    min: 120,
    max: 160
  },
  content: {
    minWordCount: 300
  },
  pageSizeKb: {
    warning: 3000   // 3MB
  }
};

export const SEVERITY_MULTIPLIER = {
  critical: 1,
  warning: 0.5,
  pass: 0
};

export const CATEGORY_KEYS = [
  "indexability",
  "content",
  "technical"
];
