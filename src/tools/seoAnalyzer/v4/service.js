import { detectSerpIntent } from "./intent/detectIntent.js";
import { prioritizeActions } from "./actions/prioritize.js";
import { resolveConfidence } from "./confidence/confidenceScore.js";

import { getSectionRules } from "./sections/rules.js";
import { matchSections } from "./sections/matcher.js";
import { evaluateSections } from "./sections/evaluator.js";

import {
  calculateCompetitiveScore,
  getCompetitiveLevel
} from "./scoring/competitiveScore.js";

import { calculateCompetitorDelta } from "./scoring/competitorDelta.js";

/**
 * SEO Analyzer v4.2 (FINAL)
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
     Intent detection
  -------------------- */
  let serpIntent = detectSerpIntent(serpTitles);

  if (serpIntent.intent === "unknown") {
    serpIntent = {
      intent: "informational",
      confidence: 0.3,
      breakdown: {}
    };
  }

  const pageIntent =
    pageHeadings.length > 5 ? "informational" : "transactional";

  const intentStatus =
    serpIntent.intent === pageIntent
      ? "match"
      : "mismatch";

  /* --------------------
     Section logic
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
     Actions
  -------------------- */
  let actions = prioritizeActions({
    intent: { status: intentStatus },
    missingSections: weightedMissingSections.map(s => s.label),
    weakSections: [],
    hasCriticalTechnicalIssues
  });

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
     Competitive score (v4.2)
  -------------------- */
  const competitiveScore = calculateCompetitiveScore({
    intentStatus,
    missingSections: sectionEval.missing,
    hasCriticalTechnicalIssues
  });

  const competitiveLevel =
    getCompetitiveLevel(competitiveScore);

  /* --------------------
     Competitor delta (NEW)
  -------------------- */
  const competitorDelta = calculateCompetitorDelta({
    yourScore: competitiveScore,
    competitors: v3Result.competitors
  });

  /* --------------------
     Confidence
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
    confidence,

    // 🔥 v4.2 output
    competitive: {
      score: competitiveScore,
      level: competitiveLevel
    },

    delta: competitorDelta
  };
}