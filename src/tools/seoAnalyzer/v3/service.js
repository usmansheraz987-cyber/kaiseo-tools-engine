import { runSeoAnalyzerV2 } from "../v2/service.js";
import { fetchSerpResults } from "./serp.js";
import { serpContextAnalyzer } from "./analyzer/serpContext.js";

console.log("V3 SERVICE FILE LOADED");

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
     2️⃣ SERP (REAL — no fallback)
  -------------------- */
  const serpData = await fetchSerpResults(primaryQuery);

  const serpBenchmarks = serpData.benchmarks;
  const competitors = serpData.competitors;

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
      serpSampleSize: 10
    },
    serpBenchmarks,
    competitors,
    relativeScore
  };
}
