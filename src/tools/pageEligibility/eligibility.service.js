import { fetchPageHtml } from "../../lib/fetcher/fetchPage.js";
import { applyRules } from "./eligibility.rules.js";
import { calculateVerdict } from "./eligibility.scorer.js";
import { getCached, setCache } from "./cache.js";

export async function runEligibilityChecks({ url, html }) {
  let pageData;

  // -------------------
  // HTML MODE (no cache)
  // -------------------
  if (html) {
    if (typeof html !== "string") {
      throw new Error("Invalid HTML input");
    }

    if (html.length > 2 * 1024 * 1024) {
      throw new Error("HTML_TOO_LARGE");
    }

    pageData = {
      html,
      status: 200,
      headers: { "content-type": "text/html" },
      finalUrl: null
    };
  }

  // -------------------
  // URL MODE (with cache)
  // -------------------
  if (url) {
    const cached = getCached(url);
    if (cached) {
      return {
        ...cached,
        source: "cache"
      };
    }

    try {
      const fetchResult = await fetchPageHtml(url);

      pageData = {
        html: fetchResult.html,
        status: fetchResult.meta.httpStatus,
        headers: { "content-type": "text/html" },
        finalUrl: fetchResult.meta.finalUrl
      };

    } catch (err) {
      return {
        eligible: false,
        severity: "critical",
        verdict: "Page could not be fetched",
        issues: [
          {
            type: "fetch_error",
            severity: "critical",
            message: err.message || "Unknown fetch error"
          }
        ]
      };
    }
  }

  const issues = applyRules(pageData);
  const verdict = calculateVerdict(issues);

  const result = {
    ...verdict,
    issues,
    mode: url ? "url" : "html",
    source: "live"
  };

  // Cache only successful URL results
  if (url && result.eligible !== false) {
    setCache(url, result);
  }

  return result;
}
