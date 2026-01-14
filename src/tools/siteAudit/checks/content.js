import * as cheerio from "cheerio";
import crypto from "crypto";

export function checkContent(page, contentHashes) {
  const issues = [];
  if (!page.html) return issues;

  const $ = cheerio.load(page.html);
  const text = $("body").text().replace(/\s+/g, " ").trim();

  if (text.length < 300) {
    issues.push({
      code: "THIN_CONTENT",
      page: page.url,
      severity: "important",
      message: "Page has very little content",
      why: "Thin pages often fail to rank",
      fix: "Add meaningful, original content"
    });
  }

  const hash = crypto.createHash("md5").update(text).digest("hex");
  if (contentHashes.has(hash)) {
    issues.push({
      code: "DUPLICATE_CONTENT",
      page: page.url,
      severity: "important",
      message: "Duplicate content detected",
      why: "Duplicate pages compete with each other",
      fix: "Consolidate or differentiate content"
    });
  } else {
    contentHashes.add(hash);
  }

  return issues;
}
