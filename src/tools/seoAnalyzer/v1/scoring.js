/**
 * SEO Analyzer – Scoring Engine (v1)
 * Contract-safe with service.js
 *
 * IMPORT EXPECTED:
 * import { calculateScore } from "./scoring.js";
 */

export const calculateScore = (checks = []) => {
  let baseScore = 100;

  let hasCriticalIndexabilityFail = false;

  const categoryScores = {
    indexability: 100,
    content: 100,
    technical: 100,
  };

  for (const check of checks) {
    const impact = Number(check.scoreImpact || 0);
    const category = check.category || "content";

    // 🔴 Critical
    if (check.status === "critical") {
      baseScore -= impact * 2;
      categoryScores[category] -= impact * 2;

      if (check.googleRequired === true) {
        hasCriticalIndexabilityFail = true;
      }
    }

    // 🟡 Warning
    if (check.status === "warning") {
      baseScore -= impact;
      categoryScores[category] -= impact;
    }
  }

  // 🚫 Google hard blockers cap score
  if (hasCriticalIndexabilityFail) {
    baseScore = Math.min(baseScore, 40);
  }

  // Normalize category scores
  for (const key of Object.keys(categoryScores)) {
    categoryScores[key] = Math.max(
      0,
      Math.min(100, Math.round(categoryScores[key]))
    );
  }

  return {
    totalScore: Math.max(0, Math.min(100, Math.round(baseScore))),
    categoryScores,
    hasCriticalIndexabilityFail,
  };
};
