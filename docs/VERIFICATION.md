# Verification

Verified 2026-11-03 with Node 22.23.1 and npm 10.9.8.

- Strict TypeScript, ESLint and Prettier checks passed.
- **50 unit tests** passed: date validity/DST/leap/month boundaries, occupied nights and checkout boundaries, integer money/rounding, URL filters/saved rooms, malformed/denied storage, contact validation and sensitive-field stripping.
- **24 Playwright tests** passed: eight journeys on desktop Chromium, mobile Chromium and WebKit. Includes the complete booking, date/contact errors, draft recovery, exact €810 sample total, preferences reset after confirmation, editing only departure, filter persistence, saved/reset/empty states, gallery/menu keyboard focus and month-boundary navigation.
- Axe scans of home, collection, room detail and booking returned no findings for the tested A/AA rules. Manual automated-browser keyboard interactions exercised Enter, Space, Escape, arrows, focus restoration and step focus.
- All main routes reflowed without horizontal overflow at 390, 768 and 1440 CSS pixels. Reduced-motion output was inspected.
- Actual production screenshots are in `docs/screenshots`. Run `node scripts/capture-screenshots.mjs` with the preview running to reproduce them. Its capture report records browser errors, overflow and failed images.
- Production build passes; lazy route bundles are separate. The main bundle is approximately 235 kB uncompressed / 74 kB gzip; shared routing chunk 48 kB / 17 kB; CSS 40 kB / 8.5 kB. Full and small WebP image variants total 987,480 bytes across all rooms/hero. These are build measurements, not invented Lighthouse scores.

GitHub CI and live deployment evidence will be appended after their runs complete.
