// src/tools/seoAnalyzer/v1/service.js

import { loadHtml, isValidUrl } from "./utils.js";
import { fetchPageHtml } from "../../../lib/fetcher/fetchPage.js";

import { extractMeta } from "./extractors/meta.js";
import { extractHeadings } from "./extractors/headings.js";
import { extractLinks } from "./extractors/links.js";
import { extractImages } from "./extractors/images.js";
import { extractContent } from "./extractors/content.js";
import { analyzeTechnical } from "./extractors/technical.js";

import { analyzeSeo } from "./analyzer.js";
import { calculateScore } from "./scoring.js";
import { buildSuggestions } from "./suggestions.js";

export async function runSeoAnalyzer({ url, html }) {

  if (url && !isValidUrl(url)) {
  throw new Error("Invalid URL provided.");
}
let fetchedMeta = null;

if (!html && url) {
  const fetched = await fetchPageHtml(url);
  html = fetched.html;
  fetchedMeta = fetched.meta;
}

if (!html) {
  throw new Error("HTML content is required for analysis.");
}



  if (url && !isValidUrl(url)) {
    throw new Error("Invalid URL provided.");
  }

  // Load DOM
  const $ = loadHtml(html);

  // --------------------
  // Extraction phase
  // --------------------

  const meta = extractMeta($);
  const headings = extractHeadings($);
  const links = extractLinks($, url);
  const images = extractImages($);
  const content = extractContent($);
  const technical = analyzeTechnical({ url, html });


  const extracted = {
    meta,
    headings,
    links,
    images,
    content,
    technical
  };

  // --------------------
  // Analysis phase
  // --------------------

  const checks = analyzeSeo(extracted);

  // --------------------
  // Scoring phase
  // --------------------

  const score = calculateScore(checks);

  // --------------------
  // Suggestions phase
  // --------------------

  const suggestions = buildSuggestions(checks);

return {
  fetchedMeta,    // null if HTML was pasted
  extracted,
  checks,
  score,
  suggestions
};

}
