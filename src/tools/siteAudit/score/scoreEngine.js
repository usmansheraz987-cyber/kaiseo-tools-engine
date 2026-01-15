// src/tools/siteAudit/score/scoreEngine.js

import { ISSUE_SEVERITY, SEVERITY_PENALTY } from "./weights.js";

const CATEGORY_MAP = {
  crawlability: [
    "non_indexable_status",
    "blocked_or_failed_page",
    "redirect_chain"
  ],
  indexability: [
    "meta_noindex",
    "xrobots_noindex",
    "canonical_mismatch",
    "insecure_canonical"
  ],
  architecture: [
    "orphan_page",
    "dead_end_page",
    "deep_page"
  ],
  duplication: [
    "duplicate_title",
    "duplicate_meta_description",
    "url_parameter_duplicate"
  ],
  performance: [
    "slow_response_time",
    "large_html_size"
  ],
  security: [
    "mixed_content",
    "not_https"
  ]
};

export function calculateScore(groupedIssues) {
  const categoryScores = {};
  let siteScore = 100;

  Object.entries(CATEGORY_MAP).forEach(([category, issueKeys]) => {
    let score = 100;

    issueKeys.forEach(issueKey => {
      const severity = ISSUE_SEVERITY[issueKey];
      if (!severity) return;

      const count = groupedIssues[severity]?.[issueKey] || 0;
      score -= count * SEVERITY_PENALTY[severity];
    });

    score = Math.max(score, 0);
    categoryScores[category] = score;
    siteScore = Math.min(siteScore, score);
  });

  return {
    siteScore,
    categoryScores
  };
}
