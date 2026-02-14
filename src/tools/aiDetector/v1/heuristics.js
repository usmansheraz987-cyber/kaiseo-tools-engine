// src/tools/aiDetector/v1/heuristics.js

import {
  splitIntoSentences,
  normalizeText,
  tokenize
} from "./utils.js";

import {
  PERPLEXITY_THRESHOLDS,
  BURSTINESS_THRESHOLDS,
  STRUCTURE_THRESHOLDS
} from "./constants.js";

/* =====================================================
   STOPWORDS (Used for smarter repetition detection)
===================================================== */

const STOPWORDS = new Set([
  "the","is","in","and","to","of","a","it","that","for","on","with",
  "as","at","by","an","be","this","which","or","from","are","was"
]);

// transition phase detection

const TRANSITION_PHRASES = [
  "in conclusion",
  "in addition",
  "furthermore",
  "moreover",
  "overall",
  "as a result",
  "for example",
  "for instance",
  "it is important to",
  "this highlights",
  "this demonstrates",
  "on the other hand",
  "in summary",
  "to conclude"
];

/* =====================================================
   TRANSITION PHRASE DETECTION
===================================================== */

export function analyzeTransitions(text) {
  const normalized = normalizeText(text);
  const wordCount = tokenize(normalized).length;

  if (wordCount < 40) return "low";

  let matchCount = 0;

  TRANSITION_PHRASES.forEach(phrase => {
    const regex = new RegExp("\\b" + phrase + "\\b", "g");
    const matches = normalized.match(regex);
    if (matches) {
      matchCount += matches.length;
    }
  });

  const density = matchCount / wordCount;

  if (density > 0.02) return "high";
  if (density > 0.01) return "medium";
  return "low";
}


/* =====================================================
   PERPLEXITY (Sentence Length Variance)
===================================================== */

export function analyzePerplexity(text) {
  const sentences = splitIntoSentences(text);
  const lengths = sentences.map(s => tokenize(s).length);

  if (!lengths.length) return "low";

  const avg = average(lengths);
  const variance = varianceOf(lengths, avg);

  if (variance < PERPLEXITY_THRESHOLDS.low) return "high";
  if (variance < PERPLEXITY_THRESHOLDS.medium) return "medium";
  return "low";
}

/* =====================================================
   BURSTINESS (Rhythm Variation)
===================================================== */

export function analyzeBurstiness(text) {
  const sentences = splitIntoSentences(text);
  const lengths = sentences.map(s => tokenize(s).length);

  if (!lengths.length) return "low";

  const stdDev = Math.sqrt(varianceOf(lengths, average(lengths)));

  if (stdDev < BURSTINESS_THRESHOLDS.low) return "high";
  if (stdDev < BURSTINESS_THRESHOLDS.medium) return "medium";
  return "low";
}

/* =====================================================
   IMPROVED REPETITION DETECTION
   - Stopword filtered
   - Bigram detection
   - Trigram detection
===================================================== */

export function analyzeRepetition(text) {
  const normalized = normalizeText(text);
  const tokens = tokenize(normalized);

  if (tokens.length < 20) return "low";

  /* ---------- WORD REPETITION ---------- */

  const wordFreq = {};
  tokens.forEach(token => {
    if (!STOPWORDS.has(token)) {
      wordFreq[token] = (wordFreq[token] || 0) + 1;
    }
  });

  const repeatedWords = Object.values(wordFreq).filter(c => c > 3).length;
  const wordRatio = repeatedWords / tokens.length;

  /* ---------- BIGRAM REPETITION ---------- */

  const bigramFreq = {};
  for (let i = 0; i < tokens.length - 1; i++) {
    if (!STOPWORDS.has(tokens[i])) {
      const bigram = tokens[i] + " " + tokens[i + 1];
      bigramFreq[bigram] = (bigramFreq[bigram] || 0) + 1;
    }
  }

  const repeatedBigrams = Object.values(bigramFreq).filter(c => c > 2).length;
  const bigramRatio = repeatedBigrams / tokens.length;

  /* ---------- TRIGRAM REPETITION ---------- */

  const trigramFreq = {};
  for (let i = 0; i < tokens.length - 2; i++) {
    if (!STOPWORDS.has(tokens[i])) {
      const trigram =
        tokens[i] + " " + tokens[i + 1] + " " + tokens[i + 2];
      trigramFreq[trigram] = (trigramFreq[trigram] || 0) + 1;
    }
  }

  const repeatedTrigrams = Object.values(trigramFreq).filter(c => c > 1).length;
  const trigramRatio = repeatedTrigrams / tokens.length;

  /* ---------- COMBINED SCORE ---------- */

  const combinedScore =
    wordRatio * 0.4 +
    bigramRatio * 0.35 +
    trigramRatio * 0.25;

  if (combinedScore > 0.03) return "high";
  if (combinedScore > 0.015) return "medium";
  return "low";
}

/* =====================================================
   STRUCTURAL PREDICTABILITY
===================================================== */

export function analyzeStructure(text) {
  const sentences = splitIntoSentences(text);
  if (!sentences.length) return "natural";

  const starters = sentences.map(s =>
    s.trim().split(" ")[0]?.toLowerCase()
  );

  const starterFreq = {};
  starters.forEach(w => {
    if (!w) return;
    starterFreq[w] = (starterFreq[w] || 0) + 1;
  });

  const repeatedStarters = Object.values(starterFreq).filter(v => v > 2).length;
  const ratio = repeatedStarters / starters.length;

  if (ratio > STRUCTURE_THRESHOLDS.patterned) return "patterned";
  if (ratio > STRUCTURE_THRESHOLDS.semi) return "semi-patterned";
  return "natural";
}

/* =====================================================
   HELPERS
===================================================== */

function average(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function varianceOf(arr, mean) {
  return (
    arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
    arr.length
  );
}
