import fetch from "node-fetch";
import { FETCH_RULES } from "./fetchRules.js";
import { protectAgainstSSRF } from "./ssrfGuard.js";

export async function fetchPageHtml(url) {
  await protectAgainstSSRF(url);

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    FETCH_RULES.timeoutMs
  );

  let response;
  let lastError;

  try {
    // 🔁 Retry (2 attempts)
    for (let i = 0; i < 2; i++) {
      try {
        response = await fetch(url, {
          method: "GET",
          redirect: "follow",
          follow: FETCH_RULES.maxRedirects,
          signal: controller.signal,
          headers: {
            // ✅ Mimic real browser
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
            "Accept":
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Connection": "keep-alive"
          }
        });

        break; // success → exit retry loop
      } catch (err) {
        lastError = err;
      }
    }

    if (!response) {
      throw new Error("TIMEOUT_OR_FETCH_FAILED");
    }

  } catch (err) {
    clearTimeout(timeout);
    throw new Error("TIMEOUT_OR_FETCH_FAILED");
  }

  clearTimeout(timeout);

  // ❌ HTTP errors
  if (!response.ok) {
    throw new Error(`HTTP_${response.status}`);
  }

  // ❌ Not HTML
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes(FETCH_RULES.allowedContentType)) {
    throw new Error("NOT_HTML");
  }

  const html = await response.text();

  // ❌ Too large
  const size = Buffer.byteLength(html, "utf8");
  if (size > FETCH_RULES.maxSizeBytes) {
    throw new Error("HTML_TOO_LARGE");
  }

  return {
    html,
    renderedHtml: null, // keep for future (puppeteer fallback)
    meta: {
      httpStatus: response.status,
      finalUrl: response.url,
      pageSizeKB: Math.round(size / 1024),
      renderUsed: false,
      fetchAttempts: 2
    }
  };
}