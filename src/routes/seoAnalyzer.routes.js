import express from "express";

// v1
import { seoAnalyzerController } from "../tools/seoAnalyzer/v1/controller.js";

// v2
import { seoAnalyzerV2Controller } from "../tools/seoAnalyzer/v2/controller.js";
//comparision
import { seoAnalyzerV2CompareController } from "../tools/seoAnalyzer/v2/comparison/controller.js";
router.post(
  "/seo-analyzer/v2/compare",
  seoAnalyzerV2CompareController
);


const router = express.Router();

// health check
router.get("/_alive", (req, res) => {
  res.send("SEO ANALYZER ROUTE IS ALIVE");
});

// v1 (stable)
router.post("/seo-analyzer/v1/analyze", seoAnalyzerController);

// v2 (advanced)
router.post("/seo-analyzer/v2/analyze", seoAnalyzerV2Controller);

export default router;
