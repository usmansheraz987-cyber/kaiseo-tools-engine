// src/tools/siteAudit/crawl/urlUtils.js

export function normalizeCanonical(url) {
  try {
    const u = new URL(url);
    u.hash = "";
    u.search = "";
    return u.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}



export function normalizeUrl(url) {
  try {
    const u = new URL(url);
    u.hash = "";
    u.search = "";
    return u.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

export function resolveInternalLinks(baseUrl, links) {
  const base = new URL(baseUrl);
  const internal = [];

  for (const link of links) {
    try {
      const u = new URL(link, base);

      if (u.origin !== base.origin) continue;

      u.hash = "";
      const normalized = u.toString().replace(/\/$/, "");

      internal.push(normalized);
    } catch {}
  }

  return internal;
}
