import { runSeoAnalyzerV2 } from "../v2/service.js";
import { fetchSerpResults } from "./serp.js";
import { getIntentBenchmarks } from "./intentBenchmarks.js";

/* ───────────────── Cache (in-memory, 24h) ───────────────── */

const CACHE_TTL = 24 * 60 * 60 * 1000;
const cache = new Map();

function getCacheKey(url, query) {
  return `${url}::${query}`.toLowerCase();
}

/* ───────────────── Main Runner ───────────────── */

export async function runSeoAnalyzerV3({ url, primaryQuery }) {
  const cacheKey = getCacheKey(url, primaryQuery);
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.time < CACHE_TTL) {
    return cached.data;
  }

  /* 1️⃣ Run v2 (CORE ANALYSIS) */
  const v2Result = await runSeoAnalyzerV2({ url });

  if (!v2Result?.extracted?.content) {
    throw new Error("Content signals missing from v2 analysis.");
  }

  /* 2️⃣ SERP (real or fallback) */
  let serpBenchmarks;
  let competitors = [];
  let relativeScore = {
    overall: 50,
    contentDepth: "unknown",
    structureMatch: "unknown",
    note: "Fallback baseline used"
  };

  try {
    if (process.env.SERP_API_ENABLED === "true") {
      const serpData = await fetchSerpResults(primaryQuery);

      serpBenchmarks = serpData.benchmarks;
      competitors = serpData.competitors;

      relativeScore = {
        overall:
          v2Result.extracted.content.cleanWordCount >=
          serpBenchmarks.medianWordCount
            ? 90
            : 50,
        contentDepth:
          v2Result.extracted.content.cleanWordCount >=
          serpBenchmarks.medianWordCount
            ? "meets_serp_median"
            : "below_serp_median",
        structureMatch: "partial"
      };
    } else {
      throw new Error("SERP_DISABLED");
    }
  } catch {
    serpBenchmarks = getIntentBenchmarks(primaryQuery);
  }

  /* 3️⃣ Final Response */
  const finalResult = {
    ...v2Result,
    context: {
      query: primaryQuery,
      serpSampleSize: 10
    },
    relativeScore,
    serpBenchmarks,
    competitors
  };

  cache.set(cacheKey, {
    time: Date.now(),
    data: finalResult
  });

  return finalResult;
}
