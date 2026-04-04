import { runSeoAnalyzerV3 } from "../v3/service.js";
import { runSeoAnalyzerV4 } from "./service.js";
import { getCache, setCache } from "../../../lib/cache/simpleCache.js";

export async function seoAnalyzerV4Controller(req, res) {
  try {
    const { url, primaryQuery } = req.body;

    if (!url || !primaryQuery) {
      return res.status(400).json({
        success: false,
        error: "url and primaryQuery required"
      });
    }

    const cacheKey = `${url}:${primaryQuery}`;

    const cached = getCache(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        cached: true,
        data: cached
      });
    }

    const v3Result = await runSeoAnalyzerV3({
      url,
      primaryQuery
    });

    const v4Result = await runSeoAnalyzerV4({
      v3Result
    });

    setCache(cacheKey, v4Result);

    return res.json({
      success: true,
      cached: false,
      data: v4Result
    });

  } catch (err) {
    console.error("API ERROR:", err);

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}