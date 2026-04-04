import { detectSerpIntent } from "./intent/detectIntent.js";
import { getSectionRules } from "./sections/rules.js";
import { matchSections } from "./sections/matcher.js";
import { evaluateSections } from "./sections/evaluator.js";
import { prioritizeActions } from "./actions/prioritize.js";
import { resolveConfidence } from "./confidence/confidenceScore.js";

export async function runSeoAnalyzerV4({ v3Result }) {
  try {
    /* ---------- HEADINGS ---------- */
    const raw =
      v3Result?.extracted?.headings?.structure || {};

    const headings = [
      ...(raw.h1 || []),
      ...(raw.h2 || []),
      ...(raw.h3 || [])
    ];

    const safeHeadings = Array.isArray(headings) ? headings : [];

    /* ---------- SERP TITLES ---------- */
    let serpTitles = v3Result?.serp?.titles || [];

    if (!serpTitles.length) {
      serpTitles = ["what is", "how to", "guide"];
    }

    /* ---------- INTENT ---------- */
    const serpIntentResult = detectSerpIntent(serpTitles);

    let intent = {
      serp: serpIntentResult.intent || "informational",
      confidence: serpIntentResult.confidence || 0.4
    };

    if (!intent.serp || intent.serp === "unknown") {
      intent.serp = "informational";
    }

    /* ---------- PAGE INTENT ---------- */
    const text = safeHeadings.join(" ").toLowerCase();

    let pageIntent = "informational";

    if (text.includes("buy") || text.includes("price")) {
      pageIntent = "transactional";
    }

    if (text.includes("best") || text.includes("vs")) {
      pageIntent = "comparison";
    }

    intent.page = pageIntent;
    intent.status =
      intent.serp === intent.page ? "match" : "mismatch";

    /* ---------- SECTIONS ---------- */
    const expected = getSectionRules(intent.serp);
    const match = matchSections(expected, safeHeadings);
    const evaluated = evaluateSections(match);

    /* ---------- ACTIONS ---------- */
    let actions = prioritizeActions({
      intent,
      missingSections: evaluated.missing.map(s => s.label),
      weakSections: [],
      hasCriticalTechnicalIssues: false
    });

    if (!actions.length) {
      actions = [
        {
          priority: 1,
          action: "Improve content depth",
          reason: "Low structural alignment"
        }
      ];
    }

    /* ---------- CONFIDENCE ---------- */
    const confidence = resolveConfidence({
      serpLive: v3Result?.context?.serpSource === "live",
      intentConfidence: intent.confidence
    });

    /* ---------- SCORE ---------- */
    let score = 100;

    if (intent.status === "mismatch") score -= 25;

    score -= evaluated.missingBySeverity.high.length * 10;
    score -= evaluated.missingBySeverity.medium.length * 5;

    score = Math.max(0, Math.min(100, score));

    let level = "strong";
    if (score < 80) level = "average";
    if (score < 60) level = "weak";
    if (score < 40) level = "critical";

    return {
      intent,
      sections: evaluated,
      actions,
      confidence,
      competitive: { score, level }
    };

  } catch (err) {
    console.error("V4 ERROR:", err);
    throw err;
  }
}