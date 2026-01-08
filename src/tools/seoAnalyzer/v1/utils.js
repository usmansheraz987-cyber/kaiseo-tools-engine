// src/tools/seoAnalyzer/v1/utils.js

import cheerio from "cheerio";
import { URL } from "url";

export function loadHtml(html) {
  return cheerio.load(html, {
    decodeEntities: true,
    normalizeWhitespace: true
  });
}

export function normalizeText(text = "") {
  return text.replace(/\s+/g, " ").trim();
}

export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function getDomain(targetUrl) {
  try {
    return new URL(targetUrl).hostname;
  } catch {
    return null;
  }
}
