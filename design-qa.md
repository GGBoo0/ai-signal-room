# Design QA — Signal Room

## Comparison target

- Source visual truth: `C:\Users\didch\.codex\generated_images\019ffe5d-9848-7d50-b05f-8bb29feaf258\exec-1eaacf71-3e1e-464b-8238-8e0b87ede513.png`
- Implementation screenshot: `C:\Users\didch\OneDrive\바탕 화면\2026 여름방학 공부\ai-signal-room\design-qa-final-desktop.png`
- Source dimensions: 1487 × 1058 px.
- Implementation dimensions: 1440 × 1024 px.
- CSS viewport: 1440 × 1024 px.
- Density normalization: source and implementation share the same 1.406 aspect ratio; source was visually normalized to the implementation viewport for comparison. Browser capture used the desktop viewport at device scale 1.
- State: initial atlas view, SenseTime selected, search empty, all countries visible, profile sheet open, snapshot date August 14, 2026.

## Full-view comparison evidence

The source and implementation were opened together and compared at the same desktop aspect ratio. The implementation preserves the source's editorial spread: warm paper field, oversized serif mastheads, thin ink rules, orange/blue signal accents, dark geographic map, right market rail, and bottom company dossier. The implementation intentionally adds a clickable country lane, search field, map controls, and interactive news rows required by the product brief.

## Focused region comparison evidence

- Left masthead: `SIGNAL ROOM`, issue stamp, editorial brief, legend, and navigation match the source hierarchy; the type is scaled slightly down so the full interactive desktop composition remains readable.
- Map: real country geometry from `world-atlas` replaces the source's raster map so countries are clickable. The filled land treatment, paper ground, coordinate labels, marker colors, and map-first hierarchy remain aligned with the source.
- Profile sheet: selected-company tab, title band, facts, signal bars, and related-news column preserve the source anatomy. The generated `public/company-mark.png` is used as a real image asset for the profile mark.
- Market rail: repeated signal rows, sparkline rhythm, index labels, and quote block follow the source's narrow right-hand column.

## Findings and iteration history

### Initial pass

- [P1] Masthead collision and clipped profile sheet.
  - Evidence: at 1440 × 1024, the oversized left masthead overlapped the central title and the bottom profile sheet continued below the viewport.
  - Fix: reduced the masthead and central display scale, made the main stage a bounded flex column, and fitted the atlas body to the viewport.
  - Post-fix evidence: `design-qa-fitted.png`; page scroll height reduced to the viewport height.

- [P2] Country lane was occluded by the profile sheet.
  - Evidence: the first fitted view showed only the country-lane heading while most lane cards were hidden behind the dossier.
  - Fix: reduced map height and compressed the dossier's internal rhythm so the full country lane remains clickable above the profile sheet.
  - Post-fix evidence: `design-qa-final-desktop.png`; map ends at 637 px, country lane ends at 737 px, and the profile begins at 728 px with the lane content visible.

### Final pass

- No actionable P0, P1, or P2 findings remain.
- The company mark was promoted from a text monogram to the generated `public/company-mark.png` asset to keep the profile stamp faithful to the selected visual direction.

## Interaction checks

- Clicked the Japan country lane: lane becomes selected and the dossier updates to Sakana AI.
- Clicked a related-news row: inline news focus appears with a back-to-list action and source link.
- Opened `VIEW ALL NEWS`: newsroom dialog appears with the selected company's full news list.
- Searched `Mistral`: country filter clears and exactly one matching company marker remains.
- Opened `SCREENER` and selected `PRIVATE`: six private markers remain and the public NVIDIA marker is removed.
- Captured a responsive mobile state at CSS viewport 390 × 844; the stacked layout, search, map, country lane scroller, and dossier remain available.
- Browser console check: no error or warning entries.

## Implementation checklist

- [x] Map, company markers, country selection, and profile dossier are interactive.
- [x] Search and screener controls update visible map data.
- [x] Related news and full newsroom states work.
- [x] Desktop reference viewport fits without page scroll.
- [x] Compact desktop height and mobile responsive states were checked.
- [x] Image assets use generated paper texture and company mark files.
- [x] Production build and Sites packaging tests pass.

## Follow-up polish

- Replace the prototype snapshot dataset with a server-side news/market feed when a source and API policy are selected. Keep keys off the client and label live data freshness in the UI.
- Add a saved watchlist persistence layer if the product moves beyond the prototype.

final result: passed

## Live data and bilingual follow-up

- The right rail now requests KOSPI, NASDAQ Composite, S&P 500, Dow Jones, EURO STOXX 50, Nikkei 225, Hang Seng, US 10Y, and WTI through same-origin `/api/market/*` proxy routes. Yahoo chart responses populate the value, move, and sparkline every 60 seconds; the UI keeps the editorial snapshot when an upstream feed is unavailable.
- GDELT is used as a best-effort related-news feed through `/api/news`; an 8-second timeout returns to the curated company links and labels the rail `SNAPSHOT` instead of leaving a loading state.
- KOR/ENG toggle was checked in the live preview. Korean is the default, with translated navigation, brief, legend, map annotations, country lanes, dossier fields, news labels, and market names.
- Local proxy checks returned HTTP 200 for the Yahoo KOSPI endpoint. The browser preview displayed live/delayed values for all nine market rows, and the Sites build plus worker tests still pass.
