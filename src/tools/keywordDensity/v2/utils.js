export function cleanText(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function generateNgrams(words, n) {
  const grams = [];
  for (let i = 0; i <= words.length - n; i++) {
    grams.push(words.slice(i, i + n).join(" "));
  }
  return grams;
}

export function countOccurrences(items) {
  const map = {};
  for (const item of items) {
    map[item] = (map[item] || 0) + 1;
  }
  return map;
}

export function classify(count, density, totalWords) {
  if (count >= 3 && density >= 3) return "over-optimized";
  if (count === 1 && totalWords > 300) return "low-usage";
  return "ok";
}
