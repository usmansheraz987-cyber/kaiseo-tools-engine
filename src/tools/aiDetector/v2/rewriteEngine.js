/**
 * V2 REWRITE ENGINE (UPGRADED)
 * Generates intelligent rewrite suggestions + impact estimation
 */

export function generateRewritePlan({
  styleSignals = {},
  structureSignals = {},
  repetitionSignals = {},
  rhythmSignals = {},
  sentenceSignals = [],
  paragraphSignals = []
}) {
  const suggestions = [];
  const impactEstimate = {};

  /* ================= STYLE CHECKS ================= */

  if (styleSignals.passive_voice?.density > 0.2) {
    suggestions.push({
      issue: "High passive voice usage",
      suggestion:
        "Rewrite sentences in active voice. Move the subject before the verb and reduce auxiliary constructions.",
      scope: "global"
    });
    impactEstimate.passive_voice = -12;
  }

  if (styleSignals.contraction_density?.density < 0.002) {
    suggestions.push({
      issue: "Overly formal tone",
      suggestion:
        "Introduce natural contractions where appropriate to create more human conversational flow.",
      scope: "global"
    });
    impactEstimate.contraction_density = -8;
  }

  if (styleSignals.lexical_diversity < 0.5) {
    suggestions.push({
      issue: "Low lexical diversity",
      suggestion:
        "Replace repeated vocabulary with synonyms and vary descriptive phrasing to reduce predictability.",
      scope: "global"
    });
    impactEstimate.lexical_diversity = -18;
  }

  if (styleSignals.word_length_variance < 2) {
    suggestions.push({
      issue: "Monotonous word structure",
      suggestion:
        "Mix short and longer words intentionally to create more natural rhythm variation.",
      scope: "global"
    });
    impactEstimate.word_length_variance = -7;
  }

  /* ================= STRUCTURE CHECKS ================= */

  if (structureSignals?.opening_phrase_pattern?.repetition_rate > 0.25) {
    suggestions.push({
      issue: "Repeated formulaic sentence openings",
      suggestion:
        "Avoid starting multiple sentences with transition-heavy phrases like 'In conclusion' or 'Furthermore'. Vary openings naturally.",
      scope: "structure"
    });
    impactEstimate.structure_pattern = -12;
  }

  if (structureSignals?.paragraph_length_variance < 30) {
    suggestions.push({
      issue: "Uniform paragraph structure",
      suggestion:
        "Vary paragraph lengths. Combine shorter and longer paragraphs to create more organic flow.",
      scope: "structure"
    });
    impactEstimate.paragraph_variation = -9;
  }

  /* ================= REPETITION CHECKS ================= */

  if (repetitionSignals?.repetition_density > 0.02) {
    suggestions.push({
      issue: "Repeated vocabulary clusters",
      suggestion:
        "Reduce overused words and rephrase repetitive expressions to avoid predictable patterns.",
      scope: "repetition"
    });
    impactEstimate.repetition = -15;
  }

  if (repetitionSignals?.list_pattern_score > 2) {
    suggestions.push({
      issue: "Predictable list patterning",
      suggestion:
        "Avoid rigid list-like transitions (first, second, finally). Rewrite more fluidly.",
      scope: "repetition"
    });
    impactEstimate.list_pattern = -8;
  }

  /* ================= RHYTHM CHECKS ================= */

  if (rhythmSignals?.uniformity_score === 1) {
    suggestions.push({
      issue: "Mechanical sentence rhythm",
      suggestion:
        "Vary sentence length intentionally. Combine short punchy lines with longer descriptive ones.",
      scope: "rhythm"
    });
    impactEstimate.rhythm_uniformity = -10;
  }

  if (rhythmSignals?.std_deviation < 3) {
    suggestions.push({
      issue: "Low sentence length variation",
      suggestion:
        "Adjust pacing by alternating between concise and expanded sentences.",
      scope: "rhythm"
    });
    impactEstimate.rhythm_variation = -7;
  }

  /* ================= SENTENCE LAYER CHECK ================= */

  const highSentenceCount =
    sentenceSignals.filter(score => score > 15).length;

  if (highSentenceCount > sentenceSignals.length * 0.4) {
    suggestions.push({
      issue: "Inconsistent sentence distribution",
      suggestion:
        "Break overly long sentences and expand overly short ones for smoother readability.",
      scope: "sentence_layer"
    });
    impactEstimate.sentence_balance = -9;
  }

  return {
    rewrite_suggestions: suggestions,
    impact_estimate: impactEstimate
  };
}