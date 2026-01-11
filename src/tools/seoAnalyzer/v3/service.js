import { runSeoAnalyzerV2 } from "../v2/service.js";
import { fetchSerpData } from "./serp.js";
import { serpContextAnalyzer } from "./analyzer/serpContext.js";

/**
 * V3 MAIN SERVICE
 * - Calls v2 for core analysis
 * - Calls real SERP API (NO fallback)
 * - Throws error if SERP fails
 */
export async function runSeoAnalyzerV3({ url, primaryQuery }) {
  console.log("V3 SERVICE FUNCTION RUNNING");

  if (!url) {
    throw new Error("URL is required for v3 analysis.");
  }

  if (!primaryQuery || primaryQuery.trim().length < 3) {
    throw new Error("primaryQuery is required for v3 analysis.");
  }

  /* --------------------
     1️⃣ Run v2 analysis
  -------------------- */
  const v2Result = await runSeoAnalyzerV2({ url });

  const contentSignals = v2Result?.extracted?.content;
  if (!contentSignals) {
    throw new Error("Content signals missing from v2 analysis.");
  }

  /* --------------------
     2️⃣ REAL SERP API (NO FALLBACK)
  -------------------- */
  console.log("SERP API CALLED");

  const serpData = await fetchSerpData(primaryQuery);
  const { serpBenchmarks, competitors } = serpData;

  /* --------------------
     3️⃣ Relative score
  -------------------- */
  const relativeScore = serpContextAnalyzer({
    pageWordCount: contentSignals.cleanWordCount,
    pageParagraphCount: contentSignals.paragraphCount,
    serpBenchmarks
  });

  /* --------------------
     4️⃣ Final response
  -------------------- */
  return {
    ...v2Result,
    context: {
      query: primaryQuery,
      serpSampleSize: serpBenchmarks?.sampleSize || null
    },
    relativeScore,
    serpBenchmarks,
    competitors
  };
}
