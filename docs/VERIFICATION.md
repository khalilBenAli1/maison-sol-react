# Verification

Verified 2026-11-03 with Node 22.23.1 and npm 10.9.8.

- Strict TypeScript, ESLint and Prettier checks passed.
- **54 unit tests** passed: date validity/DST/leap/month boundaries, occupied nights and checkout boundaries, integer money/rounding, URL filters/saved rooms, malformed/denied storage, contact validation and sensitive-field stripping.
- **36 Playwright tests** passed: twelve journeys on desktop Chromium, mobile Chromium and WebKit. Includes the complete booking, date/contact errors, draft recovery, exact €810 sample total, preferences reset after confirmation, editing only departure, filter persistence, saved/reset/empty states, gallery/menu keyboard focus and month-boundary navigation.
- Axe scans of home, collection, room detail and booking returned no findings for the tested A/AA rules. Manual automated-browser keyboard interactions exercised Enter, Space, Escape, arrows, focus restoration and step focus.
- All main routes reflowed without horizontal overflow at 390, 768 and 1440 CSS pixels. Reduced-motion output was inspected.
- Actual production screenshots are in `docs/screenshots`. Run `node scripts/capture-screenshots.mjs` with the preview running to reproduce them. Its capture report records browser errors, overflow and failed images.
- Production build passes; lazy route bundles are separate. The main bundle is approximately 235 kB uncompressed / 74 kB gzip; shared routing chunk 48 kB / 17 kB; CSS 40 kB / 8.5 kB. Full and small WebP image variants total 987,480 bytes across all rooms/hero. These are build measurements, not invented Lighthouse scores.

## Publication evidence

- Release PR [#1](https://github.com/khalilBenAli1/maison-sol-react/pull/1) passed both push and PR checks.
- Main commit `755fd31eb6a4ed4839a401fc6490cc20b5919c8c` passed [quality and Pages deployment](https://github.com/khalilBenAli1/maison-sol-react/actions/runs/41560987494).
- Public HTML and hero image returned HTTP 200. The hero has `image/webp` content type.
- Three critical browser journeys also passed against the deployed URL: collection filters/saved/reset, direct room/gallery/refresh, and the complete validated booking with exact totals/contact privacy.
- Verified free demo: [Maison Sol](https://khalilbenali1.github.io/maison-sol-react/). Production dependency audit: zero findings.
- The publication evidence above records the initial release; later narrow corrections are documented below.

## Booking separation verification

The user-requested step/orchestration extraction passed all 50 unit tests and 27 browser journeys, including the new review-edit-remount regression on all three browser projects. Independent code review found no behavior/state-boundary regressions. Fixed-clock before/after desktop (1440×1000) and mobile (390×844) booking screenshots have identical pixels; see `booking-visual-comparison.json`. No CSS, date/money rules, persistence behavior or dependencies changed.

## Narrow long-contact correction

A valid unbroken 100-character guest name reproduced confirmation overflow at390px. The targeted thank-you paragraph now wraps within its container. The regression checks both review and confirmation using `documentElement.clientWidth`; layout assertions and capture reports also use that stable layout-viewport measure. All six focused Chromium/mobile/WebKit long-contact and multi-width journeys pass. Normal design is unchanged; no overflow is hidden.

## Rapid interaction regressions

Two deterministic browser cases failed before the correction: delayed native close notifications could dismiss a newly reopened menu, and same-turn filter changes retained only the final sort query. Modal state now follows explicit dismissal intent. A focused typed URL bridge merges pending filter changes until the router commits and handles external history navigation.

All six focused race journeys pass on desktop Chromium, mobile Chromium and WebKit, including Escape/focus restoration and filter reload/back navigation. Existing pure rules and the visual design are unchanged. The focus assertion uses keyboard activation explicitly, since Safari mouse-click focus is platform-defined.

## Supported email punctuation correction

Negative unit regressions first reproduced `alex<smith>@example.com` and `alex,smith@example.com` being accepted. The existing email shape now applies a supported unquoted character guard; it does not perform DNS or deliverability checks. Trim behavior, raw length limits, international names and simulation acknowledgement are unchanged, and plus/dot and apostrophe addresses remain accepted.

The focused regressions pass after the predicate correction. All 54 unit tests, all 36 existing browser journeys, lint, formatting, strict TypeScript and the production build passed locally. No UI, styling, fields, stores, pricing, assets, dependencies or workflow configuration changed.
