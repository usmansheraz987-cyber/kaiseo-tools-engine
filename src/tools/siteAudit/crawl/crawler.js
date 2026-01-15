// src/tools/siteAudit/crawl/crawler.js

import * as cheerio from "cheerio";
import { isAllowed } from "./robots.js";

export async function crawlPage(url) {
  const start = Date.now();

  if (!(await isAllowed(url))) {
    return { url, blocked: true };
  }

  try {
    let redirectCount = 0;

const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 8000); // 8s per page

let res;
try {
  res = await fetch(url, {
    redirect: "follow",
    follow: 10,
    signal: controller.signal
  });
} finally {
  clearTimeout(timeout);
}


if (res.redirected) {
  redirectCount = res.url !== url ? 1 : 0;
}

    const html = await res.text();

    const $ = cheerio.load(html);
    const links = [];

    $("a[href]").each((_, el) => {
      const href = $(el).attr("href");
      if (href) links.push(href);
    });

return {
  url,
  status: res.status,
  finalUrl: res.url,
  redirected: res.redirected,
  redirectCount,
  html,
  links,
  headers: Object.fromEntries(res.headers.entries()),
  responseTime: Date.now() - start,
  size: Buffer.byteLength(html, "utf8")
};


} catch (err) {
  if (err.name === "AbortError") {
    return { url, timeout: true };
  }
  return { url, error: true };
}
}
