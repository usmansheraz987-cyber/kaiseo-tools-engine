import { detectSerpIntent } from "./intent/detectIntent.js";
import { getSectionRules } from "./sections/rules.js";
import { matchSections } from "./sections/matcher.js";
import { evaluateSections } from "./sections/evaluator.js";
import { prioritizeActions } from "./actions/prioritize.js";
import { resolveConfidence } from "./confidence/confidenceScore.js";

export async function runSeoAnalyzerV4({ v3Result }) {
  try {
    /* -----------------------------
       SAFE HEADING EXTRACTION
    ----------------------------- */
    const rawHeadings =
      v3Result?.extracted?.headings?.structure || {};

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
      v3Result?.serp?.titles || [];

    const serpSource =
      v3Result?.context?.serpSource || "fallback";

    /* -----------------------------
       1. INTENT
    ----------------------------- */
    const serpIntentResult = detectSerpIntent(serpTitles);

    let intent = {
      serp: serpIntentResult.intent || "informational",
      confidence: serpIntentResult.confidence || 0.4,
      breakdown: serpIntentResult.breakdown || {}
    };

    /* -----------------------------
       2. PAGE INTENT
    ----------------------------- */
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

    /* -----------------------------
       3. STATUS
    ----------------------------- */
    intent.status =
      intent.serp === intent.page ? "match" : "mismatch";

    /* -----------------------------
       4. SECTIONS
    ----------------------------- */
    const expectedSections = getSectionRules(intent.serp);

    const sectionMatch = matchSections(
      expectedSections,
      safeHeadings
    );

    const evaluated = evaluateSections(sectionMatch);

    /* -----------------------------
       5. ACTIONS
    ----------------------------- */
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
          action: "Improve alignment with search intent",
          reason: "Content does not strongly match SERP intent"
        }
      ];
    }

    /* -----------------------------
       6. CONFIDENCE
    ----------------------------- */
    const confidence = resolveConfidence({
      serpLive: serpSource === "live",
      intentConfidence: intent.confidence
    });

    /* -----------------------------
       7. SCORE
    ----------------------------- */
    let score = 100;

    if (intent.status === "mismatch") score -= 25;

    score -= evaluated.missingBySeverity.high.length * 10;
    score -= evaluated.missingBySeverity.medium.length * 5;

    score = Math.max(0, Math.min(100, score));

    let level = "strong";
    if (score < 80) level = "average";
    if (score < 60) level = "weak";
    if (score < 40) level = "critical";

    /* -----------------------------
       FINAL
    ----------------------------- */
    return {
      intent,
      sections: evaluated,
      actions,
      confidence,
      competitive: {
        score,
        level
      }
    };

  } catch (err) {
    console.error("V4 SERVICE ERROR:", err);
    throw err;
  }
}