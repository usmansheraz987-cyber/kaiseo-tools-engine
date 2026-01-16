// src/tools/siteAudit/crawl/queue.js

import { normalizeCanonical } from "./urlUtils.js";



export class CrawlQueue {
constructor({ maxPages = 100, maxDepth = 5 }) {
  this.queue = [];
  this.visited = new Set();           // URL-level dedup
  this.canonicalVisited = new Set();  // Canonical-level dedup
  this.maxPages = maxPages;
  this.maxDepth = maxDepth;
}


  normalize(url) {
    try {
      const u = new URL(url);
      u.hash = "";
      u.search = "";
      return u.toString().replace(/\/$/, "");
    } catch {
      return null;
    }
  }

  add(url, depth = 0) {
    if (depth > this.maxDepth) return;

    const normalized = this.normalize(url);
    if (!normalized) return;

    if (this.visited.has(normalized)) return;
    if (this.visited.size >= this.maxPages) return;

    this.queue.push({ url: normalized, depth });
    this.visited.add(normalized);
  }

  next() {
    return this.queue.shift() || null;
  }

  hasNext() {
    return this.queue.length > 0;
  }

  size() {
    return this.visited.size;
  }
  markCanonical(page) {
  const canonical =
    normalizeCanonical(page.canonical) ||
    normalizeCanonical(page.url);

  if (!canonical) return false;

  if (this.canonicalVisited.has(canonical)) {
    return false;
  }

  this.canonicalVisited.add(canonical);
  return true;
}

}
