import { fetchPage } from "../../../lib/fetcher/fetchPage.js";
import { extractContent } from "../v2/extractors/content.js";

export async function fetchSerpData(query) {
  // 🔴 Replace this with real SERP API
  const serpResults = await fetchSerpApi(query);

  const topPages = serpResults.slice(0, 10);

  const wordCounts = [];
  const headingCounts = [];

  const competitors = topPages.slice(0, 3).map(p => ({
    title: p.title,
    url: p.url
  }));

  for (const page of topPages) {
    try {
      const html = await fetchPage(page.url);
      const content = extractContent(html);

      wordCounts.push(content.wordCount || 0);
      headingCounts.push(content.headingCount || 0);
    } catch {
      // ignore failures
    }
  }

  return {
    serpBenchmarks: {
      medianWordCount: median(wordCounts),
      medianHeadingCount: median(headingCounts)
    },
    competitors
  };
}

function median(values = []) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}
