// src/routes/pageFit.routes.js

import express from "express";
import PageFit from "../tools/pageFit/index.js";

const router = express.Router();

/*
 POST /api/pagefit
 Body example:
 {
   "html": "<html>...</html>"
 }
 OR
 {
   "url": "https://example.com"
 }
*/

router.post("/", async (req, res) => {
  try {
    const { html, url, phases } = req.body;

    // ✅ UPDATED VALIDATION (THIS FIXES YOUR ISSUE)
    if (!html && !url) {
      return res.status(400).json({
        error: "Either HTML or URL is required",
      });
    }

    const result = await PageFit.run({
      html,
      url,
      phases: Array.isArray(phases) ? phases : [1],
    });

    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      error: "PageFit execution failed",
      details: error.message,
    });
  }
});

export default router;
