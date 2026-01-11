import { runSeoAnalyzerV2 } from "./service.js";

export async function seoAnalyzerV2Controller(req, res, internal = false) {
  try {
    const { html, url } = req.body || {};

    // validation
    if (!html && !url) {
      const errorResponse = {
        success: false,
        error: "Either HTML content or URL must be provided."
      };

      if (internal) return errorResponse;
      return res.status(400).json(errorResponse);
    }

    // run v2 engine
    const result = await runSeoAnalyzerV2({ html, url });

    const response = {
      success: true,
      version: "v2",
      data: result
    };

    // 👇 IMPORTANT PART
    // internal call → return data
    if (internal) return response;

    // normal HTTP call → send response
    return res.status(200).json(response);

  } catch (error) {
    const errorResponse = {
      success: false,
      error: error.message || "SEO analysis (v2) failed."
    };

    if (internal) return errorResponse;
    return res.status(400).json(errorResponse);
  }
}
