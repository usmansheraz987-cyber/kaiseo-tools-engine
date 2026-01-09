// src/tools/seoAnalyzer/v1/extractors/content.js

export function extractContent($) {
  if (!$) {
    return {
      wordCount: 0,
      textSample: null,
    };
  }

  const rawText = $("body").text() || "";
  const cleanText = rawText.replace(/\s+/g, " ").trim();

  const wordCount = cleanText
    ? cleanText.split(" ").length
    : 0;

  return {
    wordCount,
    textSample: cleanText.slice(0, 200),
  };
}
