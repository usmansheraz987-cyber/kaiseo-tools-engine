import cheerio from "cheerio";

export function checkIndexability(page) {
  const issues = [];

  if (page.status >= 400) {
    issues.push({
      code: "HTTP_ERROR",
      page: page.url,
      severity: "critical",
      message: `Page returns HTTP ${page.status}`,
      why: "Search engines cannot index error pages",
      fix: "Fix server response or redirect"
    });
  }

  if (!page.html) return issues;

  const $ = cheerio.load(page.html);

  const robots = $('meta[name="robots"]').attr("content") || "";
  if (robots.includes("noindex")) {
    issues.push({
      code: "NOINDEX",
      page: page.url,
      severity: "critical",
      message: "Page is marked noindex",
      why: "Search engines are instructed not to index this page",
      fix: "Remove noindex if this page should rank"
    });
  }

  const canonical = $('link[rel="canonical"]').attr("href");
  if (!canonical) {
    issues.push({
      code: "MISSING_CANONICAL",
      page: page.url,
      severity: "important",
      message: "Canonical tag missing",
      why: "Canonicals prevent duplicate indexing",
      fix: "Add a canonical URL"
    });
  }

  return issues;
}
