export function normalizeUrl(input) {
  const url = new URL(input);

  url.hash = "";
  if (!url.pathname.endsWith("/")) {
    url.pathname += "/";
  }

  return url.toString();
}
