import { runSeoAnalyzerV3 } from "../v3/service.js";
import { runSeoAnalyzerV4 } from "./service.js";

export async function seoAnalyzerV4Controller(req, res, next) {
  try {
    const { url, primaryQuery } = req.body;
    const eligibility = req.eligibility;

    const v3Result = await runSeoAnalyzerV3({
      url,
      primaryQuery
    });

    const v4Result = await runSeoAnalyzerV4({
      v3Result
    });

    return res.json({
      success: true,
      version: "v4",
      eligibility,
      data: v4Result
    });

  } catch (err) {
    next(err);
  }
}
