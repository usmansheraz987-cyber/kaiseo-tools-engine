// src/routes/pageFit.routes.js

import express from "express";
import PageFit from "../tools/pageFit/index.js";

const router = express.Router();

/*
 POST /api/pagefit
 Body example:
 {
   "html": "<html>...</html>",
   "phases": [1]
 }
*/

router.post("/", async (req, res) => {
  try {
    const { html, phases } = req.body;

    if (!html) {
      return res.status(400).json({
        error: "HTML input is required",
      });
    }

    const result = await PageFit.run({
      html,
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
