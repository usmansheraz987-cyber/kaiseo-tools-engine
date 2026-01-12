import { detectSerpIntent } from "./intent/detectIntent.js";
import { detectTopicalGaps } from "./gaps/topicalGaps.js";
import { prioritizeActions } from "./actions/prioritize.js";
import { resolveConfidence } from "./confidence/confidenceScore.js";

/**
 * Run SEO Analyzer v4
 *
 * v4 depends on:
 * - v2 core analysis
 * - v3 SERP context
 *
 * It NEVER fetches data itself.
 */
export async function runSeoAnalyzerV4({
  v2Result,
  v3Result
}) {
  // ---- Safety checks ----
  if (!v2Result || !v3Result) {
    throw new Error("v4 requires v2 and v3 results");
  }

  // ---- Inputs from v3 ----
  const serpTitles = v3Result?.serp?.titles || [];
  const serpLive = v3Result?.context?.serpSource === "live";

  // ---- Inputs from v2 ----
  const pageHeadings =
    v2Result?.extracted?.headings?.map(h => h.text) || [];

  const hasCriticalTechnicalIssues =
    v2Result?.score?.hasCriticalIndexabilityFail || false;

  // ---- INTENT ----
  const serpIntent = detectSerpIntent(serpTitles);

  const pageIntent =
    v2Result?.content?.intent || "informational";

  const intentStatus =
    serpIntent.intent === pageIntent
      ? "match"
      : serpIntent.intent === "unknown"
      ? "unknown"
      : "mismatch";

  // ---- TOPICAL GAPS ----
  const gaps = detectTopicalGaps(serpTitles, pageHeadings);

  // ---- ACTION PRIORITIZATION ----
  const actions = prioritizeActions({
    intent: {
      status: intentStatus
    },
    missingSections: gaps.missing,
    weakSections: gaps.weak,
    hasCriticalTechnicalIssues
  });

  // ---- CONFIDENCE ----
  const confidence = resolveConfidence({
    serpLive,
    intentConfidence: serpIntent.confidence
  });

  // ---- FINAL RESPONSE ----
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
