// src/routes/ai.routes.js

import express from "express";
import { detectAIContent } from "../tools/aiDetector/v1/controller.js";

const router = express.Router();

/**
 * POST /api/ai-detector
 * Body: { text: string }
 */
router.post("/ai-detector", detectAIContent);

export default router;
