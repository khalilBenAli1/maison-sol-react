# Maison Sol implementation plan

Started 2026-11-03. An original fictional hotel frontend, using the approved ivory/teal photographic direction. No real hotel, payment, or reservation service.

## Delivery milestones

1. Foundation: independent repository, strict TypeScript, React Router, Vite, CSS tokens, locally bundled fonts, CI and documented commands. Commit and push a passing build.
2. Room discovery: responsive editorial homepage, distinct room fixtures, URL-based capacity/price/amenity filters and sort, saved rooms, detail routes and accessible gallery. Verify direct navigation and empty results. Commit/push.
3. Booking: date-only calendar with disabled dates and valid range selection, room availability, contact/review/confirmation, integer-money totals, recoverable versioned draft and reset. Test deterministic date, filter, persistence and booking behavior. Commit/push.
4. Hardening: browser journeys, keyboard and accessibility checks, actual desktop/mobile screenshots, production reflow and payload review, documentation and provenance. Open a PR, verify CI, merge preserving history.
5. Publish: GitHub Pages Actions deployment with correct repository base and direct-link behavior, verify deployed routes/assets/core flow, publish repository homepage and final evidence.

## Boundaries and decisions

- React + React Router + Vite is intentionally a client-only static demo. Native state and typed local adapters are sufficient; no API key/backend needed.
- Use hash-based routes for reliable direct links on static GitHub Pages without an HTTP rewrite service. Unknown application routes get a deliberate not-found screen.
- Show simulated booking information before contact submission. Never collect card details or transmit contact records.
- Persist stay preferences and saved room identifiers only. Contact details remain in memory and are excluded from storage.
- Date-only strings use UTC arithmetic for differences; the injected clock supplies a local calendar date. Currency values are integer euro cents.
- Respect reduced motion, keyboard focus, semantic labels and real button/link behavior.
- Reference screenshots guide composition; actual site images are independent assets. Do not embed UI screenshots as the app.

## Acceptance evidence

- Room filters survive URL reload; unavailable combinations show a resettable empty state.
- Saved rooms and non-sensitive booking draft survive reload; corrupted/blocked storage recovers safely.
- Date math handles DST, leap years, month boundaries, invalid dates, unavailable nights and invalid ranges.
- Booking completes on desktop/mobile, validates errors, calculates exact sample totals, and shows a local confirmation.
- Gallery and menu support keyboard/Escape/focus restoration. Primary flow works without a pointer.
- Lint, formatting, strict typecheck, domain tests, browser journeys and build pass locally and on GitHub.
- Screenshots at 390, 768 and 1440 pixels; no horizontal overflow. Record actual payloads, not invented performance scores.

## Completed evidence

All five milestones completed on 2026-11-03. See `docs/VERIFICATION.md` for checks, live browser verification and deployment provenance. Meaningful implementation history was preserved through a merge PR.
