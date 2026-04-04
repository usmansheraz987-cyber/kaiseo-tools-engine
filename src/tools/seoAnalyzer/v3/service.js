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
const SERP_CACHE_TTL = 24 * 60 * 60 * 1000;
const serpCache = new Map();

const MAX_SERP_CALLS_PER_HOUR = 200;
let serpCalls = 0;
let serpWindowStart = Date.now();

function canUseSerpQuota() {
  const now = Date.now();

  if (now - serpWindowStart > 60 * 60 * 1000) {
    serpCalls = 0;
    serpWindowStart = now;
  }

  return serpCalls < MAX_SERP_CALLS_PER_HOUR;
}

/* ==================== */
export async function runSeoAnalyzerV3({ url, primaryQuery }) {
  try {
    if (!url) throw new Error("URL required");
    if (!primaryQuery) throw new Error("primaryQuery required");

    /* ---------- V2 ---------- */
    const v2Result = await runSeoAnalyzerV2({ url });
    const extracted = v2Result?.data?.extracted || {};

    const contentSignals = {
      cleanWordCount: extracted.cleanWordCount || 0,
      paragraphCount: extracted.paragraphCount || 0
    };

    /* ---------- SERP ---------- */
    let serpBenchmarks;
    let competitors = [];
    let usedFallback = false;

    const cacheKey = primaryQuery.toLowerCase();
    const cached = serpCache.get(cacheKey);

    if (cached && Date.now() - cached.time < SERP_CACHE_TTL) {
      serpBenchmarks = cached.serpBenchmarks;
      competitors = cached.competitors;
    } else {
      try {
        if (!canUseSerpQuota() || !canCallSerp()) {
          throw new Error("SERP_BLOCKED");
        }

        serpCalls++;

        const serpData = await fetchSerpResults(primaryQuery);

        recordSerpSuccess();

        serpBenchmarks = serpData.benchmarks;
        competitors = serpData.competitors;

        serpCache.set(cacheKey, {
          time: Date.now(),
          serpBenchmarks,
          competitors
        });

      } catch (err) {
        recordSerpFailure();
        usedFallback = true;

        serpBenchmarks = getIntentBenchmarks(primaryQuery);
        competitors = [];
      }
    }

    /* ---------- SCORING ---------- */
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

    /* ---------- SERP TITLES BRIDGE (CRITICAL) ---------- */
    const serpTitles = competitors.map(c => c.title).filter(Boolean);

    /* ---------- FINAL ---------- */
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