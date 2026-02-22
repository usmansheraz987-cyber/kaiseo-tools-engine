/**
 * V2 ADVANCED SCORING ENGINE
 * Multi-layer weighted + non-linear scaling.
 */

export function computeFinalScore({
  sentenceSignals = [],
  paragraphSignals = [],
  styleSignals = {},
  structureSignals = {},
  repetitionSignals = {},
  rhythmSignals = {}
}) {
  const sentenceScore = average(sentenceSignals);
  const paragraphScore = average(paragraphSignals);
  const styleScore = computeStyleScore(styleSignals);
  const structureScore = computeStructureScore(structureSignals);
  const repetitionScore = computeRepetitionScore(repetitionSignals);
  const rhythmScore = computeRhythmScore(rhythmSignals);

  const rawScore =
    (sentenceScore * 0.30) +
    (paragraphScore * 0.15) +
    (styleScore * 0.20) +
    (structureScore * 0.15) +
    (repetitionScore * 0.10) +
    (rhythmScore * 0.10);

  const scaledScore = applyNonLinearScaling(rawScore);

  return {
    ai_probability: scaledScore,
    classification: classifyScore(scaledScore),
    risk_level: determineRiskLevel(scaledScore),
    confidence: computeConfidence([
      sentenceScore,
      paragraphScore,
      styleScore,
      structureScore,
      repetitionScore,
      rhythmScore
    ]),
    signal_breakdown: {
      sentence: round(sentenceScore),
      paragraph: round(paragraphScore),
      style: round(styleScore),
      structure: round(structureScore),
      repetition: round(repetitionScore),
      rhythm: round(rhythmScore)
    }
  };
}

/* ---------------- STYLE ---------------- */

function computeStyleScore(style) {
  let score = 0;

  if (style.passive_voice?.density > 0.25) score += 15;
  if (style.contraction_density?.density < 0.002) score += 10;
  if (style.lexical_diversity < 0.45) score += 20;
  if (style.word_length_variance < 2) score += 10;
  if (style.clause_complexity?.complexity_per_sentence > 2.5)
    score += 10;

  return clamp(score, 0, 100);
}

/* ---------------- STRUCTURE ---------------- */

function computeStructureScore(structure) {
  let score = 0;

  if (structure.paragraph_length_variance < 50) score += 10;
  if (structure.opening_phrase_pattern?.repetition_rate > 0.4)
    score += 15;
  if (structure.sentence_position_pattern?.pattern_score < 0.5)
    score += 10;

  return clamp(score, 0, 100);
}

/* ---------------- REPETITION ---------------- */

function computeRepetitionScore(rep) {
  let score = 0;

  if (rep.repetition_density > 0.02) score += 15;
  if (rep.list_pattern_score > 3) score += 10;

  return clamp(score, 0, 100);
}

/* ---------------- RHYTHM ---------------- */

function computeRhythmScore(rhythm) {
  let score = 0;

  if (rhythm.uniformity_score === 1) score += 20;
  if (rhythm.std_deviation < 3) score += 10;

  return clamp(score, 0, 100);
}

/* ---------------- NON-LINEAR SCALING ---------------- */

function applyNonLinearScaling(score) {
  const normalized = score / 100;
  const curved = normalized * normalized;
  return round(clamp(curved * 100, 0, 100));
}

/* ---------------- CONFIDENCE ---------------- */

function computeConfidence(layerScores) {
  const max = Math.max(...layerScores);
  const min = Math.min(...layerScores);
  const variance = max - min;

  if (variance < 15) return "high";
  if (variance < 35) return "medium";
  return "low";
}

/* ---------------- CLASSIFICATION ---------------- */

function classifyScore(score) {
  if (score < 35) return "Likely Human";
  if (score < 65) return "Mixed";
  return "Likely AI";
}

function determineRiskLevel(score) {
  if (score < 30) return "low";
  if (score < 60) return "medium";
  return "high";
}

/* ---------------- HELPERS ---------------- */

function average(arr) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

function round(num) {
  return Math.round(num * 100) / 100;
}