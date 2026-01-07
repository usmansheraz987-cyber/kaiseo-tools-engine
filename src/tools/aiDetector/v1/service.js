// src/tools/aiDetector/v1/service.js



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
  const signals = {
    perplexity: analyzePerplexity(text),
    burstiness: analyzeBurstiness(text),
    repetition: analyzeRepetition(text),
    structure: analyzeStructure(text)
  };

  const aiProbability = calculateAIProbability(signals);
  const classification = classify(aiProbability);
  const riskLevel = determineRisk(aiProbability);
  const confidence = determineConfidence(signals, text);
  const explanation = buildExplanation(signals);

  return {
    ai_probability: aiProbability,
    classification,
    confidence,
    risk_level: riskLevel,
    signals,
    explanation
  };
}

/* ---------- core logic ---------- */

function calculateAIProbability(signals) {
  let score = 0;

  if (signals.perplexity === "high") score += 30;
  if (signals.perplexity === "medium") score += 15;

  if (signals.burstiness === "high") score += 25;
  if (signals.burstiness === "medium") score += 12;

  if (signals.repetition === "high") score += 25;
  if (signals.repetition === "medium") score += 12;

  if (signals.structure === "patterned") score += 20;
  if (signals.structure === "semi-patterned") score += 10;

  return Math.min(score, 100);
}

function classify(score) {
  if (score < AI_CLASSIFICATION_THRESHOLDS.likelyHuman)
    return "Likely Human";

  if (score < AI_CLASSIFICATION_THRESHOLDS.mixed)
    return "Mixed";

  return "Likely AI";
}

function determineRisk(score) {
  if (score < RISK_LEVEL_THRESHOLDS.low) return "low";
  if (score < RISK_LEVEL_THRESHOLDS.medium) return "medium";
  return "high";
}

function determineConfidence(signals, text) {
  const wordCount = countWords(text);

  let baseConfidence = "low";

  const strongSignals = Object.values(signals).filter(
    v => v === "high" || v === "patterned"
  ).length;

  if (strongSignals >= 3) baseConfidence = "high";
  else if (strongSignals === 2) baseConfidence = "medium";

  // Length-aware confidence dampening
  if (wordCount < 400) return "low";

  if (wordCount < 700 && baseConfidence === "high") {
    return "medium";
  }

  return baseConfidence;
}


function buildExplanation(signals) {
  const explanations = [];

  if (signals.perplexity !== "low") {
    explanations.push(
      "Sentence length and phrasing show unusually consistent patterns"
    );
  }

  if (signals.burstiness !== "low") {
    explanations.push(
      "Sentence rhythm lacks natural variation typical of human writing"
    );
  }

  if (signals.repetition !== "low") {
    explanations.push(
      "Repeated word usage appears higher than expected in human text"
    );
  }

  if (signals.structure !== "natural") {
    explanations.push(
      "Sentence openings follow predictable structural patterns"
    );
  }

  if (!explanations.length) {
    explanations.push(
      "No strong AI writing patterns detected in this text"
    );
  }

  return explanations;
}
