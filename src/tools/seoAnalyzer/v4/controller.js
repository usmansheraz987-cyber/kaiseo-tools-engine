import { runSeoAnalyzerV2 } from "../v2/service.js";
import { runSeoAnalyzerV3 } from "../v3/service.js";
import { runSeoAnalyzerV4 } from "./service.js";

export async function seoAnalyzerV4Controller(req, res, next) {
  try {
    const { url, html, primaryQuery } = req.body;

    if (!primaryQuery) {
      return res.status(400).json({
        success: false,
        error: "PRIMARY_QUERY_REQUIRED"
      });
    }

    const v2Result = await runSeoAnalyzerV2({ url, html });

    const v3Result = await runSeoAnalyzerV3({
      url,
      html,
      primaryQuery
    });

    const v4Result = await runSeoAnalyzerV4({
      v2Result: v2Result.data,
      v3Result: v3Result.data
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
``
