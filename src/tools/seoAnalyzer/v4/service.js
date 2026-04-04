import { detectSerpIntent } from "./intent/detectIntent.js";
import { getSectionRules } from "./sections/rules.js";
import { matchSections } from "./sections/matcher.js";
import { evaluateSections } from "./sections/evaluator.js";
import { prioritizeActions } from "./actions/prioritize.js";
import { resolveConfidence } from "./confidence/confidenceScore.js";

export async function runSeoAnalyzerV4({ v3Result }) {
  try {
    // -----------------------------
    // SAFE HEADING EXTRACTION (FIXED)
    // -----------------------------
    const rawHeadings =
      v3Result?.data?.extracted?.headings?.structure || {};

    const headings = [
      ...(rawHeadings.h1 || []),
      ...(rawHeadings.h2 || []),
      ...(rawHeadings.h3 || []),
      ...(rawHeadings.h4 || []),
      ...(rawHeadings.h5 || []),
      ...(rawHeadings.h6 || [])
    ].filter(Boolean);

    const safeHeadings = Array.isArray(headings) ? headings : [];

    const serpTitles =
      v3Result?.data?.serp?.titles || [];

    const serpSource =
      v3Result?.data?.serp?.source || "fallback";

    // -----------------------------
    // 1. SERP INTENT
    // -----------------------------
    const serpIntentResult = detectSerpIntent(serpTitles);

    let intent = {
      serp: serpIntentResult.intent || "informational",
      confidence: serpIntentResult.confidence || 0.4,
      breakdown: serpIntentResult.breakdown || {}
    };

    // -----------------------------
    // 2. PAGE INTENT
    // -----------------------------
    const headingText = safeHeadings.join(" ").toLowerCase();

    let pageIntent = "informational";

    if (headingText.includes("buy") || headingText.includes("price")) {
      pageIntent = "transactional";
    }

    if (
      headingText.includes("best") ||
      headingText.includes("top") ||
      headingText.includes("vs")
    ) {
      pageIntent = "comparison";
    }

    intent.page = pageIntent;

    // -----------------------------
    // 3. STATUS
    // -----------------------------
    intent.status =
      intent.serp === intent.page ? "match" : "mismatch";

    // -----------------------------
    // 4. EXPECTED SECTIONS
    // -----------------------------
    const expectedSections = getSectionRules(intent.serp);

    // -----------------------------
    // 5. MATCH SECTIONS
    // -----------------------------
    const sectionMatch = matchSections(expectedSections, safeHeadings);

    // -----------------------------
    // 6. EVALUATE
    // -----------------------------
    const evaluated = evaluateSections(sectionMatch);

    // -----------------------------
    // 7. ACTIONS (FIXED INPUT)
    // -----------------------------
    let actions = prioritizeActions({
      intent,
      missingSections: evaluated.missing.map(s => s.label),
      weakSections: [],
      hasCriticalTechnicalIssues: false
    });

    if (!actions || actions.length === 0) {
      actions = [
        {
          priority: 1,
          action: "Improve alignment with search intent",
          reason:
            "Content does not strongly match dominant SERP intent"
        }
      ];
    }

    // -----------------------------
    // 8. CONFIDENCE
    // -----------------------------
    const confidence = resolveConfidence({
      serpLive: serpSource === "live",
      intentConfidence: intent.confidence
    });

    // -----------------------------
    // 9. SCORE (FIXED)
    // -----------------------------
    let score = 100;

    if (intent.status === "mismatch") score -= 25;

    score -= evaluated.missingBySeverity.high.length * 10;
    score -= evaluated.missingBySeverity.medium.length * 5;

    score = Math.max(0, Math.min(100, score));

    let level = "strong";
    if (score < 80) level = "average";
    if (score < 60) level = "weak";
    if (score < 40) level = "critical";

    // -----------------------------
    // 10. DELTA
    // -----------------------------
    const competitorAverage = 65;
    const delta = score - competitorAverage;

    let position = "ahead";
    if (delta < 0) position = "behind";
    if (delta < -20) position = "far_behind";

    // -----------------------------
    // FINAL RESPONSE
    // -----------------------------
    return {
      intent,
      sections: evaluated,
      actions,
      confidence,
      competitive: {
        score,
        level
      },
      delta: {
        average: competitorAverage,
        delta,
        position
      }
    };

  } catch (err) {
    console.error("V4 Service Error:", err);
    throw err;
  }
}