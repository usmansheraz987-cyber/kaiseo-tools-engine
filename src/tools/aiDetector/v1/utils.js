export function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function splitIntoSentences(text) {
  return text
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);
}

export function tokenize(text) {
  return normalizeText(text)
    .split(" ")
    .filter(Boolean);
}

export function countWords(text) {
  return tokenize(text).length;
}
