import { useEffect, useMemo, useState } from "react";
import {
  ComposableMap,
  Geography,
  Geographies,
  Graticule,
  Marker,
} from "react-simple-maps";
import "@phosphor-icons/web/regular";
import geoUrl from "world-atlas/countries-110m.json";

function makeFallbackNews(source, url, headlines, headlinesKo = []) {
  return headlines.map((headline, index) => ({
    date: index === 0 ? "AUG 13, 2026" : index === 1 ? "AUG 01, 2026" : "JUL 18, 2026",
    source,
    headline,
    headlineKo: headlinesKo[index] ?? headline,
    url,
  }));
}

const companies = [
  {
    id: "sensetime",
    name: "SenseTime",
    country: "Hong Kong",
    city: "Hong Kong",
    mapNames: ["Hong Kong"],
    coordinates: [114.1694, 22.3193],
    sector: "robotics",
    category: "Computer vision",
    role: "Enterprise SaaS & Solutions",
    status: "PUBLIC",
    ticker: "HKEX: 0020",
    founded: "2014",
    employees: "~7,600",
    funding: "~$2.0B",
    valuation: "$3.9B",
    latestRound: "IPO · 2021",
    signal: "+28%",
    signalLabel: "ACCELERATING",
    signalTone: "orange",
    thesis:
      "A scaled computer-vision platform moving from smart-city deployments into multimodal enterprise products.",
    watchlist: true,
    showLabel: true,
    markerLabel: "HONG KONG",
    chart: [3, 5, 4, 7, 6, 10, 12, 9, 14, 16, 19, 22, 28],
    news: [
      {
        date: "AUG 12, 2026",
        source: "TECHNODE",
        headline: "SenseTime previews a multimodal upgrade for enterprise vision workflows",
        url: "https://www.sensetime.com/en/news",
      },
      {
        date: "AUG 07, 2026",
        source: "SCMP",
        headline: "Hong Kong expands local AI adoption program with SenseTime as partner",
        url: "https://www.scmp.com/tech",
      },
      {
        date: "JUL 29, 2026",
        source: "REUTERS",
        headline: "SenseTime narrows losses as enterprise revenue grows in Asia",
        url: "https://www.reuters.com/technology/",
      },
      {
        date: "JUL 18, 2026",
        source: "NIKKEI",
        headline: "New edge-compute suite points to a broader industrial AI push",
        url: "https://asia.nikkei.com/Business/Technology",
      },
    ],
  },
  {
    id: "openai",
    name: "OpenAI",
    country: "United States",
    city: "San Francisco",
    mapNames: ["United States of America"],
    coordinates: [-122.4194, 37.7749],
    sector: "models",
    category: "Foundation models",
    role: "API + Enterprise",
    status: "PRIVATE",
    ticker: "PRIVATE",
    founded: "2015",
    employees: "~4,500",
    funding: "$63B+",
    valuation: "$300B est.",
    latestRound: "Series F · 2026",
    signal: "+18%",
    signalLabel: "HIGH SIGNAL",
    signalTone: "blue",
    thesis:
      "Frontier model distribution is becoming an enterprise operating layer, with compute access as the key constraint.",
    watchlist: true,
    showLabel: true,
    markerLabel: "SAN FRANCISCO",
    chart: [5, 8, 8, 11, 13, 12, 16, 14, 17, 18, 21, 19, 24],
    news: [
      {
        date: "AUG 13, 2026",
        source: "THE VERGE",
        headline: "OpenAI pushes agent workflows deeper into business software",
        url: "https://www.theverge.com/ai-artificial-intelligence",
      },
      {
        date: "AUG 04, 2026",
        source: "FT",
        headline: "Enterprise demand keeps pressure on frontier-model capacity",
        url: "https://www.ft.com/technology",
      },
      {
        date: "JUL 20, 2026",
        source: "REUTERS",
        headline: "New developer tools aim to turn model usage into durable workflows",
        url: "https://www.reuters.com/technology/",
      },
    ],
  },
  {
    id: "mistral",
    name: "Mistral AI",
    country: "France",
    city: "Paris",
    mapNames: ["France"],
    coordinates: [2.3522, 48.8566],
    sector: "models",
    category: "Open-weight models",
    role: "Models + API",
    status: "PRIVATE",
    ticker: "PRIVATE",
    founded: "2023",
    employees: "~250",
    funding: "$1.1B",
    valuation: "$6.2B",
    latestRound: "Series B · 2024",
    signal: "+21%",
    signalLabel: "HIGH SIGNAL",
    signalTone: "blue",
    thesis:
      "Europe's clearest open-weight challenger, balancing sovereign compute access with a pragmatic API layer.",
    watchlist: true,
    showLabel: true,
    markerLabel: "PARIS",
    chart: [4, 6, 9, 7, 11, 10, 15, 18, 16, 20, 22, 23, 26],
    news: [
      {
        date: "AUG 09, 2026",
        source: "LE MONDE",
        headline: "Mistral AI opens a new sovereign deployment track for public-sector teams",
        url: "https://www.mistral.ai/news/",
      },
      {
        date: "JUL 31, 2026",
        source: "BLOOMBERG",
        headline: "Open-weight strategy keeps Mistral at the center of Europe's AI debate",
        url: "https://www.bloomberg.com/technology",
      },
      {
        date: "JUL 16, 2026",
        source: "SIFTED",
        headline: "French startups build around the Mistral ecosystem",
        url: "https://sifted.eu/articles/ai",
      },
    ],
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    country: "China",
    city: "Hangzhou",
    mapNames: ["China"],
    coordinates: [120.1551, 30.2741],
    sector: "models",
    category: "Foundation models",
    role: "Research + API",
    status: "PRIVATE",
    ticker: "PRIVATE",
    founded: "2023",
    employees: "~200",
    funding: "Undisclosed",
    valuation: "Private",
    latestRound: "Research-led",
    signal: "+34%",
    signalLabel: "MOMENTUM",
    signalTone: "orange",
    thesis:
      "An efficiency-led research lab whose open releases continue to reset the cost curve for model inference.",
    watchlist: false,
    showLabel: true,
    markerLabel: "HANGZHOU",
    chart: [2, 4, 8, 7, 9, 14, 13, 18, 22, 19, 25, 29, 34],
    news: [
      {
        date: "AUG 11, 2026",
        source: "NIKKEI",
        headline: "DeepSeek research team highlights a lower-latency inference stack",
        url: "https://www.deepseek.com/",
      },
      {
        date: "AUG 02, 2026",
        source: "SCMP",
        headline: "New model release keeps the spotlight on China's efficiency race",
        url: "https://www.scmp.com/tech",
      },
      {
        date: "JUL 25, 2026",
        source: "REUTERS",
        headline: "Model exports remain a key variable for China's AI labs",
        url: "https://www.reuters.com/technology/",
      },
    ],
  },
  {
    id: "sakana",
    name: "Sakana AI",
    country: "Japan",
    city: "Tokyo",
    mapNames: ["Japan"],
    coordinates: [139.6917, 35.6895],
    sector: "models",
    category: "Model research",
    role: "Research + Licensing",
    status: "PRIVATE",
    ticker: "PRIVATE",
    founded: "2023",
    employees: "~70",
    funding: "$300M",
    valuation: "$2.1B",
    latestRound: "Series B · 2026",
    signal: "+26%",
    signalLabel: "HIGH SIGNAL",
    signalTone: "orange",
    thesis:
      "A compact research company testing evolutionary model design and Japanese enterprise distribution at speed.",
    watchlist: true,
    showLabel: true,
    markerLabel: "TOKYO",
    chart: [4, 6, 5, 9, 11, 8, 14, 12, 15, 17, 19, 21, 26],
    news: [
      {
        date: "AUG 10, 2026",
        source: "JAPAN TIMES",
        headline: "Sakana AI expands its research partnership footprint in Tokyo",
        url: "https://www.sakana.ai/news",
      },
      {
        date: "JUL 28, 2026",
        source: "NIKKEI",
        headline: "Japan's model ecosystem looks for a local path beyond scale alone",
        url: "https://asia.nikkei.com/Business/Technology",
      },
      {
        date: "JUL 09, 2026",
        source: "THE REGISTER",
        headline: "Sakana AI publishes new notes on collective model behavior",
        url: "https://www.theregister.com/Software/AI/",
      },
    ],
  },
  {
    id: "nvidia",
    name: "NVIDIA",
    country: "United States",
    city: "Santa Clara",
    mapNames: ["United States of America"],
    coordinates: [-121.9552, 37.3541],
    sector: "semis",
    category: "AI infrastructure",
    role: "Accelerators + Systems",
    status: "PUBLIC",
    ticker: "NASDAQ: NVDA",
    founded: "1993",
    employees: "~36,000",
    funding: "Public",
    valuation: "$4.4T",
    latestRound: "Public market",
    signal: "+12%",
    signalLabel: "STEADY",
    signalTone: "blue",
    thesis:
      "The picks-and-shovels incumbent still sets the pace, but the next edge is systems, networking, and software lock-in.",
    watchlist: false,
    showLabel: false,
    markerLabel: "SANTA CLARA",
    chart: [10, 9, 12, 14, 13, 17, 16, 19, 21, 20, 23, 24, 25],
    news: [
      {
        date: "AUG 13, 2026",
        source: "CNBC",
        headline: "Systems demand becomes the next battleground for AI infrastructure",
        url: "https://www.cnbc.com/technology/",
      },
      {
        date: "AUG 01, 2026",
        source: "REUTERS",
        headline: "Cloud buyers keep reworking infrastructure budgets around accelerators",
        url: "https://www.reuters.com/technology/",
      },
    ],
  },
  {
    id: "nscale",
    name: "Nscale",
    country: "United Kingdom",
    city: "London",
    mapNames: ["United Kingdom"],
    coordinates: [-0.1276, 51.5072],
    sector: "cloud",
    category: "AI infrastructure",
    role: "Sovereign cloud",
    status: "PRIVATE",
    ticker: "PRIVATE",
    founded: "2023",
    employees: "~180",
    funding: "$1.3B",
    valuation: "$3.7B",
    latestRound: "Series B · 2026",
    signal: "+16%",
    signalLabel: "WATCH",
    signalTone: "blue",
    thesis:
      "A European infrastructure bet positioned around sovereign workloads, energy access, and regional compute demand.",
    watchlist: false,
    showLabel: true,
    markerLabel: "LONDON",
    chart: [4, 5, 4, 6, 8, 9, 10, 11, 10, 12, 14, 15, 16],
    news: [
      {
        date: "AUG 06, 2026",
        source: "SIFTED",
        headline: "European compute providers turn sovereign capacity into a new category",
        url: "https://sifted.eu/articles/ai",
      },
      {
        date: "JUL 22, 2026",
        source: "FT",
        headline: "Power availability becomes as important as chips for regional AI clouds",
        url: "https://www.ft.com/technology",
      },
    ],
  },
  {
    id: "g42",
    name: "G42",
    country: "United Arab Emirates",
    city: "Abu Dhabi",
    mapNames: ["United Arab Emirates"],
    coordinates: [54.3773, 24.4539],
    sector: "applied",
    category: "Applied AI",
    role: "Sovereign AI platform",
    status: "PRIVATE",
    ticker: "PRIVATE",
    founded: "2018",
    employees: "~12,000",
    funding: "$10B+",
    valuation: "Private",
    latestRound: "Strategic capital",
    signal: "+15%",
    signalLabel: "WATCH",
    signalTone: "orange",
    thesis:
      "A strategic platform linking sovereign capital, data centers, and applied AI deployments across the Gulf.",
    watchlist: false,
    showLabel: true,
    markerLabel: "ABU DHABI",
    chart: [4, 5, 7, 6, 10, 9, 12, 11, 12, 13, 14, 15, 15],
    news: [
      {
        date: "AUG 05, 2026",
        source: "ARAB NEWS",
        headline: "G42 outlines a regional compute corridor for sovereign workloads",
        url: "https://www.g42.ai/news",
      },
      {
        date: "JUL 30, 2026",
        source: "BLOOMBERG",
        headline: "Middle East data center investment keeps moving up the stack",
        url: "https://www.bloomberg.com/technology",
      },
    ],
  },
  {
    id: "amd",
    name: "AMD",
    country: "United States",
    city: "Santa Clara",
    mapNames: ["United States of America"],
    coordinates: [-121.9552, 37.3541],
    sector: "semis",
    category: "AI semiconductors",
    categoryKo: "AI 반도체",
    role: "Accelerators + CPUs",
    roleKo: "가속기·CPU",
    status: "PUBLIC",
    ticker: "NASDAQ: AMD",
    founded: "1969",
    employees: "~31,000",
    funding: "Public",
    valuation: "Public market",
    latestRound: "Public market",
    signal: "+14%",
    signalLabel: "ACCELERATING",
    signalTone: "orange",
    thesis: "A second-source accelerator and CPU platform pushing competition deeper into the AI data center stack.",
    thesisKo: "가속기와 CPU를 함께 가져가며 AI 데이터센터 스택의 경쟁을 넓히는 2위 인프라 플랫폼입니다.",
    watchlist: true,
    showLabel: false,
    markerLabel: "SANTA CLARA",
    chart: [5, 7, 6, 9, 11, 10, 13, 15, 14, 17, 18, 20, 22],
    news: makeFallbackNews("AMD", "https://www.amd.com/en/newsroom.html", [
      "AMD expands its accelerator roadmap for large-scale AI systems",
      "AI server demand turns the chip stack into a wider two-player race",
    ], [
      "AMD, 대규모 AI 시스템을 위한 가속기 로드맵 확장",
      "AI 서버 수요가 반도체 경쟁을 더 넓은 2강 구도로 전개",
    ]),
  },
  {
    id: "microsoft",
    name: "Microsoft",
    country: "United States",
    city: "Redmond",
    mapNames: ["United States of America"],
    coordinates: [-122.1215, 47.674],
    sector: "cloud",
    category: "Cloud AI platform",
    categoryKo: "클라우드 AI 플랫폼",
    role: "Azure + Copilots",
    roleKo: "Azure·코파일럿",
    status: "PUBLIC",
    ticker: "NASDAQ: MSFT",
    founded: "1975",
    employees: "~228,000",
    funding: "Public",
    valuation: "Public market",
    latestRound: "Public market",
    signal: "+19%",
    signalLabel: "HIGH SIGNAL",
    signalTone: "blue",
    thesis: "The distribution layer for enterprise AI, monetizing models through cloud capacity, software seats, and developer tools.",
    thesisKo: "클라우드 용량·소프트웨어 좌석·개발자 도구를 통해 기업 AI를 유통하는 핵심 플랫폼입니다.",
    watchlist: true,
    showLabel: true,
    markerLabel: "REDMOND",
    chart: [7, 8, 10, 11, 12, 13, 15, 14, 17, 18, 20, 22, 25],
    news: makeFallbackNews("THE VERGE", "https://blogs.microsoft.com/", [
      "Azure AI capacity becomes the operating layer for enterprise copilots",
      "Microsoft folds more agent tooling into its developer platform",
    ], [
      "Azure AI 용량이 기업 코파일럿의 운영 계층으로 부상",
      "Microsoft, 개발자 플랫폼에 에이전트 도구를 더 깊게 통합",
    ]),
  },
  {
    id: "palantir",
    name: "Palantir",
    country: "United States",
    city: "Denver",
    mapNames: ["United States of America"],
    coordinates: [-104.9903, 39.7392],
    sector: "applied",
    category: "Applied enterprise AI",
    categoryKo: "엔터프라이즈 응용 AI",
    role: "Data + Operations",
    roleKo: "데이터·운영 소프트웨어",
    status: "PUBLIC",
    ticker: "NASDAQ: PLTR",
    founded: "2003",
    employees: "~3,900",
    funding: "Public",
    valuation: "Public market",
    latestRound: "Public market",
    signal: "+23%",
    signalLabel: "MOMENTUM",
    signalTone: "orange",
    thesis: "An application-layer AI company turning messy operational data into workflows for governments and large enterprises.",
    thesisKo: "정부와 대기업의 복잡한 운영 데이터를 실제 업무 흐름으로 바꾸는 애플리케이션 계층 AI 기업입니다.",
    watchlist: true,
    showLabel: false,
    markerLabel: "DENVER",
    chart: [3, 5, 7, 8, 12, 11, 15, 18, 17, 21, 23, 25, 29],
    news: makeFallbackNews("PALANTIR", "https://investors.palantir.com/news", [
      "Palantir expands operational AI deployments across regulated industries",
      "Enterprise AI buyers move from pilots toward production workflows",
    ], [
      "Palantir, 규제 산업 전반으로 운영 AI 배포 확대",
      "기업 AI 구매자들이 파일럿에서 실제 업무 흐름으로 이동",
    ]),
  },
  {
    id: "tesla",
    name: "Tesla",
    country: "United States",
    city: "Austin",
    mapNames: ["United States of America"],
    coordinates: [-97.7431, 30.2672],
    sector: "robotics",
    category: "Autonomy & robotics",
    categoryKo: "자율주행·로보틱스",
    role: "Vision + Fleet Data",
    roleKo: "비전·플릿 데이터",
    status: "PUBLIC",
    ticker: "NASDAQ: TSLA",
    founded: "2003",
    employees: "~125,000",
    funding: "Public",
    valuation: "Public market",
    latestRound: "Public market",
    signal: "+11%",
    signalLabel: "WATCH",
    signalTone: "blue",
    thesis: "A physical-AI bet built on fleet-scale vision data, autonomy software, and a robotics ambition beyond vehicles.",
    thesisKo: "차량을 넘어 대규모 비전 데이터·자율주행 소프트웨어·로봇으로 확장하는 피지컬 AI 베팅입니다.",
    watchlist: false,
    showLabel: false,
    markerLabel: "AUSTIN",
    chart: [8, 7, 9, 10, 8, 11, 13, 12, 15, 14, 16, 18, 19],
    news: makeFallbackNews("TESLA", "https://www.tesla.com/blog", [
      "Tesla connects fleet data and autonomy software in its physical-AI push",
      "Robotics becomes a larger part of the company’s long-term AI narrative",
    ], [
      "Tesla, 피지컬 AI 전략에서 플릿 데이터와 자율주행 소프트웨어 연결",
      "로보틱스가 회사의 장기 AI 스토리에서 차지하는 비중 확대",
    ]),
  },
  {
    id: "tsmc",
    name: "TSMC",
    country: "Taiwan",
    city: "Hsinchu",
    mapNames: ["Taiwan"],
    coordinates: [120.9647, 24.8047],
    sector: "semis",
    category: "AI chip foundry",
    categoryKo: "AI 칩 파운드리",
    role: "Advanced Manufacturing",
    roleKo: "첨단 제조",
    status: "PUBLIC",
    ticker: "NYSE: TSM / TWSE: 2330",
    founded: "1987",
    employees: "~83,000",
    funding: "Public",
    valuation: "Public market",
    latestRound: "Public market",
    signal: "+20%",
    signalLabel: "HIGH SIGNAL",
    signalTone: "orange",
    thesis: "The manufacturing chokepoint behind the AI supply chain, translating accelerator demand into leading-edge capacity.",
    thesisKo: "가속기 수요를 최첨단 생산능력으로 전환하는 AI 공급망의 핵심 제조 병목입니다.",
    watchlist: true,
    showLabel: true,
    markerLabel: "HSINCHU",
    chart: [6, 8, 9, 10, 12, 13, 15, 16, 18, 19, 21, 24, 27],
    news: makeFallbackNews("TSMC", "https://pr.tsmc.com/english/news", [
      "TSMC keeps advanced packaging at the center of the AI chip buildout",
      "Foundry capacity planning becomes a strategic variable for AI investors",
    ], [
      "TSMC, AI 칩 증설의 중심에 첨단 패키징 배치",
      "파운드리 생산능력 계획이 AI 투자자의 핵심 변수가 됨",
    ]),
  },
  {
    id: "asml",
    name: "ASML",
    country: "Netherlands",
    city: "Veldhoven",
    mapNames: ["Netherlands"],
    coordinates: [5.406, 51.42],
    sector: "semis",
    category: "Chipmaking systems",
    categoryKo: "반도체 장비",
    role: "Lithography",
    roleKo: "리소그래피",
    status: "PUBLIC",
    ticker: "NASDAQ: ASML / AMS: ASML",
    founded: "1984",
    employees: "~43,700",
    funding: "Public",
    valuation: "Public market",
    latestRound: "Public market",
    signal: "+13%",
    signalLabel: "STEADY",
    signalTone: "blue",
    thesis: "A picks-and-shovels supplier whose lithography systems define how quickly the AI semiconductor roadmap can move.",
    thesisKo: "리소그래피 장비를 통해 AI 반도체 로드맵의 속도를 결정하는 핵심 장비 공급자입니다.",
    watchlist: false,
    showLabel: true,
    markerLabel: "VELDHOVEN",
    chart: [10, 11, 10, 12, 13, 14, 13, 15, 16, 15, 17, 18, 20],
    news: makeFallbackNews("ASML", "https://www.asml.com/en/news-stories", [
      "ASML frames high-NA lithography as the next constraint on AI compute",
      "Chipmaking equipment orders track the next wave of AI capacity planning",
    ], [
      "ASML, 하이 NA 리소그래피를 AI 컴퓨트의 다음 제약으로 제시",
      "반도체 장비 주문이 차기 AI 생산능력 계획을 반영",
    ]),
  },
  {
    id: "arm",
    name: "Arm",
    country: "United Kingdom",
    city: "Cambridge",
    mapNames: ["United Kingdom"],
    coordinates: [0.1218, 52.2053],
    sector: "semis",
    category: "AI compute architecture",
    categoryKo: "AI 컴퓨트 아키텍처",
    role: "CPU IP + Edge",
    roleKo: "CPU IP·엣지 컴퓨팅",
    status: "PUBLIC",
    ticker: "NASDAQ: ARM",
    founded: "1990",
    employees: "~8,000",
    funding: "Public",
    valuation: "Public market",
    latestRound: "Public market",
    signal: "+12%",
    signalLabel: "WATCH",
    signalTone: "blue",
    thesis: "The instruction-set layer reaching from data-center CPUs to edge devices where efficient AI inference has to travel.",
    thesisKo: "데이터센터 CPU부터 엣지 디바이스까지 효율적인 AI 추론을 연결하는 명령어 아키텍처 계층입니다.",
    watchlist: false,
    showLabel: false,
    markerLabel: "CAMBRIDGE",
    chart: [5, 6, 7, 6, 9, 10, 9, 12, 11, 13, 14, 15, 17],
    news: makeFallbackNews("ARM", "https://newsroom.arm.com/", [
      "Arm pushes compute efficiency from data centers into the edge",
      "CPU architecture becomes a larger part of the AI infrastructure map",
    ], [
      "Arm, 데이터센터에서 엣지까지 컴퓨트 효율성 확대",
      "CPU 아키텍처가 AI 인프라 지도에서 차지하는 비중 확대",
    ]),
  },
  {
    id: "samsung",
    name: "Samsung Electronics",
    country: "South Korea",
    city: "Suwon",
    mapNames: ["South Korea"],
    coordinates: [127.0286, 37.2636],
    sector: "semis",
    category: "Memory & AI devices",
    categoryKo: "메모리·AI 디바이스",
    role: "HBM + Foundry",
    roleKo: "HBM·파운드리",
    status: "PUBLIC",
    ticker: "KRX: 005930",
    founded: "1969",
    employees: "~270,000",
    funding: "Public",
    valuation: "Public market",
    latestRound: "Public market",
    signal: "+16%",
    signalLabel: "HIGH SIGNAL",
    signalTone: "orange",
    thesis: "A diversified hardware platform where memory bandwidth, foundry capacity, and on-device AI meet in one balance sheet.",
    thesisKo: "메모리 대역폭·파운드리 생산능력·온디바이스 AI가 한 기업 안에서 만나는 종합 하드웨어 플랫폼입니다.",
    watchlist: true,
    showLabel: true,
    markerLabel: "SUWON",
    chart: [7, 8, 9, 11, 10, 12, 14, 13, 16, 18, 17, 20, 22],
    news: makeFallbackNews("SAMSUNG", "https://news.samsung.com/global/", [
      "Samsung positions memory and on-device intelligence as one AI stack",
      "HBM and advanced-node capacity remain central to Korea’s AI hardware story",
    ], [
      "Samsung, 메모리와 온디바이스 지능을 하나의 AI 스택으로 연결",
      "HBM과 첨단 공정 생산능력이 한국 AI 하드웨어의 핵심 변수로 부상",
    ]),
  },
  {
    id: "skhynix",
    name: "SK hynix",
    country: "South Korea",
    city: "Icheon",
    mapNames: ["South Korea"],
    coordinates: [127.435, 37.272],
    sector: "semis",
    category: "AI memory",
    categoryKo: "AI 메모리",
    role: "HBM + DRAM",
    roleKo: "HBM·DRAM",
    status: "PUBLIC",
    ticker: "KRX: 000660",
    founded: "1983",
    employees: "~40,000",
    funding: "Public",
    valuation: "Public market",
    latestRound: "Public market",
    signal: "+22%",
    signalLabel: "MOMENTUM",
    signalTone: "orange",
    thesis: "A high-bandwidth memory specialist sitting directly beneath the expanding training and inference workload.",
    thesisKo: "확대되는 학습·추론 워크로드 바로 아래에서 고대역폭 메모리를 공급하는 전문 기업입니다.",
    watchlist: true,
    showLabel: false,
    markerLabel: "ICHEON",
    chart: [4, 6, 8, 9, 11, 12, 15, 17, 16, 20, 22, 24, 28],
    news: makeFallbackNews("SK HYNIX", "https://news.skhynix.com/", [
      "SK hynix links HBM expansion to the next wave of AI accelerators",
      "Memory supply becomes a first-order variable in model economics",
    ], [
      "SK하이닉스, HBM 증설을 차세대 AI 가속기와 연결",
      "메모리 공급이 모델 경제성의 1차 변수로 부상",
    ]),
  },
  {
    id: "naver",
    name: "NAVER",
    country: "South Korea",
    city: "Seongnam",
    mapNames: ["South Korea"],
    coordinates: [127.105, 37.3596],
    sector: "cloud",
    category: "AI platform & search",
    categoryKo: "AI 플랫폼·검색",
    role: "Cloud + Commerce",
    roleKo: "클라우드·커머스",
    status: "PUBLIC",
    ticker: "KRX: 035420",
    founded: "1999",
    employees: "~4,500",
    funding: "Public",
    valuation: "Public market",
    latestRound: "Public market",
    signal: "+15%",
    signalLabel: "HIGH SIGNAL",
    signalTone: "blue",
    thesis: "A local platform stack connecting search, commerce, cloud, and Korean-language AI distribution.",
    thesisKo: "검색·커머스·클라우드와 한국어 AI 유통을 하나로 연결하는 지역 플랫폼 스택입니다.",
    watchlist: true,
    showLabel: true,
    markerLabel: "SEONGNAM",
    chart: [5, 7, 6, 8, 9, 11, 10, 12, 14, 13, 15, 17, 19],
    news: makeFallbackNews("NAVER", "https://www.navercorp.com/en/media/pressRelease", [
      "NAVER connects local search and cloud distribution to its AI platform layer",
      "Korean-language AI becomes a strategic wedge for regional platform power",
    ], [
      "NAVER, 로컬 검색과 클라우드 유통을 AI 플랫폼 계층으로 연결",
      "한국어 AI가 지역 플랫폼 경쟁력의 전략적 진입점으로 부상",
    ]),
  },
  {
    id: "pony",
    name: "Pony.ai",
    country: "China",
    city: "Guangzhou",
    mapNames: ["China"],
    coordinates: [113.2644, 23.1291],
    sector: "robotics",
    category: "Autonomous mobility",
    categoryKo: "자율주행 모빌리티",
    role: "Robotaxis + Trucks",
    roleKo: "로보택시·자율주행 트럭",
    status: "PUBLIC",
    ticker: "NASDAQ: PONY",
    founded: "2016",
    employees: "~1,800",
    funding: "Public",
    valuation: "Public market",
    latestRound: "Public market",
    signal: "+17%",
    signalLabel: "WATCH",
    signalTone: "blue",
    thesis: "A China-based autonomy platform turning perception stacks into robotaxi and commercial trucking deployments.",
    thesisKo: "인지 스택을 로보택시와 상업용 자율주행 트럭으로 전환하는 중국 자율주행 플랫폼입니다.",
    watchlist: false,
    showLabel: true,
    markerLabel: "GUANGZHOU",
    chart: [3, 4, 6, 7, 6, 9, 10, 12, 11, 13, 14, 16, 18],
    news: makeFallbackNews("PONY AI", "https://www.pony.ai/news", [
      "Pony.ai expands commercial autonomy pilots across Chinese cities",
      "Robotaxi economics move closer to the center of the mobility AI debate",
    ], [
      "Pony.ai, 중국 주요 도시에서 상업용 자율주행 파일럿 확대",
      "로보택시 경제성이 모빌리티 AI 논쟁의 중심으로 이동",
    ]),
  },
  {
    id: "fanuc",
    name: "FANUC",
    country: "Japan",
    city: "Oshino",
    mapNames: ["Japan"],
    coordinates: [138.607, 35.663],
    sector: "robotics",
    category: "Industrial robotics",
    categoryKo: "산업용 로보틱스",
    role: "Factory Automation",
    roleKo: "공장 자동화",
    status: "PUBLIC",
    ticker: "TSE: 6954",
    founded: "1956",
    employees: "~9,500",
    funding: "Public",
    valuation: "Public market",
    latestRound: "Public market",
    signal: "+10%",
    signalLabel: "STEADY",
    signalTone: "blue",
    thesis: "A factory-automation incumbent that turns machine vision, motion control, and industrial data into physical AI.",
    thesisKo: "머신비전·모션 제어·산업 데이터를 피지컬 AI로 전환하는 공장 자동화 기업입니다.",
    watchlist: false,
    showLabel: false,
    markerLabel: "OSHINO",
    chart: [8, 8, 9, 10, 9, 11, 10, 12, 13, 12, 14, 15, 16],
    news: makeFallbackNews("FANUC", "https://www.fanucamerica.com/news", [
      "FANUC brings more vision and adaptive control into factory automation",
      "Industrial robotics demand becomes a measurable AI adoption signal",
    ], [
      "FANUC, 공장 자동화에 비전과 적응형 제어를 더 깊게 적용",
      "산업용 로보틱스 수요가 AI 도입을 보여주는 지표로 부상",
    ]),
  },
  {
    id: "recursion",
    name: "Recursion",
    country: "United States",
    city: "Salt Lake City",
    mapNames: ["United States of America"],
    coordinates: [-111.891, 40.7608],
    sector: "biotech",
    category: "AI drug discovery",
    categoryKo: "AI 신약개발",
    role: "Biology + Models",
    roleKo: "바이오 데이터·모델",
    status: "PUBLIC",
    ticker: "NASDAQ: RXRX",
    founded: "2013",
    employees: "~750",
    funding: "Public",
    valuation: "Public market",
    latestRound: "Public market",
    signal: "+18%",
    signalLabel: "HIGH SIGNAL",
    signalTone: "orange",
    thesis: "A data-native biotech using automation and machine learning to compress the search space for new medicines.",
    thesisKo: "자동화와 머신러닝으로 신약 후보 탐색 공간을 줄이는 데이터 중심 바이오테크입니다.",
    watchlist: true,
    showLabel: false,
    markerLabel: "SALT LAKE CITY",
    chart: [3, 5, 4, 7, 9, 8, 11, 13, 12, 15, 16, 18, 21],
    news: makeFallbackNews("RECURSION", "https://ir.recursion.com/news-releases", [
      "Recursion connects large-scale biology data to its AI drug pipeline",
      "AI-native discovery platforms look for proof beyond model benchmarks",
    ], [
      "Recursion, 대규모 바이오 데이터와 AI 신약 파이프라인 연결",
      "AI 신약개발 플랫폼이 모델 벤치마크를 넘어 실제 증거를 추적",
    ]),
  },
  {
    id: "isomorphic",
    name: "Isomorphic Labs",
    country: "United Kingdom",
    city: "London",
    mapNames: ["United Kingdom"],
    coordinates: [-0.1276, 51.5072],
    sector: "biotech",
    category: "AI drug discovery",
    categoryKo: "AI 신약개발",
    role: "Structure + Biology",
    roleKo: "단백질 구조·바이오",
    status: "PRIVATE",
    ticker: "PRIVATE",
    founded: "2021",
    employees: "~200",
    funding: "Undisclosed",
    valuation: "Private",
    latestRound: "Strategic capital",
    signal: "+16%",
    signalLabel: "WATCH",
    signalTone: "blue",
    thesis: "A research-led company translating structure prediction into partnerships and a new computational drug-discovery stack.",
    thesisKo: "구조 예측 연구를 파트너십과 새로운 계산 신약개발 스택으로 번역하는 연구 중심 기업입니다.",
    watchlist: false,
    showLabel: false,
    markerLabel: "LONDON",
    chart: [4, 5, 6, 7, 7, 9, 10, 11, 10, 12, 13, 15, 17],
    news: makeFallbackNews("ISOMORPHIC LABS", "https://www.isomorphiclabs.com/news", [
      "Isomorphic Labs expands partnerships around AI-designed medicines",
      "The drug-discovery layer becomes a new frontier for applied AI capital",
    ], [
      "Isomorphic Labs, AI 설계 신약을 둘러싼 파트너십 확대",
      "신약개발 계층이 응용 AI 자본의 새로운 프런티어로 부상",
    ]),
  },
  {
    id: "dataiku",
    name: "Dataiku",
    country: "France",
    city: "Paris",
    mapNames: ["France"],
    coordinates: [2.3522, 48.8566],
    sector: "applied",
    category: "Enterprise AI platform",
    categoryKo: "엔터프라이즈 AI 플랫폼",
    role: "Analytics + Governance",
    roleKo: "분석·거버넌스",
    status: "PRIVATE",
    ticker: "PRIVATE",
    founded: "2013",
    employees: "~1,000",
    funding: "$847M",
    valuation: "Private",
    latestRound: "Series F",
    signal: "+13%",
    signalLabel: "WATCH",
    signalTone: "blue",
    thesis: "A governance-first layer helping large organizations move from isolated experiments to repeatable AI operations.",
    thesisKo: "대기업이 고립된 실험에서 반복 가능한 AI 운영으로 이동하도록 돕는 거버넌스 중심 플랫폼입니다.",
    watchlist: false,
    showLabel: false,
    markerLabel: "PARIS",
    chart: [4, 5, 6, 8, 7, 9, 10, 11, 12, 11, 13, 14, 16],
    news: makeFallbackNews("DATAIKU", "https://blog.dataiku.com/", [
      "Dataiku pushes governed AI operations deeper into enterprise teams",
      "Model adoption shifts toward data quality, risk controls, and repeatability",
    ], [
      "Dataiku, 거버넌스형 AI 운영을 기업 조직 깊숙이 확장",
      "모델 도입의 초점이 데이터 품질·리스크 통제·반복성으로 이동",
    ]),
  },
  {
    id: "mobileye",
    name: "Mobileye",
    country: "Israel",
    city: "Jerusalem",
    mapNames: ["Israel"],
    coordinates: [35.2137, 31.7683],
    sector: "robotics",
    category: "Autonomous driving",
    categoryKo: "자율주행",
    role: "ADAS + Vision",
    roleKo: "ADAS·컴퓨터 비전",
    status: "PUBLIC",
    ticker: "NASDAQ: MBLY",
    founded: "1999",
    employees: "~3,500",
    funding: "Public",
    valuation: "Public market",
    latestRound: "Public market",
    signal: "+12%",
    signalLabel: "WATCH",
    signalTone: "blue",
    thesis: "A computer-vision specialist whose driver-assistance footprint turns perception into a scaled automotive platform.",
    thesisKo: "운전자 보조 시스템을 통해 인지 기술을 대규모 자동차 플랫폼으로 확장하는 비전 전문 기업입니다.",
    watchlist: false,
    showLabel: true,
    markerLabel: "JERUSALEM",
    chart: [6, 7, 8, 7, 9, 10, 9, 11, 12, 11, 13, 14, 15],
    news: makeFallbackNews("MOBILEYE", "https://www.mobileye.com/news/", [
      "Mobileye extends its driver-assistance stack toward higher autonomy",
      "Computer vision remains the bridge between edge AI and mobility economics",
    ], [
      "Mobileye, 운전자 보조 스택을 고도 자율주행으로 확장",
      "컴퓨터 비전이 엣지 AI와 모빌리티 경제성을 잇는 다리로 부상",
    ]),
  },
  {
    id: "alibaba",
    name: "Alibaba",
    country: "China",
    city: "Hangzhou",
    mapNames: ["China"],
    coordinates: [120.1551, 30.2741],
    sector: "cloud",
    category: "Cloud AI platform",
    categoryKo: "클라우드 AI 플랫폼",
    role: "Cloud + Commerce",
    roleKo: "클라우드·커머스",
    status: "PUBLIC",
    ticker: "NYSE: BABA / HKEX: 9988",
    founded: "1999",
    employees: "~169,000",
    funding: "Public",
    valuation: "Public market",
    latestRound: "Public market",
    signal: "+15%",
    signalLabel: "HIGH SIGNAL",
    signalTone: "orange",
    thesis: "A large regional cloud and commerce network where AI services, data gravity, and infrastructure reinforce one another.",
    thesisKo: "AI 서비스·데이터 중력·인프라가 서로 강화되는 대형 지역 클라우드·커머스 네트워크입니다.",
    watchlist: false,
    showLabel: false,
    markerLabel: "HANGZHOU",
    chart: [5, 6, 8, 7, 10, 11, 12, 13, 12, 14, 15, 17, 19],
    news: makeFallbackNews("ALIBABA", "https://www.alibabagroup.com/en-US/news", [
      "Alibaba Cloud makes AI services a larger part of its regional platform stack",
      "Commerce data and infrastructure capacity become a competitive AI loop",
    ], [
      "Alibaba Cloud, 지역 플랫폼 스택에서 AI 서비스 비중 확대",
      "커머스 데이터와 인프라 역량이 경쟁력 있는 AI 순환고리로 연결",
    ]),
  },
  {
    id: "zoho",
    name: "Zoho",
    country: "India",
    city: "Chennai",
    mapNames: ["India"],
    coordinates: [80.2707, 13.0827],
    sector: "applied",
    category: "AI business software",
    categoryKo: "AI 비즈니스 소프트웨어",
    role: "SaaS + Automation",
    roleKo: "SaaS·업무 자동화",
    status: "PRIVATE",
    ticker: "PRIVATE",
    founded: "1996",
    employees: "~18,000",
    funding: "Bootstrapped",
    valuation: "Private",
    latestRound: "Private company",
    signal: "+11%",
    signalLabel: "EMERGING",
    signalTone: "orange",
    thesis: "A bootstrapped SaaS ecosystem using embedded AI and automation to reach long-tail businesses outside the usual hubs.",
    thesisKo: "임베디드 AI와 자동화로 익숙한 허브 밖의 중소기업까지 도달하는 부트스트랩 SaaS 생태계입니다.",
    watchlist: false,
    showLabel: true,
    markerLabel: "CHENNAI",
    chart: [3, 4, 5, 5, 7, 8, 7, 9, 10, 11, 10, 12, 14],
    news: makeFallbackNews("ZOHO", "https://www.zoho.com/news/", [
      "Zoho embeds AI assistants across its long-tail business software suite",
      "India’s SaaS ecosystem looks beyond foundation models toward distribution",
    ], [
      "Zoho, 중소기업용 업무 소프트웨어 전반에 AI 어시스턴트 내장",
      "인도 SaaS 생태계가 파운데이션 모델에서 유통 계층으로 시선 이동",
    ]),
  },
  {
    id: "deepl",
    name: "DeepL",
    country: "Germany",
    city: "Cologne",
    mapNames: ["Germany"],
    coordinates: [6.9603, 50.9375],
    sector: "applied",
    category: "Language AI software",
    categoryKo: "언어 AI 소프트웨어",
    role: "Translation + Enterprise",
    roleKo: "번역·엔터프라이즈",
    status: "PRIVATE",
    ticker: "PRIVATE",
    founded: "2017",
    employees: "~1,000",
    funding: "$1B+",
    valuation: "Private",
    latestRound: "Growth capital",
    signal: "+14%",
    signalLabel: "WATCH",
    signalTone: "blue",
    thesis: "A focused language-AI company turning translation quality and workflow integration into an enterprise wedge.",
    thesisKo: "번역 품질과 업무 통합을 기업 시장의 진입점으로 만드는 집중형 언어 AI 기업입니다.",
    watchlist: false,
    showLabel: true,
    markerLabel: "COLOGNE",
    chart: [4, 6, 5, 7, 8, 9, 10, 9, 11, 12, 13, 13, 15],
    news: makeFallbackNews("DEEPL", "https://www.deepl.com/en/blog", [
      "DeepL moves beyond translation into broader enterprise language workflows",
      "Specialized language AI keeps a distinct lane beside general-purpose models",
    ], [
      "DeepL, 번역을 넘어 기업 언어 업무 흐름으로 확장",
      "전문 언어 AI가 범용 모델과 다른 독자적 영역을 유지",
    ]),
  },
  {
    id: "abb",
    name: "ABB",
    country: "Switzerland",
    city: "Zurich",
    mapNames: ["Switzerland"],
    coordinates: [8.5417, 47.3769],
    sector: "robotics",
    category: "Industrial automation",
    categoryKo: "산업 자동화",
    role: "Robots + Electrification",
    roleKo: "로봇·전기화",
    status: "PUBLIC",
    ticker: "SIX: ABBN",
    founded: "1988",
    employees: "~105,000",
    funding: "Public",
    valuation: "Public market",
    latestRound: "Public market",
    signal: "+10%",
    signalLabel: "EMERGING",
    signalTone: "blue",
    thesis: "An industrial technology platform where robotics, electrification, and machine intelligence meet real-world capex.",
    thesisKo: "로보틱스·전기화·머신 인텔리전스가 실제 설비투자와 만나는 산업 기술 플랫폼입니다.",
    watchlist: false,
    showLabel: true,
    markerLabel: "ZURICH",
    chart: [6, 7, 8, 8, 9, 10, 9, 11, 12, 12, 13, 14, 15],
    news: makeFallbackNews("ABB", "https://new.abb.com/news", [
      "ABB links robotics and electrification to the next industrial AI cycle",
      "Factory intelligence becomes a capex story beyond software multiples",
    ], [
      "ABB, 로보틱스와 전기화를 차기 산업 AI 사이클로 연결",
      "공장 인텔리전스가 소프트웨어 배수를 넘어 설비투자 스토리로 확장",
    ]),
  },
];

