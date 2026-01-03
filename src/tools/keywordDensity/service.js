export default function analyzeKeywordDensity(text) {
  if (!text || typeof text !== "string") {
    return { error: "Invalid text input" };
  }

  const cleanText = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = cleanText.split(" ");
  const totalWords = words.length;

  const frequencyMap = {};

  for (const word of words) {
    if (word.length < 3) continue;
    frequencyMap[word] = (frequencyMap[word] || 0) + 1;
  }

  const keywords = Object.entries(frequencyMap)
    .map(([keyword, count]) => {
      const density = ((count / totalWords) * 100).toFixed(2);

      let warning = "ok";
      if (density > 3) warning = "over-optimized";
      else if (density < 0.5) warning = "low-usage";

      return {
        keyword,
        count,
        density: Number(density),
        warning
      };
    })
    .sort((a, b) => b.count - a.count);

  return {
    totalWords,
    uniqueKeywords: keywords.length,
    keywords
  };
}
