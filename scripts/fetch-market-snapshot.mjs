import { writeFile } from "node:fs/promises";

const symbols = ["^IXIC", "^KS11", "^GSPC", "^DJI", "^STOXX50E", "^N225", "^HSI", "^TNX", "CL=F"];
const endpoint = "https://query1.finance.yahoo.com/v8/finance/chart/";

async function fetchQuote(symbol) {
  try {
    const response = await fetch(`${endpoint}${encodeURIComponent(symbol)}?range=1d&interval=5m&includePrePost=false`, { headers: { accept: "application/json" } });
    if (!response.ok) return [symbol, null];
    const payload = await response.json();
    const result = payload.chart?.result?.[0];
    const meta = result?.meta ?? {};
    const price = Number(meta.regularMarketPrice ?? meta.previousClose);
    if (!Number.isFinite(price)) return [symbol, null];
    const closes = (result?.indicators?.quote?.[0]?.close ?? []).filter((value) => Number.isFinite(value)).slice(-18);
    return [symbol, {
      price,
      previousClose: Number(meta.chartPreviousClose ?? meta.previousClose),
      closes,
      updatedAt: meta.regularMarketTime ? meta.regularMarketTime * 1000 : Date.now(),
    }];
  } catch {
    return [symbol, null];
  }
}

const entries = await Promise.all(symbols.map(fetchQuote));
const quotes = Object.fromEntries(entries.filter(([, quote]) => quote));
await writeFile("public/market.json", JSON.stringify({ generatedAt: Date.now(), quotes }, null, 2));
console.log(`Wrote ${Object.keys(quotes).length}/${symbols.length} market quotes`);
