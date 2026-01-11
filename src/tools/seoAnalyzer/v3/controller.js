import { runSeoAnalyzerV2 } from "../v2/service.js";
import { fetchSerpData } from "./service.js";
import { serpContextAnalyzer } from "./analyzer/serpContext.js";

export async function seoAnalyzerV3Controller(req, res) {
  try {
    const { html, url, primaryQuery } = req.body || {};

    if (!primaryQuery || primaryQuery.trim().length < 3) {
      return res.status(400).json({
        success: false,
        error: "primaryQuery is required for v3 analysis."
      });
    }

    if (!html && !url) {
      return res.status(400).json({
        success: false,
        error: "Either HTML content or URL must be provided."
      });
    }

    // 1️⃣ Run v2 service (stable)
    const v2Result = await runSeoAnalyzerV2({ html, url });

    // 2️⃣ Try to extract content stats (if available)
    const contentSignals =
      v2Result?.analysis?.cleanContent ||
      v2Result?.analysis?.content ||
      v2Result?.cleanContent ||
      null;

    // 3️⃣ Fetch SERP context (mock)
    const { serpBenchmarks, competitors } =
      await fetchSerpData(primaryQuery);

    // 4️⃣ Calculate relative score SAFELY
    const relativeScore = contentSignals
      ? serpContextAnalyzer({
          pageWordCount: contentSignals.cleanWordCount,
          pageParagraphCount: contentSignals.paragraphCount,
          serpBenchmarks
        })
      : {
          overall: 50,
          contentDepth: "unknown",
          structureMatch: "unknown",
          note: "Content metrics not exposed by v2. Using neutral baseline."
        };

    // 5️⃣ Always return response (NO FAIL)
    return res.status(200).json({
      success: true,
      version: "v3",
      data: {
        ...v2Result,
        context: {
          query: primaryQuery,
          serpSampleSize: 10
        },
        relativeScore,
        serpBenchmarks,
        competitors
      }
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message || "SEO analysis (v3) failed."
    });
  }
}
