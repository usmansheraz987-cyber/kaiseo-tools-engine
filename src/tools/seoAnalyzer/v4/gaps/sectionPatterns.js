/**
 * Common section patterns inferred from SERP titles
 * These are STRUCTURAL expectations, not keywords.
 */

export const SECTION_PATTERNS = [
  {
    label: "Comparison Table",
    patterns: ["vs", "versus", "comparison", "compare"]
  },
  {
    label: "Pricing / Cost",
    patterns: ["price", "pricing", "cost", "plans"]
  },
  {
    label: "Pros & Cons",
    patterns: ["pros", "cons", "advantages", "disadvantages"]
  },
  {
    label: "Alternatives",
    patterns: ["alternatives", "similar", "like", "competitors"]
  },
  {
    label: "Use Cases",
    patterns: ["use case", "examples", "best for"]
  },
  {
    label: "How It Works",
    patterns: ["how it works", "working", "process"]
  },
  {
    label: "FAQ",
    patterns: ["faq", "questions", "asked"]
  }
];
