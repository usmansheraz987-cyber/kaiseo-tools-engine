export function validateDecisionInput(body) {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Request body is required" };
  }

  const { pageUrl, primaryQuery } = body;

  if (!pageUrl || typeof pageUrl !== "string") {
    return { valid: false, error: "pageUrl is required" };
  }

  if (!primaryQuery || typeof primaryQuery !== "string") {
    return { valid: false, error: "primaryQuery is required" };
  }

  try {
    new URL(pageUrl);
  } catch {
    return { valid: false, error: "pageUrl must be a valid URL" };
  }

  if (primaryQuery.trim().length < 2) {
    return { valid: false, error: "primaryQuery is too short" };
  }

  return { valid: true };
}
