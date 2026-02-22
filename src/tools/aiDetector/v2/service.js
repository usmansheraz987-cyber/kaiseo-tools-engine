/**
 * FINAL V2 SERVICE ORCHESTRATOR
 * Fully integrated AI Pattern Optimization Engine.
 */

import {
  splitIntoSentences,
  tokenize,
  countWords
} from "../../v1/utils.js";

import { analyzeStyle } from "./signals/style.js";
import { analyzeStructure } from "./signals/structure.js";
import { analyzeRepetition } from "./signals/repetition.js";
import { analyzeRhythm } from "./signals/rhythm.js";

import { computeFinalScore } from "./scoring.js";
import { generateRewritePlan } from "./rewriteEngine.js";
import { formatResponse } from "./schema.js";

/* ================= MAIN ENTRY ================= */

export async function analyzeContentV2(text) {
  const wordCount = countWords(text);
  const sentences = splitIntoSentences(text);
  const paragraphs = splitParagraphs(text);

  /* ---------- Sentence Layer Scoring ---------- */
  const sentenceLayerScores = analyzeSentenceLayer(sentences);

  /* ---------- Paragraph Layer Scoring ---------- */
  const paragraphLayerScores = analyzeParagraphLayer(paragraphs);

  /* ---------- Advanced Signals ---------- */
  const styleSignals = analyzeStyle(text);
  const structureSignals = analyzeStructure(text);
  const repetitionSignals = analyzeRepetition(text);
  const rhythmSignals = analyzeRhythm(text);

  /* ---------- Final Scoring ---------- */
  const scoringResult = computeFinalScore({
    sentenceSignals: sentenceLayerScores,
    paragraphSignals: paragraphLayerScores,
    styleSignals,
    structureSignals,
    repetitionSignals,
    rhythmSignals
  });

  /* ---------- Rewrite Engine ---------- */
  const rewritePlan = generateRewritePlan({
    styleSignals,
    sentenceSignals: sentenceLayerScores,
    paragraphSignals: paragraphLayerScores
  });

  /* ---------- Final Output ---------- */
  return formatResponse({
    ...scoringResult,

    sentence_analysis: sentenceLayerScores,
    paragraph_analysis: paragraphLayerScores,

    style_analysis: styleSignals,
    structure_analysis: structureSignals,
    repetition_analysis: repetitionSignals,
    rhythm_analysis: rhythmSignals,

    rewrite_suggestions: rewritePlan.rewrite_suggestions,
    impact_estimate: rewritePlan.impact_estimate,

    meta: {
      word_count: wordCount,
      sentence_count: sentences.length,
      paragraph_count: paragraphs.length
    }
  });
}

/* ================= SENTENCE LAYER ================= */

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

/* ================= PARAGRAPH LAYER ================= */

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

/* ================= HELPERS ================= */

function splitParagraphs(text) {
  return text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean);
}