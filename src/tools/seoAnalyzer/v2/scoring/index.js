export function calculateV2Score(allChecks) {
  let totalScore = 100;
  let hasCriticalIndexabilityFail = false;

  const categoryScores = {
    indexability: 100,
    content: 100,
    technical: 100
  };

  for (const check of allChecks) {
    const impact =
      check.status === "critical"
        ? check.scoreImpact * 2
        : check.status === "warning"
        ? check.scoreImpact
        : 0;

    totalScore -= impact;
    categoryScores[check.category] -= impact;

    if (
      check.googleRequired &&
      check.status === "critical" &&
      check.category === "indexability"
    ) {
      hasCriticalIndexabilityFail = true;
    }
  }

  // Hard cap for indexability failures
  if (hasCriticalIndexabilityFail) {
    totalScore = Math.min(totalScore, 40);
  }

  // Clamp values
  totalScore = Math.max(0, Math.round(totalScore));

  Object.keys(categoryScores).forEach(cat => {
    categoryScores[cat] = Math.max(
      0,
      Math.round(categoryScores[cat])
    );
  });

  return {
    totalScore,
    categoryScores,
    hasCriticalIndexabilityFail
  };
}
