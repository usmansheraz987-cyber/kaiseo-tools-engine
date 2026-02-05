export function runPhase1Checks(data) {
  return [
    {
      check: "httpStatus",
      // ✅ ALLOW 2xx + 3xx (Google-style)
      pass: data.status >= 200 && data.status < 400,
      severity: "block"
    },
    {
      check: "noindex",
      pass: !data.noindex,
      severity: "block"
    },
    {
      check: "canonical",
      pass: data.canonicalValid,
      severity: "warn"
    },
    {
      check: "html",
      pass: Boolean(data.html),
      severity: "block"
    },
    {
      check: "mainContent",
      pass: data.hasMainContent,
      severity: "block"
    },
    {
      check: "h1",
      pass: data.hasH1,
      severity: "warn"
    }
  ];
}
