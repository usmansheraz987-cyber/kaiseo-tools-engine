import * as cheerio from "cheerio";


export function applyRules(fetchResult) {
  const issues = [];
  const { html, status, headers } = fetchResult;

  if (status !== 200) {
    issues.push({
      type: "invalid_status",
      severity: "critical",
      message: `HTTP status ${status}`
    });
  }

  if (!headers["content-type"]?.includes("text/html")) {
    issues.push({
      type: "invalid_content_type",
      severity: "critical",
      message: "Content is not HTML"
    });
  }

  const $ = cheerio.load(html);

  const title = $("title").text().trim();
  if (!title) {
    issues.push({
      type: "missing_title",
      severity: "warning",
      message: "Title tag is missing"
    });
  }

  const h1 = $("h1");
  if (h1.length === 0) {
    issues.push({
      type: "missing_h1",
      severity: "warning",
      message: "H1 tag missing"
    });
  }

  const wordCount = $("body").text().split(/\s+/).length;
  if (wordCount < 300) {
    issues.push({
      type: "thin_content",
      severity: "warning",
      message: "Word count below 300"
    });
  }

  const noindex = $('meta[name="robots"]').attr("content");
  if (noindex?.includes("noindex")) {
    issues.push({
      type: "noindex_detected",
      severity: "critical",
      message: "Page contains noindex directive"
    });
  }

  return issues;
}
