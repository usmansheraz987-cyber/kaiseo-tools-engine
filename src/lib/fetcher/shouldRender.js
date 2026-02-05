export function shouldRender(html) {
  if (!html) return false;

  const lower = html.toLowerCase();

  // 1️⃣ HTML too thin → likely JS site
  if (stripTags(html).length < 500) {
    return true;
  }

  // 2️⃣ Known JS framework fingerprints
  const jsFrameworkSignals = [
    'id="__next"',
    'id="__nuxt"',
    'id="app"',
    'id="root"',
    'data-reactroot',
    'window.__next_data__',
    'window.__nuxt__'
  ];

  if (jsFrameworkSignals.some(s => lower.includes(s))) {
    return true;
  }

  // 3️⃣ Skeleton / loader patterns
  const skeletonSignals = [
    'loading',
    'spinner',
    'skeleton',
    'please wait'
  ];

  if (skeletonSignals.some(s => lower.includes(s))) {
    return true;
  }

  // 4️⃣ No meaningful content markers
  if (
    !lower.includes("<main") &&
    !lower.includes("<article") &&
    !lower.includes("<h1")
  ) {
    return true;
  }

  // Otherwise HTML looks trustworthy
  return false;
}

function stripTags(input) {
  return input
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
