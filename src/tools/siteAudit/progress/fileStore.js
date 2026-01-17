import fs from "fs";
import path from "path";

const BASE_DIR = path.resolve("data/audits");
fs.mkdirSync(BASE_DIR, { recursive: true });

function getPath(id) {
  return path.join(BASE_DIR, `${id}.json`);
}

export const progressStore = {
  init(id, total) {
    fs.writeFileSync(
      getPath(id),
      JSON.stringify({
        auditId: id,
        status: "running",
        total,
        processed: 0,
        startedAt: Date.now()
      })
    );
  },

  increment(id) {
    const p = getPath(id);
    if (!fs.existsSync(p)) return;

    const data = JSON.parse(fs.readFileSync(p));
    data.processed += 1;
    fs.writeFileSync(p, JSON.stringify(data));
  },

  finish(id, resultFile) {
    const p = getPath(id);
    if (!fs.existsSync(p)) return;

    const data = JSON.parse(fs.readFileSync(p));
    data.status = "done";
    data.finishedAt = Date.now();
    data.resultFile = resultFile;

    fs.writeFileSync(p, JSON.stringify(data));
  },

  get(id) {
    const p = getPath(id);
    if (!fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p));
  }
};
