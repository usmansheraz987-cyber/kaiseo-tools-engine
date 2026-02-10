import express from "express";

import { seoAnalyzerController } from "../tools/seoAnalyzer/v1/controller.js";
import { seoAnalyzerV2Controller } from "../tools/seoAnalyzer/v2/controller.js";
import { seoAnalyzerV2CompareController }
from "../tools/seoAnalyzer/v2/compare.controller.js";

import { seoAnalyzerV3Controller } from "../tools/seoAnalyzer/v3/controller.js";
import { seoAnalyzerV4Controller } from "../tools/seoAnalyzer/v4/controller.js";


import { checkPageEligibility } from "../tools/pageEligibility/index.js";

const router = express.Router();

/* ---------------------------------------
   Eligibility Wrapper Middleware
---------------------------------------- */
function withEligibility(controller) {
  return async (req, res, next) => {
    try {
      const { url, html } = req.body;

      if (!url && !html) {
        return res.status(400).json({
          success: false,
          error: "Provide either url or html"
        });
      }

      const eligibility = await checkPageEligibility({ url, html });

      // Block ONLY on critical technical failure
      if (!eligibility.eligible && eligibility.severity === "critical") {
        return res.json({
          success: false,
          stage: "eligibility",
          eligibility
        });
      }

      // Attach eligibility to request for controllers
      req.eligibility = eligibility;

      return controller(req, res, next);

    } catch (err) {
      next(err);
    }
  };
}

/* ---------------------------------------
   SEO Analyzer Routes
---------------------------------------- */

// V1 Analyze
router.post(
  "/seo-analyzer/v1/analyze",
  withEligibility(seoAnalyzerController)
);

// V2 Analyze
router.post(
  "/seo-analyzer/v2/analyze",
  withEligibility(seoAnalyzerV2Controller)
);

// V2 Compare (NO eligibility here)
router.post(
  "/seo-analyzer/v2/compare",
  seoAnalyzerV2CompareController
);

// V3 Analyze
router.post(
  "/seo-analyzer/v3/analyze",
  withEligibility(seoAnalyzerV3Controller)
);

// V4 Decide
router.post(
  "/seo-analyzer/v4/decide",
  withEligibility(seoAnalyzerV4Controller)
);

export default router;
