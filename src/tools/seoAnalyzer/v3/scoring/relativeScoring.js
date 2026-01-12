export function calculateRelativeScore({
  pageWords,
  pageParagraphs,
  serpBenchmarks,
  intent
}) {
  let score = 100;

  if (pageWords < serpBenchmarks.medianWordCount) {
    score -= 20;
  }

  if (pageParagraphs < serpBenchmarks.medianParagraphCount / 2) {
    score -= 10;
  }

  if (intent === "commercial") score -= 5;
  if (intent === "informational") score += 5;

  return {
    overall: Math.max(score, 0),
    contentDepth:
      pageWords >= serpBenchmarks.medianWordCount
        ? "meets_serp_median"
        : "below_serp_median",
    structureMatch:
      pageParagraphs >= serpBenchmarks.medianParagraphCount
        ? "strong"
        : "partial"
  };
}
