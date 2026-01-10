// src/tools/seoAnalyzer/v2/service.js

import { loadHtml, isValidUrl } from "../v1/utils.js";
import { fetchPageHtml } from "../../../lib/fetcher/fetchPage.js";

// v2 layers
import { cleanContent } from "./cleaners/contentCleaner.js";
import { extractCleanContent } from "./extractors/content.js";
import { analyzeContentStrength } from "./analyzer/contentStrength.js";
import { calculateV2Score } from "./scoring/index.js";

// v1 extractors (reused)
import { extractMeta } from "../v1/extractors/meta.js";
import { extractHeadings } from "../v1/extractors/headings.js";
import { extractLinks } from "../v1/extractors/links.js";
import { extractImages } from "../v1/extractors/images.js";
import { analyzeTechnical } from "../v1/extractors/technical.js";

// v1 logic reused
import { analyzeSeo as analyzeV1Seo } from "../v1/analyzer.js";
import { buildSuggestions } from "../v1/suggestions.js";

export async function runSeoAnalyzerV2({ html, url }) {
  let fetchedMeta = null;

  // --------------------
  // Input handling
  // --------------------
  if (!html && url) {
    if (!isValidUrl(url)) {
      throw new Error("INVALID_URL");
    }

    const fetched = await fetchPageHtml(url);
    html = fetched.html;
    fetchedMeta = fetched.meta;
  }

  if (!html) {
    throw new Error("HTML_REQUIRED");
  }

  // --------------------
  // Load DOM
  // --------------------
  const $ = loadHtml(html);

  // --------------------
  // v2 content cleaning
  // --------------------
  const rawText = $("body").text() || "";
  const cleaned = cleanContent($);

  // --------------------
  // v1 extractions
  // --------------------
  const extracted = {
    meta: extractMeta($),
    headings: extractHeadings($),
    links: extractLinks($, url),
    images: extractImages($),
    technical: analyzeTechnical({ url, html })
  };

  // --------------------
  // v2 content extraction
  // --------------------
  const contentMetrics = extractCleanContent({
    cleanText: cleaned.cleanText,
    rawText
  });

  extracted.content = {
    ...contentMetrics
  };

  // --------------------
  // Analysis
  // --------------------
  const v1Checks = analyzeV1Seo(extracted);
  const v2ContentChecks = analyzeContentStrength(contentMetrics);

  const allChecks = [...v1Checks, ...v2ContentChecks];

  // --------------------
  // Scoring
  // --------------------
  const score = calculateV2Score(allChecks);

  // --------------------
  // Suggestions
  // --------------------
  const suggestions = buildSuggestions(allChecks);

  return {
    fetchedMeta, // null if HTML was pasted
    extracted,
    checks: allChecks,
    score,
    suggestions
  };
}
