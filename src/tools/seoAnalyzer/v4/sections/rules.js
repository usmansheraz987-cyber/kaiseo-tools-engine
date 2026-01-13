/**
 * Section Expectation Rules with Severity
 */

export const SECTION_RULES = {
  comparison: [
    {
      key: "comparison_table",
      label: "Comparison Table",
      severity: "high",
      patterns: ["comparison", "compare", "vs", "versus"]
    },
    {
      key: "pricing",
      label: "Pricing",
      severity: "high",
      patterns: ["pricing", "price", "cost", "plans"]
    },
    {
      key: "pros_cons",
      label: "Pros & Cons",
      severity: "medium",
      patterns: ["pros", "cons", "advantages", "disadvantages"]
    },
    {
      key: "alternatives",
      label: "Alternatives",
      severity: "medium",
      patterns: ["alternatives", "competitors", "similar"]
    }
  ],

  informational: [
    {
      key: "definition",
      label: "Definition / Explanation",
      severity: "high",
      patterns: ["what is", "definition", "meaning"]
    },
    {
      key: "examples",
      label: "Examples",
      severity: "medium",
      patterns: ["examples", "use cases"]
    },
    {
      key: "how_it_works",
      label: "How It Works",
      severity: "medium",
      patterns: ["how it works", "process"]
    },
    {
      key: "faq",
      label: "FAQ",
      severity: "low",
      patterns: ["faq", "questions"]
    }
  ],

  transactional: [
    {
      key: "pricing",
      label: "Pricing",
      severity: "high",
      patterns: ["pricing", "price", "cost"]
    },
    {
      key: "features",
      label: "Features",
      severity: "medium",
      patterns: ["features", "capabilities"]
    },
    {
      key: "cta",
      label: "Call To Action",
      severity: "high",
      patterns: ["buy", "get started", "sign up", "purchase"]
    }
  ]
};

export function getSectionRules(intent) {
  return SECTION_RULES[intent] || [];
}
