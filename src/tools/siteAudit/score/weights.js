// src/tools/siteAudit/score/weights.js

export const ISSUE_SEVERITY = {
  // Critical
  non_indexable_status: "critical",
  meta_noindex: "critical",
  xrobots_noindex: "critical",
  blocked_or_failed_page: "critical",

  // High
  canonical_mismatch: "high",
  insecure_canonical: "high",
  redirect_chain: "high",
  orphan_page: "high",

  // Medium
  duplicate_title: "medium",
  duplicate_meta_description: "medium",
  url_parameter_duplicate: "medium",
  dead_end_page: "medium",
  slow_response_time: "medium",

  // Low
  deep_page: "low",
  redirected_page: "low",
  mixed_content: "low",
  large_html_size: "low"
};

export const SEVERITY_PENALTY = {
  critical: 15,
  high: 8,
  medium: 4,
  low: 1
};
