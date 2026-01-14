// src/tools/siteAudit/analyze/redirects.js

export function analyzeRedirects(page) {
  const issues = [];

  if (page.redirected) {
    issues.push("redirected_page");
  }

  if (page.redirectCount > 1) {
    issues.push("redirect_chain");
  }

  if (page.status >= 300 && page.status < 400) {
    issues.push("internal_redirect");
  }

  return issues;
}
