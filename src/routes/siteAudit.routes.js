import express from "express";
import fs from "fs";

import { runSiteAudit } from "../tools/siteAudit/controller.js";
import { progressStore } from "../tools/siteAudit/progress/fileStore.js";

const router = express.Router();

router.post("/site-audit", runSiteAudit);

router.get("/site-audit/progress/:id", (req, res) => {
  const job = progressStore.get(req.params.id);
  if (!job) {
    return res.status(404).json({ error: "Audit not found" });
  }
  res.json(job);
});

router.get("/site-audit/result/:id", (req, res) => {
  const job = progressStore.get(req.params.id);
  if (!job || job.status !== "done") {
    return res.status(404).json({ error: "Result not ready" });
  }

  const result = JSON.parse(fs.readFileSync(job.resultFile));
  res.json(result);
});

export default router;
