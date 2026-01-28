export function analyzeImpact(before, after) {
  if (!before || !after) {
    return { result: "unknown", confidence: "low" };
  }

  if (after > before) {
    return { result: "positive", confidence: "medium" };
  }

  if (after < before) {
    return { result: "negative", confidence: "medium" };
  }

  return { result: "neutral", confidence: "low" };
}
