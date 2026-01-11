import { runSeoAnalyzerV2 } from "../v2/service.js";
import { fetchSerpData } from "./service.js";
import { serpContextAnalyzer } from "./analyzer/serpContext.js";

export async function seoAnalyzerV3Controller(req, res) {
  try {
    const { html, url, primaryQuery } = req.body || {};

    // basic validation
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

    // 1️⃣ Run v2 SERVICE directly (never controller)
    const v2Result = await runSeoAnalyzerV2({ html, url });

    if (!v2Result) {
      return res.status(400).json({
        success: false,
        error: "v2 analysis returned no result."
      });
    }

    /**
     * 2️⃣ Extract content signals SAFELY
     * This handles ALL possible v2 shapes
     */
    const contentSignals =
      v2Result?.analysis?.cleanContent ||
      v2Result?.analysis?.content ||
      v2Result?.content?.cleanContent ||
      v2Result?.content ||
      v2Result?.cleanContent;

    if (
      !contentSignals ||
      typeof contentSignals.cleanWordCount !== "number"
    ) {
      return res.status(400).json({
        success: false,
        error: "Content signals missing from v2 analysis."
      });
    }

    // 3️⃣ Fetch SERP context (mock, stable)
    const { serpBenchmarks, competitors } =
      await fetchSerpData(primaryQuery);

    // 4️⃣ Compare page vs SERP
    const relativeScore = serpContextAnalyzer({
      pageWordCount: contentSignals.cleanWordCount,
      pageParagraphCount: contentSignals.paragraphCount,
      serpBenchmarks
    });

    // 5️⃣ Final response
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
