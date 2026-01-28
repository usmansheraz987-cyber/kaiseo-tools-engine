export function decidePriority(intent) {
  if (intent === "comparison") {
    return {
      primary: "Add comparison table and alternatives",
      secondary: "Add pros and cons",
      ignore: "Link building",
    };
  }

  if (intent === "transactional") {
    return {
      primary: "Add pricing and CTAs",
      secondary: "Add trust signals",
      ignore: "Long guides",
    };
  }

  if (intent === "informational") {
    return {
      primary: "Improve explanations and structure",
      secondary: "Add examples",
      ignore: "Pricing sections",
    };
  }

  return {
    primary: "Observe SERP before acting",
    secondary: null,
    ignore: "Major rewrites",
  };
}
