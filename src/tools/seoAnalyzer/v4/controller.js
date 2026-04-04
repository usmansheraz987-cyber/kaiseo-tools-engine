import { runSeoAnalyzerV3 } from "../v3/service.js";
import { runSeoAnalyzerV4 } from "./service.js";
import { getCache, setCache } from "../../../lib/cache/simpleCache.js";

export async function seoAnalyzerV4Controller(req, res, next) {
  try {
    const { url, primaryQuery } = req.body;
    const eligibility = req.eligibility;

    const cacheKey = `${url}:${primaryQuery}`;

    // 🔥 CACHE HIT
    const cached = getCache(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        version: "v4",
        cached: true,
        eligibility,
        data: cached
      });
    }

    // 🔥 FULL PIPELINE
    const v3Result = await runSeoAnalyzerV3({
      url,
      primaryQuery
    });

    const v4Result = await runSeoAnalyzerV4({
      v3Result
    });

    // 🔥 SAVE CACHE
    setCache(cacheKey, v4Result);

    return res.json({
      success: true,
      version: "v4",
      cached: false,
      eligibility,
      data: v4Result
    });

  } catch (err) {
    next(err);
  }
}