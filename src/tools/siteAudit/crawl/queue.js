// src/tools/siteAudit/crawl/queue.js

export class CrawlQueue {
  constructor({ maxPages = 100, maxDepth = 5 }) {
    this.queue = [];
    this.visited = new Set();
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
}
