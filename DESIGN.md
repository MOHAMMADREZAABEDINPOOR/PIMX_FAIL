# PIMXFAIL redesign

The application uses a warm paper background, charcoal surfaces, acid green accents, and an architectural Three.js scene that reacts to pointer movement. Case pages distinguish reported events from editorial lessons. The interface stays in English to match the existing catalog.

## Local preview

```sh
npm ci
npm run dev
```

Open http://localhost:3000. The Node server is required for `/api/analyze` and the existing admin analytics. On a static host, the catalog remains usable, and unavailable analysis requests show an error.

## Checks

```sh
npm run lint
npm run build
npm run audit-data
npm run test:ui
```

Browser tests use an installed Google Chrome through Playwright and cover desktop and mobile views, search and filters, bookmarks, direct case URLs, research drafts, analysis errors, themes, blueprints, reduced motion, and the WebGL fallback. Update the browser channel in `playwright.config.ts` if Chrome is not installed.

## Content and storage

- Counts are computed from `src/startups.json`. A linked source does not imply a fully verified record.
- Four featured summaries (WeWork, Theranos, Quibi, and Juicero) have source-backed corrections. `node scripts/reviewFeatured.cjs` reapplies those corrections. Other records are explicitly identified as existing, independently unreviewed catalog entries.
- Funding is reported financing, not investor losses. WeWork's 2023 bankruptcy is distinguished from its 2024 emergence. The catalog's numerical risk scores are not displayed.
- Bookmarks and theme settings retain their existing storage keys. New research drafts use `pimxfail_research_drafts`; drafts do not enter the public archive. Existing custom-case storage is not overwritten.
- The analysis endpoint returns generic questions with `simulated: true` when a provider is unavailable, without fabricated scores or company findings.
- The Three.js module loads separately. Rendering pauses offscreen and in hidden tabs. Reduced-motion users get a still model; unavailable WebGL gets a CSS illustration.

Public sources are linked on each featured case page. The structural data audit validates completeness and IDs; it does not fact-check historical claims.
