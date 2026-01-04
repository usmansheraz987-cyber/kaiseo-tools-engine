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