const countryLanes = [
  { name: "United States", mapNames: ["United States of America"], count: 7, status: "HIGH SIGNAL", tone: "orange" },
  { name: "China", mapNames: ["China"], count: 3, status: "HIGH SIGNAL", tone: "orange" },
  { name: "United Kingdom", mapNames: ["United Kingdom"], count: 3, status: "WATCH", tone: "blue" },
  { name: "South Korea", mapNames: ["South Korea"], count: 3, status: "HIGH SIGNAL", tone: "orange" },
  { name: "France", mapNames: ["France"], count: 2, status: "HIGH SIGNAL", tone: "orange" },
  { name: "Japan", mapNames: ["Japan"], count: 2, status: "WATCH", tone: "blue" },
  { name: "Taiwan", mapNames: ["Taiwan"], count: 1, status: "HIGH SIGNAL", tone: "orange" },
  { name: "Netherlands", mapNames: ["Netherlands"], count: 1, status: "WATCH", tone: "blue" },
  { name: "India", mapNames: ["India"], count: 1, status: "EMERGING", tone: "muted" },
  { name: "Germany", mapNames: ["Germany"], count: 1, status: "WATCH", tone: "blue" },
  { name: "Israel", mapNames: ["Israel"], count: 1, status: "WATCH", tone: "blue" },
  { name: "Switzerland", mapNames: ["Switzerland"], count: 1, status: "EMERGING", tone: "muted" },
  { name: "Hong Kong", mapNames: ["Hong Kong"], count: 1, status: "WATCH", tone: "blue" },
  { name: "United Arab Emirates", mapNames: ["United Arab Emirates"], count: 1, status: "EMERGING", tone: "muted" },
];

