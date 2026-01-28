// src/decisionEngine/intent/intent.detector.js

export function detectSearchIntent(primaryQuery) {
  const q = primaryQuery.toLowerCase();

  if (q.includes("best") || q.includes("top") || q.includes("vs")) {
    return {
      intent: "comparison",
      confidence: "high",
    };
  }

  if (
    q.includes("buy") ||
    q.includes("price") ||
    q.includes("pricing") ||
    q.includes("cost")
  ) {
    return {
      intent: "transactional",
      confidence: "high",
    };
  }

  if (
    q.includes("how") ||
    q.includes("what is") ||
    q.includes("guide") ||
    q.includes("tutorial")
  ) {
    return {
      intent: "informational",
      confidence: "medium",
    };
  }

  return {
    intent: "unknown",
    confidence: "low",
  };
}
