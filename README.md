# Useful Math Tools

Useful Math Tools is a static public website of clear calculators for everyday problems. It contains 23 calculators across dates, percentages, everyday math, money, conversions, and home projects.

The production site uses HTML, CSS, and browser-native JavaScript modules. It has no runtime dependencies, database, account system, or required build step. Calculation engines are separate from DOM handling so they can be tested directly.

## Local use

From this directory, run:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. A local server is required because browsers apply module restrictions to `file://` pages.

## Testing

Run the calculation suite with:

```sh
npm test
```

`TEST_CASES.md` contains a separate manual launch checklist with human-verifiable scenarios.

## Project structure

- `index.html`: homepage and client-side calculator filter
- category directories: crawlable category hubs and calculator pages
- `assets/css/site.css`: shared responsive visual system and print rules
- `assets/js/engines.js`: pure calculation functions
- `assets/js/holidays.js`: holiday calendars and special working-day rules
- `assets/js/calculators.js`: calculator form and result behavior
- `assets/js/registry.js`: centralized calculator names, URLs, descriptions, search terms, relationships, and shareable fields
- `assets/js/storage.js`: guarded browser-local favorites, recent tools, history, and settings
- `assets/js/url-state.js`: allowlisted query-string encoding and form restoration
- `assets/js/site.js`: navigation, search, year, and copy behavior
- `scripts/generate-pages.mjs`: source definitions and static-page generator
- `tests/`: Node built-in test suite
- `sitemap.xml`, `robots.txt`, icons, and manifest: launch assets

## Adding a calculator

1. Add pure mathematical logic to `assets/js/engines.js` and tests under `tests/`.
2. Add its public metadata, search synonyms, relationships, and shareable field allowlist to `assets/js/registry.js`.
3. Add the calculator definition, static copy, form, and metadata to `scripts/generate-pages.mjs`.
4. Add the DOM handler in `assets/js/calculators.js`.
5. Run `npm run generate` to write the public HTML.
6. Add the canonical URL to `sitemap.xml` and engine tests under `tests/`.
7. Check category, homepage search, breadcrumbs, related links, mobile layout, validation, copy behavior, URL restoration, and at least one known result.

Generated HTML is committed and deployed directly. Generation is a development convenience, not a production build requirement.

## Browser-local features

Favorites, recently used calculators, calculation history, and the history preference use browser `localStorage`. They require no account and fail without affecting calculator operation when storage is unavailable.

The namespaced keys are:

- `umt:favorites`: calculator IDs only
- `umt:recentTools`: up to eight unique calculator IDs
- `umt:calculationHistory`: up to 25 concise entries containing calculator ID, timestamp, summary, and optional calculation URL
- `umt:settings`: local preferences such as whether calculation history is enabled

Visitors can clear history from `/history/` and clear all four keys from `/privacy/`. These controls do not touch unrelated browser storage.

## Shareable calculation URLs

Each registry entry declares an allowlist in `shareFields`. After a valid calculation, the calculator controller serializes only those ordinary form values when the visitor selects **Copy calculation link** or **Share result**. Opening the URL restores validated values and runs the calculation. Invalid, unknown, or excessive values are ignored.

Canonical tags remain the clean calculator URLs, and parameterized URLs are not included in `sitemap.xml`.

## Examples and related tools

Clickable examples are defined by calculator type in `assets/js/calculators.js` and exposed by the page generator only where they add practical value. An example restores known input values and submits the real form, so it follows the same validation, recent-tool, and history behavior as a user-entered calculation.

Related-tool IDs live in `assets/js/registry.js`. The static generator resolves those IDs into ordinary crawlable links on each calculator page.

## Current calculators

The original 18 calculators remain available. This enhancement added:

- Area Converter
- Volume Converter
- Speed Converter
- Sales Tax Calculator
- Markup & Margin Calculator

## Cloudflare Pages deployment

- Framework preset: None
- Build command: `exit 0`
- Build output directory: `.`
- Production branch: `main`

The target custom domain is `usefulmathtools.com`. Connect the GitHub repository to Cloudflare Pages, deploy the repository root, then add the domain in the Pages project.

## Google Search Console

After the domain is live:

1. Add `usefulmathtools.com` as a Domain property.
2. Verify ownership with the DNS record supplied by Search Console through Cloudflare DNS.
3. Submit `https://usefulmathtools.com/sitemap.xml`.
4. Inspect the homepage and key calculator URLs to confirm indexing and rendered output.

No verification token is included in the repository.
## Flagship money calculators

The Take-Home Pay Estimator uses year-specific data in `assets/js/tax/federal/2026.js`, Publication 15-T Worksheet 1A logic in `withholding.js`, and a separate YTD-aware FICA module. See `TAX_DATA.md` for sources, assumptions, unsupported cases, and the tax-year update checklist. A future state module should be added beside the federal module and combined only in the payroll orchestrator.

The Household Budget Calculator normalizes every row through shared annual/monthly conversion functions. Expense rows carry category and need/want/savings-or-debt metadata; custom rows use the same model. Detailed values are stored only after the user enables saving, under `umt:householdBudget`. The versioned model can later be wrapped in multiple named scenarios.
