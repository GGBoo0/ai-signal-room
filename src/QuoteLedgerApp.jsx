import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import geoUrl from "world-atlas/countries-110m.json";
import "@phosphor-icons/web/regular";
import {
  companies,
  getCityLabel,
  getCompanyText,
  getCompanyValue,
  getCountryLabel,
  getNewsHeadline,
  getSectorLabel,
  sectorOptions,
} from "./App.jsx";
import {
  COMPANY_LOGOS,
  COMPANY_MARKET_SYMBOLS,
  COUNTRY_CODES,
  FEATURED_COMPANY_IDS,
  INDEX_MARKETS,
} from "./marketUniverse.js";

const PAGE_SIZE = 11;
const BASE_URL = import.meta.env.BASE_URL;

const copy = {
  ko: {
    product: "AI 투자 인텔리전스 아틀라스",
    title: "QUOTE LEDGER",
    subtitle: "글로벌 AI 기업 78 · 13개 산업 · 기업 시세와 투자 단서를 한눈에",
    search: "기업, 섹터, 국가, 티커 검색",
    marketOpen: "시장 거래 중",
    marketClosed: "정규장 마감",
    marketClock: "뉴욕",
    dataAuto: "자동 업데이트",
    dataDelayed: "거래소별 지연 시세",
    total: "전체",
    public: "공개기업",
    private: "비상장",
    sector: "섹터",
    country: "국가",
    all: "전체",
    favorites: "관심목록",
    company: "기업명",
    exchange: "거래소 / 티커",
    price: "현재가 (통화)",
    move: "전일 대비",
    status: "마켓 상태",
    todaysQuote: "오늘의 시세",
    oneDayChart: "1일 차트",
    facts: "핵심 정보",
    relatedNews: "관련 뉴스",
    more: "더보기",
    open: "시가",
    high: "고가",
    low: "저가",
    previous: "전일 종가",
    noQuote: "공개 시세 없음",
    privatePrice: "비상장 기업은 현재가를 제공하지 않습니다.",
    quoteWaiting: "시세 업데이트 대기 중",
    role: "AI 투자 역할",
    headquarters: "본사",
    founded: "설립",
    funding: "자금 / 시장",
    signal: "리서치 시그널",
    officialSource: "원문 열기",
    sourceOfficial: "공식 뉴스룸 / 공개 링크",
    sourceLive: "최신 뉴스 + 공개 소스",
    rows: "개 기업",
    page: "페이지",
    previousPage: "이전",
    nextPage: "다음",
    noResults: "조건에 맞는 기업이 없습니다.",
    clearFilters: "필터 초기화",
    distribution: "글로벌 분포",
    sectorMix: "섹터 분포 (13개)",
    marketSummary: "지표 요약",
    coveredCompanies: "추적 기업",
    quotedCompanies: "현재가 연결",
    coveredCountries: "커버 국가",
    coveredSectors: "커버 섹터",
    privateLabel: "PRIVATE",
    openLabel: "OPEN",
    closedLabel: "CLOSED",
    preLabel: "PRE",
    postLabel: "AFTER",
    unavailable: "확인 불가",
    refreshed: "기준",
    live: "LIVE",
    scheduled: "5분 스냅샷",
    cryptoLive: "1초 스트림",
    researchNotice: "정보 제공용 리서치 화면이며 투자 권유가 아닙니다.",
    watchAdd: "관심목록에 추가",
    watchRemove: "관심목록에서 제거",
    selectCompany: "기업 상세 보기",
  },
  en: {
    product: "AI INVESTMENT INTELLIGENCE ATLAS",
    title: "QUOTE LEDGER",
    subtitle: "78 global AI companies · 13 industries · quotes and investment context at a glance",
    search: "Search company, sector, country, ticker",
    marketOpen: "MARKET OPEN",
    marketClosed: "REGULAR SESSION CLOSED",
    marketClock: "NEW YORK",
    dataAuto: "AUTO UPDATE",
    dataDelayed: "EXCHANGE-DELAYED QUOTES",
    total: "ALL",
    public: "PUBLIC",
    private: "PRIVATE",
    sector: "SECTOR",
    country: "COUNTRY",
    all: "ALL",
    favorites: "WATCHLIST",
    company: "COMPANY",
    exchange: "EXCHANGE / TICKER",
    price: "LAST (CURRENCY)",
    move: "DAY CHANGE",
    status: "MARKET STATUS",
    todaysQuote: "TODAY'S QUOTE",
    oneDayChart: "1 DAY CHART",
    facts: "KEY FACTS",
    relatedNews: "RELATED NEWS",
    more: "VIEW MORE",
    open: "OPEN",
    high: "HIGH",
    low: "LOW",
    previous: "PREV. CLOSE",
    noQuote: "NO PUBLIC QUOTE",
    privatePrice: "Private companies do not have a public market price.",
    quoteWaiting: "WAITING FOR QUOTE UPDATE",
    role: "AI INVESTMENT ROLE",
    headquarters: "HEADQUARTERS",
    founded: "FOUNDED",
    funding: "FUNDING / MARKET",
    signal: "RESEARCH SIGNAL",
    officialSource: "OPEN SOURCE",
    sourceOfficial: "OFFICIAL NEWSROOM / PUBLIC LINKS",
    sourceLive: "LATEST NEWS + SOURCES",
    rows: "COMPANIES",
    page: "PAGE",
    previousPage: "PREV",
    nextPage: "NEXT",
    noResults: "No companies match these filters.",
    clearFilters: "RESET FILTERS",
    distribution: "GLOBAL DISTRIBUTION",
    sectorMix: "SECTOR MIX (13)",
    marketSummary: "MARKET SUMMARY",
    coveredCompanies: "TRACKED COMPANIES",
    quotedCompanies: "CONNECTED QUOTES",
    coveredCountries: "COVERED COUNTRIES",
    coveredSectors: "COVERED SECTORS",
    privateLabel: "PRIVATE",
    openLabel: "OPEN",
    closedLabel: "CLOSED",
    preLabel: "PRE",
    postLabel: "AFTER",
    unavailable: "UNAVAILABLE",
    refreshed: "AS OF",
    live: "LIVE",
    scheduled: "5 MIN SNAPSHOT",
    cryptoLive: "1 SEC STREAM",
    researchNotice: "Research interface for information only. Not investment advice.",
    watchAdd: "Add to watchlist",
    watchRemove: "Remove from watchlist",
    selectCompany: "Open company detail",
  },
};

