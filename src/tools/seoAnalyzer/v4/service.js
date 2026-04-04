import { detectSerpIntent } from "./intent/detectIntent.js";
import { getSectionRules } from "./sections/rules.js";
import { matchSections } from "./sections/matcher.js";
import { evaluateSections } from "./sections/evaluator.js";
import { prioritizeActions } from "./actions/prioritize.js";
import { resolveConfidence } from "./confidence/confidenceScore.js";

export async function runSeoAnalyzerV4({ v3Result }) {
  try {
    /* -----------------------------
       HEADINGS + CONTENT
    ----------------------------- */
    const rawHeadings =
      v3Result?.extracted?.headings?.structure || {};

    const headings = [
      ...(rawHeadings.h1 || []),
      ...(rawHeadings.h2 || []),
      ...(rawHeadings.h3 || [])
    ];

    const safeHeadings = Array.isArray(headings) ? headings : [];

    // 🔥 NEW: full page text for deeper detection
    const pageText =
      v3Result?.extracted?.text?.content || "";

    /* -----------------------------
       SERP TITLES
    ----------------------------- */
    let serpTitles = v3Result?.serp?.titles || [];

    if (!serpTitles.length) {
      serpTitles = ["what is", "best", "how to"];
    }

    /* -----------------------------
       HYBRID INTENT
    ----------------------------- */
    const serpIntentResult = detectSerpIntent(serpTitles);

    const intent = {
      primary: serpIntentResult.primary,
      secondary: serpIntentResult.secondary,
      distribution: serpIntentResult.distribution,
      confidence: serpIntentResult.confidence
    };

    /* -----------------------------
       PAGE INTENT
    ----------------------------- */
    const combinedText = (
      safeHeadings.join(" ") +
      " " +
      pageText
    ).toLowerCase();

    let pageIntent = "informational";

    if (
      combinedText.includes("buy") ||
      combinedText.includes("price") ||
      combinedText.includes("pricing")
    ) {
      pageIntent = "transactional";
    }

    if (
      combinedText.includes("best") ||
      combinedText.includes("vs") ||
      combinedText.includes("compare")
    ) {
      pageIntent = "comparison";
    }

    intent.page = pageIntent;
    intent.status =
      intent.primary === intent.page ? "match" : "mismatch";

    /* -----------------------------
       SECTION ANALYSIS
    ----------------------------- */
    const expectedSections = getSectionRules(intent.primary);

    const sectionMatch = matchSections(
      expectedSections,
      safeHeadings,
      pageText // 🔥 critical upgrade
    );

    const evaluated = evaluateSections(sectionMatch);

    const presentLabels = evaluated.present.map(s => s.label);
    const missingLabels = evaluated.missing.map(s => s.label);

    /* -----------------------------
       ACTIONS
    ----------------------------- */
    const actions = prioritizeActions({
      intent,
      missingSections: missingLabels
    });

    /* -----------------------------
       CONFIDENCE
    ----------------------------- */
    const confidence = resolveConfidence({
      serpLive: v3Result?.context?.serpSource === "live",
      intentConfidence: intent.confidence
    });

    /* -----------------------------
       SCORING
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
       COMPETITOR INSIGHTS
    ----------------------------- */
    const topCompetitors =
      v3Result?.competitors?.slice(0, 3).map(c => c.title);

    /* -----------------------------
       FINAL RESPONSE
    ----------------------------- */
    return {
      intent: {
        primary: intent.primary,
        secondary: intent.secondary,
        distribution: intent.distribution,
        page: intent.page,
        status: intent.status,
        confidence: intent.confidence
      },

      sections: {
        present: presentLabels,
        missing: missingLabels,
        missingBySeverity: evaluated.missingBySeverity
      },

      actions,

      insights: {
        topCompetitors:
          topCompetitors?.length
            ? topCompetitors
            : ["Fallback mode"]
      },

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