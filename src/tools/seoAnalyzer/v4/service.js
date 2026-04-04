import { detectSerpIntent } from "./intent/detectIntent.js";
import { sectionRules } from "./sections/rules.js";
import { matchSections } from "./sections/matcher.js";
import { evaluateSections } from "./sections/evaluator.js";
import { prioritizeActions } from "./actions/prioritize.js";
import { resolveConfidence } from "./confidence/confidenceScore.js";

export async function runSeoAnalyzerV4({ v3Result }) {
  try {
    // -----------------------------
    // SAFE EXTRACTION
    // -----------------------------
    const headings =
      v3Result?.data?.extracted?.headings?.structure?.h1 || [];

    const serpTitles =
      v3Result?.data?.serp?.titles || [];

    const serpSource =
      v3Result?.data?.serp?.source || "fallback";

    // -----------------------------
    // 1. SERP INTENT (REAL LOGIC)
    // -----------------------------
    const serpIntentResult = detectSerpIntent(serpTitles);

    let intent = {
      serp: serpIntentResult.intent,
      confidence: serpIntentResult.confidence,
      breakdown: serpIntentResult.breakdown
    };

    // -----------------------------
    // 2. PAGE INTENT (HEADING BASED)
    // -----------------------------
    const headingText = headings.join(" ").toLowerCase();

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
    // 3. STATUS (MATCH / MISMATCH)
    // -----------------------------
    intent.status =
      intent.serp === intent.page ? "match" : "mismatch";

    // 🚨 SAFETY FALLBACK (NEVER UNKNOWN)
    if (!intent.serp || intent.serp === "unknown") {
      intent.serp = "informational";
      intent.confidence = 0.4;
    }

    // -----------------------------
    // 4. EXPECTED SECTIONS
    // -----------------------------
    const expectedSections = sectionRules(intent.serp);

    // -----------------------------
    // 5. MATCH SECTIONS
    // -----------------------------
    const sectionMatch = matchSections({
      headings,
      expectedSections
    });

    // -----------------------------
    // 6. EVALUATE SECTIONS
    // -----------------------------
    const evaluated = evaluateSections(sectionMatch);

    // -----------------------------
    // 7. ACTIONS
    // -----------------------------
    let actions = prioritizeActions({
      intent,
      evaluated
    });

    // 🚨 NEVER RETURN EMPTY ACTIONS
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
    // 8. CONFIDENCE (REAL SYSTEM)
    // -----------------------------
    const confidence = resolveConfidence({
      serpLive: serpSource === "live",
      intentConfidence: intent.confidence || 0.4
    });

    // -----------------------------
    // 9. COMPETITIVE SCORE (v4.2)
    // -----------------------------
    let score = 100;

    if (intent.status === "mismatch") score -= 25;

    score -= evaluated.missing.high.length * 10;
    score -= evaluated.missing.medium.length * 5;

    score = Math.max(0, Math.min(100, score));

    let level = "strong";
    if (score < 80) level = "average";
    if (score < 60) level = "weak";
    if (score < 40) level = "critical";

    // -----------------------------
    // 10. COMPETITOR DELTA (v4.2)
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