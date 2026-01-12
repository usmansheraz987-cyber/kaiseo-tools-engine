export function calculateRelativeScore({
  pageContent,
  serpBenchmarks,
  usedFallback
}) {
  const result = {
    overall: 0,
    contentDepth: "unknown",
    structureMatch: "unknown"
  };

  if (!pageContent || !serpBenchmarks) {
    result.note = "Insufficient data";
    return result;
  }

  if (pageContent.cleanWordCount >= serpBenchmarks.medianWordCount) {
    result.contentDepth = "above_serp_median";
    result.overall += 50;
  } else {
    result.contentDepth = "below_serp_median";
    result.overall += 30;
  }

  if (pageContent.paragraphCount >= serpBenchmarks.medianParagraphCount) {
    result.structureMatch = "good";
    result.overall += 40;
  } else {
    result.structureMatch = "partial";
    result.overall += 20;
  }

  if (usedFallback) {
    result.note = "Fallback baseline used";
  }

  return result;
}
