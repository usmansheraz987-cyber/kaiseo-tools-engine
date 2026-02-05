import fetch from "node-fetch";
import { FETCH_RULES } from "./fetchRules.js";
import { protectAgainstSSRF } from "./ssrfGuard.js";
import { renderPage } from "./renderPage.js";
import { shouldRender } from "./shouldRender.js";

export async function fetchPageHtml(url, options = {}) {
  const { render = false } = options;

  // 🔒 SSRF protection
  await protectAgainstSSRF(url);

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    FETCH_RULES.timeoutMs
  );

  let response;

  try {
    response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      follow: FETCH_RULES.maxRedirects,
      signal: controller.signal,
      headers: {
        "User-Agent": FETCH_RULES.userAgent,
        "Accept": "text/html"
      }
    });
  } catch {
    clearTimeout(timeout);
    throw new Error("TIMEOUT_OR_FETCH_FAILED");
  }

  clearTimeout(timeout);

  if (!response.ok) {
    throw new Error(`HTTP_${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes(FETCH_RULES.allowedContentType)) {
    throw new Error("NOT_HTML");
  }

  const html = await response.text();

  const size = Buffer.byteLength(html, "utf8");
  if (size > FETCH_RULES.maxSizeBytes) {
    throw new Error("HTML_TOO_LARGE");
  }

  // 🧠 Smart render policy
  let renderedHtml = null;
  let renderUsed = false;

  if (render === true || shouldRender(html)) {
    try {
      renderedHtml = await renderPage(url, FETCH_RULES.timeoutMs);
      renderUsed = true;
    } catch {
      // Rendering failed → safe fallback to HTML-only
      renderedHtml = null;
      renderUsed = false;
    }
  }

  return {
    html,
    renderedHtml,
    meta: {
      httpStatus: response.status,
      finalUrl: response.url,
      pageSizeKB: Math.round(size / 1024),
      renderUsed
    }
  };
}
