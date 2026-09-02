# IndoThai website

A static Astro migration of [IndoThai’s staging website](https://staging-e356-indothaiweb.wpcomstaging.com/), using TypeScript and Tailwind CSS v4.

## Status and scope

The **homepage (`/`) is implemented**. About Us and Mutual Funds are pending; their links, and all other unbuilt pages, still point to staging. This workspace has not been deployed.

The homepage includes the header and nested navigation, hero, nine services, About introduction, final statistics, account-opening steps, both apps, six testimonials, contact preview, and regulatory/company footer. Shared layout, SEO, navigation data, and design tokens are ready for the next two pages.

The five requirements remain the design constraints: human maintainability without AI; familiar pages/layouts/components/data/styles structure; simple static builds and deployment; one shared design-token source; and sound technical SEO. No React, UI kit, CMS, server adapter or carousel package is required. Playwright and the HTML parser are development-only test dependencies.

The previous project, `/home/mrrobot/Projects/itsl-website`, was used read-only for structural reference and byte-verified matching assets. It is not a runtime dependency or the authoritative design.

## Local development

Use Node **24.14.1** (pinned in `.nvmrc`) and npm 11. With nvm installed:

```sh
nvm install
nvm use
npm ci
npm run dev
```

Open the URL printed by Astro (normally `http://127.0.0.1:4321`; another free port is chosen if occupied). Without nvm, install the pinned Node version using your normal Node manager.

| Command                     | Purpose                                                                           |
| --------------------------- | --------------------------------------------------------------------------------- |
| `npm run dev`               | Local development with reloads.                                                   |
| `npm run check`             | Astro and TypeScript diagnostics, including test code.                            |
| `npm run format`            | Format source and documentation.                                                  |
| `npm run format:check`      | Check formatting without changing files.                                          |
| `npm test`                  | Build and check the generated HTML, metadata, content, assets and safety rules.   |
| `npm run build`             | Generate the static site in `dist/`.                                              |
| `npm run preview`           | Serve an existing build locally; not a production server.                         |
| `npm run test:browser`      | Build and run Chromium responsive/interaction tests.                              |
| `npm run test:dev`          | Check every image and responsive layout against a fresh Astro development server. |
| `npm run capture:local`     | Build and capture every section at the comparison widths.                         |
| `npm run capture:reference` | Optional live staging screenshots; requires network access.                       |

Before the first browser test, run `npx playwright install chromium`. On a Linux machine missing browser system libraries, follow Playwright’s OS dependency instructions. Browser testing is optional for simply starting the site; it is part of change verification.

Astro may start a background process in an agent environment. Inspect or stop **this project’s** process with `npm run dev -- status` and `npm run dev -- stop`; equivalent preview subcommands exist. The browser suite uses Astro’s public preview API in the foreground, independent of AI tooling.

Keep `package-lock.json` in version control and use `npm ci` for reproducible installations. No environment variables, WordPress connection, agent tools, or accounts are needed to build. Dependency installation and the optional reference capture require network access; normal builds use local files only.

### If development images disappear

Development transforms images through `/_image/`; the static build serves already
optimized files. `astro.config.mjs` explicitly externalizes the native `sharp`
module so Vite does not transform it, including after configuration reloads.
Removing that setting reproduced HTTP 500 image failures in the local dev server
after reloads, despite Sharp being installed and the static build passing.
If image requests return HTTP 500, inspect the dev-server output.
For `MissingSharp`, first check `npm ls sharp` and
`node --input-type=module -e 'await import("sharp")'`. If Sharp loads in a fresh
Node process, fully stop and restart the development server, then reload the page.
Hot reload is not always enough to recover a stale server. If the import fails,
use the pinned Node version and restore dependencies with `npm ci` before restarting.
Do not disable image optimization to hide this failure.

Run `npm run test:dev` as well as `npm run test:browser`: these verify different
image-serving paths. The dev check uses an isolated server on port 4327 and leaves
your normal preview alone. Background-server status can be unreliable across
process-isolated agent sessions; verify the exact process/project before stopping
anything, or stop the server in the terminal where you started it.

## Structure

```text
src/
├── assets/images/             Original local artwork, icons and portraits
├── components/
│   ├── home/                  Named homepage sections
│   ├── shared/                Header, Footer and SEO
│   └── ui/                    Shared ActionLink primitive
├── data/
│   ├── site.ts                Company details, destinations and home metadata
│   ├── nav.ts                 Primary, utility, legal and venture navigation
│   └── home.ts                Typed services, statistics, steps, apps and testimonials
├── layouts/BaseLayout.astro   Document shell, fonts, header, footer and SEO
├── pages/index.astro          Homepage composition only
├── scripts/carousel.ts        Progressive carousel interaction
└── styles/
    ├── tokens.css             Sole shared design-value owner
    └── global.css             Imports, font faces, base styles and shared actions
public/
├── fonts/                     Local variable WOFF2 fonts
└── favicon.png
scripts/                       Browser preview and screenshot helpers
tests/
├── static-output.test.mjs     Generated HTML assertions
└── browser/home.spec.ts       Responsive and behavior checks
DESIGN.md                      Reference-led design guidance, not duplicate tokens
AGENTS.md                      Coding-agent rules
astro.config.mjs               Static output and Tailwind Vite integration
```

The future About Us and Mutual Funds route/data files do **not** exist yet. Add them when those pages are approved for implementation; do not create placeholder routes.

## Maintenance

- **Repeated content:** edit `src/data/home.ts`. Keep the arrays typed and the six original testimonials intact.
- **One-off content and order:** edit the named component in `src/components/home/`; reorder imports/components in `src/pages/index.astro`.
- **Company information and destinations:** edit `src/data/site.ts`. Avoid repeated literal URLs in components. `nav.ts` controls navigation labels and grouping.
- **Images:** replace/import files in `src/assets/images/`, keeping accurate alt text, intrinsic dimensions and responsive `sizes`. Astro generates optimized images at build time. Decorative icons/backgrounds do not need descriptive alt text.
- **Typography and design:** change `src/styles/tokens.css`. It owns families, sizes, weights, line heights, colors, spacing, widths, borders, shadows and motion. `@theme` supplies Tailwind utilities; responsive custom properties live in the same file. Component CSS consumes tokens for special geometry. See `DESIGN.md`.
- **Section spacing and header buttons:** the responsive `--space-section` token drives the gap between homepage sections in `#main-content`. Avoid adding another outer margin to individual sections. Dedicated `--header-action-*` tokens control the compact account/IPO buttons without shrinking other calls to action.
- **Page metadata:** `homeMeta` in `site.ts` feeds `BaseLayout.astro` and shared `SEO.astro`. Later pages should pass their own title and description.
- **Browser behavior:** navigation enhancement lives with Header; carousel logic is in `src/scripts/carousel.ts`. Keep the default HTML useful without JavaScript.

The browser receives compiled CSS, not the Tailwind CDN/runtime. See the [official Tailwind Astro integration](https://tailwindcss.com/docs/installation/framework-guides/astro).

Scoped component media queries reference the canonical breakpoint tokens through
Tailwind `@reference` and `theme()`. Do not copy numeric breakpoints into component
CSS. Keep responsive image `sizes` descriptions aligned with the resulting layout.

### Assets and reference provenance

The local logo, Capital Tower photograph, statistical icons, app screenshots, contact illustration and six portraits were compared byte-for-byte with staging before reusing matching previous-project assets. The graph-paper hero, account backgrounds and store badges came from staging. Service icons were extracted from the homepage’s embedded original PNGs. Raleway and Inter provide the measured heading/body typography; Roboto preserves the reference’s small actions/footer. All font files are local variable fonts.

Source image filenames include `banner-bg.png`, `galleryb1-1-1.png`, `winstock-1.png`, `winvest.png`, `get-tuch.png`, and `Group-1399-1.png` under staging’s `wp-content/uploads/`. The existing brand imagery and customer portraits remain subject to IndoThai’s publication approval. No new promotional claims or invented testimonials were added.

## Interaction and safety rules

Navigation uses native disclosures, enhanced with Escape, outside-click dismissal, focus restoration and expanded state. Closed menus do not expose their links to keyboard navigation.

Testimonials are scrollable HTML containing all six quotes. JavaScript adds previous/next and pause/resume controls. Autoplay uses the token-owned five-second interval, pauses on hover/focus/manual interaction, and is suspended offscreen or when the document is hidden. Reduced motion disables automatic rotation. Manual controls still work.

**Contact is preview-only.** Its labeled fields have no form owner or field names, and the Submit button is disabled. No form handler, network submission, persistence, success message or URL serialization exists. Phone and email links remain usable. Do not enable submission until a service and privacy/spam controls are approved.

The floating accessibility toolbar is **deferred to pre-release compliance review**. Its omission is not a claim that a toolbar is unnecessary or that this page meets every regulatory requirement. Semantic HTML, focus visibility, keyboard controls, reduced-motion support and responsive content remain part of this build.

## Source anomalies to review

Preserved intentionally, not endorsed as correct:

- WINSTOCK’s paragraph contains the truncated fragment “ard and Aadhaar card ready”.
- WINVEST’s Google Play badge points to the same app ID as WINSTOCK.
- The source says “What our clients says”, “Filing compliant”, “desiganted”, uses “Aadhar”, omits a space in “experience.As”, and retains a 2024 copyright.
- Source mobile navigation uses a different Fund Transfer host and MF Back Office destination from desktop. Destinations are recorded separately in site data; do not merge them without approval.
- SCORES displays an old URL label but links to the current source destination; Femto’s approved source link uses HTTP.
- Source mobile and desktop footer copies differ, including contact numbers, capitalization, legal links and hidden regulatory notices. This build uses the complete desktop company/regulatory copy at every width rather than hiding disclosures on phones.
- The source has slight phone overflow and cramped tablet statistics. The owner approved aligned statistic cards, quote-first testimonials with compact controls, and clearer menu/chevron icons. These are intentional departures from the source, documented in `DESIGN.md`; wording, figures and destinations remain unchanged.

Content or destination corrections need the website owner’s approval, especially financial/regulatory wording.

## SEO and deployment status

The generated page includes one meaningful H1, logical section headings, a title, description, social text metadata, image alternatives, and explicit **`noindex, nofollow`**. It deliberately has no production canonical, `og:url`, sitemap, production robots policy, or domain-dependent structured data. An absolute social sharing image also awaits the approved public origin.

Deployment will consist of publishing `dist/` to a static host. No running Astro/Node application server is required for visitors. No hosting provider or deployment workflow has been selected, and no deployment was performed.

Resolve hosting, production-domain routing alongside WordPress, and the contact submission service before their integrations. Keep preview builds noindex; changing indexing is a deliberate release step, not something `npm run build` silently enables.

## Verification and release checklist

The repository tests check structure, preview SEO, all content groups, local assets, links, contact safety, menu focus, all six testimonials, autoplay/pause, no-JavaScript behavior, reduced motion and overflow. Chromium screenshots are generated at desktop, tablet, phone and narrow-phone widths. Live reference capture is separate from the offline build/test workflow.

See `VERIFICATION.md` for the measured results and remaining limitations of this implementation. Passing a build or browser suite is not deployment readiness, legal approval, a complete accessibility audit, or a guarantee of search ranking.

Before release:

- [ ] Approve visual fidelity across desktop, tablet and phone, including heading wraps and crops.
- [ ] Migrate and verify About Us and Mutual Funds when scheduled.
- [ ] Approve source-copy/link anomalies and verify external service destinations and availability.
- [ ] Choose the contact service; implement and test validation, pending, success and failure states, privacy and spam controls.
- [ ] Complete accessibility/compliance review, including the deferred floating toolbar; test screen readers, contrast, zoom/reflow and supported physical devices.
- [ ] Run formatting, Astro/TypeScript, static-output and browser tests; inspect every section.
- [ ] Approve the production origin, canonical URLs, social image, relevant structured data and WordPress routing/redirect ownership.
- [ ] Coordinate sitemap and robots policy with WordPress; activate and verify production indexing while retaining noindex on previews.
- [ ] Select hosting, document deployment/rollback and verify response status codes, caching, compression and asset paths.
- [ ] Measure performance and Core Web Vitals on representative real devices and the production host.
- [ ] Confirm image/font publication rights, regulatory copy and final counter values.
- [ ] Keep setup and maintenance documentation current and independently usable without AI.
