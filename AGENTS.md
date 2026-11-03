# Maison Sol

Original fictional hotel portfolio app. Keep this repository independent of the parent workspace.

- Node 22.23.1, npm 10.9.8. Install with `npm ci`.
- Commands: `npm run dev`, `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm test`, `npm run test:e2e`, `npm run build`, `npm run preview`.
- `src/domain`: pure date/money/filter rules. `src/data`: typed fixtures. `src/state`: resilient versioned local preferences. `src/components` and `src/pages`: semantic UI.
- Never persist guest contact information; never imply a real reservation/payment.
- Keep URL filter and hash route behavior compatible with GitHub Pages subpaths.
- Add meaningful regression tests when changing calculations, validation, storage or the booking journey.
- Commit verified milestones using intent-first Lore subjects and useful native trailers. Verify remote checks after pushing.
- Preserve collaborators' changes. Never copy private client sources or credentials.