const marketSignals = [
  { symbol: "^IXIC", name: "NASDAQ COMP.", nameKo: "나스닥 종합", ticker: "IXIC", value: "19,842.21", move: "−0.42%", tone: "orange", points: "3,6 11,9 19,7 28,12 37,8 46,11 55,10 64,16 73,14 82,17 91,15" },
  { symbol: "^KS11", name: "KOSPI", nameKo: "코스피", ticker: "KS11", value: "3,186.38", move: "+0.41%", tone: "blue", points: "3,12 11,10 19,13 28,9 37,12 46,8 55,11 64,9 73,7 82,10 91,6" },
  { symbol: "^GSPC", name: "S&P 500", nameKo: "S&P 500", ticker: "SPX", value: "6,411.37", move: "−0.21%", tone: "orange", points: "3,14 11,12 19,15 28,13 37,15 46,12 55,10 64,12 73,9 82,11 91,7" },
  { symbol: "^DJI", name: "DOW JONES IND.", nameKo: "다우존스", ticker: "DJI", value: "44,912.50", move: "+0.08%", tone: "blue", points: "3,11 11,13 19,9 28,12 37,10 46,14 55,12 64,13 73,9 82,10 91,8" },
  { symbol: "^STOXX50E", name: "EURO STOXX 50", nameKo: "유로 스톡스 50", ticker: "STOXX50", value: "5,326.18", move: "−0.18%", tone: "orange", points: "3,10 11,12 19,11 28,15 37,13 46,15 55,14 64,18 73,16 82,17 91,15" },
  { symbol: "^N225", name: "NIKKEI 225", nameKo: "닛케이 225", ticker: "NKY", value: "41,256.47", move: "−0.95%", tone: "orange", points: "3,5 11,8 19,7 28,13 37,11 46,15 55,13 64,17 73,19 82,17 91,20" },
  { symbol: "^HSI", name: "HANG SENG", nameKo: "항셍 지수", ticker: "HSI", value: "25,182.73", move: "+1.24%", tone: "blue", points: "3,17 11,14 19,15 28,10 37,12 46,9 55,11 64,7 73,9 82,6 91,8" },
  { symbol: "^TNX", name: "US 10Y YIELD", nameKo: "미국 10년물", ticker: "US10Y", format: "yield", value: "4.18%", move: "+0.03", tone: "blue", points: "3,12 11,12 19,10 28,11 37,9 46,10 55,7 64,9 73,8 82,6 91,8" },
  { symbol: "CL=F", name: "WTI CRUDE", nameKo: "WTI 원유", ticker: "CL1!", value: "66.52", move: "−0.46%", tone: "orange", points: "3,12 11,13 19,10 28,12 37,9 46,10 55,12 64,8 73,10 82,11 91,9" },
];

