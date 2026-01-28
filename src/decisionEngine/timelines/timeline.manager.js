const store = new Map();

/*
Each page timeline looks like:
[
  {
    type: "decision" | "change" | "serp_snapshot" | "impact",
    data: {},
    timestamp
  }
]
*/

export function addTimelineEvent(pageUrl, event) {
  const list = store.get(pageUrl) || [];
  list.push({
    ...event,
    timestamp: new Date().toISOString(),
  });
  store.set(pageUrl, list);
}

export function getTimeline(pageUrl) {
  return store.get(pageUrl) || [];
}
