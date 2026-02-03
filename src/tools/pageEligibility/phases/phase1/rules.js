export const RULES = {
  httpStatus: {
    severity: "block",
    message: "Page is not accessible (non-200 status)"
  },

  noindex: {
    severity: "block",
    message: "Page is marked noindex"
  },

  robots: {
    severity: "block",
    message: "Blocked by robots.txt"
  },

  canonical: {
    severity: "warn",
    message: "Canonical points to a different URL"
  },

  html: {
    severity: "block",
    message: "No rendered HTML content found"
  },

  mainContent: {
    severity: "warn",
    minWords: 150,
    message: "No substantial main content found"
  },

  h1: {
    severity: "warn",
    message: "No clear primary topic detected"
  }
};
