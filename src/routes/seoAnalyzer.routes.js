import express from "express";

// v1
import { seoAnalyzerController } from "../tools/seoAnalyzer/v1/controller.js";

// v2 analyze
import { seoAnalyzerV2Controller } from "../tools/seoAnalyzer/v2/controller.js";

// v2 compare
import { seoAnalyzerV2CompareController } from "../tools/seoAnalyzer/v2/comparison/controller.js";

const router = express.Router();

/* --------------------
   Health check
-------------------- */
router.get("/_alive", (req, res) => {
  res.send("SEO ANALYZER ROUTE IS ALIVE");
});

/* --------------------
   v1
-------------------- */
router.post("/seo-analyzer/v1/analyze", seoAnalyzerController);

/* --------------------
   v2 analyze
-------------------- */
router.post("/seo-analyzer/v2/analyze", seoAnalyzerV2Controller);

/* --------------------
   v2 compare
-------------------- */
router.post("/seo-analyzer/v2/compare", seoAnalyzerV2CompareController);

export default router;
