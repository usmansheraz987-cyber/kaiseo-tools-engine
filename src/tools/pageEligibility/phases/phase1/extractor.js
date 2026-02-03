import { JSDOM } from "jsdom";

export function extractPhase1Data(fetchResult) {
  const { url, status, html, headers } = fetchResult;

  if (!html) {
    return { url, status, html: null };
  }

  const dom = new JSDOM(html);
  const doc = dom.window.document;

  const metaRobots =
    doc.querySelector('meta[name="robots"]')?.content?.toLowerCase() || "";

  const xRobots =
    headers?.["x-robots-tag"]?.toLowerCase() || "";

  const canonical =
    doc.querySelector('link[rel="canonical"]')?.href || null;

  const h1 =
    doc.querySelector("h1")?.textContent?.trim() || null;

  const text = doc.body?.textContent || "";
  const wordCount = text
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .length;

  return {
    url,
    status,
    html,
    canonical,
    h1,
    wordCount,
    noindex: metaRobots.includes("noindex") || xRobots.includes("noindex")
  };
}
