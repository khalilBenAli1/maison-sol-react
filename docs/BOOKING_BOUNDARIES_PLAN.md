# Bounded booking separation

User architecture addendum approved 2026-11-03. Preserve the approved appearance, wording, interaction, privacy and confirmation behavior.

## Smell and scope

Boundary violation: `src/pages/Booking.tsx` combines route composition, form orchestration, step markup and summary markup. Pricing/date validation and storage are already pure/separate and will remain untouched. Do not add a store or dependencies.

Allowed scope: the booking route, booking feature components/hook, existing confirmation component, contact validation/tests (relocate into domain), and directly relevant architecture/verification docs. No room, date, money, persistence, other route or styling rewrites.

## Behavior lock before editing

Run existing 50 unit tests and critical Chromium booking/calendar/departure regression journeys. They cover date errors, reload recovery, keyboard flow, exact totals, contact privacy, preference reset and immutable confirmation. Keep the same tests; do not relax assertions.

## Ordered pass

1. Extract only presentation responsibilities into `features/booking`: dates step, room selection step, guest details step, review step, stay summary and the existing confirmation. Keep their existing semantic DOM/classes/copy and local focus refs.
2. Move feature-local orchestration into typed `useBookingFlow`: step/contact/error/confirmation state, transition guards and derived room/availability/totals. Reuse existing pure domain functions and preferences adapter; keep contact data only in this mounted feature.
3. Make the route compose the heading, step navigation and focused components. Move existing pure contact validation from app to domain without changing its rules/tests.
4. Document ownership and data flow. Run lint/format/strict typing, all unit/browser tests, production build and compare fixed-clock screenshots with the approved baseline. Commit/push one coherent verified change, PR review/CI, then merge and verify public booking.

No speculative wrappers, duplicate totals, global transient state, new dependencies or unrelated cleanup. A regression or visual mismatch must be fixed before release.

## Independent plan review

Plan passed. Keep DOM heading focus in the route and invalid-contact focus/form ref in the details step. Use narrow typed actions and a `0 | 1 | 2 | 3` step type, retaining one derived totals calculation. Add a review-edit-remount browser regression before extraction; keep contact across steps but clear it on route remount.

## Implementation record

The pre-change lock passed: all 50 unit tests, existing booking/calendar/departure journeys and the new review-edit-remount test (desktop and mobile). The pass extracts four step views, summary and confirmation; orchestration uses typed `BookingStep` actions, existing pure rules and one derived totals value. DOM focus stays with route/details UI. No CSS, date/money/persistence rules or dependencies changed.

## Completion evidence

All 50 unit and 27 browser tests pass. Independent post-change review passed with no findings. Desktop/mobile fixed-clock images are pixel-identical to their pre-refactor baselines. Lint, strict typing, formatting and production build pass.
