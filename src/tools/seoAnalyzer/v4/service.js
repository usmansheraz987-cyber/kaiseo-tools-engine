import { detectSerpIntent } from "./intent/detectIntent.js";
import { getSectionRules } from "./sections/rules.js";
import { matchSections } from "./sections/matcher.js";
import { evaluateSections } from "./sections/evaluator.js";
import { prioritizeActions } from "./actions/prioritize.js";
import { resolveConfidence } from "./confidence/confidenceScore.js";

export async function runSeoAnalyzerV4({ v3Result }) {
  try {
    const raw =
      v3Result?.extracted?.headings?.structure || {};

    const headings = [
      ...(raw.h1 || []),
      ...(raw.h2 || []),
      ...(raw.h3 || [])
    ];

    const safeHeadings = Array.isArray(headings) ? headings : [];

    let serpTitles = v3Result?.serp?.titles || [];

    const serpIntentResult = detectSerpIntent(serpTitles);

    const intent = {
      primary: serpIntentResult.primary,
      secondary: serpIntentResult.secondary,
      distribution: serpIntentResult.distribution,
      confidence: serpIntentResult.confidence
    };

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
      intent.primary === intent.page ? "match" : "mismatch";

    const expected = getSectionRules(intent.primary);
    const match = matchSections(expected, safeHeadings);
    const evaluated = evaluateSections(match);

    const missingLabels = evaluated.missing.map(s => s.label);
    const presentLabels = evaluated.present.map(s => s.label);

    const actions = prioritizeActions({
      intent,
      missingSections: missingLabels
    });

    const confidence = resolveConfidence({
      serpLive: v3Result?.context?.serpSource === "live",
      intentConfidence: intent.confidence
    });

    let score = 100;

    if (intent.status === "mismatch") score -= 25;

    score -= evaluated.missingBySeverity.high.length * 10;
    score -= evaluated.missingBySeverity.medium.length * 5;

    score = Math.max(0, Math.min(100, score));

    let level = "strong";
    if (score < 80) level = "average";
    if (score < 60) level = "weak";
    if (score < 40) level = "critical";

    const topCompetitors =
      v3Result?.competitors?.slice(0, 3).map(c => c.title);

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
    console.error("V4 ERROR:", err);
    throw err;
  }
}