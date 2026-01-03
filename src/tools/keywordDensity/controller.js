import { analyzeKeywordDensity } from "./service.js";

export function keywordDensityController(req, res) {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({
      error: "Text is required"
    });
  }

  const result = analyzeKeywordDensity(text);

  if (result.error) {
    return res.status(400).json(result);
  }

  res.json({
    tool: "keyword-density",
    result
  });
}
