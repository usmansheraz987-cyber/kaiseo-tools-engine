import fetch from "node-fetch";

export async function fetchSerpResults(query) {
    console.log("SERP API CALLED");

  if (!process.env.SERP_API_KEY) {
    throw new Error("SERP_API_KEY_MISSING");
  }

  const url = `https://serpapi.com/search.json?q=${encodeURIComponent(
    query
  )}&engine=google&num=10&api_key=${process.env.SERP_API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("SERP_API_FAILED");

  const data = await res.json();
  const organic = data.organic_results || [];

  return {
    benchmarks: {
      medianWordCount: 1800,
      medianParagraphCount: 20
    },
    competitors: organic.slice(0, 3).map(r => ({
      title: r.title,
      url: r.link
    }))
  };
}
