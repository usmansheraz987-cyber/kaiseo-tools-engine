import express from "express";
import {
  runSiteAudit,
  getAuditProgress,
  getAuditResult
} from "../tools/siteAudit/controller.js";

const router = express.Router();

/**
 * Start site audit (async)
 * POST /api/site-audit
 */
router.post("/site-audit", runSiteAudit);

/**
 * Get audit progress
 * GET /api/site-audit/progress/:auditId
 */
router.get("/site-audit/progress/:auditId", getAuditProgress);

/**
 * Get audit result
 * GET /api/site-audit/result/:auditId
 */
router.get("/site-audit/result/:auditId", getAuditResult);

export default router;
