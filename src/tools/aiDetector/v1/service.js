import {
  analyzePerplexity,
  analyzeBurstiness,
  analyzeRepetition,
  analyzeStructure,
  analyzeTransitions
} from "./heuristics.js";


import {
  AI_CLASSIFICATION_THRESHOLDS,
  RISK_LEVEL_THRESHOLDS
} from "./constants.js";

import {
  countWords,
  splitIntoSentences
} from "./utils.js";


/* ===============================
   MAIN ENTRY
================================= */

export async function analyzeContent(text) {
  const wordCount = countWords(text);
  const sentences = splitIntoSentences(text);

  const sentenceAnalysis = sentences.map((sentence, index) => {
    return analyzeSentence(sentence, index);
  });
  const paragraphs = splitIntoParagraphs(text);

const paragraphAnalysis = paragraphs.map((para, index) => {
  return analyzeParagraph(para, index);
});


  const aiProbability = aggregateGlobalScore(sentenceAnalysis);
  const classification = classify(aiProbability);
  const riskLevel = determineRisk(aiProbability);
  const confidence = determineConfidence(sentenceAnalysis, wordCount);

return {
  ai_probability: aiProbability,
  classification,
  confidence,
  risk_level: riskLevel,
  sentence_analysis: sentenceAnalysis,
  paragraph_analysis: paragraphAnalysis
};
}

/* ===============================
   PARAGRAPH ENGINE
================================= */

function splitIntoParagraphs(text) {
  return text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean);
}

function analyzeParagraph(paragraph, index) {
  const sentences = splitIntoSentences(paragraph);

  if (!sentences.length) {
    return {
      index,
      text: paragraph,
      ai_probability: 0,
      dominant_signal: null
    };
  }

  const sentenceScores = sentences.map(s =>
    calculateSentenceScore({
      perplexity: analyzePerplexity(s),
      burstiness: analyzeBurstiness(s),
      repetition: analyzeRepetition(s),
      structure: analyzeStructure(s),
      transitions: analyzeTransitions(s)
    })
  );

  const avgScore =
    sentenceScores.reduce((a, b) => a + b, 0) /
    sentenceScores.length;

  const dominantSignal = detectDominantParagraphSignal(paragraph);

  return {
    index,
    text: paragraph,
    ai_probability: Math.round(avgScore),
    dominant_signal: dominantSignal
  };
}

function detectDominantParagraphSignal(paragraph) {
  const signals = {
    repetition: analyzeRepetition(paragraph),
    transitions: analyzeTransitions(paragraph),
    structure: analyzeStructure(paragraph)
  };

  if (signals.transitions === "high") return "transitions";
  if (signals.repetition === "high") return "repetition";
  if (signals.structure === "patterned") return "structure";

  return null;
}

/* ===============================
   SENTENCE ENGINE
================================= */

function analyzeSentence(sentence, index) {
 const signals = {
  perplexity: analyzePerplexity(sentence),
  burstiness: analyzeBurstiness(sentence),
  repetition: analyzeRepetition(sentence),
  structure: analyzeStructure(sentence),
  transitions: analyzeTransitions(sentence)
};

  const score = calculateSentenceScore(signals);

  const flags = buildSentenceFlags(signals);

  return {
    index,
    text: sentence,
    ai_probability: score,
    signals,
    flags
  };
}

function calculateSentenceScore(signals) {
  let score = 0;

  if (signals.perplexity === "high") score += 30;
  else if (signals.perplexity === "medium") score += 15;

  if (signals.burstiness === "high") score += 25;
  else if (signals.burstiness === "medium") score += 12;

  if (signals.repetition === "high") score += 25;
  else if (signals.repetition === "medium") score += 12;

  if (signals.structure === "patterned") score += 20;
  else if (signals.structure === "semi-patterned") score += 10;

  // ✅ ADD THIS BLOCK HERE
  if (signals.transitions === "high") score += 20;
  else if (signals.transitions === "medium") score += 10;

  return Math.min(score, 100);
}


function buildSentenceFlags(signals) {
  const flags = [];

  if (signals.perplexity !== "low")
    flags.push("Uniform sentence length pattern");

  if (signals.burstiness !== "low")
    flags.push("Low rhythm variation");

  if (signals.repetition !== "low")
    flags.push("Repetitive word usage");

  if (signals.structure !== "natural")
    flags.push("Predictable sentence opening");

  // ✅ ADD THIS BLOCK HERE
  if (signals.transitions !== "low")
    flags.push("Overused AI-style transition phrases");

  return flags;
}


/* ===============================
   GLOBAL AGGREGATION
================================= */

function aggregateGlobalScore(sentenceResults) {
  if (!sentenceResults.length) return 0;

  const total = sentenceResults.reduce(
    (sum, s) => sum + s.ai_probability,
    0
  );

  return Math.round(total / sentenceResults.length);
}

/* ===============================
   CLASSIFICATION
================================= */

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

function determineConfidence(sentenceResults, wordCount) {
  if (wordCount < 120) return "low";

  const highRiskSentences = sentenceResults.filter(
    s => s.ai_probability > 70
  ).length;

  if (highRiskSentences >= 3) return "high";
  if (highRiskSentences >= 1) return "medium";

  return "low";
}
