export function calculateFinalScore(checks) {
  let score = 100;
  let hasCriticalIndexabilityFail = false;

  for (const check of checks) {
    if (check.status === "critical") {
      score -= check.scoreImpact * 2;

      if (check.googleRequired) {
        hasCriticalIndexabilityFail = true;
      }
    }

    if (check.status === "warning") {
      score -= check.scoreImpact;
    }
  }

  if (hasCriticalIndexabilityFail) {
    score = Math.min(score, 40);
  }

  return {
    totalScore: Math.max(0, Math.round(score)),
    hasCriticalIndexabilityFail,
  };
}
