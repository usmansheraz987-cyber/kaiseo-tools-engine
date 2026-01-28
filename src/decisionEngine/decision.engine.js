import { detectSearchIntent } from "./intent/intent.detector.js";
import { decidePriority } from "./decisions/priority.decider.js";
import { addToTimeline } from "./timelines/timeline.manager.js";
import { buildTimelineEntry } from "./timelines/timeline.builder.js";

export function runDecisionEngine({ pageUrl, primaryQuery }) {
  // 1. Detect intent
  const intentResult = detectSearchIntent(primaryQuery);

  // 2. Decide priority
  const priority = decidePriority(intentResult.intent);

  // 3. Build timeline entry
  const timelineEntry = buildTimelineEntry({
    pageUrl,
    primaryQuery,
    intent: intentResult.intent,
    decision: priority.primary,
  });

  // 4. Store timeline
  addToTimeline(timelineEntry);

  // 5. Final response object (STABLE CONTRACT)
  return {
    pageUrl,
    primaryQuery,
    intent: intentResult.intent,
    primaryAction: priority.primary,
    secondaryAction: priority.secondary,
    ignore: priority.ignore,
    confidence: intentResult.confidence,
  };
}
