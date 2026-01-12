/**
 * Intent detection rules based on SERP title patterns
 * Deterministic. Order matters.
 */

export const INTENT_RULES = [
  {
    intent: "comparison",
    patterns: [
      "best",
      "top",
      "vs",
      "versus",
      "comparison",
      "compare",
      "alternatives",
      "tools",
      "software",
      "platforms"
    ],
    threshold: 0.35
  },

  {
    intent: "transactional",
    patterns: [
      "buy",
      "price",
      "pricing",
      "cost",
      "cheap",
      "deal",
      "discount",
      "subscription",
      "plans"
    ],
    threshold: 0.3
  },

  {
    intent: "informational",
    patterns: [
      "what is",
      "how to",
      "guide",
      "tutorial",
      "explained",
      "learn",
      "meaning",
      "definition",
      "examples"
    ],
    threshold: 0.3
  }
];

/**
 * Normalize text for matching
 */
export function normalize(text = "") {
  return text.toLowerCase().trim();
}
