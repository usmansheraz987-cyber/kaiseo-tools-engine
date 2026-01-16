// src/tools/siteAudit/crawl/crawler.js

function extractCanonical(html) {
  if (!html) return null;

  const match = html.match(
    /<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i
  );

  return match ? match[1].trim() : null;
}



export async function crawlPage(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000); // 8s per page

  let res;

  try {
    res = await fetch(url, {
      redirect: "follow",
      follow: 10,
      signal: controller.signal
    });
  } catch (err) {
    clearTimeout(timeout);

    if (err.name === "AbortError") {
      return { url, timeout: true };
    }

    return { url, error: true };
  }

  clearTimeout(timeout);

  const finalUrl = res.url;
  const status = res.status;

  let html = "";
  try {
    html = await res.text();
  } catch {
    return { url: finalUrl, status, error: true };
  }

  // Extract links safely
  let links = [];
  try {
    const linkRegex = /href\s*=\s*["']([^"']+)["']/gi;
    let match;
    while ((match = linkRegex.exec(html)) !== null) {
      links.push(match[1]);
    }
  } catch {
    links = [];
  }

const canonical = extractCanonical(html);

return {
  url: finalUrl,
  originalUrl: url,
  canonical,
  status,
  redirected: finalUrl !== url,
  redirectCount: finalUrl !== url ? 1 : 0,
  html,
  links
};

}
