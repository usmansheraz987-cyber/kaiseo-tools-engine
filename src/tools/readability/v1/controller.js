// tools/readability/v1/controller.js

const { analyzeReadability } = require("./service");

/**
 * POST /readability
 * Body:
 * {
 *   "text": "...",
 *   "preset": "general_blog"
 * }
 */
async function readabilityController(req, res, next) {
  try {
    const { text, preset } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({
        error: "Text is required and must be a string"
      });
    }

    const result = analyzeReadability(text, preset);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  readabilityController
};
