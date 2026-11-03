# Preserve rapid interaction intent

Two deterministic Chromium regressions fail before changes: a delayed native close event dismisses a newly reopened menu, and same-turn capacity/amenity/sort changes discard earlier URL values. The same failure classes were independently reproduced in other portfolio applications.

Scope: controlled Modal event ownership; room-filter URL bridge; their browser regressions. No visual redesign, domain/filter rules, fixture, price or persistence changes and no dependencies.

1. Make modal dismissal follow explicit user intent (cancel/button/backdrop), not a delayed passive native close notification. Retain native focus restoration and Escape behavior.
2. Extract a focused typed room-filter hook. Merge pending changes until the router commits, clear the pending bridge for external history navigation, and continue deriving displayed filters from the URL.
3. Verify failures become passing on Chromium/mobile/WebKit, back/reload behavior remains intact, and full CI passes before merge.

## Verified result

Both original failures were reproduced before editing. The modal correction passed independently before extracting the URL bridge. All six cross-engine race cases now pass, together with existing 50 unit tests, lint, strict typing, formatting and build. Filter coverage includes rapid changes, reload and history-back recovery. No CSS or dependency changes.
