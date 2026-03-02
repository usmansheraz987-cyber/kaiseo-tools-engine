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

import { contentImproverV2Controller } 
  from "../tools/contentImprover/v2/controller.js";

router.post(
  "/content-improver/v2",
  contentImproverV2Controller
);