function formatNumber(value, currency, language, compact = false) {
  if (!Number.isFinite(Number(value))) return "—";
  const normalizedCurrency = currency || "USD";
  const noDecimals = ["KRW", "JPY"].includes(normalizedCurrency);
  return new Intl.NumberFormat(language === "ko" ? "ko-KR" : "en-US", {
    notation: compact ? "compact" : "standard",
    minimumFractionDigits: compact || noDecimals ? 0 : 2,
    maximumFractionDigits: compact ? 1 : noDecimals ? 0 : 2,
  }).format(Number(value));
}

function quoteMove(quote) {
  const price = Number(quote?.price);
  const previous = Number(quote?.previousClose);
  if (!Number.isFinite(price) || !Number.isFinite(previous) || previous === 0) return null;
  const delta = price - previous;
  return { delta, percent: (delta / previous) * 100, tone: delta >= 0 ? "up" : "down" };
}

function formatSigned(value, digits = 2) {
  if (!Number.isFinite(value)) return "—";
  return `${value >= 0 ? "+" : "−"}${Math.abs(value).toFixed(digits)}`;
}

function formatDateTime(timestamp, language, includeSeconds = false) {
  if (!timestamp) return "—";
  return new Intl.DateTimeFormat(language === "ko" ? "ko-KR" : "en-US", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: includeSeconds ? "2-digit" : undefined,
    hour12: false,
    timeZone: "Asia/Seoul",
  }).format(new Date(timestamp));
}

function formatChartTime(timestamp, language, timeZone) {
  if (!timestamp) return "—";
  return new Intl.DateTimeFormat(language === "ko" ? "ko-KR" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timeZone || "UTC",
  }).format(new Date(timestamp));
}

function formatNewsDate(value, language) {
  const match = String(value ?? "").match(/^(\d{4})(\d{2})(\d{2})/);
  if (!match) return language === "ko" ? "최근" : "RECENT";
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return new Intl.DateTimeFormat(language === "ko" ? "ko-KR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC",
  }).format(date).toUpperCase();
}

function officialNewsLinks(company, language) {
  const uniqueLinks = [...new Map((company.news ?? []).filter((item) => item.url).map((item) => [item.url, item])).values()];
  return uniqueLinks.slice(0, 3).map((item) => ({
    ...item,
    date: language === "ko" ? "공개 링크" : "PUBLIC LINK",
    headline: language === "ko" ? `${company.name} 관련 ${item.source} 소스 열기` : `Open ${item.source} coverage for ${company.name}`,
    headlineKo: `${company.name} 관련 ${item.source} 소스 열기`,
    isLive: true,
  }));
}

async function fetchCompanyNews(company, language) {
  const params = new URLSearchParams({
    query: `"${company.name}" AI`,
    mode: "artlist",
    format: "json",
    maxrecords: "5",
    sort: "datedesc",
    timespan: "1month",
  });
  const controller = new AbortController();
  const timer = globalThis.setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetch(`https://api.gdeltproject.org/api/v2/doc/doc?${params}`, {
      headers: { accept: "application/json" },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`news ${response.status}`);
    const payload = await response.json();
    const items = (payload.articles ?? []).filter((article) => article.title && article.url).slice(0, 5).map((article) => ({
      date: formatNewsDate(article.seendate ?? article.datetime, language),
      source: String(article.domain ?? "GDELT").replace(/^www\./, "").toUpperCase(),
      headline: article.title,
      headlineKo: article.title,
      url: article.url,
      isLive: true,
    }));
    if (!items.length) throw new Error("news empty");
    return items;
  } finally {
    globalThis.clearTimeout(timer);
  }
}

