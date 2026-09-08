# IndoThai website

Static Astro + TypeScript + Tailwind CSS v4 migration of the [IndoThai staging
website](https://staging-e356-indothaiweb.wpcomstaging.com/).

## Status

The following routes are implemented and linked locally:

`/`, `/about-us/`, `/mutual-funds/`, `/downloads/`, `/careers/`,
`/careers/job/`, `/close-account/`, `/procedure-of-closing-account/`,
`/raise-a-ticket/`, `/investors/overview/`,
`/investors/shareholder-relation/`, `/investors/financial-reports/`,
`/investors/disclosures-under-regulation-46/`, `/investors/client-relation/`,
`/investors/corporate-presentation/`, `/blog/`, and `/blog/post/`.

Other navigation still points to staging. The site is static and has not been
deployed. Preview builds use `noindex, nofollow`.

See [DESIGN.md](DESIGN.md) for visual decisions and
[VERIFICATION.md](VERIFICATION.md) for completed checks and known limitations.

## Development

Use Node `24.14.1` and npm 11.

```sh
nvm install
nvm use
npm ci
npm run dev
```

Open the URL printed by Astro, normally `http://127.0.0.1:4321`.

| Command                     | Purpose                                            |
| --------------------------- | -------------------------------------------------- |
| `npm run dev`               | Start the development server.                      |
| `npm run check`             | Run Astro and TypeScript diagnostics.              |
| `npm run format`            | Format source and documentation.                   |
| `npm run format:check`      | Check formatting without editing.                  |
| `npm test`                  | Build and run static-output tests.                 |
| `npm run build`             | Generate the static site in `dist/`.               |
| `npm run preview`           | Serve the existing build locally.                  |
| `npm run test:browser`      | Run mocked Chromium tests.                         |
| `npm run test:dev`          | Test development-server images and layouts.        |
| `npm run capture:local`     | Capture local comparison screenshots.              |
| `npm run capture:reference` | Capture staging screenshots; needs network access. |

Install Chromium before browser tests:

```sh
npx playwright install chromium
```

Run the full verification set after application changes:

```sh
npm run format:check
npm run check
npm test
npm run test:browser
npm run test:dev
```

Keep `package-lock.json` committed. Builds do not require Strapi, WordPress,
environment variables, agent tools, or external accounts.

## Strapi configuration

Browser-only CMS reads and submissions use the optional public base URL:

```dotenv
PUBLIC_STRAPI_URL=http://localhost:1337
```

Copy `.env.example` to `.env.local`, set the URL, and restart Astro. Missing
configuration or JavaScript leaves CMS-backed controls unavailable while
contact links remain usable. Builds never call Strapi.

The website sends no tokens or cookies and does not change Strapi. Production
requires an approved HTTPS origin, restricted CORS, least-privilege public
permissions, server-side validation, abuse controls, privacy review, and
retention rules.

| Feature       | Endpoint(s)                                                                                                                                                            | Browser behavior                                                                      |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Contact       | `POST /api/contact-forms`                                                                                                                                              | Four fields: `name`, `contact_no`, `email`, `message`.                                |
| Close Account | `POST /api/close-account-requests`                                                                                                                                     | Four required fields; creates a request, not confirmation of closure.                 |
| Raise Ticket  | `POST /api/complaints` and optional `POST /api/private-upload`                                                                                                         | Seven complaint fields and one optional attachment.                                   |
| Downloads     | `GET /api/software-categories`, `GET /api/softwares`                                                                                                                   | Fetches all pages, then filters locally.                                              |
| Careers       | `GET /api/openings`, `POST /api/private-upload`, `POST /api/candidates`                                                                                                | Shows Open, Closed and Filled jobs; only Open jobs accept PDF applications.           |
| Blog          | `GET /api/blogs` and one public document read                                                                                                                          | Lists published posts and renders sanitized Markdown.                                 |
| Investors     | `GET /api/overviews`, `/api/shareholder-relation-categories`, `/api/shareholder-relations`, `/api/financial-reports`, `/api/disclosure-2015s`, `/api/client-relations` | Loads published records in the browser and exposes only safe HTTP(S) files and links. |

Downloads, Careers, Blog and Investor records are absent from initial HTML.
They require published Strapi records and public read access. Private resumes
and complaint attachments use the private-upload flow; the website never
deletes failed or abandoned uploads. Live submission tests require separate
owner approval and synthetic data.

Shareholder Relation selects the first alphabetical document category after
loading. It intentionally does not provide an All Categories option and requests
documents from Strapi only when their category is selected.

## Project structure

```text
src/
├── assets/                  Local images, artwork and documents
├── components/              Named page sections and shared UI
├── data/                    Typed content, navigation and CMS reads
├── layouts/BaseLayout.astro Document shell, SEO, header and footer
├── pages/                   Static route entry points
└── styles/                  tokens.css, global.css and content.css
public/                      Fonts and favicon
scripts/                     Capture helpers
tests/                       Static and browser tests
```

Important files:

- `src/data/site.ts` — company information, destinations and shared metadata.
- `src/data/nav.ts` — primary, utility, legal and venture navigation.
- `src/data/home.ts`, `about.ts`, `mutual-funds.ts`, `apps.ts` — repeated page content.
- `src/data/openings.ts`, `blogs.ts`, `investors.ts` — typed browser CMS reads.
- `src/styles/tokens.css` — the single source of truth for shared design values.
- `src/components/shared/` — layout, SEO, contact and store-badge components.

Each route composes named sections. Keep CMS flows explicit and local to their
page components; do not add a generic CMS layer, server adapter, UI kit, React,
state-management library, or new backend integration without approval.

## Maintenance

- Edit repeated marketing content in the relevant `src/data/` file.
- Edit navigation and external destinations in `src/data/nav.ts` and `site.ts`.
- Edit layout or page-specific behavior in the named component under `src/components/`.
- Change typography, spacing, colors, breakpoints, shadows and motion in `tokens.css`.
- Replace local images under `src/assets/images/` and keep alt text and dimensions accurate.
- Replace `src/assets/docs/corporate-presentation_.pdf` to update the static presentation.
- Keep browser validation, timeout, safe-URL, sanitization and no-JavaScript fallbacks intact.

The full-resolution account-closing flowchart and its accessible transcript must
be updated together. About Us timeline artwork and text equivalents must also
remain synchronized. Intentional source-copy, destination and artwork anomalies
remain pending owner/editorial approval; do not silently correct them.

## Release checklist

- [ ] Approve visual fidelity, content, links, imagery and regulatory copy.
- [ ] Configure and verify production Strapi origin, CORS, permissions and private storage.
- [ ] Complete privacy, retention, abuse, malware and orphan-upload controls.
- [ ] Complete accessibility/compliance review, including screen readers, zoom and reflow.
- [ ] Approve production domain, canonical URLs, social image, redirects, sitemap and robots policy.
- [ ] Select hosting and document deployment, rollback, caching and asset behavior.
- [ ] Run the full verification commands and inspect representative desktop and mobile pages.

Deployment is a separate approval step. Publishing `dist/` requires no running
Astro server, but production indexing must not be enabled until the origin and
WordPress routing are approved.
