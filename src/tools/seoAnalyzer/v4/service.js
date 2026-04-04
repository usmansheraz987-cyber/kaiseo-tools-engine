import { detectIntent } from "./intent/detectIntent.js";
import { sectionRules } from "./sections/rules.js";
import { matchSections } from "./sections/matcher.js";
import { evaluateSections } from "./sections/evaluator.js";
import { prioritizeActions } from "./actions/prioritize.js";
import { confidenceScore } from "./confidence/confidenceScore.js";

export async function runSeoAnalyzerV4({ v3Result }) {
  try {
    const headings =
      v3Result?.data?.extracted?.headings?.structure?.h1 || [];

    const serpTitles =
      v3Result?.data?.serp?.titles || [];

    // -----------------------------
    // 1. Intent Detection (FIXED)
    // -----------------------------
    let intent = detectIntent({
      serpTitles,
      headings
    });

    // 🚨 fallback intent (never unknown)
    if (!intent.serp) {
      intent.serp = "informational";
      intent.confidence = 0.3;
    }

    if (!intent.page) {
      intent.page = "informational";
    }

    if (!intent.status) {
      intent.status =
        intent.serp === intent.page ? "match" : "mismatch";
    }

    // -----------------------------
    // 2. Section Rules
    // -----------------------------
    const expectedSections = sectionRules(intent.serp);

    // -----------------------------
    // 3. Match Sections
    // -----------------------------
    const sectionMatch = matchSections({
      headings,
      expectedSections
    });

    // -----------------------------
    // 4. Evaluate
    // -----------------------------
    const evaluated = evaluateSections(sectionMatch);

    // -----------------------------
    // 5. Actions
    // -----------------------------
    let actions = prioritizeActions({
      intent,
      evaluated
    });

    // 🚨 fallback actions (never empty)
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
    // 6. Confidence
    // -----------------------------
    const confidence = confidenceScore({
      intent,
      evaluated
    });

    // -----------------------------
    // 7. Competitive Score (NEW)
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
    // 8. Competitor Delta (NEW)
    // -----------------------------
    const competitorAverage = 65;
    const delta = score - competitorAverage;

    let position = "ahead";
    if (delta < 0) position = "behind";
    if (delta < -20) position = "far_behind";

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