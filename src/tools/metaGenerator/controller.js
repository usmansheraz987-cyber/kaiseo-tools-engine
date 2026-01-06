import { generateMeta } from "./service.js";

export function metaGeneratorController(req, res) {
  const { content, targetKeyword } = req.body;

  if (!content || content.length < 50) {
    return res.status(400).json({
      error: "Content is required (minimum 50 characters)"
    });
  }

  const result = generateMeta({ content, targetKeyword });
  res.json(result);
}