function marketLabel(quote, labels) {
  const state = String(quote?.marketState ?? "").toUpperCase();
  if (["REGULAR", "OPEN"].includes(state)) return { label: labels.openLabel, tone: "open" };
  if (state === "PRE") return { label: labels.preLabel, tone: "pre" };
  if (["POST", "POSTPOST"].includes(state)) return { label: labels.postLabel, tone: "post" };
  return { label: labels.closedLabel, tone: "closed" };
}

function exchangeLabel(quote, company) {
  const exchangeCode = String(quote?.exchange ?? "").toUpperCase();
  const exchangeNames = {
    NMS: "NASDAQ",
    NGM: "NASDAQ",
    NCM: "NASDAQ",
    NYQ: "NYSE",
    ASE: "NYSE",
    KSC: "KRX",
    KOE: "KRX",
    JPX: "TSE",
    HKG: "HKEX",
    GER: "XETRA",
    FRA: "XETRA",
    PAR: "EPA",
    AMS: "EURONEXT",
    ASX: "ASX",
    EBS: "SIX",
  };
  return exchangeNames[exchangeCode] ?? company.ticker.split(":")[0];
}

function CompanyMark({ company }) {
  const [failed, setFailed] = useState(false);
  const filename = COMPANY_LOGOS[company.id];
  if (filename && !failed) {
    return (
      <span className="ql-company-mark has-logo" aria-hidden="true">
        <img src={`${BASE_URL}brands/${filename}`} alt="" onError={() => setFailed(true)} />
      </span>
    );
  }
  return <span className="ql-company-mark" aria-hidden="true"><i className="ph ph-buildings" /></span>;
}

function CountryMark({ country, language }) {
  const code = COUNTRY_CODES[country];
  return (
    <span className="ql-country-mark">
      {code ? <img src={`${BASE_URL}flags/${code.toLowerCase()}.svg`} alt="" aria-hidden="true" /> : <i className="ph ph-globe-hemisphere-west" aria-hidden="true" />}
      <span>{getCountryLabel(country, language)}</span>
    </span>
  );
}

function QuoteCanvas({ values, tone = "up", label }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || values.length < 2) return undefined;
    const context = canvas.getContext("2d");
    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const width = rect.width;
      const height = rect.height;
      const pad = { top: 14, right: 54, bottom: 14, left: 8 };
      const chartWidth = width - pad.left - pad.right;
      const chartHeight = height - pad.top - pad.bottom;
      const min = Math.min(...values);
      const max = Math.max(...values);
      const range = max - min || 1;
      const points = values.map((value, index) => ({
        x: pad.left + (index / (values.length - 1)) * chartWidth,
        y: pad.top + chartHeight - ((value - min) / range) * chartHeight,
      }));

      context.clearRect(0, 0, width, height);
      context.strokeStyle = "rgba(31, 29, 24, 0.12)";
      context.lineWidth = 1;
      context.setLineDash([3, 4]);
      for (let row = 0; row < 4; row += 1) {
        const y = pad.top + (row / 3) * chartHeight;
        context.beginPath();
        context.moveTo(pad.left, y);
        context.lineTo(width - pad.right, y);
        context.stroke();
      }
      context.setLineDash([]);

      const lineColor = tone === "down" ? "#195bba" : "#ed4b16";
      const fillColor = tone === "down" ? "rgba(25, 91, 186, 0.11)" : "rgba(237, 75, 22, 0.10)";
      const gradient = context.createLinearGradient(0, pad.top, 0, height - pad.bottom);
      gradient.addColorStop(0, fillColor);
      gradient.addColorStop(1, "rgba(255,255,255,0)");

      context.beginPath();
      context.moveTo(points[0].x, height - pad.bottom);
      points.forEach((point) => context.lineTo(point.x, point.y));
      context.lineTo(points.at(-1).x, height - pad.bottom);
      context.closePath();
      context.fillStyle = gradient;
      context.fill();

      context.beginPath();
      points.forEach((point, index) => index === 0 ? context.moveTo(point.x, point.y) : context.lineTo(point.x, point.y));
      context.strokeStyle = lineColor;
      context.lineWidth = 2;
      context.lineJoin = "round";
      context.lineCap = "round";
      context.stroke();

      context.fillStyle = "rgba(58, 54, 48, 0.78)";
      context.font = '700 11px "Gyeonggi Cheonnyeon", sans-serif';
      context.textAlign = "right";
      context.textBaseline = "middle";
      const digits = max >= 1000 ? 0 : 2;
      [max, min + range / 2, min].forEach((value, index) => {
        const y = pad.top + (index / 2) * chartHeight;
        context.fillText(value.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits }), width - 4, y);
      });
    };

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [tone, values]);

  return <canvas className="ql-quote-canvas" ref={canvasRef} role="img" aria-label={label} />;
}

