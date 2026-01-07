// src/tools/aiDetector/v1/heuristics.js

import {
  splitIntoSentences,
  normalizeText,
  tokenize
} from "./utils.js";

import {
  PERPLEXITY_THRESHOLDS,
  BURSTINESS_THRESHOLDS,
  REPETITION_THRESHOLDS,
  STRUCTURE_THRESHOLDS
} from "./constants.js";

/**
 * Perplexity proxy
 * Measures uniformity of language patterns
 * AI text tends to be too consistent
 */
export function analyzePerplexity(text) {
  const sentences = splitIntoSentences(text);
  const lengths = sentences.map(s => tokenize(s).length);

  const avg = average(lengths);
  const variance = varianceOf(lengths, avg);

  if (variance < PERPLEXITY_THRESHOLDS.low) return "high";
  if (variance < PERPLEXITY_THRESHOLDS.medium) return "medium";
  return "low";
}

/**
 * Burstiness
 * Human writing fluctuates in sentence length
 * AI writing clusters tightly
 */
export function analyzeBurstiness(text) {
  const sentences = splitIntoSentences(text);
  const lengths = sentences.map(s => tokenize(s).length);

  const stdDev = Math.sqrt(varianceOf(lengths, average(lengths)));

  if (stdDev < BURSTINESS_THRESHOLDS.low) return "high";
  if (stdDev < BURSTINESS_THRESHOLDS.medium) return "medium";
  return "low";
}

/**
 * Repetition detection
 * AI repeats phrases, transitions, structures
 */
export function analyzeRepetition(text) {
  const normalized = normalizeText(text);
  const tokens = tokenize(normalized);

  const freqMap = {};
  tokens.forEach(t => {
    freqMap[t] = (freqMap[t] || 0) + 1;
  });

  const repeatedTokens = Object.values(freqMap).filter(c => c > 3).length;
  const ratio = repeatedTokens / tokens.length;

  if (ratio > REPETITION_THRESHOLDS.high) return "high";
  if (ratio > REPETITION_THRESHOLDS.medium) return "medium";
  return "low";
}

/**
 * Structural predictability
 * AI uses predictable transitions and paragraph rhythm
 */
export function analyzeStructure(text) {
  const sentences = splitIntoSentences(text);
  const starters = sentences.map(s =>
    s.trim().split(" ")[0]?.toLowerCase()
  );

  const starterFreq = {};
  starters.forEach(w => {
    starterFreq[w] = (starterFreq[w] || 0) + 1;
  });

  const repeatedStarters = Object.values(starterFreq).filter(v => v > 2).length;
  const ratio = repeatedStarters / starters.length;

  if (ratio > STRUCTURE_THRESHOLDS.patterned) return "patterned";
  if (ratio > STRUCTURE_THRESHOLDS.semi) return "semi-patterned";
  return "natural";
}

/* ---------- helpers ---------- */

function average(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function varianceOf(arr, mean) {
  return (
    arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
    arr.length
  );
}
