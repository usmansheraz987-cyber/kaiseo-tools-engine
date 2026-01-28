export function calculateConfidence(inputsUsed) {
  if (inputsUsed.includes("gsc") && inputsUsed.includes("serp")) {
    return "high";
  }

  if (inputsUsed.length > 0) {
    return "medium";
  }

  return "low";
}