function MarketTapeItem({ item, quote, language, crypto = false }) {
  const move = quoteMove(quote);
  const currency = quote?.currency ?? (crypto ? "USD" : "");
  return (
    <div className={`ql-tape-item ${crypto ? "is-stream" : ""}`}>
      <span className="ql-tape-label">
        {language === "ko" ? item.nameKo : item.name}
        {crypto && <em>1S</em>}
      </span>
      <strong>{formatNumber(quote?.price, currency, language)}</strong>
      <span className={`ql-tape-move ${move?.tone ?? "flat"}`}>{move ? `${formatSigned(move.percent)}%` : "—"}</span>
    </div>
  );
}

function DetailPanel({ company, quote, language, labels, news, newsStatus }) {
  const move = quoteMove(quote);
  const isPublic = company.status === "PUBLIC";
  const currency = quote?.currency ?? "";
  const quoteState = marketLabel(quote, labels);
  const chartValues = (quote?.closes ?? []).map(Number).filter(Number.isFinite);
  const symbol = COMPANY_MARKET_SYMBOLS[company.id];
  const chartStart = quote?.timestamps?.[0];
  const chartEnd = quote?.timestamps?.at(-1);

  return (
    <section className="ql-detail" aria-label={`${company.name} ${labels.todaysQuote}`}>
      <div className="ql-detail-quote">
        <span className="ql-detail-kicker">{labels.todaysQuote}</span>
        {isPublic && quote ? (
          <>
            <div className="ql-detail-price"><strong>{formatNumber(quote.price, currency, language)}</strong><span>{currency}</span></div>
            <div className={`ql-detail-change ${move?.tone ?? "flat"}`}>
              <span>{move ? formatSigned(move.delta, ["KRW", "JPY"].includes(currency) ? 0 : 2) : "—"}</span>
              <strong>{move ? `${formatSigned(move.percent)}%` : "—"}</strong>
            </div>
            <dl className="ql-quote-stats">
              <div><dt>{labels.open}</dt><dd>{formatNumber(quote.open, currency, language)}</dd></div>
              <div><dt>{labels.high}</dt><dd>{formatNumber(quote.dayHigh, currency, language)}</dd></div>
              <div><dt>{labels.low}</dt><dd>{formatNumber(quote.dayLow, currency, language)}</dd></div>
              <div><dt>{labels.previous}</dt><dd>{formatNumber(quote.previousClose, currency, language)}</dd></div>
            </dl>
            <span className="ql-quote-source">{exchangeLabel(quote, company)} · {currency} · {labels.dataDelayed}</span>
          </>
        ) : (
          <div className="ql-private-quote">
            <strong>{isPublic ? labels.quoteWaiting : labels.privateLabel}</strong>
            <p>{isPublic ? labels.dataDelayed : labels.privatePrice}</p>
          </div>
        )}
      </div>

      <div className="ql-detail-chart">
        <div className="ql-detail-head">
          <span>{labels.oneDayChart}</span>
          <div><button type="button" className="is-active">1D</button><span>5M</span></div>
        </div>
        {chartValues.length > 1 ? (
          <>
            <QuoteCanvas values={chartValues} tone={move?.tone} label={`${company.name} one day price chart`} />
            <div className="ql-chart-axis"><span>{formatChartTime(chartStart, language, quote.exchangeTimezoneName)}</span><span>{formatChartTime(chartEnd, language, quote.exchangeTimezoneName)}</span></div>
          </>
        ) : (
          <div className="ql-chart-empty"><i className="ph ph-chart-line-down" /><span>{isPublic ? labels.quoteWaiting : labels.noQuote}</span></div>
        )}
      </div>

      <div className="ql-detail-facts">
        <span className="ql-detail-kicker">{labels.facts}</span>
        <dl>
          <div><dt>{labels.role}</dt><dd>{getCompanyText(company, "role", language)}</dd></div>
          <div><dt>{labels.headquarters}</dt><dd>{getCityLabel(company.city, language)}, {getCountryLabel(company.country, language)}</dd></div>
          <div><dt>{labels.founded}</dt><dd>{company.founded}</dd></div>
          <div><dt>{labels.funding}</dt><dd>{isPublic ? `${company.ticker}${symbol ? ` · ${symbol}` : ""}` : getCompanyValue(company, "valuation", language)}</dd></div>
        </dl>
        <div className="ql-investment-role"><span>{labels.signal}</span><strong className={company.signalTone === "orange" ? "up" : "down"}>{company.signal} · {company.signalLabel}</strong></div>
      </div>

      <div className="ql-detail-news">
        <div className="ql-detail-head"><span>{labels.relatedNews}</span><em>{newsStatus === "live" ? labels.sourceLive : labels.sourceOfficial}</em></div>
        <div className="ql-news-stack">
          {news.slice(0, 3).map((item, index) => (
            <a href={item.url} target="_blank" rel="noreferrer" key={`${item.url}-${index}`}>
              <strong>{getNewsHeadline(item, company, index, language)}</strong>
              <span>{item.source} · {item.date} <i className="ph ph-arrow-up-right" /></span>
            </a>
          ))}
        </div>
      </div>

      <div className={`ql-detail-state ${quoteState.tone}`}><span />{isPublic ? quoteState.label : labels.privateLabel}</div>
    </section>
  );
}

