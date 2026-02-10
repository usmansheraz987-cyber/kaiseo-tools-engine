import { fetchPage } from "../../lib/fetcher/fetchPage.js";
import { applyRules } from "./eligibility.rules.js";
import { calculateVerdict } from "./eligibility.scorer.js";
import { getCached, setCache } from "./cache.js";

export async function runEligibilityChecks({ url, html }) {
  let pageData;

  // HTML MODE (no cache)
  if (html) {
    if (typeof html !== "string") {
      throw new Error("Invalid HTML input");
    }

    if (html.length > 2 * 1024 * 1024) {
      throw new Error("HTML too large");
    }

    pageData = {
      html,
      status: 200,
      headers: { "content-type": "text/html" },
      finalUrl: null
    };
  }

  // URL MODE (with cache)
  if (url) {
    const cached = getCached(url);
    if (cached) {
      return {
        ...cached,
        source: "cache"
      };
    }

    const fetchResult = await fetchPage(url);

    if (!fetchResult.ok) {
      return {
        eligible: false,
        severity: "critical",
        verdict: "Page could not be fetched",
        issues: [
          {
            type: "fetch_error",
            severity: "critical",
            message: fetchResult.error || "Unknown fetch error"
          }
        ]
      };
    }

    pageData = fetchResult;
  }

  const issues = applyRules(pageData);
  const verdict = calculateVerdict(issues);

  const result = {
    ...verdict,
    issues,
    mode: url ? "url" : "html",
    source: "live"
  };

  // Cache only URL mode
  if (url && result.eligible !== false) {
    setCache(url, result);
  }

  return result;
}
