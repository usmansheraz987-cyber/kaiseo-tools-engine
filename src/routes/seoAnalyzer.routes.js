import express from "express";
import { seoAnalyzerController } from "../tools/seoAnalyzer/v1/controller.js";

const router = express.Router();

// health check
router.get("/__alive", (req, res) => {
  res.send("SEO ANALYZER ROUTE IS ALIVE");
});

// main analyzer endpoint
router.post("/v1/seo-analyzer", seoAnalyzerController);

export default router;
