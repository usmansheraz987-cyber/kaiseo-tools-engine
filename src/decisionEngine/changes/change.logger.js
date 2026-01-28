import { addTimelineEvent } from "../timelines/timeline.manager.js";

export function logSeoChange(pageUrl, note) {
  addTimelineEvent(pageUrl, {
    type: "change",
    data: {
      note,
    },
  });
}
