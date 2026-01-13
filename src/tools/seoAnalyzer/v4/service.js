import { detectSerpIntent } from "./intent/detectIntent.js";
import { detectTopicalGaps } from "./gaps/topicalGaps.js";
import { prioritizeActions } from "./actions/prioritize.js";
import { resolveConfidence } from "./confidence/confidenceScore.js";

/**
 * SEO Analyzer v4
 * Decision layer
 * Consumes REAL v3 output
 */
export async function runSeoAnalyzerV4({ v3Result }) {
  /* --------------------
     Safety
  -------------------- */
  if (!v3Result) {
    throw new Error("V4_REQUIRES_V3_RESULT");
  }

  /* --------------------
     SERP titles (from competitors)
  -------------------- */
  const serpTitles = Array.isArray(v3Result.competitors)
    ? v3Result.competitors
        .map(c => c?.title)
        .filter(Boolean)
    : [];

  const serpLive =
    v3Result?.context?.serpSource === "live";

  /* --------------------
     Page headings (from v3.extracted)
  -------------------- */
  const pageHeadings = Array.isArray(v3Result?.extracted?.headings)
    ? v3Result.extracted.headings.map(h => h.text)
    : [];

  const hasCriticalTechnicalIssues =
    Boolean(v3Result?.score?.hasCriticalIndexabilityFail);

  /* --------------------
     Intent (SERP-based)
  -------------------- */
  const serpIntent = detectSerpIntent(serpTitles);

  // We do NOT guess page intent yet
  const pageIntent = "informational";

  const intentStatus =
    serpIntent.intent === "unknown"
      ? "unknown"
      : serpIntent.intent === pageIntent
      ? "match"
      : "mismatch";

  /* --------------------
     Topical gaps
  -------------------- */
  const gaps = detectTopicalGaps(
    serpTitles,
    pageHeadings
  );

  /* --------------------
     Action priority
  -------------------- */
  const actions = prioritizeActions({
    intent: {
      status: intentStatus
    },
    missingSections: gaps.missing,
    weakSections: gaps.weak,
    hasCriticalTechnicalIssues
  });

  /* --------------------
     Confidence
  -------------------- */
  const confidence = resolveConfidence({
    serpLive,
    intentConfidence: serpIntent.confidence
  });

  /* --------------------
     Final v4 output
  -------------------- */
  return {
    intent: {
      serp: serpIntent.intent,
      page: pageIntent,
      status: intentStatus,
      confidence: serpIntent.confidence
    },
    topicalGaps: gaps,
    actions,
    confidence
  };
}
