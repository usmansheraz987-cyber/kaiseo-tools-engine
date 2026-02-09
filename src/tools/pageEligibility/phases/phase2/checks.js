export function runPhase2Checks(signals) {
  return [
    {
      check: "emptyHtmlShell",
      pass: signals.textLength > 200
    },
    {
      check: "jsRequired",
      pass: !(signals.textLength < 50 && signals.scriptCount > 10)
    },
    {
      check: "soft404",
      pass: !signals.bodyTextSample.toLowerCase().includes("not found")
    }
  ];
}
