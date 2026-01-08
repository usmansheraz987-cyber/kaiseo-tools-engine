// src/tools/seoAnalyzer/v1/extractors/technical.js

export function extractTechnical({ url, html }) {
  let isHttps = false;

  try {
    isHttps = url?.startsWith("https://");
  } catch {}

  const pageSizeKb = html
    ? Math.round(Buffer.byteLength(html, "utf8") / 1024)
    : 0;

  return {
    https: isHttps,
    pageSizeKb
  };
}
