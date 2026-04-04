import { WEIGHTS } from "../constants/weights.js";

/**
 * Calculate competitive SEO gap score (0–100)
 */
export function calculateCompetitiveScore({
  intentStatus,
  missingSections = [],
  hasCriticalTechnicalIssues
}) {
  let score = 100;

  // 🔴 Intent mismatch penalty (BIG)
  if (intentStatus === "mismatch") {
    score -= 25;
  }

  // 🔴 Missing sections penalty (weighted)
  for (const section of missingSections) {
    if (section.severity === "high") score -= 15;
    else if (section.severity === "medium") score -= 8;
    else score -= 4;
  }

  // 🔴 Technical issues penalty
  if (hasCriticalTechnicalIssues) {
    score -= 20;
  }

  // clamp
  return Math.max(0, Math.min(100, score));
}

/**
 * Convert score to label
 */
export function getCompetitiveLevel(score) {
  if (score >= 80) return "strong";
  if (score >= 60) return "average";
  if (score >= 40) return "weak";
  return "critical";
}