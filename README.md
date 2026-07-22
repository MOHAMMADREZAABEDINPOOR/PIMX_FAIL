# PIMXFAIL

PIMXFAIL is an English-only database of failed companies and startup post-mortems. It combines a searchable React interface, public-source research metadata, repeatable data-quality checks, and an optional AI failure diagnostic.

## Features

- 1,691 unique English startup and company-failure records
- Search and filters for company, founder, industry, country, and failure reason
- Detailed post-mortems, lessons, risk metrics, and public research links
- Honest disclosure labels when a fact is not publicly documented
- English-only public interface, admin console, routes, and AI output
- Dark and light themes
- Local bookmarks
- Operational visit dashboard

## Technology

- React 19
- TypeScript
- Vite 6
- Tailwind CSS 4
- Express
- Google GenAI SDK

## Local development

```bash
npm install
npm run dev
```

The application runs at `http://localhost:3000`.

## Validation

```bash
npm run audit-data
npm run lint
npm run build
```

## Data workflow

The canonical runtime catalog is `src/startups.json`. Supporting research is stored in `src/startup_research.json` and `src/startup_wikipedia.json`.

```bash
npm run research-prepare
# Fetch the generated Wikidata queries, then merge the results:
node scripts/researchStartups.cjs merge
node scripts/buildStartupCatalog.cjs
node scripts/auditStartups.cjs src/startups.json
```

The research scripts use public Wikidata and English Wikipedia records. When no reliable public value can be found, the catalog states that directly instead of inventing a value.

## Deployment

For a Node deployment:

- Build command: `npm run build`
- Start command: `npm start`
- Recommended Node version: 20 or newer

For static hosting, the full startup catalog is bundled into the client as a fallback. Server-backed AI diagnostics and visit persistence require the Express server or equivalent API routes.
