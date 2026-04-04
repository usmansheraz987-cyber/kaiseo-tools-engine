import { WEIGHTS } from "../constants/weights.js";

export function resolveConfidence({ serpLive, intentConfidence }) {

  // 🔥 baseline boost (avoid useless "low")
  const adjustedConfidence = Math.max(intentConfidence, 0.4);

  if (serpLive && adjustedConfidence >= WEIGHTS.CONFIDENCE.HIGH) {
    return "high";
  }

  if (adjustedConfidence >= WEIGHTS.CONFIDENCE.MEDIUM) {
    return "medium";
  }

  return "low";
}