import { runSeoAnalyzerV2 } from "../v2/service.js";
import { fetchSerpResults } from "./serp.js";
import { getIntentBenchmarks } from "./intentBenchmarks.js";

import {
  canCallSerp,
  recordSerpFailure,
  recordSerpSuccess
} from "./safety/serpGuard.js";

import { calculateRelativeScore } from "./scoring/relativeScoring.js";
import { buildCompetitorInsights } from "./competitors/insights.js";

/* -------------------- */
export async function runSeoAnalyzerV3({ url, primaryQuery }) {
  try {
    const v2Result = await runSeoAnalyzerV2({ url });
    const extracted = v2Result?.data?.extracted || {};

    const contentSignals = {
      cleanWordCount: extracted.cleanWordCount || 0,
      paragraphCount: extracted.paragraphCount || 0
    };

    let serpBenchmarks;
    let competitors = [];
    let usedFallback = false;

    try {
      if (!canCallSerp()) {
        throw new Error("SERP_BLOCKED_BY_GUARD");
      }

      console.log("🔍 Calling SERP API for:", primaryQuery);

      const serpData = await fetchSerpResults(primaryQuery);

      console.log("✅ SERP RAW RESPONSE:", serpData);

      if (!serpData || !Array.isArray(serpData.competitors)) {
        throw new Error("INVALID_SERP_RESPONSE");
      }

      recordSerpSuccess();

      serpBenchmarks = serpData.benchmarks || {};
      competitors = serpData.competitors;

    } catch (err) {
      console.error("🚨 SERP FAILED:", err.message);

      recordSerpFailure();
      usedFallback = true;

      serpBenchmarks = getIntentBenchmarks(primaryQuery);
      competitors = [];
    }

    /* 🔥 ALWAYS PROVIDE TITLES */
    let serpTitles = competitors.map(c => c.title).filter(Boolean);

    if (!serpTitles.length) {
      serpTitles = [
        `what is ${primaryQuery}`,
        `how to choose ${primaryQuery}`,
        `best ${primaryQuery}`
      ];
    }

    const relativeScore = calculateRelativeScore({
      pageContent: contentSignals,
      serpBenchmarks,
      usedFallback
    });

    const competitorInsights = buildCompetitorInsights({
      competitors,
      serpBenchmarks,
      pageContent: contentSignals
    });

    return {
      ...v2Result.data,

      context: {
        query: primaryQuery,
        serpSource: usedFallback ? "fallback" : "live"
      },

      serp: {
        titles: serpTitles
      },

      serpBenchmarks,
      competitors,
      competitorInsights,
      relativeScore
    };

  } catch (err) {
    console.error("V3 ERROR:", err);
    throw err;
  }
}