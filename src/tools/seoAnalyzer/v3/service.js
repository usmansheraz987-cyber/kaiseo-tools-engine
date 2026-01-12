import { runSeoAnalyzerV2 } from "../v2/service.js";
import { fetchSerpResults } from "./serp.js";
import { serpContextAnalyzer } from "./analyzer/serpContext.js";
import { getIntentBenchmarks } from "./intentBenchmarks.js";

console.log("V3 SERVICE FILE LOADED");

/* --------------------
   SERP CACHE (24h)
-------------------- */
const SERP_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const serpCache = new Map();

/* --------------------
   QUOTA GUARD (soft)
-------------------- */
const MAX_SERP_CALLS_PER_HOUR = 200;
let serpCalls = 0;
let serpWindowStart = Date.now();

function canUseSerp() {
  const now = Date.now();

  if (now - serpWindowStart > 60 * 60 * 1000) {
    serpCalls = 0;
    serpWindowStart = now;
  }

  return serpCalls < MAX_SERP_CALLS_PER_HOUR;
}

export async function runSeoAnalyzerV3({ url, primaryQuery }) {
  console.log("V3 SERVICE FUNCTION RUNNING");

  if (!url) {
    throw new Error("URL is required for v3 analysis");
  }

  if (!primaryQuery || primaryQuery.trim().length < 3) {
    throw new Error("primaryQuery is required for v3 analysis");
  }

  /* --------------------
     1️⃣ Run v2 (core analysis)
  -------------------- */
  const v2Result = await runSeoAnalyzerV2({ url });

  const contentSignals = v2Result?.extracted?.content;
  if (!contentSignals) {
    throw new Error("Content signals missing from v2 analysis.");
  }

  /* --------------------
     2️⃣ SERP (cache → real → fallback)
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
      if (!canUseSerp()) {
        throw new Error("SERP_QUOTA_GUARD");
      }

      console.log("SERP API CALLED");
      serpCalls++;

      const serpData = await fetchSerpResults(primaryQuery);

      serpBenchmarks = serpData.benchmarks;
      competitors = serpData.competitors;

      serpCache.set(cacheKey, {
        time: Date.now(),
        serpBenchmarks,
        competitors
      });
    } catch (err) {
      console.warn("SERP FALLBACK USED:", err.message);

      usedFallback = true;
      serpBenchmarks = getIntentBenchmarks(primaryQuery);
      competitors = [];
    }
  }

  /* --------------------
     3️⃣ Relative score
  -------------------- */
  const relativeScore = serpContextAnalyzer({
    pageWordCount: contentSignals.cleanWordCount,
    pageParagraphCount: contentSignals.paragraphCount,
    serpBenchmarks
  });

  if (usedFallback) {
    relativeScore.note = "Fallback baseline used";
  }

  /* --------------------
     4️⃣ Final response
  -------------------- */
  return {
    ...v2Result,
    context: {
      query: primaryQuery,
      serpSampleSize: 10,
      serpSource: usedFallback ? "fallback" : "live"
    },
    serpBenchmarks,
    competitors,
    relativeScore
  };
}
