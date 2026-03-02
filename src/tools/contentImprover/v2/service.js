import { SEVERITY } from "./constants.js";
import { runDetectors } from "./detectors.js";
import { calculateMetrics } from "./metrics.js";
import { calculateScores, calculateProjection } from "./scoring.js";

export function analyzeContent({ content, keyword }) {
  const sentenceIssues = runDetectors(content, keyword);

  const metrics = calculateMetrics(content, keyword);

  const { content_score, subscores } =
    calculateScores({
      sentenceIssues,
      metrics,
      keyword
    });

  const impact_projection =
    calculateProjection(content_score, sentenceIssues);

  return {
    content_score,
    subscores,
    summary: {
      total_issues: sentenceIssues.length,
      highest_severity:
        sentenceIssues[0]?.severity || SEVERITY.LOW
    },
    issues: mapHighLevelIssues(sentenceIssues),
    sentence_issues: sentenceIssues,
    metrics,
    impact_projection,
    meta: {
      version: "v2",
      scoring_model: "deterministic-weighted-subtraction"
    }
  };
}

function mapHighLevelIssues(sentenceIssues) {
  const types = [...new Set(
    sentenceIssues.map(i => i.issue_type)
  )];

  return types.map(type => ({
    type,
    occurrences: sentenceIssues.filter(
      i => i.issue_type === type
    ).length
  }));
}