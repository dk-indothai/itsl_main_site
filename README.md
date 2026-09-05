# IndoThai website

A static Astro migration of [IndoThai’s staging website](https://staging-e356-indothaiweb.wpcomstaging.com/), using TypeScript and Tailwind CSS v4.

## Status and scope

**Home (`/`), About Us (`/about-us/`), Mutual Funds (`/mutual-funds/`), Software Downloads (`/downloads/`), Careers (`/careers/`), job details (`/careers/job/`), Close Account (`/close-account/`), Procedure for Closing an Account (`/procedure-of-closing-account/`), Raise Ticket (`/raise-a-ticket/`), Investor Overview (`/investors/overview/`), Shareholder Relation (`/investors/shareholder-relation/`) and Financial Reports (`/investors/financial-reports/`) are implemented.** Navigation between these twelve static routes is local; all other unbuilt pages still point to staging. This workspace has not been deployed.

The homepage includes the header and nested navigation, hero, nine services, About introduction, final statistics, account-opening steps, both apps, six testimonials, contact form, and regulatory/company footer.

About Us includes the photographic hero, complete company story, six directors, the original responsive milestone artwork with an accessible 11-event transcript, vision, three values, business profile, four group-company links and five gallery images. Mutual Funds includes the hero/artwork, introduction, five investment steps, six benefits, WINVEST promotion, six NRI support cards and the shared contact form. Downloads provides live Strapi categories and software files. Careers lists published openings and provides job details and a PDF application form. Close Account provides a four-field Strapi request form. Procedure for Closing an Account displays the original staging flowchart from a local full-resolution image with an accessible text transcript. Raise Ticket provides the existing complaint fields and an optional supporting attachment. Investor Overview displays sanitized Strapi rich text, Shareholder Relation filters Strapi documents by category, and Financial Reports filters quarterly and full-year files by year. All routes reuse the layout, header, footer, SEO and design tokens.

The five requirements remain the design constraints: human maintainability without AI; familiar pages/layouts/components/data/styles structure; simple static builds and deployment; one shared design-token source; and sound technical SEO. No React, UI kit, CMS SDK, server adapter or carousel package is required. The approved `marked` and DOMPurify dependencies format and sanitize CMS rich text in the browser. Playwright and the HTML parser are development-only test dependencies. Contact, Close Account, Raise Ticket, software, Careers and Investor pages use the owner's existing self-hosted Strapi endpoints; builds remain independent of Strapi.

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
| `npm run test:browser`      | Build and run Chromium tests with mocked submissions and software listings.       |
| `npm run test:dev`          | Check every image and responsive layout against a fresh Astro development server. |
| `npm run capture:local`     | Build and capture every section at the comparison widths.                         |
| `npm run capture:reference` | Optional live staging screenshots; requires network access.                       |

Before the first browser test, run `npx playwright install chromium`. On a Linux machine missing browser system libraries, follow Playwright’s OS dependency instructions. Browser testing is optional for simply starting the site; it is part of change verification.

Capture commands cover the three original marketing routes. Downloads screenshots
are generated by its mocked browser tests, avoiding changes in live CMS data.
To inspect one marketing route, use, for example,
`npm run capture:local -- about-us` or `npm run capture:reference -- mutual-funds`.
Screenshots and measurements are saved in route-named folders under `artifacts/local/`
and `artifacts/reference/`; they are ignored by Git and never deployed. Source
entrance animations can distort full-page captures; review the section captures too.

Astro may start a background process in an agent environment. Inspect or stop **this project’s** process with `npm run dev -- status` and `npm run dev -- stop`; equivalent preview subcommands exist. The browser suite uses Astro’s public preview API in the foreground, independent of AI tooling.

Keep `package-lock.json` in version control and use `npm ci` for reproducible installations. No environment variables, WordPress connection, agent tools, or accounts are needed to build. Dependency installation and the optional reference capture require network access; normal builds use local files only.

### Contact submission setup

Copy `.env.example` to an ignored `.env.local` and set:

```dotenv
PUBLIC_STRAPI_URL=http://localhost:1337
```

This is a public API **base URL**, not a token. Restart development after changing it;
rebuild for deployment. Missing or invalid configuration keeps submission disabled.
Builds never connect to Strapi. No API token, SDK or server adapter is needed.

`src/components/shared/Contact.astro` contains the four fields and their browser
submission handler, shared by Home and Mutual Funds. It sends JSON
`{ "data": { "name", "contact_no", "email", "message" } }` (string values) to
`POST /api/contact-forms`, without authorization headers or cookies.

Name, contact number and a valid email are required; message is optional. Client
validation shows inline errors; server errors use the form's status message. Only
a `201` response with a created Strapi document clears the fields. Errors preserve
entered values; the 20-second timeout and network/unexpected responses say completion
could not be confirmed. There are no automatic retries or leave-page warnings.
Values are never saved to URLs, storage or logs. Without JavaScript, controls remain
disabled and phone/email links work.

**Strapi is not modified by this project.** Existing Public Create access and CORS
must allow submission. No email notifications, backend spam protection or publication
override is added; entries follow the endpoint's existing Draft & Publish behavior.
Client validation and duplicate-click prevention are usability features, not security.
Production needs an approved HTTPS API URL, permission/privacy/retention review and
revocation of the previously shared token. `localhost` works only on the machine
running Strapi.

Browser tests build `dist/` using `http://strapi.test` and mock submissions and listings on
one preview server (port 4325). A page fixture removes the endpoint to test the
disabled client fallback. Run `npm run build` again before a normal preview or
deployment to restore your configured URL. Live smoke tests are separate and use
synthetic data only; never inspect or delete existing enquiries. Results are in
`VERIFICATION.md`.

### Close Account submission setup and maintenance

`/close-account/` reuses `PUBLIC_STRAPI_URL` and keeps its four fields, scoped
styles and browser submission handler together in
`src/components/close-account/CloseAccountForm.astro`. There is no form library,
field registry, server adapter or build-time Strapi request. The Modify Account
menu now links both “Close/Freeze an Account” and “Procedure for Closing an
Account” locally; the external modification destination remains unchanged.

The form sends only `{ "data": { "bo_id", "ucc", "email", "mobile_no" } }`
to `POST /api/close-account-requests`, without authorization headers, cookies or
publication overrides. All four values are required and email uses its semantic
email check. BO ID deliberately has no length, numeric or pattern restriction.
The fieldset begins disabled and is enabled only after the browser submission
guard is installed. Missing configuration or JavaScript leaves the form disabled
while the compliance email and telephone links remain usable.

Submitting creates a request; it is not confirmation that the account is closed.
Only a `201` response with a Strapi document ID clears the fields. Rejected and
uncertain outcomes preserve the values. Timeouts occur after 20 seconds with no
automatic retry; the message advises contacting compliance before resubmitting
when completion cannot be confirmed. BO ID, UCC, email and mobile number are never
placed in URLs, browser storage or logs.

**No Strapi changes are made by the website.** The Public role must permit only
Create for this collection, and CORS must allow the website origin. Do not enable
public Find, Find One, Update or Delete. Production also requires an approved HTTPS
API address, server-side validation, rate limiting and abuse controls, retention
rules, and privacy/security approval. Automated tests mock the endpoint. Never run
a live closure-request test without separate owner approval, and never read existing
requests.

### Account-closing procedure maintenance

`/procedure-of-closing-account/` is fully static and requires no Strapi endpoint
or browser JavaScript. Its route composes
`src/components/closing-procedure/ClosingProcedure.astro`, which displays the exact
staging flowchart from `src/assets/images/account-closing.jpg`. The checked-in file
is the 2366×3612 original rather than the previous project's 197×300 derivative.
Astro generates responsive versions and the layout retains the staging page's
centered 671px maximum display width.

The component also contains a visually hidden transcript of the eight steps,
nil-holding/with-holdings decision and error-return path. If the approved procedure
changes, replace the image and update that transcript together. The artwork is
non-interactive like the source page; no image map, animation or client script is
used.

### Raise Ticket setup and maintenance

`/raise-a-ticket/` reuses `PUBLIC_STRAPI_URL`. Its fields, exact issue options,
scoped styles and small browser handler stay together in
`src/components/raise-ticket/RaiseTicketForm.astro`; there is no form framework,
upload abstraction, SDK, server adapter or build-time CMS request. The utility
navigation now links to this local route and marks it as current.

The required fields map directly to `name`, `client_id`, `email`, `mobile_no`,
`issue`, `subject` and `description`. Issue values are Account Opening, Trade
Related Query, Technical Issue, Fund Related, Demat Related and Others. The optional
single attachment accepts JPG, JPEG, PNG, GIF, PDF, DOC, DOCX, XLS, XLSX, TXT and
CSV extensions up to exactly **5,000,000 bytes**. Selection stays in the browser
until the visitor raises the ticket; the component displays the filename, size
and a Remove action.

Without a file, the browser sends the seven text values inside `data` to
`POST /api/complaints`. With a file, it first posts multipart `files` to
`POST /api/private-upload` with `purpose=complaint`, then adds the returned numeric
media ID as `attachment` to the
complaint JSON. No token, cookies or publication override are sent. A confirmed
upload ID is retained only in memory for a manual retry with the same selected
File. The browser never deletes uploads, so a failed complaint can leave an
unattached media record.

Only HTTP 201 with a created complaint `documentId` clears the form. Validation
and endpoint errors preserve its values; each request has a 20-second timeout and
no automatic retry. Uncertain outcomes advise contacting compliance before another
attempt. Missing configuration or JavaScript keeps the form disabled while email
and telephone links work. Complaint values never enter URLs, browser storage or logs.

The Public role must permit Complaint Create but not Complaint
reads/updates/deletes. Strapi's startup policy enables Private Upload Create and
removes every normal Upload API action from Public without altering other
permissions. Strapi enforces the same file allowlist and 5,000,000-byte limit,
stores accepted attachments in the private bucket and validates the private media
ID again when creating the complaint. Staff with Complaint Read and
attachment-field access receive a fresh five-minute signed URL in Content Manager.
Production still requires rate limiting, malware controls, retention/orphan cleanup,
restricted CORS and privacy/security approval. Automated website tests mock both
endpoints; live attachment tests require separate approval.

Private resume and complaint URLs are generated by Strapi for five minutes when an
authorized administrator views the corresponding record. They are bearer links:
anyone holding one can use it until it expires, so they must not be copied into
logs, tickets or public messages. Expiry does not delete the stored file.

### Software Downloads setup and maintenance

`/downloads/` uses the same `PUBLIC_STRAPI_URL` as contact forms. Its route only
composes `src/components/downloads/Downloads.astro`, which owns the markup,
types, browser loading and local filters. No CMS SDK or separate helper framework
is needed. On each refresh it reads every page of `GET /api/software-categories`
and `GET /api/softwares`, populating `artifact` and `software_category`. Requests
omit tokens and cookies; there are no CMS requests during builds.

The component's browser code follows three steps: `loadPages` reads Strapi,
`createCard` fills the card template once per entry, and `filterCards` shows or
hides those cards. `loadCatalogue` handles the initial load and Retry. Edit the
HTML template for card layout and `fileName` for filename formatting; no generic
CMS or rendering layer is involved.

Maintain category names and each software's name, optional plain-text description,
category relation and attachment in Strapi. Both lists are sorted alphabetically.
All Categories includes uncategorized software. Category buttons filter by
`documentId` without another request; categories without entries remain selectable
and show “No software yet.” The same message appears for a successfully empty list,
never for a failed API request.

**Current schema, read-only verification on 3 September 2026:** Public Find access
is available; both endpoints returned 200 and allowed the local website
origin. Software now has a single media attachment and Draft & Publish enabled,
unlike the earlier plan's multiple-attachment/no-publication schema. Categories
also use Draft & Publish. Publish both categories and software in the admin panel
to expose them through the existing public API. This implementation does not
change Strapi or override its default publication behavior.

Cards use the single attachment, or **only the first attachment** if Strapi returns
an array. A missing/unusable first attachment never falls back to a later one.
Cards show the attachment filename with its extension. The Strapi media name is
preferred; a missing extension is appended from `ext`, and a missing name falls
back to the file URL's basename. Filename and size share one metadata row. Long
filenames wrap within the left column instead of being truncated; size stays on
the right.
Relative file URLs resolve against Strapi; only HTTP(S) URLs without embedded
credentials are allowed. Sizes use Strapi's kilobyte values when present. Download
links open in a new tab; file type and storage response headers determine whether
the browser downloads or displays the file. The website does not fetch or execute
files automatically.

Loading has a 20-second timeout and manual Retry. Unconfigured/no-JavaScript pages
explain why the list is unavailable and retain phone/email links. **Software names,
descriptions and categories are not in initial HTML and require JavaScript**;
the route still has static metadata and remains `noindex, nofollow`. Loading this
catalogue does not migrate the other pages' content into Strapi.

The CMS owner must maintain Public Find permissions for both collections and
appropriate read access for populated relations/media, plus CORS for the website
origin. Production needs an approved HTTPS API origin. Browser tests mock listings,
pagination and failures; live verification is read-only. Never seed entries or
execute downloaded files during verification.

### Investor pages setup and maintenance

The Investors item in the primary header is a three-link disclosure. On desktop it
opens on hover and also works by click and keyboard; on smaller screens it opens
inside the existing navigation menu. Its local pages are:

- `/investors/overview/` — reads every published entry from `GET /api/overviews`.
- `/investors/shareholder-relation/` — reads
  `GET /api/shareholder-relation-categories` and
  `GET /api/shareholder-relations`, populating `file` and
  `shareholder_relation_category`.
- `/investors/financial-reports/` — reads `GET /api/financial-reports`,
  populating `file`, and groups the loaded reports into year dropdowns.

`src/data/investors.ts` contains the four typed reads, pagination, response checks
and safe file helpers. The three named components in `src/components/investors/`
own their markup and small browser interactions. Keep this direct structure; there
is no CMS SDK or generic content renderer.

Maintain overview titles/descriptions and shareholder categories, titles, files
and relations in Strapi. Maintain financial report year, report type, quarter and
file in the `financial-report` content type. Quarter is 1–4 for a quarterly report
and remains empty for a Full Year report. Overview descriptions are Markdown/rich
text and are sanitized before browser insertion. Markdown tables render as accessible HTML
tables inside a horizontal scroll region on narrow screens. Each overview title
is a native dropdown; entries start closed and can be opened independently without
custom accordion JavaScript. Shareholder categories filter the already loaded
records without another request. Categories with no document remain available and
show “No shareholder documents yet.” File links allow only HTTP(S)
addresses without embedded credentials, and filename plus size appear together
when Strapi provides them. Financial reports sort by newest year first, open the
newest year initially, and keep older years in native dropdowns. Within each year,
the display order is 1st–4th Quarter followed by Full Year. The grid shows only
period labels and “Download Report” actions; it omits per-year counts, filenames
and sizes. Periods without a safe published file are not displayed.

All four content types need Public Find permission, populated files/relations
must be readable, and Strapi CORS must allow the website origin. The pages use
`PUBLIC_STRAPI_URL`, no token or cookies, a 20-second timeout and manual Retry.
Records load only in browser JavaScript, so builds remain independent of Strapi
and CMS content is absent from initial HTML. Local Strapi availability and actual
published records must be verified separately before release. When testing from
another device, replace `localhost` in `PUBLIC_STRAPI_URL` with an HTTPS hostname
or LAN address that device can reach, then restart Astro and allow that website
origin in Strapi CORS.

### Careers setup and maintenance

Careers reuses `PUBLIC_STRAPI_URL`. Publish openings in Strapi and maintain their
title, `job_status` (Open, Closed or Filled), location, comma-separated tags and
Markdown description. All published statuses appear alphabetically on `/careers/`.
Each link uses `/careers/job/?id=<documentId>`: new jobs and edits appear on refresh
without rebuilding. Only the public opening identifier belongs in the URL.
The website never reads candidates or populates the opening's `candidates` relation.

The implementation has three components in `src/components/careers/`:
`OpeningList.astro` owns cards and loading, `JobDetails.astro` owns the overview and
keyboard-operated tabs, and `ApplicationForm.astro` owns its explicit fields and
submission handler. `src/data/openings.ts` shares the Opening type, public API
configuration and read functions. Edit these directly; there is no CMS framework,
field registry or page builder. Visual values stay in `src/styles/tokens.css`.

Descriptions use `marked` followed by DOMPurify with a small formatting allowlist.
Scripts, styles, embedded media and forms are not rendered; links accept only
HTTP(S) and email destinations without embedded credentials. CMS headings are
normalized below the overview heading. Other CMS values render as plain text.

Applications require name, valid email, LinkedIn URL and one nonempty PDF resume.
Contact number and additional links are optional strings. The limit is exactly
**2,000,000 bytes**, owned by `MAX_RESUME_BYTES` beside the form handler. Selection
does not upload anything. The browser checks size, extension/MIME and a basic PDF
signature before sending; these are usability checks, not a security boundary.

On Submit, the browser rechecks the job is Open, uploads `files` in multipart
FormData to `POST /api/private-upload` with `purpose=resume`, then sends JSON `data`
to `POST /api/candidates`:
`name`, `email`, `contact_no`, `linkedin_url`, `additional_links`, numeric uploaded
`resume` ID, and `opening` documentId. No tokens, cookies or publication overrides
are sent. Entries retain Strapi's existing Draft & Publish behavior.

Each request times out after 20 seconds, without automatic retries. Only a
confirmed candidate creation clears the form. Errors preserve values and the
selected file. Manual retry reuses the confirmed upload ID while the same File
remains selected in this page; removing/replacing it or navigating clears that
in-memory reference. Nothing is stored in URLs, browser storage or logs. A failed
or abandoned application can leave an unattached upload; the website never deletes
it. Timeouts/network failures can have uncertain outcomes, so the UI advises
contacting the company before resubmitting. There is no server-side idempotency or
atomic job-status check: an opening can close between the check and creation.

Opening list/detail reads were verified during planning. Candidate Create still
requires Public permission and CORS. Strapi's startup policy enables Private Upload
Create and removes normal Upload API access from Public; Candidate reads must remain
unavailable publicly. Strapi enforces the PDF type and exact 2,000,000-byte limit,
validates the private media relation during Candidate creation, and stores accepted
resumes in the private bucket. Staff with Candidate Read and resume-field access
receive a fresh five-minute signed URL in Content Manager. Real smoke tests require
separate approval and use clearly synthetic data only.

Private storage does not replace malware/abuse protection, rate limiting,
retention/orphan cleanup or production HTTPS/CORS and privacy review. Failed or
abandoned submissions can still leave unattached private files. Revocation of the
previously shared token remains outstanding.

Without JavaScript/configuration, explanations and contact alternatives remain;
applications cannot submit natively. Job details also disable applications for
Closed/Filled, missing or unpublished jobs. The twelve static routes retain
`noindex, nofollow`. Job records are not in initial HTML: the detail page starts
with generic metadata and updates the document title after loading. This is not
server-rendered job SEO or a replacement for future production redirect planning.

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
│   ├── about/                 Company, leadership, milestones, values and gallery
│   ├── mutual-funds/          Introduction, steps, benefits, WINVEST and NRI sections
│   ├── downloads/             Catalogue markup, typed client loading and filters
│   ├── careers/               Opening list, job details/tabs and application form
│   ├── close-account/         Account closure request form and browser submission
│   ├── closing-procedure/     Static semantic account-closing flow
│   ├── raise-ticket/          Complaint form, optional upload and browser submission
│   ├── investors/             Investor overview, shareholder and financial report components
│   ├── shared/                Header, Footer, SEO, Contact and StoreBadges
│   └── ui/                    Shared ActionLink primitive
├── data/
│   ├── site.ts                Company details, destinations and home metadata
│   ├── nav.ts                 Primary, utility, legal and venture navigation
│   ├── home.ts                Typed services, statistics, steps, apps and testimonials
│   ├── about.ts               Company story, directors, timeline, values and gallery
│   ├── mutual-funds.ts        Introduction, investment steps, benefits and NRI copy
│   ├── apps.ts                Shared WINVEST copy and store destinations
│   ├── openings.ts            Typed opening reads and Careers API configuration
│   └── investors.ts           Typed investor reads and public file helpers
├── layouts/BaseLayout.astro   Document shell, fonts, header, footer and SEO
├── pages/                     Twelve static routes, including investor/support workflows
├── scripts/carousel.ts        Progressive carousel interaction
└── styles/
    ├── tokens.css             Sole shared design-value owner
    ├── global.css             Imports, font faces, base styles and shared actions
    └── content.css            Scoped secondary-page layout patterns
public/
├── fonts/                     Local variable WOFF2 fonts
└── favicon.png
scripts/                       Browser preview and screenshot helpers
tests/
├── static-output.test.mjs     Generated HTML assertions
├── content-pages.test.mjs     About Us and Mutual Funds static assertions
├── downloads.test.mjs         Downloads static metadata and fallback assertions
├── careers.test.mjs           Careers and job-page metadata and form safety
├── close-account.test.mjs     Close Account metadata and safe form contract
├── closing-procedure.test.mjs Static procedure, links and metadata assertions
├── raise-ticket.test.mjs      Raise Ticket metadata and safe form/upload contract
├── investors.test.mjs         Investor metadata, fallback and CMS-read assertions
└── browser/                   Responsive, navigation, asset and safety checks
DESIGN.md                      Reference-led design guidance, not duplicate tokens
AGENTS.md                      Coding-agent rules
astro.config.mjs               Static output and Tailwind Vite integration
```

Each route file only composes named sections and supplies its metadata. No placeholder
routes, build-time CMS fetching, fund calculator, financial transactions or Astro server-side form handler are included.

## Maintenance

- **Repeated content:** edit `src/data/home.ts`, `src/data/about.ts` or `src/data/mutual-funds.ts`. Keep the arrays typed and all original entries intact. Shared WINVEST text belongs in `src/data/apps.ts`.
- **One-off content and order:** edit the named component in the appropriate page folder; reorder imports/components in its `src/pages/` route. Contact and store badges are shared components.
- **Company information and destinations:** edit `src/data/site.ts`. Avoid repeated literal URLs in components. `nav.ts` controls navigation labels and grouping.
- **Images:** replace/import files in `src/assets/images/`, keeping accurate alt text, intrinsic dimensions and responsive `sizes`. Astro generates optimized images at build time. Decorative icons/backgrounds do not need descriptive alt text.
- **Typography and design:** change `src/styles/tokens.css`. It owns families, sizes, weights, line heights, colors, spacing, widths, borders, shadows and motion. `@theme` supplies Tailwind utilities; responsive custom properties live in the same file. Component CSS consumes tokens for special geometry. See `DESIGN.md`.
- **Section spacing and header buttons:** the responsive `--space-section-gap` token drives the gap between logical sections and the space before the footer on every route through `#main-content`. The separate `--space-section` token retains internal padding in colored bands. Avoid adding another outer margin to individual sections. Dedicated `--header-action-*` tokens control the compact account/IPO buttons without shrinking other calls to action. Secondary-page type and geometry have separate tokens so editing them does not change Home.
- **About Us hero and header:** `--about-hero-height` fills the small viewport height, with the photo cropped using `object-fit: cover`. `--header-about-surface` sets only this route's header background to 50% opacity. Its logo, text, actions and open dropdown remain opaque; Home and Mutual Funds retain solid headers.
- **Page metadata:** `homeMeta` in `site.ts`, `aboutMeta` in `about.ts` and `mutualFundsMeta` in `mutual-funds.ts` feed `BaseLayout.astro` and shared `SEO.astro`. Downloads, Careers, Investor pages, Close Account, Procedure for Closing an Account and Raise Ticket supply route-specific metadata in their page files; job details begin with generic metadata because records load in the browser.
- **Browser behavior:** navigation enhancement lives with Header; contact submission lives with Contact; Close Account and Raise Ticket submission stay in their named components; Careers interactions stay in their three named components; Investor loading stays in its two named components; carousel logic is in `src/scripts/carousel.ts`. The closing procedure is static HTML. Keep the default HTML useful without JavaScript.

The browser receives compiled CSS, not the Tailwind CDN/runtime. See the [official Tailwind Astro integration](https://tailwindcss.com/docs/installation/framework-guides/astro).

Scoped component media queries reference the canonical breakpoint tokens through
Tailwind `@reference` and `theme()`. Do not copy numeric breakpoints into component
CSS. Keep responsive image `sizes` descriptions aligned with the resulting layout.

### Assets and reference provenance

The local logo, Capital Tower photograph, statistical icons, app screenshots, contact illustration and six portraits were compared byte-for-byte with staging before reusing matching previous-project assets. The graph-paper hero, account backgrounds and store badges came from staging. Service icons were extracted from the homepage’s embedded original PNGs. Raleway and Inter provide the measured heading/body typography; Roboto preserves the reference’s small actions/footer. All font files are local variable fonts.

Source image filenames include `banner-bg.png`, `galleryb1-1-1.png`, `winstock-1.png`, `winvest.png`, `get-tuch.png`, and `Group-1399-1.png` under staging’s `wp-content/uploads/`. The existing brand imagery and customer portraits remain subject to IndoThai’s publication approval. No new promotional claims or invented testimonials were added.

The secondary-page originals live in `src/assets/images/about-us/` and
`src/assets/images/mutual-funds/`. Their 42 assets include the office photographs,
six director portraits, timeline variants, group logos, five gallery photos,
investment/app artwork and original icons. Thirty-two matched the previous project
byte-for-byte; the remaining originals were obtained from staging, including its
embedded SVG icons. No runtime fetch from WordPress is required. The milestone
text in `about.ts` is a transcription of the artwork: if approved history changes,
update both visual variants and the text equivalent together.

The owner-requested NRI refinement uses a static inline SVG flight path over the heading and cards
and `flight-plane.svg`, which reuses the original embedded plane from `fund-bg.svg`.
The original full-width and mobile flight artwork files remain untouched as
reference assets. Flight geometry is controlled by the NRI tokens in `tokens.css`;
the icon keeps its proportions and size independently of the line's width.
The subtle dashed trajectory and plane are decorative, ignore pointer events,
and use no animation or browser script. This supersedes the earlier separated divider.

## Interaction and safety rules

Navigation uses native disclosures, enhanced with Escape, outside-click dismissal, focus restoration and expanded state. Closed menus do not expose their links to keyboard navigation.

Testimonials are scrollable HTML containing all six quotes. JavaScript adds previous/next and pause/resume controls. Autoplay uses the token-owned five-second interval, pauses on hover/focus/manual interaction, and is suspended offscreen or when the document is hidden. Reduced motion disables automatic rotation. Manual controls still work.

**Contact uses the existing Strapi endpoint when configured.** A disabled fieldset and Submit button prevent native submission before the JavaScript handler initializes. The handler uses JSON POST, associated inline errors and a live status region, and prevents concurrent submissions. Phone and email links remain usable. See setup and release limitations above.

The floating accessibility toolbar is **deferred to pre-release compliance review**. Its omission is not a claim that a toolbar is unnecessary or that this page meets every regulatory requirement. Semantic HTML, focus visibility, keyboard controls, reduced-motion support and responsive content remain part of this build.

## Source anomalies to review

Preserved intentionally, not endorsed as correct:

- WINSTOCK’s paragraph contains the truncated fragment “ard and Aadhaar card ready”.
- WINVEST’s Google Play badge points to the same app ID as WINSTOCK.
- The source says “What our clients says”, “Filing compliant”, “desiganted”, uses “Aadhar”, omits a space in “experience.As”, and retains a 2024 copyright.
- Source mobile navigation uses a different Fund Transfer host and MF Back Office destination from desktop. Destinations are recorded separately in site data; do not merge them without approval.
- SCORES displays an old URL label but links to the current source destination. Femto uses HTTP in the footer but HTTPS in the About Us company band; the destinations remain separate in site data.
- Source mobile and desktop footer copies differ, including contact numbers, capitalization, legal links and hidden regulatory notices. This build uses the complete desktop company/regulatory copy at every width rather than hiding disclosures on phones.
- The source has slight phone overflow and cramped tablet statistics. The owner approved aligned statistic cards, quote-first testimonials with compact controls, and clearer menu/chevron icons. These are intentional departures from the source, documented in `DESIGN.md`; wording, figures and destinations remain unchanged.
- About Us preserves “Board of Director”, unusual capitalization in the vision,
  the missing punctuation at “audience Every service”, and source age/experience
  claims. These are not independently verified company-history or performance claims.
- The milestone SVGs disagree: desktop shows the currency launch in 2008 and
  “Raised 155cr for growth” in 2024; mobile shows 2006 and “Raised 160cr for growth”.
  Both source images are preserved. Each has a matching 11-event accessible
  transcript, with only the applicable transcript exposed at its breakpoint.
  Reconcile the facts and both artwork variants only after owner approval.
- Mutual Funds preserves “Creating wealth for you everday” and “achive”. Both
  Start Investing buttons use the source Google Play search URL, distinct from
  the WINVEST badge’s app-detail URL and the Investwell login. The source's desktop
  “Log in” capitalization is used consistently across widths.
- The account-closing source diagram says “account closer Form”, “BO I’d”,
  “register email address” and “register phone number”. These labels remain in
  the original image and its accessible transcript pending approved procedural
  copy.

Content or destination corrections need the website owner’s approval, especially financial/regulatory wording.

## SEO and deployment status

Each generated page includes one meaningful H1, logical section headings, a unique title and description, social text metadata, image alternatives, and explicit **`noindex, nofollow`**. There is deliberately no production canonical, `og:url`, sitemap, production robots policy, or domain-dependent structured data. An absolute social sharing image also awaits the approved public origin.

Deployment will consist of publishing `dist/` to a static host. No running Astro/Node application server is required for visitors. No hosting provider or deployment workflow has been selected, and no deployment was performed.

Resolve hosting, production-domain routing alongside WordPress, and the production Strapi origin/security requirements before release. Keep preview builds noindex; changing indexing is a deliberate release step, not something `npm run build` silently enables. Serving static files needs no Astro server. The account-closing procedure remains fully available without Strapi; live contact, closure and complaint requests, software listings, Careers content/applications and Investor content require the separate Strapi service.

## Verification and release checklist

The repository tests check structure, preview SEO, all content groups, local assets, links, contact safety, menu focus, all six testimonials, autoplay/pause, no-JavaScript behavior, reduced motion and overflow. Chromium screenshots are generated at desktop, tablet, phone and narrow-phone widths. Live reference capture is separate from the offline build/test workflow.

See `VERIFICATION.md` for the measured results and remaining limitations of this implementation. Passing a build or browser suite is not deployment readiness, legal approval, a complete accessibility audit, or a guarantee of search ranking.

Before release:

- [ ] Approve visual fidelity across desktop, tablet and phone, including heading wraps and crops.
- [x] Implement the twelve approved static routes; release acceptance remains separate.
- [ ] Approve published Investor overview/shareholder/financial report records, categories, files, Public Find permissions and production CORS.
- [ ] Complete the staged migration of existing resumes and complaint attachments, verify limited-role admin access and remove the verified public copies.
- [ ] Approve Careers content, private-upload/Candidate permissions, abuse protection, malware scanning and retention without exposing candidate records.
- [ ] Approve published software, category assignments, attachment URLs and file safety; verify production read permissions/CORS. Listings require JavaScript and are absent from initial HTML.
- [ ] Approve source-copy/link anomalies and verify external service destinations and availability.
- [x] Connect both contact forms to the existing Strapi endpoint with client validation and submission states.
- [x] Connect Close Account to its existing Strapi endpoint with safe disabled fallback and truthful request status.
- [x] Connect Careers and Raise Ticket attachments to the private-upload endpoint with server-enforced type/size rules and mocked website verification.
- [ ] Approve production handling for account identifiers: Create-only permission, restricted CORS, server validation, abuse protection, retention and privacy/security controls.
- [ ] Approve private complaint permissions, malware/abuse protection, retention and orphan cleanup.
- [ ] Approve the production Strapi origin/CORS, least-privilege public permissions, privacy/retention and server-side spam controls; revoke the previously shared token.
- [ ] Complete accessibility/compliance review, including the deferred floating toolbar; test screen readers, contrast, zoom/reflow and supported physical devices.
- [ ] Run formatting, Astro/TypeScript, static-output and browser tests; inspect every section.
- [ ] Approve the production origin, canonical URLs, social image, relevant structured data and WordPress routing/redirect ownership.
- [ ] Coordinate sitemap and robots policy with WordPress; activate and verify production indexing while retaining noindex on previews.
- [ ] Select hosting, document deployment/rollback and verify response status codes, caching, compression and asset paths.
- [ ] Measure performance and Core Web Vitals on representative real devices and the production host.
- [ ] Confirm image/font publication rights, regulatory copy and final counter values.
- [ ] Keep setup and maintenance documentation current and independently usable without AI.
