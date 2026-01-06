import { INTENTS } from "./constants.js";

export function cleanText(text = "") {
  return text
    .replace(/\s+/g, " ")
    .replace(/[^\w\s]/g, "")
    .trim();
}

export function extractPrimaryKeyword(text) {
  const words = cleanText(text).toLowerCase().split(" ");
  const freq = {};
  words.forEach(w => {
    if (w.length > 3) freq[w] = (freq[w] || 0) + 1;
  });
  return Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
}

export function detectIntent(text) {
  const t = text.toLowerCase();
  if (/(buy|price|cost|best|top|deal|service)/.test(t)) {
    return INTENTS.TRANSACTIONAL;
  }
  return INTENTS.INFORMATIONAL;
}

export function scoreLength(len, min, max) {
  if (len < min || len > max) return 0;
  return 100;
}

export function scoreKeywordPresence(text, keyword) {
  if (!keyword) return 0;
  return text.toLowerCase().includes(keyword.toLowerCase()) ? 100 : 0;
}
