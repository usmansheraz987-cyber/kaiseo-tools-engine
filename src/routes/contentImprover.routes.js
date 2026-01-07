import express from "express";
import { contentImproverV1Controller } from "../tools/contentImprover/v1/controller.js";

const router = express.Router();

/**
 * Content Improver v1
 * Purpose: Analyze existing content and return improvement suggestions
 * Versioned to avoid breaking future upgrades
 */
router.post(
  "/content-improver/v1",
  contentImproverV1Controller
);

export default router;
