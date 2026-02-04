import express from "express";
import { fetchPageHtml } from "../lib/fetcher/fetchPage.js";
import { checkPageEligibility } from "../tools/pageEligibility/index.js";


const router = express.Router();

router.post("/page-eligibility", async (req, res, next) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const fetchResult = await fetchPageHtml(url);
    const result = checkPageEligibility(fetchResult);

    return res.json(result);
  } catch (err) {
    return next(err);
  }
});

export default router;
