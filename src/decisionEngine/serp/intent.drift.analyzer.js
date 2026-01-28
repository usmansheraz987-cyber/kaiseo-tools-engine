export function analyzeIntentDrift(oldTitles, newTitles) {
  if (!oldTitles || oldTitles.length === 0) {
    return { drift: "unknown", reason: "No historical SERP data" };
  }

  const oldHasComparison = oldTitles.some(t =>
    /(best|top|vs|compare)/i.test(t)
  );

  const newHasComparison = newTitles.some(t =>
    /(best|top|vs|compare)/i.test(t)
  );

  if (oldHasComparison && !newHasComparison) {
    return {
      drift: "major",
      reason: "Google shifted away from comparison intent",
    };
  }

  if (!oldHasComparison && newHasComparison) {
    return {
      drift: "major",
      reason: "Google shifted toward comparison intent",
    };
  }

  return { drift: "stable", reason: "No intent shift detected" };
}
