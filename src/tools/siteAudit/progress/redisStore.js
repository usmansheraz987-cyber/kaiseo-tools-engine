// src/tools/siteAudit/progress/redisStore.js

import { ProgressStore } from "./progressStore.js";

export class RedisProgressStore extends ProgressStore {
  constructor(redis) {
    super();
    this.redis = redis;
  }

  key(id) {
    return `siteAudit:progress:${id}`;
  }

  async init(id, total) {
    await this.redis.hSet(this.key(id), {
      total,
      processed: 0,
      status: "running"
    });
  }

  async increment(id) {
    await this.redis.hIncrBy(this.key(id), "processed", 1);
  }

  async finish(id) {
    await this.redis.hSet(this.key(id), {
      status: "done"
    });
  }

  async get(id) {
    const data = await this.redis.hGetAll(this.key(id));
    if (!data || !data.total) return null;

    return {
      total: Number(data.total),
      processed: Number(data.processed),
      status: data.status
    };
  }
}
