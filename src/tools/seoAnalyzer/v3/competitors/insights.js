export function buildCompetitorInsights({
  competitors,
  serpBenchmarks,
  pageContent
}) {
  if (!competitors || competitors.length === 0) {
    return {
      available: false,
      reason: "No competitor data available"
    };
  }

  return {
    available: true,
    competitorCount: competitors.length,
    titles: competitors.map(c => c.title),
    urls: competitors.map(c => c.url),
    benchmarkSummary: serpBenchmarks,
    pageVsSerp: {
      wordCount: pageContent.cleanWordCount,
      paragraphCount: pageContent.paragraphCount
    }
  };
}
