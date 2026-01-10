export function compareSeoResults(before, after) {
  const scoreDelta = after.score.totalScore - before.score.totalScore;

  const contentDelta =
    after.score.categoryScores.content -
    before.score.categoryScores.content;

  const beforeChecks = Object.fromEntries(
    before.checks.map(c => [c.key, c])
  );

  const improved = [];
  const worsened = [];

  for (const check of after.checks) {
    const prev = beforeChecks[check.key];
    if (!prev) continue;

    if (prev.status !== check.status) {
      const order = { pass: 2, warning: 1, critical: 0 };
      if (order[check.status] > order[prev.status]) {
        improved.push(check.key);
      } else {
        worsened.push(check.key);
      }
    }
  }

  return {
    scoreDelta,
    contentDelta,
    improvedChecks: improved,
    worsenedChecks: worsened
  };
}
