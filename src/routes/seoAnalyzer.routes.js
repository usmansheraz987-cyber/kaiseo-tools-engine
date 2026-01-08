import express from "express";
import { seoAnalyzerController } from "../tools/seoAnalyzer/v1/controller.js";

const router = express.Router();

router.post("/v1/seo-analyzer", seoAnalyzerController);

export default router;
