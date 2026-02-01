// src/tools/pageFit/phase3/intentDetector.js

/*
 Detects search intent based ONLY on the primary keyword.
 This does NOT look at page content.
*/

const INFORMATIONAL_MODIFIERS = [
  "what is",
  "how",
  "how to",
  "guide",
  "tutorial",
  "learn",
  "definition",
  "examples",
  "meaning",
  "benefits",
  "tips",
];

const COMPARISON_MODIFIERS = [
  "best",
  "vs",
  "versus",
  "compare",
  "comparison",
  "top",
  "alternatives",
  "reviews",
  "review",
];

const TRANSACTIONAL_MODIFIERS = [
  "buy",
  "price",
  "pricing",
  "cost",
  "cheap",
  "deal",
  "discount",
  "order",
  "purchase",
  "signup",
  "sign up",
  "download",
  "free trial",
];

/*
 Normalize keyword for matching
*/
function normalize(keyword) {
  return keyword.toLowerCase().trim();
}

/*
 Main intent detector
*/
export default function detectIntent(primaryKeyword) {
  if (!primaryKeyword || typeof primaryKeyword !== "string") {
    return {
      intent: "unknown",
      reason: "invalid_keyword",
    };
  }

  const keyword = normalize(primaryKeyword);

  // ---- TRANSACTIONAL FIRST (highest risk intent) ----
  for (const term of TRANSACTIONAL_MODIFIERS) {
    if (keyword.includes(term)) {
      return {
        intent: "transactional",
        reason: `matched_transactional_term:${term}`,
      };
    }
  }

  // ---- COMPARISON ----
  for (const term of COMPARISON_MODIFIERS) {
    if (keyword.includes(term)) {
      return {
        intent: "comparison",
        reason: `matched_comparison_term:${term}`,
      };
    }
  }

  // ---- INFORMATIONAL (default human search) ----
  for (const term of INFORMATIONAL_MODIFIERS) {
    if (keyword.includes(term)) {
      return {
        intent: "informational",
        reason: `matched_informational_term:${term}`,
      };
    }
  }

  // ---- FALLBACK ----
  return {
    intent: "informational",
    reason: "no_modifier_matched_default_informational",
  };
}
