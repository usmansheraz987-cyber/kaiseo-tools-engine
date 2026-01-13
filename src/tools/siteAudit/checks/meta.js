import cheerio from "cheerio";

export function checkMeta(page, allPages) {
  const issues = [];
  if (!page.html) return issues;

  const $ = cheerio.load(page.html);
  const title = $("title").text().trim();

  if (!title) {
    issues.push({
      code: "MISSING_TITLE",
      page: page.url,
      severity: "important",
      message: "Title tag is missing",
      why: "Titles help search engines understand pages",
      fix: "Add a unique, descriptive title tag"
    });
  }

  return issues;
}
