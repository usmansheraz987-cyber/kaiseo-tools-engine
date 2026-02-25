/**
 * FINAL V2 SERVICE ORCHESTRATOR
 * Fully integrated AI Pattern Optimization Engine.
 */

import {
  splitIntoSentences,
  tokenize,
  countWords
} from "../v1/utils.js";

import { analyzeStyle } from "./signals/style.js";
import { analyzeStructure } from "./signals/structure.js";
import { analyzeRepetition } from "./signals/repetition.js";
import { analyzeRhythm } from "./signals/rhythm.js";

import { computeFinalScore } from "./scoring.js";
import { generateRewritePlan } from "./rewriteEngine.js";
import { formatResponse } from "./schema.js";

export async function analyzeContentV2(
  text,
  previousAiProbability = null
) {
  const wordCount = countWords(text);
  const sentences = splitIntoSentences(text);
  const paragraphs = splitParagraphs(text);

  const sentenceLayerScores = analyzeSentenceLayer(sentences);
  const paragraphLayerScores = analyzeParagraphLayer(paragraphs);

  const styleSignals = analyzeStyle(text);
  const structureSignals = analyzeStructure(text);
  const repetitionSignals = analyzeRepetition(text);
  const rhythmSignals = analyzeRhythm(text);

  const scoringResult = computeFinalScore({
    sentenceSignals: sentenceLayerScores,
    paragraphSignals: paragraphLayerScores,
    styleSignals,
    structureSignals,
    repetitionSignals,
    rhythmSignals
  });

  const rewritePlan = generateRewritePlan({
    styleSignals,
    structureSignals,
    repetitionSignals,
    rhythmSignals,
    sentenceSignals: sentenceLayerScores,
    paragraphSignals: paragraphLayerScores
  });

  /* ---------- Improvement Simulation ---------- */

  let projectedAI = scoringResult.ai_probability;

  if (
    rewritePlan.impact_estimate &&
    Object.keys(rewritePlan.impact_estimate).length > 0
  ) {
    const totalImpact = Object.values(rewritePlan.impact_estimate)
      .reduce((sum, value) => sum + value, 0);

    projectedAI = scoringResult.ai_probability + totalImpact;
  }

  projectedAI = Math.max(0, Math.min(100, projectedAI));

  const projectedHumanization = 100 - projectedAI;

  const improvementSimulation = {
    projected_ai_probability: projectedAI,
    projected_humanization_score: projectedHumanization
  };

  /* ---------- Delta Calculation ---------- */

  let delta = null;

  if (typeof previousAiProbability === "number") {
    const aiChange = Math.round(
  (scoringResult.ai_probability - previousAiProbability) * 100
) / 100;

    const humanizationChange =
      (100 - scoringResult.ai_probability) -
      (100 - previousAiProbability);

    delta = {
      ai_change: aiChange,
      humanization_change: humanizationChange
    };
  }

  const responsePayload = {
    ...scoringResult,

    sentence_analysis: sentenceLayerScores,
    paragraph_analysis: paragraphLayerScores,

    style_analysis: styleSignals,
    structure_analysis: structureSignals,
    repetition_analysis: repetitionSignals,
    rhythm_analysis: rhythmSignals,

    rewrite_suggestions: rewritePlan.rewrite_suggestions,
    impact_estimate: rewritePlan.impact_estimate,

    improvement_simulation: improvementSimulation,

    meta: {
      word_count: wordCount,
      sentence_count: sentences.length,
      paragraph_count: paragraphs.length
    }
  };

  if (delta) {
    responsePayload.delta = delta;
  }

  return formatResponse(responsePayload);
}

/* --- Helpers below unchanged --- */

function analyzeSentenceLayer(sentences) {
  if (!sentences.length) return [];

  return sentences.map(sentence => {
    const length = sentence.split(" ").length;
    let score = 0;

    if (length > 30) score += 15;
    if (length < 6) score += 10;

    return score;
  });
}

function analyzeParagraphLayer(paragraphs) {
  if (!paragraphs.length) return [];

  return paragraphs.map(para => {
    const sentenceCount = splitIntoSentences(para).length;
    let score = 0;

    if (sentenceCount > 6) score += 15;
    if (sentenceCount < 2) score += 10;

    return score;
  });
}

function splitParagraphs(text) {
  return text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean);
}