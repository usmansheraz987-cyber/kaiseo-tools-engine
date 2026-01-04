import analyzeKeywordDensityV2 from "./service.js";

export async function keywordDensityV2Controller(req, res) {
  const { text, targets, url } = req.body;

  if (!text && !url) {
    return res.status(400).json({ error: "Text or URL is required" });
  }

  try {
    const result = await analyzeKeywordDensityV2({ text, targets, url });

    if (result.error) {
      return res.status(400).json(result);
    }

    res.json({
      tool: "keyword-density-v2",
      mode: url ? "url" : targets ? "target" : "text",
      ...result
    });
  } catch (err) {
    res.status(400).json({
      error: "Unable to analyze URL",
      detail: err.message
    });
  }
}
