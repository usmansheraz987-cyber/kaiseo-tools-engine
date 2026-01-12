import { detectSerpIntent } from "./intent/detectIntent.js";
import { detectTopicalGaps } from "./gaps/topicalGaps.js";
import { prioritizeActions } from "./actions/prioritize.js";
import { resolveConfidence } from "./confidence/confidenceScore.js";

/**
 * Run SEO Analyzer v4
 *
 * v4 = decision layer
 * Depends ONLY on v2 + v3 outputs
 * Never fetches, never parses HTML
 */
export async function runSeoAnalyzerV4({
  v2Result,
  v3Result
}) {
  // --------------------
  // Hard safety
  // --------------------
  if (!v2Result || !v3Result) {
    throw new Error("V4_REQUIRES_V2_AND_V3");
  }

  // --------------------
  // SERP data (from v3)
  // --------------------
  // Use defensive access — v3 shape is allowed to evolve
  const serpTitles =
    v3Result?.serpBenchmarks?.titles ||
    v3Result?.competitors?.titles ||
    [];

  const serpLive =
    v3Result?.context?.serpSource === "live";

  // --------------------
  // Page structure (from v2)
  // --------------------
  const pageHeadings =
    Array.isArray(v2Result?.extracted?.headings)
      ? v2Result.extracted.headings.map(h => h.text)
      : [];

  const hasCriticalTechnicalIssues =
    Boolean(v2Result?.score?.hasCriticalIndexabilityFail);

  // --------------------
  // INTENT (SERP only, deterministic)
  // --------------------
  const serpIntent = detectSerpIntent(serpTitles);

  // v2 does NOT calculate intent → keep this honest
  const pageIntent = "informational";

  const intentStatus =
    serpIntent.intent === "unknown"
      ? "unknown"
      : serpIntent.intent === pageIntent
      ? "match"
      : "mismatch";

  // --------------------
  // TOPICAL / STRUCTURAL GAPS
  // --------------------
  const gaps = detectTopicalGaps(
    serpTitles,
    pageHeadings
  );

  // --------------------
  // ACTION PRIORITY
  // --------------------
  const actions = prioritizeActions({
    intent: {
      status: intentStatus
    },
    missingSections: gaps.missing,
    weakSections: gaps.weak,
    hasCriticalTechnicalIssues
  });

  // --------------------
  // CONFIDENCE
  // --------------------
  const confidence = resolveConfidence({
    serpLive,
    intentConfidence: serpIntent.confidence
  });

  // --------------------
  // FINAL v4 OUTPUT
  // --------------------
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
