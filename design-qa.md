# Quote Ledger Design QA

**Findings**

- No actionable P0, P1, or P2 findings remain in the final comparison.
- [P3] The source shows more compact intraday x-axis labels than the implementation.
  - Location: selected-company chart.
  - Evidence: the source uses five time labels; the implementation uses start/end market-local times plus three y-axis price labels.
  - Impact: low; the implementation remains readable and exposes the actual scale without inventing intermediate values.
  - Follow-up: add collision-aware intermediate time ticks if a denser chart library is introduced.

**Comparison Target**

- Source visual truth: `C:\Users\didch\.codex\generated_images\019ffe5d-9848-7d50-b05f-8bb29feaf258\exec-db7d63e0-4d1a-4874-95aa-379a27b2d645.png`
- Source pixels: 1487 × 1058.
- Rendered implementation: `C:\Users\didch\OneDrive\바탕 화면\2026 여름방학 공부\ai-signal-room\.preview-logs\quote-ledger-qa\implementation-desktop-final-1280x720.png`
- Implementation pixels: 1265 × 712.
- Browser CSS viewport: 1280 × 720 at deviceScaleFactor 1.
- Density normalization: the source was proportionally resized to 1265 px wide and top-cropped to 1265 × 712; the implementation screenshot was kept at its native browser-capture dimensions.
- Normalized source: `C:\Users\didch\OneDrive\바탕 화면\2026 여름방학 공부\ai-signal-room\.preview-logs\quote-ledger-qa\source-normalized-1265x712.png`
- State: Korean, desktop, all-company filter, page 1, NVIDIA selected, delayed exchange quote loaded, BTC/ETH stream connected, latest-news snapshot loaded, regular session closed.

**Visible Comparison Evidence**

- Final full-view side-by-side: `C:\Users\didch\OneDrive\바탕 화면\2026 여름방학 공부\ai-signal-room\.preview-logs\quote-ledger-qa\comparison-full-final.png`
- Focused masthead/filter comparison: `C:\Users\didch\OneDrive\바탕 화면\2026 여름방학 공부\ai-signal-room\.preview-logs\quote-ledger-qa\comparison-header-final.png`
- Focused selected-row/detail comparison: `C:\Users\didch\OneDrive\바탕 화면\2026 여름방학 공부\ai-signal-room\.preview-logs\quote-ledger-qa\comparison-detail-final.png`
- Lower map/sector/summary implementation evidence: `C:\Users\didch\OneDrive\바탕 화면\2026 여름방학 공부\ai-signal-room\.preview-logs\quote-ledger-qa\implementation-lower-pass-2-1280x720.png`

**Required Fidelity Surfaces**

- Fonts and typography: Gyeonggi Cheonnyeon Medium/Bold is used throughout, as requested. The implementation intentionally increases quote, company, and row text relative to the mock so the selected design remains readable. Display, body, labels, truncation, and Korean/English wrapping were checked in the browser.
- Spacing and layout rhythm: the sharp editorial rules, masthead, filter band, ledger columns, inline expanded row, and three-part lower summary follow the selected source. A horizontal market tape is an intentional insertion required by the user; it does not introduce rounded cards or generic dashboard chrome.
- Colors and tokens: warm ivory paper, black ink, vermilion gains, cobalt losses, green live state, and gray closed/private state match the source direction. No AI-style gradients or glow effects are used.
- Image quality and asset fidelity: featured-company marks and country flags are local SVG assets; the map uses the existing world-atlas geography asset; icons use the Phosphor library. The price chart is a canvas rendering of real quote points, not decorative SVG or CSS art.
- Copy and content: KOR/ENG switching is complete for interface copy. Public companies show real delayed exchange quotes and currency; private companies show `PRIVATE` and never receive fabricated prices. Actual public/private counts and market state intentionally replace the mock's illustrative values.
- Accessibility and interaction: search, listing tabs, sector/country selects, watchlist, row selection, pagination, language controls, external news links, keyboard row activation, focus rings, reduced-motion handling, and semantic labels were checked.
- Responsiveness: desktop rendering was browser-captured. The 1080 px and 720 px breakpoint rules were reviewed for stacked controls, card-like ledger rows, one-column detail panels, and full-width pagination. The available in-app browser surface was fixed at 1280 × 720, so a separate mobile raster capture remains a low-risk test gap.

**Comparison History**

1. Pass 1
   - Evidence: `comparison-full-pass-1.png`, `comparison-header-pass-1.png`, `comparison-detail-pass-1.png` in the QA evidence directory.
   - [P2] The implementation chart lacked the source's visible y-axis price scale and showed date-heavy timestamps instead of market-local chart times.
   - Fix: added three real-data y-axis labels to the canvas, persisted each exchange timezone in the quote snapshot, and formatted the x-axis in that market's local time.
2. Pass 2
   - Evidence: `comparison-full-pass-2.png`, `comparison-header-pass-2.png`, `comparison-detail-pass-2.png`.
   - Post-fix result: the price scale and market-local time labels are visible, aligned, and readable. No P0/P1/P2 findings remained.
3. Final content pass
   - Evidence: `comparison-full-final.png`, `comparison-header-final.png`, `comparison-detail-final.png`.
   - Confirmed that real latest-news content wraps and truncates without changing the four-column detail geometry.

**Primary Interactions Tested**

- Search: `Samsung` returned one Samsung Electronics row with a KRW quote.
- Listing filter: private filter returned 19 companies and showed `PRIVATE` instead of a price.
- Sector filter: compute/semiconductor returned 10 companies.
- Language: ENG switched masthead and interface copy; KOR restored correctly.
- Company selection: Microsoft expanded inline with its current USD quote.
- Pagination: page 2 loaded and returned to page 1.
- Watchlist: star state toggled and restored without opening the row.
- Streaming: BTC/ETH values changed without a page refresh during a 1.8-second observation.
- Console errors: none in the final browser session.

**Implementation Checklist**

- [x] Selected visual target reproduced as a sharp editorial quote ledger.
- [x] Real company quote, currency, change, chart, and market state added.
- [x] Major indices and one-second crypto stream surfaced above the ledger.
- [x] Private-company pricing kept explicitly unavailable.
- [x] KOR/ENG, search, filters, watchlist, selection, pagination, map, and news links work.
- [x] Build, worker tests, browser interactions, and final visual comparison pass.

**Follow-up Polish**

- Add a dedicated 390 px browser capture when the browser surface exposes viewport emulation.
- Consider intermediate x-axis tick collision handling if a full charting library is added later.

final result: passed
