import express from "express";
import fetchPage from "../lib/fetchPage.js";
import { checkPageEligibility } from "../tools/pageEligibility/index.js";

const router = express.Router();

router.post("/page-eligibility", async (req, res, next) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        error: "URL is required"
      });
    }

    const fetchResult = await fetchPage(url);
    const eligibilityResult = checkPageEligibility(fetchResult);

    return res.json(eligibilityResult);
  } catch (error) {
    return next(error);
  }
});

export default router;
