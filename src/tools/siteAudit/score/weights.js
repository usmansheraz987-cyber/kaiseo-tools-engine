// src/tools/siteAudit/score/weights.js

export const ISSUE_SEVERITY = {
  // Critical (index killers)
  non_indexable_status: "critical",
  xrobots_noindex: "critical",
  crawl_timeout_reached: "critical",

  // High (serious but contextual)
  meta_noindex: "high",
  canonical_mismatch: "high",
  insecure_canonical: "high",
  orphan_page: "high",

  // Medium (quality / efficiency)
  duplicate_title: "medium",
  duplicate_meta_description: "medium",
  url_parameter_duplicate: "medium",
  dead_end_page: "medium",
  slow_response_time: "medium",

  // Low (minor)
  deep_page: "low",
  redirected_page: "low",
  mixed_content: "low",
  large_html_size: "low"
};

export const SEVERITY_PENALTY = {
  critical: 20,
  high: 10,
  medium: 5,
  low: 2
};
