/**
 * v3 SERP Context Service
 * TEMP implementation (no external API)
 * Safe for Render, no crashes
 */
export async function fetchSerpData(query) {
  // mock SERP competitors (trust layer)
  const competitors = [
    {
      title: "Best SEO Tools in 2026",
      url: "https://example.com/best-seo-tools"
    },
    {
      title: "Top SEO Software Compared",
      url: "https://example.com/seo-software"
    },
    {
      title: "SEO Tools Review Guide",
      url: "https://example.com/seo-tools-review"
    }
  ];

  // mock SERP benchmarks
  return {
    serpBenchmarks: {
      medianWordCount: 1800,
      medianHeadingCount: 14
    },
    competitors
  };
}
