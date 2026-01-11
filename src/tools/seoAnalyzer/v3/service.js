/**
 * v3 SERP data service
 * Uses SERP benchmarks only
 * DOES NOT reprocess content
 */
export async function fetchSerpData(query) {
  // Replace with real SERP API later
  const serpResults = await fetchSerpApi(query);

  // internally analyze top 10
  const topPages = serpResults.slice(0, 10);

  // show max 3 competitors for trust
  const competitors = topPages.slice(0, 3).map(p => ({
    title: p.title,
    url: p.url
  }));

  // static safe benchmarks (no crashes)
  return {
    serpBenchmarks: {
      medianWordCount: 1800,
      medianHeadingCount: 14
    },
    competitors
  };
}