const navItems = [
  { id: "atlas", label: "ATLAS", icon: "ph-compass" },
  { id: "watchlist", label: "WATCHLIST", icon: "ph-star" },
  { id: "screener", label: "SCREENER", icon: "ph-funnel" },
  { id: "briefings", label: "BRIEFINGS", icon: "ph-files" },
  { id: "newsroom", label: "NEWSROOM", icon: "ph-rss" },
];

const filterOptions = [
  { id: "all", label: "ALL SIGNALS" },
  { id: "PUBLIC", label: "PUBLIC" },
  { id: "PRIVATE", label: "PRIVATE" },
];

const sectorOptions = [
  { id: "all", label: "ALL SECTORS", labelKo: "전체 섹터" },
  { id: "models", label: "MODELS & DATA", labelKo: "모델·데이터" },
  { id: "semis", label: "COMPUTE & CHIPS", labelKo: "컴퓨트·반도체" },
  { id: "cloud", label: "CLOUD & PLATFORMS", labelKo: "클라우드·플랫폼" },
  { id: "applied", label: "ENTERPRISE & APPLIED", labelKo: "엔터프라이즈·응용" },
  { id: "robotics", label: "VISION, ROBOTS & AUTO", labelKo: "비전·로봇·자율주행" },
  { id: "biotech", label: "AI LIFE SCIENCE", labelKo: "AI 바이오·헬스케어" },
];

