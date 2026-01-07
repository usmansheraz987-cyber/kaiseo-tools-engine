import { analyzeContent } from "./service.js";

export async function contentImproverV1Controller(req, res, next) {
  try {
    const { content, keyword } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content is required." });
    }

    const result = analyzeContent({ content, keyword });
    res.json(result);
  } catch (err) {
    next(err);
  }
}
