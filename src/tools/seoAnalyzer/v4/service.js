import { detectSerpIntent } from "./intent/detectIntent.js";
import { detectTopicalGaps } from "./gaps/topicalGaps.js";
import { prioritizeActions } from "./actions/prioritize.js";
import { resolveConfidence } from "./confidence/confidenceScore.js";

/**
 * SEO Analyzer v4
 * Decision layer only
 * Consumes v3 + v2 outputs
 */
export async function runSeoAnalyzerV4({
  v2Result,
  v3Result
}) {
  /* --------------------
     Safety
  -------------------- */
  if (!v2Result || !v3Result) {
    throw new Error("V4_REQUIRES_V2_AND_V3");
  }

  /* --------------------
     SERP data (from v3)
  -------------------- */
  const serpTitles =
    v3Result?.serpBenchmarks?.titles ||
    v3Result?.competitors?.map(c => c.title).filter(Boolean) ||
    [];

  const serpLive =
    v3Result?.context?.serpSource === "live";

  /* --------------------
     Page structure (from v2)
  -------------------- */
  const pageHeadings = Array.isArray(v2Result?.extracted?.headings)
    ? v2Result.extracted.headings.map(h => h.text)
    : [];

  const hasCriticalTechnicalIssues =
    Boolean(v2Result?.score?.hasCriticalIndexabilityFail);

  /* --------------------
     Intent (SERP only)
  -------------------- */
  const serpIntent = detectSerpIntent(serpTitles);

  // v2 does NOT define intent — keep honest
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
