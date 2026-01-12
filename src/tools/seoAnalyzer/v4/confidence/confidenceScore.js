import { WEIGHTS } from "../constants/weights.js";

/**
 * Resolve confidence level for v4 decisions
 *
 * @param {object} params
 * @param {boolean} params.serpLive
 * @param {number} params.intentConfidence
 *
 * @returns {"high" | "medium" | "low"}
 */
export function resolveConfidence({ serpLive, intentConfidence }) {
  if (serpLive && intentConfidence >= WEIGHTS.CONFIDENCE.HIGH) {
    return "high";
  }

  if (intentConfidence >= WEIGHTS.CONFIDENCE.MEDIUM) {
    return "medium";
  }

  return "low";
}
