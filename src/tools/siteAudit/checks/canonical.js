import cheerio from "cheerio";

export function checkCanonicalConflicts(page) {
  const issues = [];
  if (!page.html) return issues;

  const $ = cheerio.load(page.html);
  const canonicals = $('link[rel="canonical"]');

  if (canonicals.length > 1) {
    issues.push({
      code: "MULTIPLE_CANONICAL",
      page: page.url,
      severity: "critical",
      message: "Multiple canonical tags found",
      why: "Conflicting canonicals confuse search engines",
      fix: "Keep only one canonical URL"
    });
  }

  return issues;
}
