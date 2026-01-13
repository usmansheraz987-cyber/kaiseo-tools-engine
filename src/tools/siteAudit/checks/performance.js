export function checkPerformance(page) {
  const issues = [];

  const size = page.html ? page.html.length : 0;
  if (size > 1_000_000) {
    issues.push({
      code: "LARGE_PAGE_SIZE",
      page: page.url,
      severity: "low",
      message: "Page size is very large",
      why: "Large pages load slower",
      fix: "Reduce HTML size"
    });
  }

  return issues;
}
