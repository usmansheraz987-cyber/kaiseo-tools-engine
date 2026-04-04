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

/* --------------------
   SERP CACHE (24h)
-------------------- */
const SERP_CACHE_TTL = 24 * 60 * 60 * 1000;
const serpCache = new Map();

/* --------------------
   QUOTA GUARD
-------------------- */
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

/* ====================
   MAIN RUNNER
==================== */
export async function runSeoAnalyzerV3({ url, primaryQuery }) {
  try {
    if (!url) {
      throw new Error("URL is required for v3 analysis");
    }

    if (!primaryQuery || primaryQuery.trim().length < 3) {
      throw new Error("primaryQuery is required for v3 analysis");
    }

    /* --------------------
       1️⃣ Run v2
    -------------------- */
    const v2Result = await runSeoAnalyzerV2({ url });

    const extracted = v2Result?.data?.extracted || {};

    // ✅ SAFE CONTENT SIGNALS (FIXED)
    const contentSignals = {
      cleanWordCount: extracted.cleanWordCount || 0,
      paragraphCount: extracted.paragraphCount || 0
    };

    // 🚨 NEVER CRASH — just warn
    if (!contentSignals.cleanWordCount) {
      console.warn("⚠️ Missing cleanWordCount from v2");
    }

    /* --------------------
       2️⃣ SERP (cache → live → fallback)
    -------------------- */
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
          throw new Error("SERP_GUARDED");
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
        console.warn("SERP FALLBACK USED:", err.message);

        recordSerpFailure();
        usedFallback = true;

        serpBenchmarks = getIntentBenchmarks(primaryQuery);
        competitors = [];
      }
    }

    /* --------------------
       3️⃣ Relative scoring
    -------------------- */
    const relativeScore = calculateRelativeScore({
      pageContent: contentSignals,
      serpBenchmarks,
      usedFallback
    });

    /* --------------------
       4️⃣ Competitor insights
    -------------------- */
    const competitorInsights = buildCompetitorInsights({
      competitors,
      serpBenchmarks,
      pageContent: contentSignals
    });

    /* --------------------
       5️⃣ FINAL RETURN (CLEAN STRUCTURE)
    -------------------- */
    return {
      ...v2Result.data,

      context: {
        query: primaryQuery,
        serpSampleSize: 10,
        serpSource: usedFallback ? "fallback" : "live"
      },

      serpBenchmarks,
      competitors,
      competitorInsights,
      relativeScore
    };

  } catch (err) {
    console.error("V3 SERVICE ERROR:", err);
    throw err;
  }
}