import rateLimit from "express-rate-limit";

export const siteAuditLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    error: "RATE_LIMIT_EXCEEDED"
  }
});
