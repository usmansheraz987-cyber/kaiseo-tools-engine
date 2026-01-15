// src/tools/siteAudit/progress/store.js

const progressStore = new Map();

export function initProgress(id, total) {
  progressStore.set(id, {
    total,
    processed: 0,
    status: "running"
  });
}

export function incrementProgress(id) {
  const job = progressStore.get(id);
  if (!job) return;
  job.processed += 1;
}

export function finishProgress(id) {
  const job = progressStore.get(id);
  if (!job) return;
  job.status = "done";
}

export function getProgress(id) {
  return progressStore.get(id) || null;
}
