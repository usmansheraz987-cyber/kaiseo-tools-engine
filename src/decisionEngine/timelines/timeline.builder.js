export function buildTimelineEntry(data) {
  return {
    ...data,
    createdAt: new Date().toISOString(),
  };
}
