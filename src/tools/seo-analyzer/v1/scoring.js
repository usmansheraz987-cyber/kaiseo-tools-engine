// src/tools/seoAnalyzer/v1/scoring.js

import {
  SCORE_WEIGHTS,
  SCORE_CAPS,
  SEVERITY_MULTIPLIER,
  CATEGORY_KEYS
} from "./constants.js";

export function calculateScore(checks = []) {
  const categoryScores = {};
  let hasCriticalIndexabilityFail = false;

  CATEGORY_KEYS.forEach(category => {
    const categoryChecks = checks.filter(
      c => c.category === category
    );

    if (!categoryChecks.length) {
      categoryScores[category] = 100;
      return;
    }

    let maxImpact = 0;
    let penalty = 0;

    categoryChecks.forEach(check => {
      maxImpact += check.scoreImpact || 0;

      const multiplier =
        SEVERITY_MULTIPLIER[check.status] ?? 0;

      penalty += (check.scoreImpact || 0) * multiplier;

      if (
        category === "indexability" &&
        check.status === "critical"
      ) {
        hasCriticalIndexabilityFail = true;
      }
    });

    const rawScore =
      maxImpact === 0
        ? 100
        : Math.max(
            0,
            Math.round(
              100 - (penalty / maxImpact) * 100
            )
          );

    categoryScores[category] = rawScore;
  });

  // Weighted total
  let totalScore = Math.round(
    CATEGORY_KEYS.reduce((sum, category) => {
      const weight = SCORE_WEIGHTS[category] || 0;
      return sum + categoryScores[category] * weight;
    }, 0)
  );

  // Cap score if indexability failed
  if (hasCriticalIndexabilityFail) {
    totalScore = Math.min(
      totalScore,
      SCORE_CAPS.indexabilityFail
    );
  }

  totalScore = Math.max(
    SCORE_CAPS.minimumScore,
    Math.min(totalScore, SCORE_CAPS.maximumScore)
  );

  return {
    totalScore,
    categoryScores,
    hasCriticalIndexabilityFail
  };
}
