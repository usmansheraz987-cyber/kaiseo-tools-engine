/**
 * REPETITION SIGNALS (V2)
 */
import { tokenize } from "../../v1/utils.js";

export function analyzeRepetition(text) {
  const words = tokenize(text).map(w => w.toLowerCase());
  const wordCount = words.length;

  const frequency = {};
  words.forEach(w => {
    frequency[w] = (frequency[w] || 0) + 1;
  });

  const repeatedWords = Object.values(frequency).filter(
    count => count > 5
  ).length;

  const listPatternScore = detectListPattern(text);

  return {
    repeated_word_clusters: repeatedWords,
    list_pattern_score: listPatternScore,
    repetition_density: Number(
      (repeatedWords / wordCount).toFixed(4)
    )
  };
}

/* ---------------- LIST PATTERN ---------------- */

function detectListPattern(text) {
  const listMatches =
    text.match(/\b(first|second|third|finally|in conclusion)\b/gi) || [];

  return listMatches.length;
}