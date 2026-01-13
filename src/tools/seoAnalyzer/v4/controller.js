import { runSeoAnalyzerV3 } from "../v3/service.js";
import { runSeoAnalyzerV4 } from "./service.js";

export async function seoAnalyzerV4Controller(req, res, next) {
  try {
    const { url, primaryQuery } = req.body;

    if (!url || !primaryQuery) {
      return res.status(400).json({
        success: false,
        error: "URL_AND_PRIMARY_QUERY_REQUIRED"
      });
    }

    // Run v3 ONCE (v3 already includes v2)
    const v3Result = await runSeoAnalyzerV3({
      url,
      primaryQuery
    });

    // Run v4 decision layer
    const v4Result = await runSeoAnalyzerV4({
      v3Result
    });

    return res.json({
      success: true,
      version: "v4",
      data: v4Result
    });
  } catch (err) {
    next(err);
  }
}
