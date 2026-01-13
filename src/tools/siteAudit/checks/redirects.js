export function checkRedirects(page) {
  const issues = [];

  if (page.status >= 300 && page.status < 400) {
    const location = page.headers?.location;

    if (!location) {
      issues.push({
        code: "REDIRECT_WITHOUT_LOCATION",
        page: page.url,
        severity: "critical",
        message: "Redirect without Location header",
        why: "Broken redirects block crawling",
        fix: "Fix redirect configuration"
      });
    }
  }

  return issues;
}
