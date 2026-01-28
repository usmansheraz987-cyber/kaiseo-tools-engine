export function analyzeImpact(before, after) {
  if (!before || !after) {
    return {
      result: "unknown",
      confidence: "low",
      explanation: "Not enough data yet",
    };
  }

  if (after.clicks > before.clicks) {
    return {
      result: "positive",
      confidence: "high",
      explanation: "Clicks increased after the change",
    };
  }

  if (after.clicks < before.clicks) {
    return {
      result: "negative",
      confidence: "medium",
      explanation: "Clicks dropped after the change",
    };
  }

  return {
    result: "neutral",
    confidence: "low",
    explanation: "No measurable impact detected",
  };
}
