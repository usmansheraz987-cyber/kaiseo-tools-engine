let failureCount = 0;
let circuitOpenUntil = 0;

const MAX_FAILURES = 5;
const COOLDOWN_MS = 10 * 60 * 1000;

export function canCallSerp() {
  if (Date.now() < circuitOpenUntil) return false;
  return true;
}

export function recordSerpFailure() {
  failureCount++;
  if (failureCount >= MAX_FAILURES) {
    circuitOpenUntil = Date.now() + COOLDOWN_MS;
    failureCount = 0;
  }
}

export function recordSerpSuccess() {
  failureCount = 0;
}
