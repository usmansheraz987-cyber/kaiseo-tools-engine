// src/tools/siteAudit/analyze/performance.js

export function analyzePerformance(page) {
  const issues = [];

  const { responseTime, size, redirected } = page;

  // Slow response (server-side)
  if (responseTime > 2000) {
    issues.push("slow_response_time");
  }

  if (responseTime > 4000) {
    issues.push("very_slow_response_time");
  }

  // Large HTML payload
  if (size > 1024 * 1024) {
    issues.push("large_html_size");
  }

  if (size > 2 * 1024 * 1024) {
    issues.push("very_large_html_size");
  }

  // Redirect performance waste
  if (redirected && responseTime > 3000) {
    issues.push("slow_redirected_page");
  }

  return issues;
}
