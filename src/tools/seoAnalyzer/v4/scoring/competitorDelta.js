/**
 * Compute competitor baseline and delta
 */
export function calculateCompetitorDelta({
  yourScore,
  competitors = []
}) {
  if (!Array.isArray(competitors) || competitors.length === 0) {
    return {
      average: null,
      delta: null,
      position: "unknown"
    };
  }

  // extract competitor scores safely
  const scores = competitors
    .map(c => c?.score?.totalScore || c?.score || null)
    .filter(s => typeof s === "number");

  if (scores.length === 0) {
    return {
      average: null,
      delta: null,
      position: "unknown"
    };
  }

  const avg =
    scores.reduce((a, b) => a + b, 0) / scores.length;

  const roundedAvg = Math.round(avg);
  const delta = Math.round(yourScore - roundedAvg);

  let position = "average";

  if (delta >= 10) position = "leading";
  else if (delta >= -10) position = "competitive";
  else if (delta >= -25) position = "behind";
  else position = "lagging";

  return {
    average: roundedAvg,
    delta,
    position
  };
}