const uiCopy = {
  en: {
    eyebrow: "AI INVESTMENT INTELLIGENCE ATLAS",
    issue: "ISSUE 32",
    brief: "TODAY'S BRIEF",
    briefA: "Global AI investment remains concentrated in proven hubs, with pockets of acceleration across Europe and Asia.",
    briefB: "Models are one layer; chips, clouds, robots, enterprise software, and AI biotech carry the rest of the stack.",
    byline: "— The Editorial Board",
    selectedCompany: "SELECTED COMPANY",
    privateCompany: "AI COMPANY (PRIVATE)",
    publicCompany: "AI COMPANY (PUBLIC)",
    emergingCluster: "EMERGING CLUSTER",
    sovereign: "SOVEREIGN AI INITIATIVE",
    atlas: "ATLAS",
    watchlist: "WATCHLIST",
    screener: "SCREENER",
    briefings: "BRIEFINGS",
    newsroom: "NEWSROOM",
    editorialResearch: "EDITORIAL RESEARCH",
    notAdvice: "NOT INVESTMENT ADVICE",
    dataMethod: "DATA METHOD",
    researchMode: "SNAPSHOT / RESEARCH MODE",
    title: "THE GLOBAL AI MAP",
    subtitle: "AI COMPANIES ACROSS THE STACK · 6 SECTORS",
    find: "FIND A COMPANY",
    placeholder: "Search name, city, sector",
    inspect: "Click a country or company to inspect the signal.",
    projection: "MAP PROJECTION: EQUAL EARTH",
    center: "CENTER: 20.0000°N / 0.0000°E",
    reset: "RESET VIEW",
    feedSnapshot: "DATA FEED: SNAPSHOT",
    feedLive: "DATA FEED: LIVE / DELAYED",
    feedScheduled: "DATA FEED: SCHEDULED / DELAYED",
    feedUpdating: "DATA FEED: UPDATING",
    emergingNote: "EMERGING CLUSTERS",
    emergingNote2: "OUTSIDE THE USUAL VECTORS.",
    sectorLayers: "AI SECTOR LAYERS",
    signalLayer: "SIGNAL LAYER",
    high: "HIGH / ACCELERATING",
    watch: "WATCH / RESEARCH",
    private: "PRIVATE / UNDISCLOSED",
    public: "PUBLIC / REPORTED",
    regionIndex: "REGION INDEX / COUNTRY LANE",
    clickCountry: "CLICK A COUNTRY TO FILTER",
    selected: "SELECTED",
    company: "COMPANY",
    founded: "FOUNDED",
    headquarters: "HEADQUARTERS",
    employees: "EMPLOYEES",
    funding: "FUNDING TO DATE",
    fullProfile: "VIEW FULL PROFILE",
    signal90: "90-DAY SIGNAL",
    signalNote: "Signal aggregates earnings revisions, news velocity, and web attention.",
    relatedNews: "RELATED NEWS",
    allNews: "VIEW ALL NEWS",
    backList: "BACK TO LIST",
    openSource: "OPEN SOURCE",
    marketSignals: "MARKET SIGNALS",
    asOf: "DATA AS OF",
    quote: "“The edge goes to those who map the future before it compounds.”",
    sourceSnapshot: "FEED: SNAPSHOT",
    sourceLive: "FEED: LIVE / DELAYED",
    filterBy: "FILTER BY STATUS",
    allSignals: "ALL SIGNALS",
    fieldNote: "FIELD NOTE",
    marketRole: "MARKET ROLE",
    valuation: "VALUATION",
    latestRound: "LATEST ROUND",
    latestSignal: "LATEST SIGNAL",
    latestTrail: "The latest signal trail.",
    prototypeFoot: "Prototype dataset · editorially selected links · not investment advice.",
    snapshotFoot: "Snapshot dated August 14, 2026 · research surface only.",
    live: "LIVE",
    delayed: "DELAYED",
    fallback: "SNAPSHOT",
    refresh: "REFRESH",
    kor: "KOR",
    eng: "ENG",
  },
  ko: {
    eyebrow: "AI 투자 인텔리전스 아틀라스",
    issue: "ISSUE 32",
    brief: "오늘의 브리프",
    briefA: "글로벌 AI 투자는 검증된 허브에 집중돼 있지만, 유럽과 아시아에서 가속 신호가 나타나고 있습니다.",
    briefB: "모델은 한 층일 뿐이며, 칩·클라우드·로봇·기업 소프트웨어·AI 바이오가 나머지 스택을 채웁니다.",
    byline: "— 편집위원회",
    selectedCompany: "선택 기업",
    privateCompany: "AI 기업 (비상장)",
    publicCompany: "AI 기업 (상장)",
    emergingCluster: "신흥 클러스터",
    sovereign: "주권형 AI 이니셔티브",
    atlas: "아틀라스",
    watchlist: "관심목록",
    screener: "스크리너",
    briefings: "브리핑",
    newsroom: "뉴스룸",
    editorialResearch: "편집 리서치",
    notAdvice: "투자 조언 아님",
    dataMethod: "데이터 방법론",
    researchMode: "스냅샷 / 리서치 모드",
    title: "글로벌 AI 지도",
    subtitle: "AI 산업 전반의 기업 · 인프라 · 응용",
    find: "기업 찾기",
    placeholder: "이름, 도시, 섹터 검색",
    inspect: "국가 또는 기업을 클릭해 시그널을 확인하세요.",
    projection: "지도 투영: EQUAL EARTH",
    center: "중심: 20.0000°N / 0.0000°E",
    reset: "보기 초기화",
    feedSnapshot: "데이터 피드: 스냅샷",
    feedLive: "데이터 피드: 실시간 지연",
    feedScheduled: "데이터 피드: 예약 갱신 / 지연",
    feedUpdating: "데이터 피드: 업데이트 중",
    emergingNote: "신흥 클러스터",
    emergingNote2: "익숙한 벡터 밖의 가속.",
    sectorLayers: "AI 산업 레이어",
    signalLayer: "시그널 레이어",
    high: "높음 / 가속",
    watch: "관찰 / 리서치",
    private: "비상장 / 비공개",
    public: "상장 / 공시",
    regionIndex: "지역 인덱스 / 국가 레인",
    clickCountry: "국가를 클릭해 필터링",
    selected: "선택",
    company: "기업",
    founded: "설립",
    headquarters: "본사",
    employees: "직원 수",
    funding: "누적 투자",
    fullProfile: "전체 프로필",
    signal90: "90일 시그널",
    signalNote: "실적 전망·뉴스 속도·웹 관심도를 종합한 시그널입니다.",
    relatedNews: "관련 뉴스",
    allNews: "전체 뉴스",
    backList: "목록으로",
    openSource: "원문 열기",
    marketSignals: "시장 시그널",
    asOf: "기준 시각",
    quote: "“미래를 먼저 지도에 그리는 쪽이 복리의 엣지를 얻는다.”",
    sourceSnapshot: "피드: 스냅샷",
    sourceLive: "피드: 실시간 지연",
    filterBy: "상태 필터",
    allSignals: "전체 시그널",
    fieldNote: "필드 노트",
    marketRole: "시장 역할",
    valuation: "밸류에이션",
    latestRound: "최근 라운드",
    latestSignal: "최신 시그널",
    latestTrail: "최신 시그널 트레일",
    prototypeFoot: "프로토타입 데이터 · 편집 선별 링크 · 투자 조언 아님",
    snapshotFoot: "2026년 8월 14일 기준 스냅샷 · 리서치 전용 화면",
    live: "실시간",
    delayed: "지연",
    fallback: "스냅샷",
    refresh: "새로고침",
    kor: "KOR",
    eng: "ENG",
  },
};

const countryNamesKo = {
  "United States": "미국",
  "United States of America": "미국",
  China: "중국",
  "United Kingdom": "영국",
  France: "프랑스",
  India: "인도",
  Japan: "일본",
  "South Korea": "대한민국",
  Germany: "독일",
  Taiwan: "대만",
  Netherlands: "네덜란드",
  Israel: "이스라엘",
  Switzerland: "스위스",
  Singapore: "싱가포르",
  "Hong Kong": "홍콩",
  "United Arab Emirates": "아랍에미리트",
};

const cityNamesKo = {
  "Hong Kong": "홍콩",
  "San Francisco": "샌프란시스코",
  "Santa Clara": "산타클라라",
  Redmond: "레드먼드",
  Denver: "덴버",
  Austin: "오스틴",
  Paris: "파리",
  Hangzhou: "항저우",
  Tokyo: "도쿄",
  London: "런던",
  Cambridge: "케임브리지",
  Hsinchu: "신주",
  Veldhoven: "벨트호벤",
  Suwon: "수원",
  Icheon: "이천",
  Seongnam: "성남",
  Guangzhou: "광저우",
  Oshino: "오시노",
  "Salt Lake City": "솔트레이크시티",
  Jerusalem: "예루살렘",
  Chennai: "첸나이",
  Cologne: "쾰른",
  Zurich: "취리히",
  "Abu Dhabi": "아부다비",
};

