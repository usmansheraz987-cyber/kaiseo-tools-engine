// src/routes/pageFit.routes.js

import express from "express";
import PageFit from "../tools/pageFit/index.js";

const router = express.Router();

/*
 POST /api/pagefit
 Body examples:

 {
   "html": "<html>...</html>",
   "phases": [1,2,3],
   "primaryKeyword": "what is seo"
 }

 OR

 {
   "url": "https://example.com",
   "phases": [3],
   "primaryKeyword": "best seo tools"
 }
*/

router.post("/", async (req, res) => {
  try {
    const {
      html,
      url,
      phases,
      primaryKeyword, // ✅ REQUIRED FOR PHASE 3
    } = req.body;

    if (!html && !url) {
      return res.status(400).json({
        error: "Either HTML or URL is required",
      });
    }

    const result = await PageFit.run({
      html,
      url,
      phases: Array.isArray(phases) ? phases : [1],
      primaryKeyword, // ✅ FORWARDED CORRECTLY
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
