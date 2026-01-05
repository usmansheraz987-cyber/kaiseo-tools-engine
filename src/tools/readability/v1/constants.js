// tools/readability/v1/constants.js

export const PRESETS = {
  general_blog: {
    maxSentenceLength: 25,
    maxParagraphLength: 120,
    targetGradeRange: [6, 9]
  },

  ecommerce_product: {
    maxSentenceLength: 20,
    maxParagraphLength: 90,
    targetGradeRange: [5, 8]
  },

  help_article: {
    maxSentenceLength: 22,
    maxParagraphLength: 100,
    targetGradeRange: [6, 8]
  },

  local_service: {
    maxSentenceLength: 18,
    maxParagraphLength: 80,
    targetGradeRange: [5, 7]
  }
};

export const GRADE_LABELS = [
  { min: 0, max: 5.9, label: "Very Easy" },
  { min: 6, max: 8.9, label: "Easy" },
  { min: 9, max: 10.9, label: "Standard" },
  { min: 11, max: 12.9, label: "Difficult" },
  { min: 13, max: 20, label: "Very Difficult" }
];

export const ACTION_PRIORITY_ORDER = [
  "long_sentences",
  "passive_voice",
  "long_paragraphs"
];
