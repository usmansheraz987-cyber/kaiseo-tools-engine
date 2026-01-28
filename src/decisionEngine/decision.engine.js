import { detectSearchIntent } from "./intent/intent.detector.js";
import { decidePriority } from "./decisions/priority.decider.js";

import { takeSerpSnapshot } from "./serp/serp.snapshot.js";
import { analyzeIntentDrift } from "./serp/intent.drift.analyzer.js";

import { fetchPageMetrics } from "./gsc/gsc.client.js";
import { analyzeImpact } from "./impact/impact.analyzer.js";

import { addTimelineEvent, getTimeline } from "./timelines/timeline.manager.js";

export async function runDecisionEngine({ pageUrl, primaryQuery }) {
  // 1️⃣ Detect search intent
  const intentResult = detectSearchIntent(primaryQuery);

  // 2️⃣ Decide SEO priority
  const priority = decidePriority(intentResult.intent);

  // 3️⃣ Store decision in timeline
  addTimelineEvent(pageUrl, {
    type: "decision",
    data: {
      intent: intentResult.intent,
      priority,
    },
  });

  // 4️⃣ SERP snapshot + drift detection
  const newSerpTitles = await takeSerpSnapshot(primaryQuery);
  const timeline = getTimeline(pageUrl);

  const lastSerpEvent = timeline.find(
    (e) => e.type === "serp_snapshot"
  );

  const serpDrift = analyzeIntentDrift(
    lastSerpEvent?.data?.titles,
    newSerpTitles
  );

  addTimelineEvent(pageUrl, {
    type: "serp_snapshot",
    data: {
      titles: newSerpTitles,
    },
  });

  // 5️⃣ Google Search Console impact
  const previousMetricsEvent = timeline.find(
    (e) => e.type === "metrics"
  );

  const beforeMetrics = previousMetricsEvent?.data || null;
  const afterMetrics = await fetchPageMetrics(pageUrl);

  addTimelineEvent(pageUrl, {
    type: "metrics",
    data: afterMetrics,
  });

  const impact = analyzeImpact(beforeMetrics, afterMetrics);

  // 6️⃣ Final stable response
  return {
    pageUrl,
    primaryQuery,

    intent: intentResult.intent,
    primaryAction: priority.primary,
    secondaryAction: priority.secondary,
    ignore: priority.ignore,

    serpDrift,
    impact,

    confidence: intentResult.confidence,
  };
}
