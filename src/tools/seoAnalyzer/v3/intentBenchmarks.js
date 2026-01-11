export function getIntentBenchmarks(query) {
  const q = query.toLowerCase();

  if (q.includes("best") || q.includes("top") || q.includes("vs")) {
    return { medianWordCount: 1800, medianParagraphCount: 18 };
  }

  if (q.includes("buy") || q.includes("price")) {
    return { medianWordCount: 900, medianParagraphCount: 8 };
  }

  return { medianWordCount: 1400, medianParagraphCount: 14 };
}
