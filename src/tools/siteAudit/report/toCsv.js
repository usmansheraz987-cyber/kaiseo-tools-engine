import { Parser } from "json2csv";

export function generateCsvReport(issues) {
  const fields = [
    "severity",
    "code",
    "page",
    "message",
    "why",
    "fix"
  ];

  const parser = new Parser({ fields });
  return parser.parse(issues);
}
