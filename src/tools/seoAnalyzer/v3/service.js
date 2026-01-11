/**
 * v3 SERP Context Service
 * Stable mock implementation
 * No external API
 * No fetch
 * No crashes
 */
export async function fetchSerpData(query) {
  // Visible competitors for trust
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

  // Safe benchmark defaults
  return {
    serpBenchmarks: {
      medianWordCount: 1800,
      medianParagraphCount: 20
    },
    competitors
  };
}
