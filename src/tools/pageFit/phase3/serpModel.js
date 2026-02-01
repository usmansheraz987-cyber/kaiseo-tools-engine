// src/tools/pageFit/phase3/serpModel.js

/*
 SERP expectation model.
 This does NOT crawl competitors.
 This defines what Google usually rewards per intent.
*/

const SERP_MODELS = {
  informational: {
    intent: "informational",

    medianWordCount: 1200,
    minimumWordCount: 600,

    requiredSections: [
      "introduction",
      "explanation",
      "examples",
      "summary",
    ],

    allowedPageRoles: ["pillar", "supporting"],

    description:
      "Informational queries expect deep explanations, examples, and structured learning.",
  },

  comparison: {
    intent: "comparison",

    medianWordCount: 1500,
    minimumWordCount: 800,

    requiredSections: [
      "introduction",
      "comparison_table_or_lists",
      "pros_cons",
      "verdict",
    ],

    allowedPageRoles: ["pillar", "supporting"],

    description:
      "Comparison queries expect side-by-side evaluation and decision support.",
  },

  transactional: {
    intent: "transactional",

    medianWordCount: 900,
    minimumWordCount: 400,

    requiredSections: [
      "value_proposition",
      "features",
      "pricing_or_offer",
      "call_to_action",
    ],

    allowedPageRoles: ["conversion"],

    description:
      "Transactional queries expect offers, trust signals, and conversion elements.",
  },
};

/*
 Get SERP model for detected intent
*/
export function getSerpModel(intent) {
  return SERP_MODELS[intent] || SERP_MODELS.informational;
}

/*
 Export all models (debug / inspection)
*/
export function getAllSerpModels() {
  return SERP_MODELS;
}