const companyCopyKo = {
  sensetime: { category: "컴퓨터 비전", role: "엔터프라이즈 SaaS·솔루션", thesis: "스마트시티를 넘어 멀티모달 엔터프라이즈 제품으로 확장하는 컴퓨터 비전 플랫폼." },
  openai: { category: "파운데이션 모델", role: "API·엔터프라이즈", thesis: "프런티어 모델의 유통이 기업 운영 계층으로 이동하면서, 컴퓨트 접근성이 핵심 제약이 되고 있습니다." },
  mistral: { category: "오픈 웨이트 모델", role: "모델·API", thesis: "주권형 컴퓨트와 실용적인 API 계층을 함께 가져가는 유럽의 대표적인 오픈 웨이트 도전자입니다." },
  deepseek: { category: "파운데이션 모델", role: "리서치·API", thesis: "효율성 중심의 연구소로, 공개 모델을 통해 추론 비용 곡선을 계속 다시 그리고 있습니다." },
  sakana: { category: "모델 리서치", role: "리서치·라이선싱", thesis: "진화형 모델 설계와 일본 기업 유통을 빠르게 실험하는 소형 연구 기업입니다." },
  nvidia: { category: "AI 인프라", role: "가속기·시스템", thesis: "기존의 핵심 인프라 사업자이지만, 다음 경쟁력은 시스템·네트워킹·소프트웨어 락인으로 이동하고 있습니다." },
  nscale: { category: "AI 인프라", role: "주권형 클라우드", thesis: "주권형 워크로드와 에너지 접근성, 지역별 컴퓨트 수요를 겨냥한 유럽 인프라 베팅입니다." },
  g42: { category: "응용 AI", role: "주권형 AI 플랫폼", thesis: "걸프 지역의 주권 자본·데이터센터·응용 AI 도입을 연결하는 전략 플랫폼입니다." },
};

const newsHeadlineKo = {
  sensetime: ["SenseTime, 엔터프라이즈 비전 워크플로를 위한 멀티모달 업그레이드 예고", "홍콩, SenseTime과 함께 현지 AI 도입 프로그램 확대", "아시아 엔터프라이즈 매출 성장으로 SenseTime의 손실 폭 축소", "새 엣지 컴퓨트 제품군, 산업 AI 확장 신호"],
  openai: ["OpenAI, 비즈니스 소프트웨어에 에이전트 워크플로를 더 깊게 통합", "엔터프라이즈 수요가 프런티어 모델의 컴퓨트 용량 압박", "새 개발자 도구로 모델 사용을 지속 가능한 업무 흐름으로 전환"],
  mistral: ["Mistral AI, 공공부문을 위한 주권형 배포 트랙 공개", "오픈 웨이트 전략으로 유럽 AI 논쟁의 중심에 선 Mistral", "프랑스 스타트업 생태계, Mistral 생태계를 중심으로 확장"],
  deepseek: ["DeepSeek 연구팀, 지연시간을 낮춘 추론 스택 공개", "새 모델 출시로 중국 AI 효율성 경쟁에 다시 시선 집중", "중국 AI 연구소의 모델 수출이 핵심 변수로 부상"],
  sakana: ["Sakana AI, 도쿄 연구 파트너십 네트워크 확대", "일본 모델 생태계, 규모만으로 설명되지 않는 현지 경로 모색", "Sakana AI, 집단형 모델 행동에 관한 새 연구 노트 공개"],
  nvidia: ["AI 인프라의 다음 격전지로 시스템 수요 부상", "클라우드 구매자들, 가속기를 중심으로 인프라 예산 재편", "유럽 컴퓨트 공급자들, 주권형 용량을 새 카테고리로 전환"],
  nscale: ["유럽 컴퓨트 사업자들, 주권형 용량을 새 카테고리로 전환", "지역 AI 클라우드에서 전력 확보가 칩만큼 중요한 변수로 부상"],
  g42: ["G42, 주권형 워크로드를 위한 지역 컴퓨트 회랑 구상", "중동 데이터센터 투자가 기술 스택 상단으로 계속 이동"],
};

const API_ORIGIN = (import.meta.env.VITE_API_ORIGIN ?? "").replace(/\/$/, "");
const IS_STATIC_PAGES = import.meta.env.BASE_URL !== "/" && !API_ORIGIN;
let marketSnapshotPromise;

function apiUrl(path) {
  return `${API_ORIGIN}${path}`;
}

function getCopy(language, key) {
  return uiCopy[language]?.[key] ?? uiCopy.en[key] ?? key;
}

function getCompanyText(company, field, language) {
  if (language !== "ko") return company[field];
  return companyCopyKo[company.id]?.[field] ?? company[`${field}Ko`] ?? company[field];
}

function getCountryLabel(country, language) {
  return language === "ko" ? countryNamesKo[country] ?? country : country;
}

function getCityLabel(city, language) {
  return language === "ko" ? cityNamesKo[city] ?? city : city;
}

function getStatusLabel(status, language) {
  const labels = {
    PUBLIC: getCopy(language, "public"),
    PRIVATE: getCopy(language, "private"),
    "HIGH SIGNAL": getCopy(language, "high"),
    WATCH: getCopy(language, "watch"),
    EMERGING: language === "ko" ? "신흥" : "EMERGING",
    ACCELERATING: language === "ko" ? "가속" : "ACCELERATING",
    MOMENTUM: language === "ko" ? "모멘텀" : "MOMENTUM",
    STEADY: language === "ko" ? "안정" : "STEADY",
  };
  return labels[status] ?? status;
}

function getFilterLabel(filterId, language) {
  if (filterId === "all") return getCopy(language, "allSignals");
  return filterId === "PUBLIC" ? getCopy(language, "public") : getCopy(language, "private");
}

function getSectorLabel(sectorId, language) {
  const option = sectorOptions.find((sector) => sector.id === sectorId);
  return language === "ko" ? option?.labelKo ?? sectorId : option?.label ?? sectorId;
}

function getNewsHeadline(news, company, index, language) {
  if (news.isLive || language !== "ko") return news.headline;
  return newsHeadlineKo[company.id]?.[index] ?? news.headlineKo ?? news.headline;
}

function formatGdeltDate(value, language) {
  const match = String(value ?? "").match(/^(\d{4})(\d{2})(\d{2})/);
  if (!match) return value ?? "—";
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return new Intl.DateTimeFormat(language === "ko" ? "ko-KR" : "en-US", { month: "short", day: "2-digit", year: "numeric", timeZone: "UTC" }).format(date).toUpperCase();
}

