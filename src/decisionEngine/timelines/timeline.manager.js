const store = new Map();

export function addToTimeline(entry) {
  const list = store.get(entry.pageUrl) || [];
  list.push(entry);
  store.set(entry.pageUrl, list);
}

export function getTimeline(pageUrl) {
  return store.get(pageUrl) || [];
}
