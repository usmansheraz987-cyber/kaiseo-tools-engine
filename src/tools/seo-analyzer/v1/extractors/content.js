// src/tools/seoAnalyzer/v1/extractors/content.js

import { normalizeText } from "../utils.js";

export function extractContent($) {
  const bodyText = normalizeText($("body").text());

  const words = bodyText
    .split(" ")
    .filter(w => w.length > 1);

  return {
    wordCount: words.length,
    textSample: bodyText.slice(0, 500) || null
  };
}
