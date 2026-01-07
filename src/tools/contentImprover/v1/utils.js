export function splitSentences(text) {
  return text
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);
}

export function splitParagraphs(text) {
  return text
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean);
}

export function countWords(text) {
  return text.trim().split(/\s+/).length;
}

export function getKeywordDensity(text, keyword) {
  const words = text.toLowerCase().split(/\s+/);
  const keywordCount = words.filter(w => w === keyword.toLowerCase()).length;
  return (keywordCount / words.length) * 100;
}

export function getRepeatedPhrases(text, minLength = 3) {
  const words = text.toLowerCase().split(/\s+/);
  const phrases = {};

  for (let i = 0; i <= words.length - minLength; i++) {
    const phrase = words.slice(i, i + minLength).join(" ");
    phrases[phrase] = (phrases[phrase] || 0) + 1;
  }

  return Object.entries(phrases)
    .filter(([_, count]) => count > 2)
    .map(([phrase, count]) => ({ phrase, count }));
}
