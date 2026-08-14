function withQueryParams(target, source) {
  source.searchParams.forEach((value, key) => target.searchParams.set(key, value));
  return target;
}

async function proxyJson(request, upstreamUrl) {
  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.set("accept", "application/json");
  const upstream = await fetch(upstreamUrl, { method: "GET", headers });
  const responseHeaders = new Headers(upstream.headers);
  responseHeaders.set("access-control-allow-origin", "*");
  responseHeaders.set("cache-control", "public, max-age=30");
  return new Response(upstream.body, { status: upstream.status, headers: responseHeaders });
}

function upstreamError(message) {
  return new Response(JSON.stringify({ error: message }), {
    status: 502,
    headers: { "content-type": "application/json", "access-control-allow-origin": "*" },
  });
}

export default {
  async fetch(request, env) {
    const requestUrl = new URL(request.url);

    if (request.method === "GET" && requestUrl.pathname.startsWith("/api/market/")) {
      const symbol = decodeURIComponent(requestUrl.pathname.slice("/api/market/".length));
      if (!symbol) return upstreamError("missing_market_symbol");
      const upstreamUrl = withQueryParams(new URL(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`), requestUrl);
      try {
        return await proxyJson(request, upstreamUrl);
      } catch {
        return upstreamError("market_upstream_unavailable");
      }
    }

    if (request.method === "GET" && requestUrl.pathname === "/api/news") {
      const upstreamUrl = withQueryParams(new URL("https://api.gdeltproject.org/api/v2/doc/doc"), requestUrl);
      try {
        return await proxyJson(request, upstreamUrl);
      } catch {
        return upstreamError("news_upstream_unavailable");
      }
    }

    const response = await env.ASSETS.fetch(request);
    const acceptsHtml = request.headers.get("accept")?.includes("text/html");

    if (response.status !== 404 || !acceptsHtml || !["GET", "HEAD"].includes(request.method)) {
      return response;
    }

    const indexUrl = new URL(request.url);
    indexUrl.pathname = "/index.html";
    indexUrl.search = "";
    return env.ASSETS.fetch(new Request(indexUrl, request));
  },
};
