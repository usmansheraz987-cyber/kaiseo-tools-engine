/**
 * RHYTHM SIGNALS (V2)
 * Measures sentence-level variance and burstiness.
 */

import { splitIntoSentences } from "../v1/utils.js";

export function analyzeRhythm(text) {
  const sentences = splitIntoSentences(text);

  if (!sentences.length) {
    return {
      avg_length: 0,
      variance: 0,
      std_deviation: 0,
      uniformity_score: 0
    };
  }

  const lengths = sentences.map(s => s.split(" ").length);

  const avg =
    lengths.reduce((a, b) => a + b, 0) / lengths.length;

  const variance =
    lengths.reduce((sum, len) => sum + Math.pow(len - avg, 2), 0) /
    lengths.length;

  const stdDev = Math.sqrt(variance);

  // Uniformity score (low std dev = more uniform = higher risk)
  const uniformityScore = stdDev < 4 ? 1 : 0;

  return {
    avg_length: Number(avg.toFixed(2)),
    variance: Number(variance.toFixed(2)),
    std_deviation: Number(stdDev.toFixed(2)),
    uniformity_score: uniformityScore
  };
}