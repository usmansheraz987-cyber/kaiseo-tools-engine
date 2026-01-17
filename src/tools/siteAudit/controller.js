import crypto from "crypto";
import { runAuditJob } from "./worker.js";
import { progressStore } from "./progress/store.js";
import { getResult } from "./result/store.js";

export async function runSiteAudit(req, res) {
  const { url, maxPages = 50, maxDepth = 3 } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  const auditId = crypto.randomUUID();

  // fire-and-forget
  runAuditJob({ auditId, url, maxPages, maxDepth });

  return res.json({
    auditId,
    status: "started"
  });
}

export function getAuditProgress(req, res) {
  const { auditId } = req.params;
  const progress = progressStore.get(auditId);

  if (!progress) {
    return res.status(404).json({ error: "Not found" });
  }

  return res.json({
    ...progress,
    percent: progress.total
      ? Math.round((progress.processed / progress.total) * 100)
      : 0
  });
}

export function getAuditResult(req, res) {
  const { auditId } = req.params;
  const result = getResult(auditId);

  if (!result) {
    return res.status(404).json({ error: "Not ready" });
  }

  return res.json(result);
}