export function QuoteLedgerApp() {
  const [language, setLanguage] = useState("ko");
  const [search, setSearch] = useState("");
  const [listingFilter, setListingFilter] = useState("all");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [watchOnly, setWatchOnly] = useState(false);
  const [watchlist, setWatchlist] = useState(() => new Set(companies.filter((company) => company.watchlist).map((company) => company.id)));
  const [selectedId, setSelectedId] = useState("nvidia");
  const [page, setPage] = useState(1);
  const [snapshot, setSnapshot] = useState({ generatedAt: null, quotes: {} });
  const [snapshotStatus, setSnapshotStatus] = useState("loading");
  const [cryptoQuotes, setCryptoQuotes] = useState({});
  const [cryptoStatus, setCryptoStatus] = useState("connecting");
  const [newsSnapshot, setNewsSnapshot] = useState({ generatedAt: null, companies: {} });
  const [newsItems, setNewsItems] = useState(() => officialNewsLinks(companies.find((company) => company.id === "nvidia") ?? companies[0], "ko"));
  const [newsStatus, setNewsStatus] = useState("loading");
  const [clockTick, setClockTick] = useState(Date.now());
  const labels = copy[language];

  const publicCount = companies.filter((company) => company.status === "PUBLIC").length;
  const privateCount = companies.length - publicCount;
  const orderedCompanies = useMemo(() => {
    const featuredRank = new Map(FEATURED_COMPANY_IDS.map((id, index) => [id, index]));
    return [...companies].sort((left, right) => {
      const leftRank = featuredRank.has(left.id) ? featuredRank.get(left.id) : 999;
      const rightRank = featuredRank.has(right.id) ? featuredRank.get(right.id) : 999;
      return leftRank - rightRank || left.name.localeCompare(right.name);
    });
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "ko" ? "ko" : "en";
    document.title = language === "ko" ? "Quote Ledger · AI 투자 인텔리전스" : "Quote Ledger · AI Investment Intelligence";
  }, [language]);

  useEffect(() => {
    const timer = window.setInterval(() => setClockTick(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const company = companies.find((item) => item.id === selectedId) ?? companies[0];
    const cachedNews = newsSnapshot.companies?.[company.id] ?? [];
    if (cachedNews.length) {
      const normalizedNews = cachedNews.map((item) => ({
        ...item,
        headlineKo: item.headline,
        date: formatDateTime(item.publishedAt, language),
        isLive: true,
      }));
      setNewsItems([...normalizedNews, ...officialNewsLinks(company, language)].slice(0, 3));
      setNewsStatus("live");
      return () => {
        cancelled = true;
      };
    }
    setNewsItems(officialNewsLinks(company, language));
    setNewsStatus("loading");
    fetchCompanyNews(company, language)
      .then((items) => {
        if (cancelled) return;
        setNewsItems(items);
        setNewsStatus("live");
      })
      .catch(() => {
        if (cancelled) return;
        setNewsItems(officialNewsLinks(company, language));
        setNewsStatus("fallback");
      });
    return () => {
      cancelled = true;
    };
  }, [language, newsSnapshot, selectedId]);

  useEffect(() => {
    let cancelled = false;
    async function loadNewsSnapshot() {
      try {
        const response = await fetch(`${BASE_URL}news.json?cache=${Date.now()}`, { cache: "no-store" });
        if (!response.ok) throw new Error(`news snapshot ${response.status}`);
        const payload = await response.json();
        if (!cancelled) setNewsSnapshot(payload);
      } catch {
        // The per-company official-link fallback remains available without this cache.
      }
    }
    loadNewsSnapshot();
    const timer = window.setInterval(loadNewsSnapshot, 5 * 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let hasSnapshot = false;
    async function loadSnapshot() {
      if (!hasSnapshot) setSnapshotStatus("loading");
      try {
        const response = await fetch(`${BASE_URL}market.json?cache=${Date.now()}`, { cache: "no-store" });
        if (!response.ok) throw new Error(`snapshot ${response.status}`);
        const payload = await response.json();
        if (cancelled) return;
        hasSnapshot = true;
        setSnapshot(payload);
        setSnapshotStatus("scheduled");
      } catch {
        if (!cancelled) setSnapshotStatus(hasSnapshot ? "stale" : "unavailable");
      }
    }
    loadSnapshot();
    const timer = window.setInterval(loadSnapshot, 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!("WebSocket" in window)) {
      setCryptoStatus("unavailable");
      return undefined;
    }
    let socket;
    let reconnectTimer;
    let disposed = false;
    function connect() {
      if (disposed) return;
      setCryptoStatus("connecting");
      socket = new window.WebSocket("wss://data-stream.binance.vision/stream?streams=btcusdt@miniTicker/ethusdt@miniTicker");
      socket.onopen = () => !disposed && setCryptoStatus("live");
      socket.onmessage = (event) => {
        if (disposed) return;
        try {
          const payload = JSON.parse(event.data);
          const data = payload.data ?? payload;
          const price = Number(data.c);
          const previousClose = Number(data.o);
          if (!data.s || !Number.isFinite(price)) return;
          setCryptoQuotes((current) => ({
            ...current,
            [data.s]: {
              price,
              previousClose,
              currency: "USD",
              marketState: "REGULAR",
              updatedAt: Number(data.E) || Date.now(),
            },
          }));
          setCryptoStatus("live");
        } catch {
          // Ignore malformed stream messages and keep the last valid quote.
        }
      };
      socket.onerror = () => socket?.close();
      socket.onclose = () => {
        if (disposed) return;
        setCryptoStatus("retrying");
        reconnectTimer = window.setTimeout(connect, 3_000);
      };
    }
    connect();
    return () => {
      disposed = true;
      window.clearTimeout(reconnectTimer);
      if (socket && socket.readyState < window.WebSocket.CLOSING) socket.close();
    };
  }, []);

  const countries = useMemo(() => [...new Set(companies.map((company) => company.country))].sort(), []);

  const filteredCompanies = useMemo(() => {
    const query = search.trim().toLocaleLowerCase(language === "ko" ? "ko-KR" : "en-US");
    return orderedCompanies.filter((company) => {
      const haystack = [
        company.name,
        company.ticker,
        COMPANY_MARKET_SYMBOLS[company.id],
        company.country,
        getCountryLabel(company.country, language),
        company.city,
        getCityLabel(company.city, language),
        getCompanyText(company, "category", language),
        getCompanyText(company, "role", language),
        getSectorLabel(company.sector, language),
      ].filter(Boolean).join(" ").toLocaleLowerCase(language === "ko" ? "ko-KR" : "en-US");
      return (!query || haystack.includes(query))
        && (listingFilter === "all" || company.status === listingFilter)
        && (sectorFilter === "all" || company.sector === sectorFilter)
        && (countryFilter === "all" || company.country === countryFilter)
        && (!watchOnly || watchlist.has(company.id));
    });
  }, [countryFilter, language, listingFilter, orderedCompanies, search, sectorFilter, watchOnly, watchlist]);

  const totalPages = Math.max(1, Math.ceil(filteredCompanies.length / PAGE_SIZE));
  const pageRows = filteredCompanies.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selectedCompany = companies.find((company) => company.id === selectedId) ?? companies[0];
  const selectedSymbol = COMPANY_MARKET_SYMBOLS[selectedCompany.id];
  const selectedQuote = selectedSymbol ? snapshot.quotes?.[selectedSymbol] : null;
  const quotedPublicCount = Object.entries(COMPANY_MARKET_SYMBOLS).filter(([, symbol]) => snapshot.quotes?.[symbol]).length;

  useEffect(() => {
    setPage(1);
  }, [countryFilter, listingFilter, search, sectorFilter, watchOnly]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const clusters = useMemo(() => {
    const grouped = new Map();
    companies.forEach((company) => {
      const group = grouped.get(company.country) ?? { country: company.country, coordinates: [0, 0], count: 0 };
      group.coordinates[0] += company.coordinates[0];
      group.coordinates[1] += company.coordinates[1];
      group.count += 1;
      grouped.set(company.country, group);
    });
    return [...grouped.values()].map((group) => ({
      ...group,
      coordinates: [group.coordinates[0] / group.count, group.coordinates[1] / group.count],
    }));
  }, []);

  const sectorMix = useMemo(() => sectorOptions.filter((sector) => sector.id !== "all").map((sector) => ({
    ...sector,
    count: companies.filter((company) => company.sector === sector.id).length,
  })).sort((left, right) => right.count - left.count), []);

  const newYorkTime = new Intl.DateTimeFormat(language === "ko" ? "ko-KR" : "en-US", {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/New_York",
  }).format(new Date(clockTick));
  const nasdaqQuote = snapshot.quotes?.["^IXIC"];
  const globalMarketState = marketLabel(nasdaqQuote, labels);
  const latestUpdatedAt = Math.max(
    Number(snapshot.generatedAt) || 0,
    ...Object.values(cryptoQuotes).map((quote) => Number(quote.updatedAt) || 0),
  );

  function resetFilters() {
    setSearch("");
    setListingFilter("all");
    setSectorFilter("all");
    setCountryFilter("all");
    setWatchOnly(false);
  }

  function toggleWatch(event, companyId) {
    event.stopPropagation();
    setWatchlist((current) => {
      const next = new Set(current);
      if (next.has(companyId)) next.delete(companyId);
      else next.add(companyId);
      return next;
    });
  }

  function selectCompany(companyId) {
    setSelectedId(companyId);
  }

  return (
    <main className="ql-shell" style={{ "--paper-texture": `url(${BASE_URL}paper-texture.png)` }}>
      <header className="ql-masthead">
        <div className="ql-brand">
          <strong>SIGNAL<br />ROOM</strong>
          <span>{labels.product}</span>
        </div>
        <div className="ql-title-block">
          <h1>{labels.title}</h1>
          <p>{labels.subtitle}</p>
        </div>
        <div className="ql-header-tools">
          <label className="ql-search">
            <span className="sr-only">{labels.search}</span>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={labels.search} />
            {search ? <button type="button" onClick={() => setSearch("")} aria-label={labels.clearFilters}><i className="ph ph-x" /></button> : <i className="ph ph-magnifying-glass" aria-hidden="true" />}
          </label>
          <div className="ql-language" role="group" aria-label="Language">
            <button type="button" className={language === "ko" ? "is-active" : ""} onClick={() => setLanguage("ko")} aria-pressed={language === "ko"}>KOR</button>
            <button type="button" className={language === "en" ? "is-active" : ""} onClick={() => setLanguage("en")} aria-pressed={language === "en"}>ENG</button>
          </div>
          <div className="ql-market-clock">
            <strong className={globalMarketState.tone}><span />{nasdaqQuote ? (globalMarketState.tone === "open" ? labels.marketOpen : labels.marketClosed) : labels.dataAuto}</strong>
            <span>{labels.marketClock} {newYorkTime}</span>
            <small>{labels.refreshed} {formatDateTime(latestUpdatedAt, language, true)} KST</small>
          </div>
        </div>
      </header>

      <section className="ql-market-tape" aria-label={labels.marketSummary}>
        <div className="ql-tape-status"><span className={snapshotStatus === "scheduled" ? "is-live" : ""} /><strong>{snapshotStatus === "scheduled" ? labels.scheduled : labels.dataAuto}</strong></div>
        {INDEX_MARKETS.slice(0, 5).map((item) => <MarketTapeItem key={item.symbol} item={item} quote={snapshot.quotes?.[item.symbol]} language={language} />)}
        <MarketTapeItem item={{ name: "BITCOIN", nameKo: "비트코인" }} quote={cryptoQuotes.BTCUSDT} language={language} crypto={cryptoStatus === "live"} />
        <MarketTapeItem item={{ name: "ETHEREUM", nameKo: "이더리움" }} quote={cryptoQuotes.ETHUSDT} language={language} crypto={cryptoStatus === "live"} />
      </section>

      <section className="ql-controls" aria-label="Company filters">
        <div className="ql-listing-tabs" role="group" aria-label="Listing status">
          {[
            ["all", labels.total, companies.length],
            ["PUBLIC", labels.public, publicCount],
            ["PRIVATE", labels.private, privateCount],
          ].map(([id, label, count]) => (
            <button type="button" key={id} className={listingFilter === id ? "is-active" : ""} onClick={() => setListingFilter(id)} aria-pressed={listingFilter === id}>{label} <strong>{count}</strong></button>
          ))}
        </div>
        <div className="ql-select-filters">
          <label><span>{labels.sector}</span><select value={sectorFilter} onChange={(event) => setSectorFilter(event.target.value)}><option value="all">{labels.all}</option>{sectorOptions.filter((sector) => sector.id !== "all").map((sector) => <option key={sector.id} value={sector.id}>{getSectorLabel(sector.id, language)}</option>)}</select><i className="ph ph-caret-down" /></label>
          <label><span>{labels.country}</span><select value={countryFilter} onChange={(event) => setCountryFilter(event.target.value)}><option value="all">{labels.all}</option>{countries.map((country) => <option key={country} value={country}>{getCountryLabel(country, language)}</option>)}</select><i className="ph ph-caret-down" /></label>
          <button type="button" className={watchOnly ? "is-active" : ""} onClick={() => setWatchOnly((current) => !current)} aria-pressed={watchOnly}><i className="ph ph-star" /> {labels.favorites}</button>
        </div>
      </section>

      <section className="ql-ledger" aria-label="AI company quote ledger">
        <div className="ql-table-head" role="row">
          <span aria-hidden="true" />
          <span>{labels.company}</span>
          <span>{labels.country}</span>
          <span>{labels.sector}</span>
          <span>{labels.exchange}</span>
          <span>{labels.price}</span>
          <span>{labels.move}</span>
          <span>{labels.status}</span>
        </div>

        <div className="ql-table-body">
          {pageRows.length ? pageRows.map((company, index) => {
            const symbol = COMPANY_MARKET_SYMBOLS[company.id];
            const quote = symbol ? snapshot.quotes?.[symbol] : null;
            const move = quoteMove(quote);
            const isSelected = selectedId === company.id;
            const isPublic = company.status === "PUBLIC";
            const state = marketLabel(quote, labels);
            const rowNumber = (page - 1) * PAGE_SIZE + index + 1;
            return (
              <Fragment key={company.id}>
                <div role="button" tabIndex="0" className={`ql-company-row ${isSelected ? "is-selected" : ""}`} onClick={() => selectCompany(company.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectCompany(company.id); } }} aria-expanded={isSelected} aria-label={`${labels.selectCompany}: ${company.name}`}>
                  <span className="ql-row-index"><em>{rowNumber}</em><button type="button" className={watchlist.has(company.id) ? "is-active" : ""} aria-label={watchlist.has(company.id) ? labels.watchRemove : labels.watchAdd} onClick={(event) => toggleWatch(event, company.id)}><i className="ph ph-star" /></button></span>
                  <span className="ql-company-cell"><CompanyMark company={company} /><strong>{company.name}</strong><small>{getCompanyText(company, "category", language)}</small></span>
                  <span className="ql-country-cell" data-label={labels.country}><CountryMark country={company.country} language={language} /></span>
                  <span className="ql-sector-cell" data-label={labels.sector}>{getSectorLabel(company.sector, language)}</span>
                  <span className="ql-ticker-cell" data-label={labels.exchange}><strong>{exchangeLabel(quote, company)}</strong><small>{symbol ?? labels.privateLabel}</small></span>
                  <span className="ql-price-cell" data-label={labels.price}>{isPublic && quote ? <><strong>{formatNumber(quote.price, quote.currency, language)}</strong><small>{quote.currency}</small></> : <strong className="is-private">{isPublic ? "—" : labels.privateLabel}</strong>}</span>
                  <span className={`ql-move-cell ${move?.tone ?? "flat"}`} data-label={labels.move}>{move ? <><strong>{formatSigned(move.percent)}%</strong><small>{formatSigned(move.delta, ["KRW", "JPY"].includes(quote.currency) ? 0 : 2)}</small></> : <strong>—</strong>}</span>
                  <span className={`ql-status-cell ${isPublic ? state.tone : "private"}`} data-label={labels.status}><span />{isPublic ? (quote ? state.label : labels.unavailable) : labels.private}</span>
                </div>
                {isSelected && <DetailPanel company={company} quote={quote} language={language} labels={labels} news={newsItems} newsStatus={newsStatus} />}
              </Fragment>
            );
          }) : (
            <div className="ql-empty"><i className="ph ph-magnifying-glass" /><strong>{labels.noResults}</strong><button type="button" onClick={resetFilters}>{labels.clearFilters}</button></div>
          )}
        </div>

        <div className="ql-pagination">
          <span>{filteredCompanies.length} {labels.rows} · {labels.page} {page}/{totalPages}</span>
          <div>
            <button type="button" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}><i className="ph ph-arrow-left" /> {labels.previousPage}</button>
            <button type="button" disabled={page >= totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>{labels.nextPage} <i className="ph ph-arrow-right" /></button>
          </div>
        </div>
      </section>

      <section className="ql-lower-grid">
        <article className="ql-distribution-panel">
          <h2>{labels.distribution}</h2>
          <div className="ql-mini-map">
            <ComposableMap width={520} height={220} projection="geoEqualEarth" projectionConfig={{ scale: 102, center: [5, 5] }} aria-label={labels.distribution}>
              <Geographies geography={geoUrl}>
                {({ geographies }) => geographies.map((geo) => <Geography key={geo.rsmKey} geography={geo} style={{ default: { fill: "#d9d1c3", stroke: "#f6f1e7", strokeWidth: 0.5, outline: "none" }, hover: { fill: "#c7bdae", stroke: "#f6f1e7", strokeWidth: 0.5, outline: "none" }, pressed: { fill: "#c7bdae", outline: "none" } }} />)}
              </Geographies>
              {clusters.map((cluster) => <Marker key={cluster.country} coordinates={cluster.coordinates} onClick={() => setCountryFilter(cluster.country)}><g className={`ql-map-cluster ${countryFilter === cluster.country ? "is-active" : ""}`} role="button" tabIndex="0" aria-label={`${getCountryLabel(cluster.country, language)} ${cluster.count}`}><circle r={Math.max(5, Math.min(13, 4 + cluster.count / 2))} /><text y="3">{cluster.count}</text></g></Marker>)}
            </ComposableMap>
          </div>
        </article>

        <article className="ql-sector-panel">
          <h2>{labels.sectorMix}</h2>
          <div className="ql-sector-bars">
            {sectorMix.slice(0, 6).map((sector) => <button type="button" key={sector.id} onClick={() => setSectorFilter(sector.id)}><span>{getSectorLabel(sector.id, language)}</span><progress max={companies.length} value={sector.count} /><strong>{sector.count}</strong></button>)}
          </div>
        </article>

        <article className="ql-summary-panel">
          <h2>{labels.marketSummary}</h2>
          <dl>
            <div><dt>{labels.coveredCompanies}</dt><dd>{companies.length}</dd></div>
            <div><dt>{labels.quotedCompanies}</dt><dd>{quotedPublicCount}/{publicCount}</dd></div>
            <div><dt>{labels.coveredCountries}</dt><dd>{countries.length}</dd></div>
            <div><dt>{labels.coveredSectors}</dt><dd>{sectorOptions.length - 1}</dd></div>
          </dl>
          <div className="ql-index-summary">
            {INDEX_MARKETS.slice(0, 3).map((market) => {
              const quote = snapshot.quotes?.[market.symbol];
              const move = quoteMove(quote);
              return <div key={market.symbol}><span>{language === "ko" ? market.nameKo : market.name}</span><strong>{formatNumber(quote?.price, quote?.currency, language)}</strong><em className={move?.tone ?? "flat"}>{move ? `${formatSigned(move.percent)}%` : "—"}</em></div>;
            })}
          </div>
          <small>{labels.researchNotice}</small>
        </article>
      </section>
    </main>
  );
}
