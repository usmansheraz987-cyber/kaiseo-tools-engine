import analyzeKeywordDensityV2 from "./service.js";

export function keywordDensityV2Controller(req, res) {
  const { text, targets } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  const result = analyzeKeywordDensityV2({ text, targets });

  if (result.error) {
    return res.status(400).json(result);
  }

  res.json({
    tool: "keyword-density-v2",
    mode: targets ? "target" : "text",
    ...result
  });
}
