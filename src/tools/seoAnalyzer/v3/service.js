import { runSeoAnalyzerV2 } from "../v2/service.js";
import { fetchSerpResults } from "./serp.js";
import { serpContextAnalyzer } from "./analyzer/serpContext.js";
import { getIntentBenchmarks } from "./intentBenchmarks.js";
import {
  canCallSerpSafely,
  recordSerpFailure,
  recordSerpSuccess
} from "./safety/serpCircuit.js";
import { buildCompetitorInsights } from "./competitors/insights.js";

console.log("V3 SERVICE FILE LOADED");

/* --------------------
   SERP CACHE (24h)
-------------------- */
const SERP_CACHE_TTL = 24 * 60 * 60 * 1000;
const serpCache = new Map();

/* --------------------
   QUOTA GUARD (soft)
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

export async function runSeoAnalyzerV3({ url, primaryQuery }) {
  console.log("V3 SERVICE FUNCTION RUNNING");

  if (!url) throw new Error("URL is required for v3 analysis");
  if (!primaryQuery || primaryQuery.trim().length < 3)
    throw new Error("primaryQuery is required for v3 analysis");

  /* --------------------
     1️⃣ Run v2
  -------------------- */
  const v2Result = await runSeoAnalyzerV2({ url });
  const content = v2Result.extracted.content;

  /* --------------------
     2️⃣ SERP (cache → real → fallback)
  -------------------- */
  let serpBenchmarks;
  let competitors = [];
  let serpSource = "live";
  let usedFallback = false;

  const cacheKey = primaryQuery.toLowerCase();
  const cached = serpCache.get(cacheKey);

  if (cached && Date.now() - cached.time < SERP_CACHE_TTL) {
    serpBenchmarks = cached.serpBenchmarks;
    competitors = cached.competitors;
  } else {
    try {
      if (!canUseSerpQuota()) throw new Error("SERP_QUOTA_LIMIT");
      if (!canCallSerpSafely()) throw new Error("SERP_CIRCUIT_OPEN");

      serpCalls++;
      console.log("SERP API CALLED");

      const serpData = await fetchSerpResults(primaryQuery);
      serpBenchmarks = serpData.benchmarks;
      competitors = serpData.competitors;

      serpCache.set(cacheKey, {
        time: Date.now(),
        serpBenchmarks,
        competitors
      });

      recordSerpSuccess();
    } catch (err) {
      console.warn("SERP FALLBACK USED:", err.message);

      recordSerpFailure();
      serpBenchmarks = getIntentBenchmarks(primaryQuery);
      competitors = [];
      serpSource = "fallback";
      usedFallback = true;
    }
  }

  /* --------------------
     3️⃣ Relative score (your existing logic)
  -------------------- */
  const relativeScore = serpContextAnalyzer({
    pageWordCount: content.cleanWordCount,
    pageParagraphCount: content.paragraphCount,
    serpBenchmarks
  });

  if (usedFallback) {
    relativeScore.note = "Estimated benchmarks used";
  }

  /* --------------------
     4️⃣ Competitor insights
  -------------------- */
  const competitorInsights = buildCompetitorInsights(competitors);

  /* --------------------
     5️⃣ Final response (TRUST FLAGS)
  -------------------- */
  return {
    ...v2Result,
    context: {
      query: primaryQuery,
      serpSource,          // live | fallback
      cached: Boolean(cached)
    },
    serpBenchmarks,
    competitors,
    competitorInsights,
    relativeScore
  };
}
