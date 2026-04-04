import { runSeoAnalyzerV3 } from "../v3/service.js";
import { runSeoAnalyzerV4 } from "./service.js";
import { getCache, setCache } from "../../../lib/cache/simpleCache.js";

export async function seoAnalyzerV4Controller(req, res) {
  try {
    const { url, primaryQuery } = req.body || {};

    // -----------------------------
    // 🔴 INPUT VALIDATION (NEW)
    // -----------------------------
    if (!url || typeof url !== "string") {
      return res.status(400).json({
        success: false,
        error: "Invalid or missing 'url'"
      });
    }

    if (!primaryQuery || typeof primaryQuery !== "string") {
      return res.status(400).json({
        success: false,
        error: "Invalid or missing 'primaryQuery'"
      });
    }

    const eligibility = req.eligibility || null;

    const cacheKey = `${url}:${primaryQuery}`;

    // -----------------------------
    // 🟢 CACHE HIT
    // -----------------------------
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

    // -----------------------------
    // 🔵 RUN V3
    // -----------------------------
    const v3Result = await runSeoAnalyzerV3({
      url,
      primaryQuery
    });

    if (!v3Result || !v3Result.data) {
      return res.status(500).json({
        success: false,
        error: "V3 analyzer failed to return valid data"
      });
    }

    // -----------------------------
    // 🔵 RUN V4
    // -----------------------------
    const v4Result = await runSeoAnalyzerV4({
      v3Result
    });

    if (!v4Result) {
      return res.status(500).json({
        success: false,
        error: "V4 analyzer returned empty result"
      });
    }

    // -----------------------------
    // 💾 SAVE CACHE
    // -----------------------------
    setCache(cacheKey, v4Result);

    // -----------------------------
    // ✅ FINAL RESPONSE
    // -----------------------------
    return res.json({
      success: true,
      version: "v4",
      cached: false,
      eligibility,
      data: v4Result
    });

  } catch (err) {
    // -----------------------------
    // 🔴 REAL ERROR OUTPUT (CRITICAL)
    // -----------------------------
    console.error("V4 CONTROLLER ERROR:", err);

    return res.status(500).json({
      success: false,
      error: err.message || "Internal Server Error",
      stack: err.stack
    });
  }
}