import { detectSerpIntent } from "./intent/detectIntent.js";
import { prioritizeActions } from "./actions/prioritize.js";
import { resolveConfidence } from "./confidence/confidenceScore.js";

import { getSectionRules } from "./sections/rules.js";
import { matchSections } from "./sections/matcher.js";
import { evaluateSections } from "./sections/evaluator.js";

/**
 * SEO Analyzer v4 (UPGRADED)
 */
export async function runSeoAnalyzerV4({ v3Result }) {
  if (!v3Result) {
    throw new Error("V4_REQUIRES_V3_RESULT");
  }

  /* --------------------
     SERP titles
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
     Intent detection (FIXED)
  -------------------- */
  let serpIntent = detectSerpIntent(serpTitles);

  // 🔥 fallback (NEVER allow unknown)
  if (serpIntent.intent === "unknown") {
    serpIntent = {
      intent: "informational",
      confidence: 0.3,
      breakdown: {}
    };
  }

  // 🔥 simple page intent detection (better than hardcode)
  const pageIntent =
    pageHeadings.length > 5 ? "informational" : "transactional";

  const intentStatus =
    serpIntent.intent === pageIntent
      ? "match"
      : "mismatch";

  /* --------------------
     Section rules
  -------------------- */
  const expectedSections = getSectionRules(serpIntent.intent);

  const sectionMatch = matchSections(
    expectedSections,
    pageHeadings
  );

  const sectionEval = evaluateSections(sectionMatch);

  const weightedMissingSections =
    serpIntent.intent === "comparison"
      ? sectionEval.missingBySeverity.high
      : sectionEval.missing;

  /* --------------------
     Build actions (FIXED)
  -------------------- */
  let actions = prioritizeActions({
    intent: { status: intentStatus },
    missingSections: weightedMissingSections.map(s => s.label),
    weakSections: [],
    hasCriticalTechnicalIssues
  });

  // 🔥 fallback action (CRITICAL UX FIX)
  if (actions.length === 0) {
    actions = [
      {
        priority: 1,
        action: "Improve content depth and topical coverage",
        reason: "Page meets baseline structure but lacks competitive depth"
      }
    ];
  }

  /* --------------------
     Confidence (slightly boosted)
  -------------------- */
  const confidence = resolveConfidence({
    serpLive,
    intentConfidence: Math.max(serpIntent.confidence, 0.4)
  });

  /* --------------------
     Final response
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