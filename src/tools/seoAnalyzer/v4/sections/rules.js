/**
 * Section Expectation Rules
 *
 * Static mapping:
 * intent → expected page sections
 *
 * These are STRUCTURAL expectations,
 * not keywords and not content length rules.
 */

export const SECTION_RULES = {
  comparison: [
    {
      key: "comparison_table",
      label: "Comparison Table",
      patterns: ["comparison", "compare", "vs", "versus"]
    },
    {
      key: "pricing",
      label: "Pricing",
      patterns: ["pricing", "price", "cost", "plans"]
    },
    {
      key: "pros_cons",
      label: "Pros & Cons",
      patterns: ["pros", "cons", "advantages", "disadvantages"]
    },
    {
      key: "alternatives",
      label: "Alternatives",
      patterns: ["alternatives", "competitors", "similar"]
    }
  ],

  informational: [
    {
      key: "definition",
      label: "Definition / Explanation",
      patterns: ["what is", "definition", "meaning"]
    },
    {
      key: "examples",
      label: "Examples",
      patterns: ["examples", "use cases"]
    },
    {
      key: "how_it_works",
      label: "How It Works",
      patterns: ["how it works", "working", "process"]
    },
    {
      key: "faq",
      label: "FAQ",
      patterns: ["faq", "questions"]
    }
  ],

  transactional: [
    {
      key: "pricing",
      label: "Pricing",
      patterns: ["pricing", "price", "cost"]
    },
    {
      key: "features",
      label: "Features",
      patterns: ["features", "capabilities"]
    },
    {
      key: "cta",
      label: "Call To Action",
      patterns: ["buy", "get started", "sign up", "purchase"]
    }
  ]
};

/**
 * Get section rules for intent
 */
export function getSectionRules(intent) {
  return SECTION_RULES[intent] || [];
}
