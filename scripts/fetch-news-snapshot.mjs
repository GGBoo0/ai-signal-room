import { writeFile } from "node:fs/promises";
import { FEATURED_NEWS_QUERIES } from "../src/marketUniverse.js";

const endpoint = "https://query1.finance.yahoo.com/v1/finance/search";
const relevanceTerms = {
  nvidia: ["nvidia", "nvda"],
  microsoft: ["microsoft", "msft"],
  tsmc: ["tsmc", "taiwan semiconductor"],
  samsung: ["samsung"],
  skhynix: ["sk hynix", "hynix"],
  palantir: ["palantir", "pltr"],
  broadcom: ["broadcom", "avgo"],
  vertiv: ["vertiv", "vrt"],
  crowdstrike: ["crowdstrike", "crwd"],
};

async function fetchCompanyNews([companyId, query]) {
  try {
    const params = new URLSearchParams({
      q: query,
      quotesCount: "1",
      newsCount: "5",
      enableFuzzyQuery: "false",
    });
    const response = await fetch(`${endpoint}?${params}`, {
      headers: {
        accept: "application/json",
        "user-agent": "Mozilla/5.0 SignalRoomNewsSnapshot/2.0",
      },
    });
    if (!response.ok) return [companyId, []];
    const payload = await response.json();
    const terms = relevanceTerms[companyId] ?? [String(query).toLowerCase()];
    const news = (payload.news ?? []).filter((item) => {
      const title = String(item.title ?? "").toLowerCase();
      return item.link && terms.some((term) => title.includes(term));
    }).slice(0, 5).map((item) => ({
      headline: item.title,
      source: item.publisher ?? "YAHOO FINANCE",
      url: item.link,
      publishedAt: Number(item.providerPublishTime) * 1000 || Date.now(),
    }));
    return [companyId, news];
  } catch {
    return [companyId, []];
  }
}

const entries = await Promise.all(Object.entries(FEATURED_NEWS_QUERIES).map(fetchCompanyNews));
const companies = Object.fromEntries(entries.filter(([, news]) => news.length));
await writeFile("public/news.json", JSON.stringify({
  generatedAt: Date.now(),
  source: "Yahoo Finance search",
  companies,
}, null, 2));
console.log(`Wrote news for ${Object.keys(companies).length}/${Object.keys(FEATURED_NEWS_QUERIES).length} featured companies`);
