// src/tools/siteAudit/progress/store.js

import { ProgressStore } from "./progressStore.js";

class InMemoryProgressStore extends ProgressStore {
  constructor() {
    super();
    this.store = new Map();
  }

  init(id, total) {
    this.store.set(id, {
      total,
      processed: 0,
      status: "running"
    });
  }

  increment(id) {
    const job = this.store.get(id);
    if (!job) return;
    job.processed += 1;
  }

  finish(id) {
    const job = this.store.get(id);
    if (!job) return;
    job.status = "done";
  }

  get(id) {
    return this.store.get(id) || null;
  }
}

export const progressStore = new InMemoryProgressStore();

let progressStore;

if (process.env.REDIS_URL) {
  const redis = new Redis(process.env.REDIS_URL);
  progressStore = new RedisProgressStore(redis);
} else {
  progressStore = new InMemoryProgressStore();
}

export { progressStore };
