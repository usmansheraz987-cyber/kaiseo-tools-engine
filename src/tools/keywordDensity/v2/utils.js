import { STOP_WORDS } from "./stopwords.js";
export function isMeaningful(keyword) {
  const parts = keyword.split(" ");
  return parts.some(p => !STOP_WORDS.has(p));
}

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
import fetch from "node-fetch";
import * as cheerio from "cheerio";


export async function extractTextFromUrl(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (SEO Tool)"
    },
    timeout: 15000
  });

  if (!response.ok) {
    throw new Error("Failed to fetch URL");
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // remove junk
  $("script, style, noscript, iframe, svg").remove();

  const text = $("body").text();

  return cleanText(text);
}
const STOP_PATTERNS = [
  "if you",
  "let’s",
  "lets",
  "you can",
  "you should",
  "for example",
  "for instance",
  "step by step",
  "in this guide",
  "this article",
  "we’ll",
  "we will"
];

const MONTHS = [
  "january","february","march","april","may","june",
  "july","august","september","october","november","december"
];

export function isValidGapPhrase(phrase, stopwords = []) {
  const words = phrase.split(" ");
  const lower = phrase.toLowerCase();

  // length rule
  if (words.length < 2 || words.length > 5) return false;

  // stop patterns
  if (STOP_PATTERNS.some(p => lower.startsWith(p) || lower.includes(p)))
    return false;

  // date / filler rules
  if (
    MONTHS.some(m => lower.includes(m)) ||
    /\b(19|20)\d{2}\b/.test(lower) ||
    /\b\d+(st|nd|rd|th)\b/.test(lower) ||
    lower.includes("retrieved") ||
    lower.includes("updated") ||
    lower.includes("published")
  ) return false;

  // stop-word density
  const stopCount = words.filter(w => stopwords.includes(w)).length;
  if (stopCount / words.length > 0.5) return false;

  return true;
}

export function classifyGapPhrase(phrase) {
  const lower = phrase.toLowerCase();

  if (lower.startsWith("what is") || lower.startsWith("how to") || lower.startsWith("why"))
    return "section";

  if (lower.includes("tools") || lower.includes("examples") || lower.includes("like"))
    return "example";

  return "concept";
}
