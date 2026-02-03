import { RULES } from "./rules.js";

export function runPhase1Checks(data) {
  return [
    {
      key: "httpStatus",
      pass: data.status === 200
    },

    {
      key: "noindex",
      pass: !data.noindex
    },

    {
      key: "canonical",
      pass: !data.canonical || data.canonical === data.url
    },

    {
      key: "html",
      pass: Boolean(data.html && data.html.length > 0)
    },

    {
      key: "mainContent",
      pass: data.wordCount >= RULES.mainContent.minWords
    },

    {
      key: "h1",
      pass:
        data.h1 &&
        data.h1.length > 3 &&
        !["home", "welcome", "untitled"].includes(
          data.h1.toLowerCase()
        )
    }
  ];
}
