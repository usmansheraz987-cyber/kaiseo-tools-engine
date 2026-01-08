import express from "express";
import { seoAnalyzerController } from "../tools/seoAnalyzer/v1/controller.js";

const router = express.Router();

// SEO Analyzer v1
router.post("/api/v1/seo-analyzer", seoAnalyzerController);

export default router;
