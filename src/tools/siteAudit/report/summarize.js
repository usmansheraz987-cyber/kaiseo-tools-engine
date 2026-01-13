export function buildReport({ baseUrl, pages, issues, meta }) {
  return {
    summary: {
      baseUrl,
      totalPages: pages.length,
      criticalIssues: issues.filter(i => i.severity === "critical").length,
      importantIssues: issues.filter(i => i.severity === "important").length
    },
    issues: {
      critical: issues.filter(i => i.severity === "critical"),
      important: issues.filter(i => i.severity === "important"),
      low: issues.filter(i => i.severity === "low")
    },
    pages: pages.map(p => ({
      url: p.url,
      status: p.status
    })),
    meta
  };
}
