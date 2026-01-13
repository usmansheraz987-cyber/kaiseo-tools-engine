import { runSeoAnalyzerV3 } from "../v3/service.js";

export async function seoAnalyzerV4Controller(req, res, next) {
  try {
    const { url, primaryQuery } = req.body;

    if (!url || !primaryQuery) {
      return res.status(400).json({
        success: false,
        error: "URL_AND_PRIMARY_QUERY_REQUIRED"
      });
    }

    const v3Result = await runSeoAnalyzerV3({
      url,
      primaryQuery
    });

    return res.json({
      success: true,
      version: "v4",
      debug: {
        v3Keys: Object.keys(v3Result || {})
      }
    });
  } catch (err) {
    next(err);
  }
}
