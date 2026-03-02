import { LIMITS } from "./constants.js";

export function calculateScores({ sentenceIssues, metrics, keyword }) {
  let score = 100;

  sentenceIssues.forEach(issue => {
    score -= issue.impact_score;
  });

  score = clamp(score);

  const readability_score = clamp(
    100 - metrics.long_sentence_percentage * 0.8
  );

  const structure_score = clamp(
    100 - metrics.paragraph_variance * 0.1
  );

  const repetition_score = clamp(
    100 - metrics.repetition_rate * 100
  );

  const keyword_score = keyword
    ? clamp(
        100 -
          Math.max(
            0,
            metrics.keyword_density - LIMITS.MAX_KEYWORD_DENSITY
          ) *
            10
      )
    : 100;

  return {
    content_score: Math.round(score),
    subscores: {
      readability_score: Math.round(readability_score),
      structure_score: Math.round(structure_score),
      repetition_score: Math.round(repetition_score),
      keyword_score: Math.round(keyword_score)
    }
  };
}

export function calculateProjection(contentScore, sentenceIssues) {
  const totalImpact = sentenceIssues.reduce(
    (sum, issue) => sum + issue.impact_score,
    0
  );

  const projected = Math.min(100, contentScore + totalImpact);

  return {
    potential_gain: totalImpact,
    projected_score: projected
  };
}

function clamp(value) {
  if (value < 0) return 0;
  if (value > 100) return 100;
  return value;
}