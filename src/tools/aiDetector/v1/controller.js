import { analyzeContent } from "./service.js";
import { countWords } from "./utils.js";

export async function detectAIContent(req, res, next) {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({
        error: "Text input is required"
      });
    }

    const wordCount = countWords(text);

    // Hard reject only if completely useless
    if (wordCount < 60) {
      return res.status(400).json({
        error: "Text too short to analyze meaningfully",
        warning: "Provide at least 60 words for analysis",
        provided_words: wordCount
      });
    }

    // Analyze everything else
    const result = await analyzeContent(text);

    // Soft warnings (NON-BLOCKING)
    const warnings = [];

    if (wordCount < 120) {
      warnings.push(
        "Very short text. Results are low confidence and should be interpreted cautiously."
      );
    } else if (wordCount < 400) {
      warnings.push(
        "Short text sample. Confidence is limited. Longer content gives more reliable results."
      );
    }

    return res.status(200).json({
      ...result,
      meta: {
        word_count: wordCount,
        warnings
      }
    });
  } catch (err) {
    next(err);
  }
}
