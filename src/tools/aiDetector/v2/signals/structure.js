/**
 * STRUCTURE SIGNALS (V2)
 * Document-level structural intelligence.
 */

import { splitIntoSentences } from "../../v1/utils.js";

export function analyzeStructure(text) {
  const paragraphs = splitParagraphs(text);
  const sentences = splitIntoSentences(text);

  const paragraphVariance = calculateParagraphLengthVariance(paragraphs);
  const openingFingerprint = detectOpeningPattern(sentences);
  const positionPattern = detectPositionPattern(sentences);

  return {
    paragraph_length_variance: paragraphVariance,
    opening_phrase_pattern: openingFingerprint,
    sentence_position_pattern: positionPattern
  };
}

/* ---------------- PARAGRAPH VARIANCE ---------------- */

function calculateParagraphLengthVariance(paragraphs) {
  if (!paragraphs.length) return 0;

  const lengths = paragraphs.map(p => p.split(" ").length);
  const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;

  const variance =
    lengths.reduce((sum, len) => sum + Math.pow(len - avg, 2), 0) /
    lengths.length;

  return Number(variance.toFixed(4));
}

/* ---------------- OPENING PHRASE FINGERPRINT ---------------- */

function detectOpeningPattern(sentences) {
  if (!sentences.length) return { repetition_rate: 0 };

  const starters = sentences.map(s =>
    s.trim().split(" ").slice(0, 2).join(" ").toLowerCase()
  );

  const frequency = {};
  starters.forEach(s => {
    frequency[s] = (frequency[s] || 0) + 1;
  });

  const maxRepeat = Math.max(...Object.values(frequency));
  const repetitionRate = maxRepeat / sentences.length;

  return {
    repetition_rate: Number(repetitionRate.toFixed(4))
  };
}

/* ---------------- POSITION PATTERN ---------------- */

function detectPositionPattern(sentences) {
  if (sentences.length < 6) return { pattern_score: 0 };

  const first = sentences.slice(0, 2).join(" ").length;
  const middle = sentences
    .slice(
      Math.floor(sentences.length / 2) - 1,
      Math.floor(sentences.length / 2) + 1
    )
    .join(" ").length;
  const last = sentences.slice(-2).join(" ").length;

  const variance =
    Math.abs(first - middle) + Math.abs(middle - last);

  return {
    pattern_score: Number((variance / 100).toFixed(4))
  };
}

/* ---------------- HELPERS ---------------- */

function splitParagraphs(text) {
  return text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean);
}