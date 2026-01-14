// src/routes/siteAudit.routes.js

import express from "express";
import { runSiteAudit } from "../tools/siteAudit/controller.js";

const router = express.Router();

// POST /api/site-audit
router.post("/site-audit", runSiteAudit);

export default router;
