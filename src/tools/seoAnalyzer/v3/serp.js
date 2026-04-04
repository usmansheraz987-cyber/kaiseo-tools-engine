import fetch from "node-fetch";

export async function fetchSerpResults(query) {
  const API_KEY = process.env.SERPER_API_KEY;

  if (!API_KEY) {
    throw new Error("SERPER_API_KEY_MISSING");
  }

  const res = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: {
      "X-API-KEY": API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      q: query,
      num: 10
    })
  });

  if (!res.ok) {
    throw new Error(`SERP_API_ERROR_${res.status}`);
  }

  const data = await res.json();

  console.log("📦 SERP API RESPONSE:", data);

  const competitors = (data.organic || []).map(item => ({
    title: item.title,
    url: item.link
  }));

  if (!competitors.length) {
    throw new Error("NO_ORGANIC_RESULTS");
  }

  return {
    benchmarks: {},
    competitors
  };
}