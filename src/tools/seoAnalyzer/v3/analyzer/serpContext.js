export function serpContextAnalyzer({
  pageWordCount,
  pageHeadingCount,
  serpBenchmarks
}) {
  const { medianWordCount, medianHeadingCount } = serpBenchmarks

  let score = 100

  if (pageWordCount < medianWordCount * 0.7) score -= 15
  if (pageHeadingCount < medianHeadingCount * 0.7) score -= 10

  return {
    overall: Math.max(score, 0),
    contentDepth:
      pageWordCount < medianWordCount
        ? "below_serp_median"
        : "meets_serp_median",
    structureMatch:
      pageHeadingCount < medianHeadingCount
        ? "partial"
        : "strong"
  }
}
