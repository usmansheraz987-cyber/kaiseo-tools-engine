/**
 * SEO Analyzer v1 – Final Scoring Engine
 * -------------------------------------
 * Rules:
 * - Start from 100
 * - Critical issues hurt more than warnings
 * - Google-required blockers cap the score
 * - Strong content can still score high
 * - Score is predictable and explainable
 */

export function calculateFinalScore(checks) {
  let score = 100;

  let hasGoogleBlocker = false;
  let criticalCount = 0;
  let warningCount = 0;

  for (const check of checks) {
    // Track blockers
    if (check.status === "critical") {
      criticalCount++;

      // Critical issues are heavier
      score -= check.scoreImpact * 1.75;

      if (check.googleRequired) {
        hasGoogleBlocker = true;
      }
    }

    if (check.status === "warning") {
      warningCount++;
      score -= check.scoreImpact;
    }
  }

  /**
   * Soft normalization
   * Prevents tiny pages from scoring unrealistically high
   */
  if (criticalCount === 0 && warningCount <= 2) {
    score += 5;
  }

  /**
   * Google-style hard truth:
   * If indexing blockers exist, the page cannot score high.
   * BUT we do not destroy the score completely.
   */
  if (hasGoogleBlocker) {
    score = Math.min(score, 55);
  }

  /**
   * Clamp + round
   */
  score = Math.max(0, Math.min(100, Math.round(score)));

  return {
    totalScore: score,
    hasCriticalIndexabilityFail: hasGoogleBlocker,
    meta: {
      criticalCount,
      warningCount,
    },
  };
}