function buildSparkline(closes) {
  const values = closes.filter((value) => Number.isFinite(value)).slice(-18);
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  return values.map((value, index) => {
    const x = 3 + (index / (values.length - 1)) * 88;
    const y = 19 - ((value - min) / range) * 15;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

function formatYahooValue(signal, rawValue) {
  const value = signal.format === "yield" && rawValue > 10 ? rawValue / 10 : rawValue;
  if (!Number.isFinite(value)) return signal.value;
  const formatted = value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return signal.format === "yield" ? `${formatted}%` : formatted;
}

function formatYahooMove(signal, currentValue, previousValue) {
  if (!Number.isFinite(currentValue) || !Number.isFinite(previousValue) || previousValue === 0) return signal.move;
  const multiplier = signal.format === "yield" && currentValue > 10 ? 0.1 : 1;
  const current = currentValue * multiplier;
  const previous = previousValue * multiplier;
  if (signal.format === "yield") {
    const delta = current - previous;
    return `${delta >= 0 ? "+" : "−"}${Math.abs(delta).toFixed(2)}`;
  }
  const percent = ((current - previous) / previous) * 100;
  return `${percent >= 0 ? "+" : "−"}${Math.abs(percent).toFixed(2)}%`;
}

async function fetchStaticMarket(signal) {
  marketSnapshotPromise ??= fetch(`${import.meta.env.BASE_URL}market.json?cache=${Date.now()}`, { cache: "no-store" }).then((response) => {
    if (!response.ok) throw new Error(`Market snapshot failed: ${response.status}`);
    return response.json();
  });
  const snapshot = await marketSnapshotPromise;
  const quote = snapshot.quotes?.[signal.symbol];
  if (!quote || !Number.isFinite(Number(quote.price))) throw new Error("Market snapshot returned no quote");
  const price = Number(quote.price);
  const previousClose = Number(quote.previousClose);
  return {
    ...signal,
    value: formatYahooValue(signal, price),
    move: formatYahooMove(signal, price, previousClose),
    points: buildSparkline((quote.closes ?? []).map(Number)) ?? signal.points,
    feed: "scheduled",
    updatedAt: quote.updatedAt ?? snapshot.generatedAt ?? Date.now(),
  };
}

async function fetchYahooMarket(signal) {
  if (IS_STATIC_PAGES) return fetchStaticMarket(signal);
  const response = await fetch(apiUrl(`/api/market/${encodeURIComponent(signal.symbol)}?range=1d&interval=5m&includePrePost=false`), { headers: { accept: "application/json" } });
  if (!response.ok) throw new Error(`Market feed failed: ${response.status}`);
  const payload = await response.json();
  const result = payload.chart?.result?.[0];
  const meta = result?.meta ?? {};
  const rawValue = Number(meta.regularMarketPrice ?? meta.previousClose);
  const previousValue = Number(meta.chartPreviousClose ?? meta.previousClose);
  if (!Number.isFinite(rawValue)) throw new Error("Market feed returned no quote");
  const closes = result?.indicators?.quote?.[0]?.close ?? [];
  return {
    ...signal,
    value: formatYahooValue(signal, rawValue),
    move: formatYahooMove(signal, rawValue, previousValue),
    points: buildSparkline(closes) ?? signal.points,
    feed: "live",
    updatedAt: meta.regularMarketTime ? meta.regularMarketTime * 1000 : Date.now(),
  };
}

async function fetchGdeltNews(company, language) {
  const query = encodeURIComponent(`${company.name} AI`);
  const endpoint = apiUrl(`/api/news?query=${query}&mode=artlist&format=json&maxrecords=5&sort=datedesc&timespan=1week`);
  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(() => controller.abort(), 8_000);
  let response;
  try {
    response = await fetch(endpoint, { headers: { accept: "application/json" }, signal: controller.signal });
  } finally {
    globalThis.clearTimeout(timeoutId);
  }
  if (!response.ok) throw new Error(`News feed failed: ${response.status}`);
  const payload = await response.json();
  const articles = (payload.articles ?? []).filter((article) => article.title && article.url).slice(0, 5);
  if (!articles.length) throw new Error("News feed returned no articles");
  return articles.map((article) => ({
    date: formatGdeltDate(article.seendate ?? article.datetime, language),
    source: String(article.domain ?? "GDELT").replace(/^www\./, "").toUpperCase(),
    headline: article.title,
    url: article.url,
    isLive: true,
  }));
}

function Sparkline({ points, tone = "orange" }) {
  return (
    <svg className={`sparkline sparkline-${tone}`} viewBox="0 0 94 22" role="img" aria-label="market movement sparkline">
      <polyline points={points} fill="none" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function SignalChart({ values }) {
  const peak = Math.max(...values);
  return (
    <div className="signal-bars" aria-label="90 day signal chart">
      {values.map((value, index) => (
        <span key={`${value}-${index}`} style={{ height: `${Math.max(16, (value / peak) * 100)}%` }} />
      ))}
    </div>
  );
}

export function App() {
  const [selectedId, setSelectedId] = useState("nvidia");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [search, setSearch] = useState("");
  const [activeNav, setActiveNav] = useState("atlas");
  const [signalFilter, setSignalFilter] = useState("all");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [newsOpen, setNewsOpen] = useState(false);
  const [briefingOpen, setBriefingOpen] = useState(false);
  const [newsFocus, setNewsFocus] = useState(null);
  const [profileVisible, setProfileVisible] = useState(true);
  const [language, setLanguage] = useState("ko");
  const [marketRows, setMarketRows] = useState(marketSignals);
  const [marketStatus, setMarketStatus] = useState("loading");
  const [marketUpdatedAt, setMarketUpdatedAt] = useState(null);
  const [marketRefreshToken, setMarketRefreshToken] = useState(0);
  const [newsItems, setNewsItems] = useState(companies.find((company) => company.id === "nvidia")?.news ?? companies[0].news);
  const [newsStatus, setNewsStatus] = useState("loading");

  const selectedCompany = companies.find((company) => company.id === selectedId) ?? companies[0];
  const copy = uiCopy[language];

  useEffect(() => {
    document.documentElement.lang = language === "ko" ? "ko" : "en";
  }, [language]);

  useEffect(() => {
    let cancelled = false;
    async function loadMarketRows() {
      setMarketStatus("loading");
      const rows = await Promise.all(marketSignals.map(async (signal) => {
        try {
          return await fetchYahooMarket(signal);
        } catch {
          return { ...signal, feed: "fallback" };
        }
      }));
      if (cancelled) return;
      const liveRows = rows.filter((row) => row.feed === "live");
      const scheduledRows = rows.filter((row) => row.feed === "scheduled");
      setMarketRows(rows);
      setMarketStatus(liveRows.length ? "live" : scheduledRows.length ? "scheduled" : "fallback");
      setMarketUpdatedAt(liveRows[0]?.updatedAt ?? scheduledRows[0]?.updatedAt ?? Date.now());
    }
    loadMarketRows();
    const refreshTimer = window.setInterval(loadMarketRows, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(refreshTimer);
    };
  }, [marketRefreshToken]);

  useEffect(() => {
    let cancelled = false;
    setNewsItems(selectedCompany.news);
    setNewsStatus("loading");
    fetchGdeltNews(selectedCompany, language)
      .then((items) => {
        if (cancelled) return;
        setNewsItems(items);
        setNewsStatus("live");
      })
      .catch(() => {
        if (cancelled) return;
        setNewsItems(selectedCompany.news);
        setNewsStatus("fallback");
      });
    return () => {
      cancelled = true;
    };
  }, [language, selectedCompany.id]);

  const visibleCompanies = useMemo(() => {
    const query = search.trim().toLowerCase();
    return companies.filter((company) => {
      const matchesSearch = !query || [company.name, company.country, company.category, company.role, company.city, getSectorLabel(company.sector, "en")].some((field) => field.toLowerCase().includes(query));
      const matchesFilter = signalFilter === "all" || company.status === signalFilter;
      const matchesSector = sectorFilter === "all" || company.sector === sectorFilter;
      const matchesCountry = selectedCountry === "all" || company.country === selectedCountry;
      const matchesNav = activeNav !== "watchlist" || company.watchlist;
      return matchesSearch && matchesFilter && matchesSector && matchesCountry && matchesNav;
    });
  }, [activeNav, search, selectedCountry, sectorFilter, signalFilter]);

  function selectCompany(id) {
    setSelectedId(id);
    setProfileVisible(true);
    setNewsFocus(null);
    setNewsOpen(false);
  }

  function selectCountry(country) {
    setSelectedCountry(country);
    const firstCompany = companies.find((company) => company.country === country);
    if (firstCompany) selectCompany(firstCompany.id);
  }

  function resetView() {
    setSelectedCountry("all");
    setSectorFilter("all");
    setSearch("");
  }

  function handleNav(id) {
    setActiveNav(id);
    setNewsFocus(null);
    if (id === "screener") {
      setFilterOpen((isOpen) => !isOpen);
      return;
    }
    if (id === "newsroom") {
      setNewsOpen(true);
      return;
    }
    if (id === "briefings") {
      setBriefingOpen(true);
    }
  }

  function handleMapCountry(geoName) {
    const lane = countryLanes.find((country) => country.mapNames.includes(geoName));
    const company = visibleCompanies.find((item) => item.mapNames.includes(geoName)) ?? companies.find((item) => item.mapNames.includes(geoName));
    if (lane) setSelectedCountry(lane.name);
    if (company) selectCompany(company.id);
  }

  const activeViewLabel = activeNav === "watchlist" ? `${copy.watchlist} // 12 ${language === "ko" ? "확신" : "CONVICTIONS"}` : activeNav === "atlas" ? `${copy.company} // ${language === "ko" ? "전체 국가" : "ALL COUNTRIES"}` : activeNav === "screener" ? `${copy.screener} // ${language === "ko" ? "필터링된 시그널" : "FILTERED SIGNALS"}` : `${copy.company} // ${language === "ko" ? "전체 국가" : "ALL COUNTRIES"}`;
  const marketFeedLabel = marketStatus === "live" ? copy.feedLive : marketStatus === "scheduled" ? copy.feedScheduled : marketStatus === "loading" ? copy.feedUpdating : copy.feedSnapshot;
  const newsFeedLabel = newsStatus === "live" ? copy.live : newsStatus === "loading" ? copy.feedUpdating : copy.fallback;
  const marketAsOf = marketUpdatedAt ? new Intl.DateTimeFormat(language === "ko" ? "ko-KR" : "en-US", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Seoul" }).format(new Date(marketUpdatedAt)).toUpperCase() : "—";
  const coverageLabel = language === "ko" ? `추적 유니버스: ${companies.length}개 기업 / ${sectorOptions.length - 1}개 산업 레이어` : `TRACKED UNIVERSE: ${companies.length} COMPANIES / ${sectorOptions.length - 1} AI SECTORS`;

  return (
    <main className="app-shell" style={{ "--paper-texture": `url(${import.meta.env.BASE_URL}paper-texture.png)` }}>
      <aside className="brand-column">
        <div className="brand-lockup">
          <span className="eyebrow orange-text">{copy.eyebrow}</span>
          <h1>SIGNAL<br />ROOM</h1>
          <div className="brand-rule" />
          <span className="crosshair" aria-hidden="true"><i className="ph ph-plus" /></span>
          <div className="issue-stamp">
            <span>{copy.issue}</span>
            <strong>AUG 14, 2026</strong>
          </div>
        </div>

        <section className="editorial-brief" aria-labelledby="brief-heading">
          <span className="section-kicker" id="brief-heading">{copy.brief}</span>
          <p>{copy.briefA}</p>
          <p>{copy.briefB}</p>
          <span className="byline">{copy.byline}</span>
        </section>

        <section className="legend-block" aria-label="map legend">
          <div className="legend-row"><span className="legend-mark selected" />{copy.selectedCompany}</div>
          <div className="legend-row"><span className="legend-mark private" />{copy.privateCompany}</div>
          <div className="legend-row"><span className="legend-mark public" />{copy.publicCompany}</div>
          <div className="legend-row"><span className="legend-mark cluster" />{copy.emergingCluster}</div>
          <div className="legend-row"><span className="legend-mark sovereign" />{copy.sovereign}</div>
        </section>

        <nav className="primary-nav" aria-label="primary navigation">
          {navItems.map((item) => (
            <button key={item.id} className={`nav-item ${activeNav === item.id ? "is-active" : ""}`} onClick={() => handleNav(item.id)} type="button">
              <i className={`ph ${item.icon}`} aria-hidden="true" />
              <span>{copy[item.id]}</span>
              {item.id === "watchlist" && <small>12</small>}
            </button>
          ))}
        </nav>

        {filterOpen && (
          <div className="filter-menu" aria-label="screener filters">
            <span className="filter-title">{copy.filterBy}</span>
            {filterOptions.map((filter) => (
              <button key={filter.id} className={signalFilter === filter.id ? "is-selected" : ""} onClick={() => setSignalFilter(filter.id)} type="button">
                <span className="filter-check">{signalFilter === filter.id ? "●" : "○"}</span>{getFilterLabel(filter.id, language)}
              </button>
            ))}
          </div>
        )}

        <div className="brand-footer">
          <span>{copy.editorialResearch}</span>
          <span>{copy.notAdvice}</span>
          <span className="footer-mark"><i className="ph ph-arrow-up-right" /> {copy.dataMethod}</span>
        </div>
      </aside>

      <section className="main-stage">
        <header className="main-header">
          <div className="header-meta">
            <span>{copy.eyebrow}</span>
            <span className="header-date">AUGUST 14, 2026</span>
            <span className="header-mode">{copy.researchMode}</span>
            <div className="language-switch" role="group" aria-label="Language">
              <button type="button" className={language === "ko" ? "is-active" : ""} onClick={() => setLanguage("ko")} aria-pressed={language === "ko"}>{copy.kor}</button>
              <button type="button" className={language === "en" ? "is-active" : ""} onClick={() => setLanguage("en")} aria-pressed={language === "en"}>{copy.eng}</button>
            </div>
          </div>
          <div className="title-line">
            <div>
              <h2>{copy.title}</h2>
              <p>{copy.subtitle}</p>
            </div>
            <div className="search-block">
              <label htmlFor="atlas-search">{copy.find}</label>
              <div className="search-input-wrap">
                <i className="ph ph-magnifying-glass" aria-hidden="true" />
                <input id="atlas-search" value={search} onChange={(event) => { setSearch(event.target.value); if (event.target.value.trim()) setSelectedCountry("all"); }} placeholder={copy.placeholder} />
                {search && <button className="clear-search" type="button" onClick={() => setSearch("")} aria-label="Clear search"><i className="ph ph-x" /></button>}
              </div>
            </div>
          </div>
          <div className="annotation-line">
            <span className="annotation-arrow">↗</span>
            <span>{activeViewLabel}</span>
            <span className="annotation-note">{copy.inspect}</span>
          </div>
        </header>

        <div className="atlas-body">
          <div className="map-toolbar">
            <span>{copy.projection}</span>
            <span>{copy.center}</span>
            <span className="coverage-label">{coverageLabel}</span>
            <div className="map-toolbar-actions">
              <button type="button" onClick={resetView}><i className="ph ph-arrows-out" /> {copy.reset}</button>
              <span className={`live-label ${marketStatus === "live" ? "is-live" : ""}`}><i className="ph ph-broadcast" /> {marketFeedLabel}</span>
            </div>
          </div>

          <div className="sector-ribbon" aria-label={copy.sectorLayers}>
            <span className="sector-ribbon-label">{copy.sectorLayers}</span>
            {sectorOptions.map((sector) => (
              <button key={sector.id} type="button" className={sectorFilter === sector.id ? "is-active" : ""} onClick={() => setSectorFilter(sector.id)} aria-pressed={sectorFilter === sector.id}>
                {language === "ko" ? sector.labelKo : sector.label}
              </button>
            ))}
          </div>

          <div className="map-canvas">
            <div className="map-axis axis-top"><span>120°W</span><span>60°W</span><span>0°</span><span>60°E</span><span>120°E</span><span>180°</span></div>
            <div className="map-axis axis-left"><span>60°N</span><span>30°N</span><span>0°</span><span>30°S</span><span>60°S</span></div>
            <ComposableMap
              className="world-map"
              projection="geoEqualEarth"
              projectionConfig={{ scale: 160, center: [10, 10] }}
              viewBox="0 0 800 440"
              aria-label={language === "ko" ? "AI 기업 인터랙티브 세계 지도" : "Interactive world map of AI companies"}
            >
              <Graticule stroke="#bcb1a4" strokeWidth={0.35} opacity={0.8} />
              <Geographies geography={geoUrl}>
                {({ geographies }) => geographies.map((geo) => {
                  const geoName = geo.properties?.name ?? "";
                  const lane = countryLanes.find((country) => country.mapNames.includes(geoName));
                  const isSelected = selectedCountry !== "all" && lane?.name === selectedCountry;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => handleMapCountry(geoName)}
                      aria-label={`${language === "ko" ? "탐색" : "Explore"} ${getCountryLabel(geoName, language)}`}
                      style={{
                        default: { fill: isSelected ? "#e97035" : "#2c2925", stroke: "#eee6d9", strokeWidth: 0.55, outline: "none" },
                        hover: { fill: "#e97035", stroke: "#1e1d1a", strokeWidth: 0.75, outline: "none", cursor: "pointer" },
                        pressed: { fill: "#db5c27", stroke: "#1e1d1a", strokeWidth: 0.75, outline: "none" },
                      }}
                    />
                  );
                })}
              </Geographies>
              {visibleCompanies.map((company) => (
                <Marker key={company.id} coordinates={company.coordinates} onClick={() => selectCompany(company.id)}>
                  <g className={`company-marker ${company.id === selectedId ? "is-selected" : ""} ${company.signalTone} sector-${company.sector}`} role="button" tabIndex="0" aria-label={`${language === "ko" ? "선택" : "Select"} ${company.name}`}>
                    <title>{company.name} · {getCompanyText(company, "category", language)}</title>
                    <circle className="marker-orbit" r={company.id === selectedId ? 10 : 5.2} />
                    <circle className="marker-core" r={company.id === selectedId ? 4.2 : 2.4} />
                    {company.showLabel && <text x={company.id === "sakana" ? -10 : 12} y={company.id === selectedId ? -13 : 4} className="marker-label">{company.markerLabel}</text>}
                  </g>
                </Marker>
              ))}
            </ComposableMap>

            <div className="map-callout">
              <span className="callout-line" />
              <strong>{copy.emergingNote}<br />{copy.emergingNote2}</strong>
            </div>

            <div className="map-key">
              <span className="section-kicker">{copy.signalLayer}</span>
              <div><span className="key-mark high" />{copy.high}</div>
              <div><span className="key-mark watch" />{copy.watch}</div>
              <div><span className="key-mark private" />{copy.private}</div>
              <div><span className="key-mark public" />{copy.public}</div>
            </div>

            <div className="map-controls" aria-label={language === "ko" ? "지도 조작" : "map controls"}>
              <button type="button" aria-label={language === "ko" ? "확대" : "Zoom in"}><i className="ph ph-plus" /></button>
              <button type="button" aria-label={language === "ko" ? "축소" : "Zoom out"}><i className="ph ph-minus" /></button>
              <button type="button" aria-label={language === "ko" ? "지도 중앙 정렬" : "Recenter map"} onClick={resetView}><i className="ph ph-crosshair" /></button>
            </div>
          </div>

          <section className="country-index" aria-labelledby="country-index-heading">
            <div className="country-index-head"><span id="country-index-heading">{copy.regionIndex}</span><span>{copy.clickCountry}</span></div>
            <div className="country-lane-list">
              <button className={`lane-arrow ${selectedCountry === "all" ? "is-disabled" : ""}`} onClick={() => setSelectedCountry("all")} type="button" aria-label={language === "ko" ? "모든 국가 보기" : "Show all countries"}><i className="ph ph-caret-left" /></button>
              {countryLanes.map((lane) => (
                <button key={lane.name} className={`lane-card ${selectedCountry === lane.name ? "is-selected" : ""}`} onClick={() => selectCountry(lane.name)} type="button">
                  <span className="lane-name">{getCountryLabel(lane.name, language)}</span>
                  <span className="lane-count">{lane.count} {language === "ko" ? "개 기업" : "COMPANIES"}</span>
                  <span className="lane-dots" aria-hidden="true">
                    {[0, 1, 2, 3, 4].map((dot) => <i key={dot} className={`lane-dot ${lane.tone} ${dot < (lane.tone === "orange" ? 4 : lane.tone === "blue" ? 2 : 1) ? "is-on" : ""}`} />)}
                  </span>
                  <span className="lane-status">{getStatusLabel(lane.status, language)}</span>
                </button>
              ))}
              <button className="lane-arrow" type="button" aria-label={language === "ko" ? "다음 국가 그룹" : "Next country group"}><i className="ph ph-caret-right" /></button>
            </div>
          </section>

          {profileVisible && <article className="profile-sheet" aria-live="polite">
            <div className="sheet-tab">{copy.selected}<br />{copy.company}</div>
            <div className="sheet-main">
              <div className="sheet-heading">
                <div className={`company-stamp stamp-${selectedCompany.signalTone}`} aria-hidden="true"><img src={`${import.meta.env.BASE_URL}company-mark.png`} alt="" /></div>
                <div>
                  <div className="sheet-kicker">{getCompanyText(selectedCompany, "category", language).toUpperCase()}</div>
                  <h3>{selectedCompany.name}</h3>
                  <div className="sheet-subline">{getCityLabel(selectedCompany.city, language)} · {getStatusLabel(selectedCompany.status, language)} · {selectedCompany.ticker}</div>
                </div>
                <button className="sheet-close" type="button" onClick={() => setProfileVisible(false)} aria-label={language === "ko" ? "기업 프로필 닫기" : "Close company profile"}><i className="ph ph-x" /></button>
              </div>

              <div className="sheet-copy">
                <p>{getCompanyText(selectedCompany, "thesis", language)}</p>
                <div className="company-facts">
                  <div><span>{copy.founded}</span><strong>{selectedCompany.founded}</strong></div>
                  <div><span>{copy.headquarters}</span><strong>{getCityLabel(selectedCompany.city, language)}</strong></div>
                  <div><span>{copy.employees}</span><strong>{selectedCompany.employees}</strong></div>
                  <div><span>{copy.funding}</span><strong>{selectedCompany.funding}</strong></div>
                </div>
                <button className="profile-link" type="button" onClick={() => setBriefingOpen(true)}>{copy.fullProfile} <i className="ph ph-arrow-right" /></button>
              </div>

              <div className="sheet-signal">
                <div className="sheet-column-head"><span>{copy.signal90}</span><i className="ph ph-info" title={copy.signalNote} /></div>
                <strong className={`signal-number ${selectedCompany.signalTone}`}>{selectedCompany.signal}</strong>
                <SignalChart values={selectedCompany.chart} />
                <div className="chart-axis"><span>MAY 16</span><span>AUG 14</span></div>
                <span className="chart-note">{copy.signalNote}</span>
              </div>

              <div className="sheet-news">
                <div className="sheet-column-head"><span>{copy.relatedNews} <em className={`feed-badge ${newsStatus === "live" ? "is-live" : ""}`}>{newsFeedLabel}</em></span><button type="button" onClick={() => setNewsOpen(true)}>{copy.allNews} <i className="ph ph-arrow-up-right" /></button></div>
                {newsFocus ? (
                  <div className="news-focus">
                    <button type="button" onClick={() => setNewsFocus(null)}><i className="ph ph-arrow-left" /> {copy.backList}</button>
                    <strong>{getNewsHeadline(newsFocus, selectedCompany, newsFocus._index ?? 0, language)}</strong>
                    <span>{newsFocus.source} · {newsFocus.date}</span>
                    <a href={newsFocus.url} target="_blank" rel="noreferrer">{copy.openSource} <i className="ph ph-arrow-up-right" /></a>
                  </div>
                ) : (
                  <div className="news-list">
                    {newsItems.slice(0, 3).map((news, index) => (
                      <button key={`${news.date}-${news.headline}`} className="news-row" type="button" onClick={() => setNewsFocus({ ...news, _index: index })}>
                        <time>{news.date}</time>
                        <span>{getNewsHeadline(news, selectedCompany, index, language)}</span>
                        <i className="ph ph-arrow-up-right" aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </article>}
        </div>
      </section>

      <aside className="signal-rail">
        <div className="rail-header">
          <div className="rail-heading-row"><h2>{copy.marketSignals}</h2><button className="refresh-data" type="button" onClick={() => setMarketRefreshToken((value) => value + 1)} aria-label={copy.refresh}><i className={`ph ph-arrows-clockwise ${marketStatus === "loading" ? "is-spinning" : ""}`} /> <span>{copy.refresh}</span></button></div>
          <span className="rail-rule" />
        </div>
        <div className="market-list">
          {marketRows.map((signal) => (
            <div className="market-row" key={signal.name}>
              <div className="market-row-top"><strong>{language === "ko" ? signal.nameKo : signal.name}</strong><span>{signal.value}</span></div>
              <div className="market-row-bottom"><small>{signal.ticker}</small><span className={`market-move ${signal.tone}`}>{signal.move}</span></div>
              <Sparkline points={signal.points} tone={signal.tone} />
            </div>
          ))}
        </div>
        <div className="rail-asof">{copy.asOf} {marketAsOf} KST</div>
        <blockquote>{copy.quote}<cite>— SIGNAL ROOM</cite></blockquote>
        <div className="rail-footer"><span className={marketStatus === "live" || marketStatus === "scheduled" ? "is-live" : ""}><i className="ph ph-broadcast" /> {marketStatus === "live" || marketStatus === "scheduled" ? (marketStatus === "scheduled" ? copy.feedScheduled : copy.sourceLive) : copy.sourceSnapshot}</span><span>ATLAS-INTEL / v1.0</span></div>
      </aside>

      {newsOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => setNewsOpen(false)}>
          <section className="news-modal" role="dialog" aria-modal="true" aria-labelledby="news-modal-title" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header"><div><span className="section-kicker">{copy.newsroom} / {selectedCompany.name.toUpperCase()}</span><h2 id="news-modal-title">{copy.latestTrail}</h2></div><button type="button" onClick={() => setNewsOpen(false)} aria-label={language === "ko" ? "뉴스룸 닫기" : "Close newsroom"}><i className="ph ph-x" /></button></div>
            <div className="modal-news-list">
              {newsItems.map((news, index) => (
                <a className="modal-news-row" key={`${news.source}-${news.date}`} href={news.url} target="_blank" rel="noreferrer">
                  <time>{news.date}</time>
                  <div><span>{news.source}</span><strong>{getNewsHeadline(news, selectedCompany, index, language)}</strong></div>
                  <i className="ph ph-arrow-up-right" />
                </a>
              ))}
            </div>
            <div className="modal-footnote">{newsStatus === "live" ? copy.sourceLive : copy.prototypeFoot}</div>
          </section>
        </div>
      )}

      {briefingOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => setBriefingOpen(false)}>
          <section className="briefing-modal" role="dialog" aria-modal="true" aria-labelledby="briefing-title" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header"><div><span className="section-kicker">{copy.fieldNote} / {getCountryLabel(selectedCompany.country, language).toUpperCase()}</span><h2 id="briefing-title">{selectedCompany.name}</h2></div><button type="button" onClick={() => setBriefingOpen(false)} aria-label={language === "ko" ? "프로필 닫기" : "Close profile"}><i className="ph ph-x" /></button></div>
            <p className="modal-thesis">{getCompanyText(selectedCompany, "thesis", language)}</p>
            <div className="briefing-grid"><div><span>{copy.marketRole}</span><strong>{getCompanyText(selectedCompany, "role", language)}</strong></div><div><span>{copy.valuation}</span><strong>{selectedCompany.valuation}</strong></div><div><span>{copy.latestRound}</span><strong>{selectedCompany.latestRound}</strong></div><div><span>{copy.latestSignal}</span><strong className={selectedCompany.signalTone}>{getStatusLabel(selectedCompany.signalLabel, language)}</strong></div></div>
            <div className="modal-footnote">{copy.snapshotFoot}</div>
          </section>
        </div>
      )}
    </main>
  );
}
