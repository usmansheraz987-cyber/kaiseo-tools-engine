import { detectSerpIntent } from "./intent/detectIntent.js";
import { prioritizeActions } from "./actions/prioritize.js";
import { resolveConfidence } from "./confidence/confidenceScore.js";

import { getSectionRules } from "./sections/rules.js";
import { matchSections } from "./sections/matcher.js";
import { evaluateSections } from "./sections/evaluator.js";

/**
 * SEO Analyzer v4 + v4.1
 * Decision + Section Expectation Engine
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

  const serpLive =
    v3Result?.context?.serpSource === "live";

  /* --------------------
     Page headings
  -------------------- */
  const pageHeadings = Array.isArray(v3Result?.extracted?.headings)
    ? v3Result.extracted.headings.map(h => h.text)
    : [];

  const hasCriticalTechnicalIssues =
    Boolean(v3Result?.score?.hasCriticalIndexabilityFail);

  /* --------------------
     Intent detection
  -------------------- */
  const serpIntent = detectSerpIntent(serpTitles);

  // We keep page intent conservative for now
  const pageIntent = "informational";

  const intentStatus =
    serpIntent.intent === "unknown"
      ? "unknown"
      : serpIntent.intent === pageIntent
      ? "match"
      : "mismatch";

  /* =================================================
     v4.1 — SECTION EXPECTATION RULES (B + C)
  ================================================= */

  // 1️⃣ Load expected sections based on intent
  const expectedSections = getSectionRules(serpIntent.intent);

  // 2️⃣ Match against page headings
  const sectionMatch = matchSections(
    expectedSections,
    pageHeadings
  );

  // 3️⃣ Evaluate with severity
  const sectionEval = evaluateSections(sectionMatch);

  // 4️⃣ Intent-based weighting
  // Comparison intent → ONLY high-severity sections block ranking
  const weightedMissingSections =
    serpIntent.intent === "comparison"
      ? sectionEval.missingBySeverity.high
      : sectionEval.missing;

  /* --------------------
     Build actions
  -------------------- */
  const actions = prioritizeActions({
    intent: { status: intentStatus },
    missingSections: weightedMissingSections.map(s => s.label),
    weakSections: [],
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
     Final v4 response
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
      present: sectionEval.present.map(s => s.label),
      missing: sectionEval.missing.map(s => ({
        label: s.label,
        severity: s.severity
      }))
    },
    actions,
    confidence
  };
}
