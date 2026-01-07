// src/tools/aiDetector/v1/constants.js

/**
 * Perplexity proxy thresholds
 * Based on sentence-length variance
 * Lower variance = more AI-like
 */
export const PERPLEXITY_THRESHOLDS = {
  low: 15,     // extremely uniform → high AI risk
  medium: 35   // somewhat uniform → medium AI risk
};

/**
 * Burstiness thresholds
 * Based on standard deviation of sentence lengths
 */
export const BURSTINESS_THRESHOLDS = {
  low: 4,      // very flat rhythm → AI-like
  medium: 8    // moderate variation
};

/**
 * Repetition thresholds
 * Ratio of over-repeated tokens
 */
export const REPETITION_THRESHOLDS = {
  high: 0.035,   // heavy repetition → AI
  medium: 0.02   // noticeable repetition
};

/**
 * Structural predictability thresholds
 * Sentence starter repetition ratio
 */
export const STRUCTURE_THRESHOLDS = {
  patterned: 0.12,       // same starters again and again
  semi: 0.06             // mild predictability
};

/**
 * Final AI probability boundaries
 * Used in service.js
 */
export const AI_CLASSIFICATION_THRESHOLDS = {
  likelyHuman: 35,
  mixed: 65
};

/**
 * Risk levels (SEO / publishing context)
 */
export const RISK_LEVEL_THRESHOLDS = {
  low: 30,
  medium: 60
};
