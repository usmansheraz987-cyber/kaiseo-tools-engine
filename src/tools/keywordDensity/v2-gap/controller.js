import keywordDensityGapService from "./service.js";

export default async function keywordDensityGapController(req, res) {
  try {
    const result = await keywordDensityGapService(req.body);

    if (result.error) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: "Failed to analyze competitor gap"
    });
  }
}
