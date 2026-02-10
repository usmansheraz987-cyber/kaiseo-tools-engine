import express from "express";
import { checkPageEligibility } from "../tools/pageEligibility/index.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { url, html } = req.body;

    if (!url && !html) {
      return res.status(400).json({
        error: "Provide either url or html"
      });
    }

    const result = await checkPageEligibility({ url, html });

    res.json(result);
  } catch (err) {
    next(err);
  }
});


export default router;
