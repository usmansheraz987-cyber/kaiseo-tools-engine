// src/routes/ai.routes.js

import express from "express";

// V1
import { detectAIContent } from "../tools/aiDetector/v1/controller.js";

// V2
import { aiDetectorV2Controller } from "../tools/aiDetector/v2/controller.js";

const router = express.Router();

/**
 * V1 — Stable Detector
 * POST /api/ai-detector
 */
router.post("/ai-detector", detectAIContent);

/**
 * V2 — Advanced Pattern Optimization Engine
 * POST /api/ai-detector-v2
 */
router.post("/ai-detector-v2", aiDetectorV2Controller);

export default router;