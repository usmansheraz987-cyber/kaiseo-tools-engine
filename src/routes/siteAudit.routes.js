import express from "express";
import { runSiteAuditController } from "../tools/siteAudit/controller.js";

const router = express.Router();

router.post("/run", runSiteAuditController);

export default router;
