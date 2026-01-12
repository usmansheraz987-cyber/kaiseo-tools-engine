export function analyzeCompetitorInsights(competitors) {
  const titles = competitors.map(c => c.title.toLowerCase());

  return {
    titlePatterns: {
      hasYear: titles.some(t => /\b202\d\b/.test(t)),
      hasList: titles.some(t => t.includes("best") || t.includes("top")),
      hasComparison: titles.some(t => t.includes("vs"))
    },
    domainDiversity: new Set(
      competitors.map(c => new URL(c.url).hostname)
    ).size,
    competitorCount: competitors.length
  };
}
