// src/tools/aiDetector/v2/signals/style.js

import { tokenize, splitIntoSentences, countWords } from "../v1/utils.js";

/**
 * STYLE SIGNAL ANALYZER (V2)
 * Pure linguistic signal detection.
 * No scoring logic here.
 */

const PASSIVE_REGEX = /\b(am|is|are|was|were|be|been|being)\s+\w+ed\b/gi;

const CONTRACTION_REGEX = /\b\w+'(t|re|ve|ll|d|s|m)\b/gi;

export function analyzeStyle(text) {
  const words = tokenize(text);
  const sentences = splitIntoSentences(text);
  const wordCount = countWords(text);

  const passive = detectPassiveVoice(text, sentences);
  const contractions = detectContractionDensity(text, wordCount);
  const clauseComplexity = detectClauseComplexity(text, sentences);
  const lexicalDiversity = calculateTypeTokenRatio(words);
  const wordLengthVariance = calculateWordLengthVariance(words);

  return {
    passive_voice: passive,
    contraction_density: contractions,
    clause_complexity: clauseComplexity,
    lexical_diversity: lexicalDiversity,
    word_length_variance: wordLengthVariance
  };
}

/* ---------------- PASSIVE VOICE ---------------- */

function detectPassiveVoice(text, sentences) {
  const matches = text.match(PASSIVE_REGEX) || [];
  const density = matches.length / sentences.length || 0;

  return {
    count: matches.length,
    density: Number(density.toFixed(4))
  };
}

/* ---------------- CONTRACTION DENSITY ---------------- */

function detectContractionDensity(text, wordCount) {
  const matches = text.match(CONTRACTION_REGEX) || [];
  const density = matches.length / wordCount || 0;

  return {
    count: matches.length,
    density: Number(density.toFixed(4))
  };
}

/* ---------------- CLAUSE COMPLEXITY ---------------- */

function detectClauseComplexity(text, sentences) {
  const commaCount = (text.match(/,/g) || []).length;
  const conjunctionCount = (
    text.match(/\b(and|but|or|because|although|while|since|unless|whereas)\b/gi) || []
  ).length;

  const complexityScore =
    (commaCount + conjunctionCount) / sentences.length || 0;

  return {
    comma_count: commaCount,
    conjunction_count: conjunctionCount,
    complexity_per_sentence: Number(complexityScore.toFixed(4))
  };
}

/* ---------------- TYPE TOKEN RATIO ---------------- */

function calculateTypeTokenRatio(words) {
  if (!words.length) return 0;

  const unique = new Set(words.map(w => w.toLowerCase()));
  const ratio = unique.size / words.length;

  return Number(ratio.toFixed(4));
}

/* ---------------- WORD LENGTH VARIANCE ---------------- */

function calculateWordLengthVariance(words) {
  if (!words.length) return 0;

  const lengths = words.map(w => w.length);
  const avg =
    lengths.reduce((sum, len) => sum + len, 0) / lengths.length;

  const variance =
    lengths.reduce((sum, len) => sum + Math.pow(len - avg, 2), 0) /
    lengths.length;

  return Number(variance.toFixed(4));
}