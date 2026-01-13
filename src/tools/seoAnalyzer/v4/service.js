import { detectSerpIntent } from "./intent/detectIntent.js";
import { detectTopicalGaps } from "./gaps/topicalGaps.js";
import { prioritizeActions } from "./actions/prioritize.js";
import { resolveConfidence } from "./confidence/confidenceScore.js";

/* v4.1 imports */
import { getSectionRules } from "./sections/rules.js";
import { matchSections } from "./sections/matcher.js";
import { evaluateSections } from "./sections/evaluator.js";
import { sectionGapsToActions } from "./sections/toActions.js";

/**
 * SEO Analyzer v4 + v4.1
 * Decision layer
 */
export async function runSeoAnalyzerV4({ v3Result }) {
  if (!v3Result) {
    throw new Error("V4_REQUIRES_V3_RESULT");
  }

  /* --------------------
     SERP titles (intent source)
  -------------------- */
  const serpTitles = Array.isArray(v3Result.competitors)
    ? v3Result.competitors.map(c => c?.title).filter(Boolean)
    : [];

  const serpLive = v3Result?.context?.serpSource === "live";

  /* --------------------
     Page headings
  -------------------- */
  const pageHeadings = Array.isArray(v3Result?.extracted?.headings)
    ? v3Result.extracted.headings.map(h => h.text)
    : [];

  const hasCriticalTechnicalIssues =
    Boolean(v3Result?.score?.hasCriticalIndexabilityFail);

  /* --------------------
     Intent
  -------------------- */
  const serpIntent = detectSerpIntent(serpTitles);
  const pageIntent = "informational";

  const intentStatus =
    serpIntent.intent === "unknown"
      ? "unknown"
      : serpIntent.intent === pageIntent
      ? "match"
      : "mismatch";

  /* --------------------
     v4.1 — Section Expectations
  -------------------- */
  const expectedSections = getSectionRules(serpIntent.intent);

  const sectionMatch = matchSections(
    expectedSections,
    pageHeadings
  );

  const sectionEvaluation = evaluateSections(sectionMatch);

  const sectionActions = sectionGapsToActions(
    sectionEvaluation.missing
  );

  /* --------------------
     Existing v4 gaps (optional)
  -------------------- */
  const gaps = detectTopicalGaps(
    serpTitles,
    pageHeadings
  );

  /* --------------------
     Merge actions
  -------------------- */
  const actions = prioritizeActions({
    intent: {
      status: intentStatus
    },
    missingSections: [
      ...gaps.missing,
      ...sectionEvaluation.missing.map(s => s.label)
    ],
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
     Final output
  -------------------- */
  return {
    intent: {
      serp: serpIntent.intent,
      page: pageIntent,
      status: intentStatus,
      confidence: serpIntent.confidence
    },
    sections: {
      expected: expectedSections.map(s => s.label),
      present: sectionEvaluation.present.map(s => s.label),
      missing: sectionEvaluation.missing.map(s => s.label)
    },
    actions,
    confidence
  };
}
