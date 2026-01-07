import {
  analyzePerplexity,
  analyzeBurstiness,
  analyzeRepetition,
  analyzeStructure
} from "./heuristics.js";

import {
  AI_CLASSIFICATION_THRESHOLDS,
  RISK_LEVEL_THRESHOLDS
} from "./constants.js";

import { countWords } from "./utils.js";

export async function analyzeContent(text) {
  const wordCount = countWords(text);

  const signals = {
    perplexity: analyzePerplexity(text),
    burstiness: analyzeBurstiness(text),
    repetition: analyzeRepetition(text),
    structure: analyzeStructure(text)
  };

  const aiProbability = calculateAIProbability(signals);
  const classification = classify(aiProbability);
  const riskLevel = determineRisk(aiProbability);
  const confidence = determineConfidence(signals, wordCount);
  const explanation = buildExplanation(signals, wordCount);

  return {
    ai_probability: aiProbability,
    classification,
    confidence,
    risk_level: riskLevel,
    signals,
    explanation
  };
}

/* ---------- CORE LOGIC ---------- */

function calculateAIProbability(signals) {
  let score = 0;

  if (signals.perplexity === "high") score += 30;
  else if (signals.perplexity === "medium") score += 15;

  if (signals.burstiness === "high") score += 25;
  else if (signals.burstiness === "medium") score += 12;

  if (signals.repetition === "high") score += 25;
  else if (signals.repetition === "medium") score += 12;

  if (signals.structure === "patterned") score += 20;
  else if (signals.structure === "semi-patterned") score += 10;

  return Math.min(score, 100);
}

function classify(score) {
  if (score < AI_CLASSIFICATION_THRESHOLDS.likelyHuman) return "Likely Human";
  if (score < AI_CLASSIFICATION_THRESHOLDS.mixed) return "Mixed";
  return "Likely AI";
}

function determineRisk(score) {
  if (score < RISK_LEVEL_THRESHOLDS.low) return "low";
  if (score < RISK_LEVEL_THRESHOLDS.medium) return "medium";
  return "high";
}

/* ---------- CONFIDENCE (LENGTH-AWARE) ---------- */

function determineConfidence(signals, wordCount) {
  let baseConfidence = "low";

  const strongSignals = Object.values(signals).filter(
    v => v === "high" || v === "patterned"
  ).length;

  if (strongSignals >= 3) baseConfidence = "high";
  else if (strongSignals === 2) baseConfidence = "medium";

  // HARD CAPS BY LENGTH
  if (wordCount < 120) return "low";

  if (wordCount < 400 && baseConfidence === "high") {
    return "medium";
  }

  return baseConfidence;
}

/* ---------- EXPLANATION ---------- */

function buildExplanation(signals, wordCount) {
  const explanations = [];

  if (signals.perplexity !== "low") {
    explanations.push(
      "Sentence length and phrasing show unusually consistent patterns."
    );
  }

  if (signals.burstiness !== "low") {
    explanations.push(
      "Sentence rhythm lacks the natural variation typical of human writing."
    );
  }

  if (signals.repetition !== "low") {
    explanations.push(
      "Repeated word usage appears higher than expected in human text."
    );
  }

  if (signals.structure !== "natural") {
    explanations.push(
      "Sentence openings follow predictable structural patterns."
    );
  }

  if (wordCount < 400) {
    explanations.push(
      "Short text samples reduce detection reliability. Longer content improves accuracy."
    );
  }

  if (!explanations.length) {
    explanations.push(
      "No strong AI writing patterns were detected in this text."
    );
  }

  return explanations;
}
