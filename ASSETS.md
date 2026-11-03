# Asset provenance

Maison Sol is an original fictional-brand portfolio/demo application. The property, rooms, rates, and amenities are illustrative, not claims about a real hotel. No private client assets, real guest records, or L’OR artwork are included.

## Photography

All photographs were created with the built-in OpenAI ImageGen tool for this portfolio. They depict fictional architecture and rooms. Exact production prompts are preserved in [docs/image-prompts.json](docs/image-prompts.json). No external image host is required at runtime.

- `public/images/hotel-hero.webp` and `hotel-hero-small.webp`: approved original Mediterranean hotel/pool photograph generated for the portfolio on 2026-11-01; reused from the user's supplied reference assets, not a photograph copied from a hotel's website.
- `public/images/olive-room.webp` and `olive-room-small.webp`: generated 2026-11-03, ivory bedroom with olive-tree courtyard.
- `public/images/terrace-suite.webp` and `terrace-suite-small.webp`: generated 2026-11-03, limestone bedroom opening onto a sea-facing terrace.
- `public/images/garden-studio.webp` and `garden-studio-small.webp`: generated 2026-11-03, garden studio with separate daybed and breakfast table.
- `public/images/sol-residence.webp` and `sol-residence-small.webp`: generated 2026-11-03, spacious villa living/dining area with two bedroom doorways and courtyard plunge pool.

The four room images were generated in four separate built-in tool calls. Generated PNG masters remain outside the repository. Sharp 0.35.5 was used only for proportional resizing and WebP encoding at quality 80; no compositing or semantic image changes were made. Hero variants are 1600×900 and 800×450. Room variants are 1200×800 and 640×427. The ten shipped images total 987,480 bytes (approximately 964 KiB).

These generated illustrative assets are separate from the MIT code license. Their provenance does not imply a photographer credit, real location, real property ownership, or a warranty of unique copyright rights. Keep the fictional/demo scope clear when reusing them.

## Fonts

Fonts are bundled locally through exact locked npm dependencies, with no Google Fonts network request:

- [Cormorant Garamond](https://fontsource.org/fonts/cormorant-garamond), `@fontsource/cormorant-garamond` 5.3.0, SIL Open Font License 1.1 (OFL-1.1).
- [DM Sans](https://fontsource.org/fonts/dm-sans), `@fontsource/dm-sans` 5.3.0, SIL Open Font License 1.1 (OFL-1.1).

Each installed Fontsource package contains its `LICENSE` notice. Font files retain their original licenses; the application's MIT license does not replace the OFL. Prefer only the Latin subsets and weights actually used by the UI.
