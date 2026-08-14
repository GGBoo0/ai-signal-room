import { writeFile } from "node:fs/promises";
import { ALL_SNAPSHOT_SYMBOLS } from "../src/marketUniverse.js";

const endpoints = [
  "https://query1.finance.yahoo.com/v8/finance/chart/",
  "https://query2.finance.yahoo.com/v8/finance/chart/",
];

function finiteValues(values = []) {
  return values.map(Number).filter(Number.isFinite);
}

function inferMarketState(meta) {
  if (meta.marketState) return meta.marketState;
  const now = Date.now() / 1000;
  const regular = meta.currentTradingPeriod?.regular;
  return regular && now >= regular.start && now <= regular.end ? "REGULAR" : "CLOSED";
}

async function fetchQuote(symbol) {
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${endpoint}${encodeURIComponent(symbol)}?range=1d&interval=5m&includePrePost=false`, {
        headers: {
          accept: "application/json",
          "user-agent": "Mozilla/5.0 SignalRoomMarketSnapshot/2.0",
        },
      });
      if (!response.ok) continue;
      const payload = await response.json();
      const result = payload.chart?.result?.[0];
      const meta = result?.meta ?? {};
      const quote = result?.indicators?.quote?.[0] ?? {};
      const timestamps = result?.timestamp ?? [];
      const points = timestamps.map((timestamp, index) => ({
        timestamp: Number(timestamp) * 1000,
        close: Number(quote.close?.[index]),
      })).filter((point) => Number.isFinite(point.close)).slice(-42);
      const closeValues = points.map((point) => point.close);
      const price = Number(meta.regularMarketPrice ?? closeValues.at(-1) ?? meta.previousClose);
      if (!Number.isFinite(price)) continue;
      const openValues = finiteValues(quote.open);
      const highValues = finiteValues(quote.high);
      const lowValues = finiteValues(quote.low);
      return [symbol, {
        price,
        previousClose: Number(meta.chartPreviousClose ?? meta.previousClose),
        currency: meta.currency ?? null,
        exchange: meta.exchangeName ?? null,
        exchangeName: meta.fullExchangeName ?? meta.exchangeName ?? null,
        exchangeTimezoneName: meta.exchangeTimezoneName ?? null,
        marketState: inferMarketState(meta),
        open: Number(meta.regularMarketOpen ?? openValues[0]),
        dayHigh: Number(meta.regularMarketDayHigh ?? (highValues.length ? Math.max(...highValues) : NaN)),
        dayLow: Number(meta.regularMarketDayLow ?? (lowValues.length ? Math.min(...lowValues) : NaN)),
        closes: closeValues,
        timestamps: points.map((point) => point.timestamp),
        updatedAt: meta.regularMarketTime ? meta.regularMarketTime * 1000 : Date.now(),
      }];
    } catch {
      // Try the secondary Yahoo chart host before marking the quote unavailable.
    }
  }
  return [symbol, null];
}

const entries = [];
const batchSize = 8;
for (let index = 0; index < ALL_SNAPSHOT_SYMBOLS.length; index += batchSize) {
  const batch = ALL_SNAPSHOT_SYMBOLS.slice(index, index + batchSize);
  entries.push(...await Promise.all(batch.map(fetchQuote)));
}
const quotes = Object.fromEntries(entries.filter(([, quote]) => quote));
await writeFile("public/market.json", JSON.stringify({
  generatedAt: Date.now(),
  source: "Yahoo Finance chart endpoint",
  quoteType: "delayed-or-live-by-exchange",
  quotes,
}, null, 2));
console.log(`Wrote ${Object.keys(quotes).length}/${ALL_SNAPSHOT_SYMBOLS.length} market quotes`);
