/**
 * V2 REWRITE ENGINE
 * Generates improvement suggestions + impact estimation.
 */

export function generateRewritePlan({
  styleSignals = {},
  sentenceSignals = [],
  paragraphSignals = []
}) {
  const suggestions = [];
  const impactEstimate = {};

  /* ---------------- PASSIVE VOICE ---------------- */

  if (styleSignals.passive_voice?.density > 0.2) {
    suggestions.push({
      issue: "High passive voice usage",
      suggestion:
        "Rewrite sentences in active voice. Move the subject before the verb and remove unnecessary auxiliary forms.",
      scope: "global"
    });

    impactEstimate.passive_voice = -12;
  }

  /* ---------------- LOW CONTRACTION DENSITY ---------------- */

  if (styleSignals.contraction_density?.density < 0.002) {
    suggestions.push({
      issue: "Overly formal tone",
      suggestion:
        "Introduce natural contractions where appropriate to create a more human conversational flow.",
      scope: "global"
    });

    impactEstimate.contraction_density = -8;
  }

  /* ---------------- LOW LEXICAL DIVERSITY ---------------- */

  if (styleSignals.lexical_diversity < 0.5) {
    suggestions.push({
      issue: "Low lexical diversity",
      suggestion:
        "Replace repeated vocabulary with synonyms and vary descriptive language to improve natural variation.",
      scope: "global"
    });

    impactEstimate.lexical_diversity = -18;
  }

  /* ---------------- UNIFORM WORD LENGTH ---------------- */

  if (styleSignals.word_length_variance < 2) {
    suggestions.push({
      issue: "Monotonous word structure",
      suggestion:
        "Mix short and longer words intentionally to create more natural rhythm.",
      scope: "global"
    });

    impactEstimate.word_length_variance = -7;
  }

  /* ---------------- HIGH CLAUSE COMPLEXITY ---------------- */

  if (
    styleSignals.clause_complexity?.complexity_per_sentence > 2.5
  ) {
    suggestions.push({
      issue: "Overly complex sentence structure",
      suggestion:
        "Break long compound sentences into shorter, clearer statements.",
      scope: "global"
    });

    impactEstimate.clause_complexity = -10;
  }

  /* ---------------- SENTENCE LAYER PATTERN ---------------- */

  const highSentenceScores = sentenceSignals.filter(s => s > 15).length;

  if (highSentenceScores > sentenceSignals.length * 0.4) {
    suggestions.push({
      issue: "Inconsistent sentence length rhythm",
      suggestion:
        "Vary sentence lengths intentionally. Combine short sentences and expand others for natural pacing.",
      scope: "sentence_layer"
    });

    impactEstimate.sentence_rhythm = -9;
  }

  /* ---------------- PARAGRAPH DENSITY ---------------- */

  const denseParagraphs = paragraphSignals.filter(p => p > 15).length;

  if (denseParagraphs > 0) {
    suggestions.push({
      issue: "Dense paragraph structure",
      suggestion:
        "Break long paragraphs into smaller units with clearer transitions and varied flow.",
      scope: "paragraph_layer"
    });

    impactEstimate.paragraph_density = -11;
  }

  return {
    rewrite_suggestions: suggestions,
    impact_estimate: impactEstimate
  };
}