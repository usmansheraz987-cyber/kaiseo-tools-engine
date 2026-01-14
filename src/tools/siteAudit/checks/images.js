import * as cheerio from "cheerio";


export function checkImages(page) {
  const issues = [];
  if (!page.html) return issues;

  const $ = cheerio.load(page.html);

  $("img").each((_, img) => {
    const alt = $(img).attr("alt");
    if (!alt) {
      issues.push({
        code: "MISSING_IMAGE_ALT",
        page: page.url,
        severity: "low",
        message: "Image missing alt attribute",
        why: "Alt text helps accessibility and image SEO",
        fix: "Add descriptive alt text"
      });
    }
  });

  return issues;
}
