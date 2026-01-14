// src/tools/siteAudit/aggregate/siteSummary.js

export function buildSummary(pages) {
  const total = pages.length;

  const statusCounts = {
    success: 0,
    redirects: 0,
    errors: 0
  };

  pages.forEach(p => {
    if (p.status >= 200 && p.status < 300) statusCounts.success++;
    else if (p.status >= 300 && p.status < 400) statusCounts.redirects++;
    else if (p.status >= 400) statusCounts.errors++;
  });

  return {
    totalPages: total,
    status: statusCounts
  };
}
