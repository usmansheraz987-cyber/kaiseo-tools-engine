// src/tools/siteAudit/crawl/robots.js
import robotsParser from "robots-parser";

const cache = new Map();

export async function isAllowed(url) {
  try {
    const u = new URL(url);
    const robotsUrl = `${u.origin}/robots.txt`;

    if (!cache.has(robotsUrl)) {
      const res = await fetch(robotsUrl, { timeout: 5000 });
      const text = res.ok ? await res.text() : "";
      cache.set(robotsUrl, robotsParser(robotsUrl, text));
    }

    return cache.get(robotsUrl).isAllowed(url, "*");
  } catch {
    return true;
  }
}
