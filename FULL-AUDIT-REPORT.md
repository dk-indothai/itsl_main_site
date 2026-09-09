# IndoThai Full-Site SEO Audit

Audit date: 9 September 2026  
Audit target: the local Astro migration in this repository  
Production domain reviewed for migration context: `https://indothai.co.in/`  
Business type: regulated securities broker and financial-services company serving India, with a registered office in Indore

> **Audit boundary:** This is a pre-migration, page-by-page audit of the new Astro project. It is not a complete content audit of every page on the legacy WordPress site. Checks against `indothai.co.in` were limited to the live routing, robots/sitemaps, representative indexed URLs and migration/redirect risks. A full legacy URL crawl and Search Console export remain a release-blocking migration task (SEO-04).

## Executive summary

### Production-readiness score: 49/100

This is not a score for the quality of the preview as a preview. The preview is correctly protected from indexing. It is a score for what would happen if the current build and routing configuration were treated as the production SEO release.

| Category            | Weight | Score | Main reason                                                                                   |
| ------------------- | -----: | ----: | --------------------------------------------------------------------------------------------- |
| Technical SEO       |    22% |    47 | Global `noindex`, no canonicals, unresolved routing and client-only content                   |
| Content quality     |    23% |    41 | Thin CMS shells and insufficient YMYL sourcing/authorship                                     |
| On-page SEO         |    20% |    58 | Unique metadata and H1s, but generic titles and weak contextual linking                       |
| Structured data     |    10% |     0 | No JSON-LD, Microdata or RDFa on any route                                                    |
| Performance         |    10% |    86 | Lean static output, with PDF, background-image and layout-shift risks                         |
| AI-search readiness |    10% |    48 | Good entity facts and structure, but weak citations, dates and crawlable CMS content          |
| Images              |     5% |    86 | Good dimensions, formats and alt coverage; social imagery and CMS image semantics are missing |

The weighted result is 49.1, rounded to 49. Sitemap production readiness is 38/100 and is reported separately because the audit framework does not assign it an independent score weight.

### Release verdict

Do not enable production indexing yet.

The 49/100 score is the pre-remediation baseline. The safe quick fixes listed below were applied afterward without re-scoring the unresolved migration architecture, production routing or editorial/compliance work.

The five issues that must be resolved first are:

1. All 17 pages emit `noindex, nofollow`, and no page has a canonical URL.
2. Ten routes deliver their important content only after browser JavaScript fetches Strapi data.
3. Blog posts and job details use generic query-ID shells with generic initial metadata and soft-404 behavior.
4. The repository sitemap does not match the current WordPress routing: five listed Investor URLs currently return 404 and Corporate Presentation redirects to an image.
5. Financial/YMYL copy contains unsupported claims, contradictory facts, grammar problems and no visible author/reviewer/source model.

### Strong foundations to preserve

- All 17 routes build successfully.
- Every built page has one H1, a unique title and a unique meta description.
- `lang="en-IN"`, the viewport declaration, semantic landmarks, skip link and keyboard-aware navigation are present.
- Static routes are linked through ordinary crawlable anchors; no fixed local route is orphaned.
- No built image is missing an `alt` attribute, and decorative imagery generally uses an empty alternative.
- Astro produces responsive WebP variants for important photographs and app artwork.
- Runtime JavaScript is modest, there are no React islands, and no third-party marketing runtime was found.
- Company name, legal name, SEBI registrations, address, phone numbers, emails and authoritative regulator links appear in static HTML.
- The site is explicit and honest about unavailable forms/CMS content when configuration or JavaScript is missing.

## Safe quick fixes applied after the baseline

- Removed the production sitemap declaration from preview `robots.txt`; the preview still allows crawling so page-level `noindex` can be seen.
- Improved the Home, Careers and Blog titles and made the Careers H1 explicitly identify IndoThai Securities and current openings.
- Restored neutral static introductions on the five browser-backed Investor shells and added introductions to Downloads and Corporate Presentation.
- Added a contextual Close Account → procedure link, official SCORES/SMART ODR links on Raise Ticket, and descriptive screen-reader context for Blog “Read More” links.
- Changed the 7.2 MB Corporate Presentation iframe to native lazy loading while preserving View and Download actions.
- Prevented the enhanced Job Details page from painting and then collapsing its disabled application form. A new mobile regression keeps measured local CLS at or below 0.1 while the no-JavaScript form remains readable.
- Promoted dynamically generated financial-report year labels to real H2 headings.
- Reconciled the five unconfigured Investor fallback assertions and the platform-dependent native-select test assumption.

These improvements do not make the project production-indexable. The release verdict and P0 migration work remain unchanged.

## Scope and evidence

The audit covered:

- all 17 generated HTML routes;
- `robots.txt`, `sitemap.xml`, metadata, headings, links, images and structured data;
- initial HTML versus browser-rendered/CMS-dependent content;
- desktop and 390px mobile rendering, horizontal overflow and layout-shift diagnostics;
- source content, footer/legal destinations, page architecture and CMS field contracts;
- the 31-page Corporate Presentation PDF;
- the current production WordPress router and sitemap transition risk;
- technical, content, schema, performance, image, SXO, local, backlink and AI-search considerations.

No deployment, Strapi change, CMS write, form submission, upload, candidate application, complaint or account-closure request was performed.

## Critical findings

### 1. Indexing is globally disabled

[SEO.astro](src/components/shared/SEO.astro#L7) hardcodes `noindex, nofollow` on every page. This is correct for preview, but a production build deployed unchanged cannot rank. [Astro configuration](astro.config.mjs#L21) also has no approved production `site` origin, so canonicals, `og:url` and absolute structured-data IDs cannot be generated truthfully.

Google documents that `noindex` prevents a page from appearing in search results. The production switch must therefore be explicit, environment-aware and default to the safe preview state: <https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag>

Required outcome:

- preview/staging builds remain `noindex, nofollow`;
- production emits `index, follow` only for approved pages;
- production pages have self-referencing canonicals and `og:url`;
- the indexing flag, robots policy and sitemap allowlist come from one release configuration;
- deployment verification fails if an indexable sitemap URL still contains `noindex`.

### 2. Ten routes are thin JavaScript shells

Downloads, Careers, Job Details, Blog, Blog Post and five CMS-backed Investor pages contain only headings, status text and contact alternatives in their initial HTML. Important copy and crawlable links are created after a browser request to Strapi.

| Route                                         | Initial `<main>` words | Missing from initial HTML                               |
| --------------------------------------------- | ---------------------: | ------------------------------------------------------- |
| `/downloads/`                                 |                     18 | Categories, software names, descriptions and file links |
| `/careers/`                                   |                     20 | Job names, locations, statuses and detail links         |
| `/careers/job/`                               |                     66 | Selected job title, description, location and status    |
| `/investors/overview/`                        |                     29 | All overview headings and descriptions                  |
| `/investors/shareholder-relation/`            |                     30 | Categories, document titles and files                   |
| `/investors/financial-reports/`               |                     29 | Years, periods and report links                         |
| `/investors/disclosures-under-regulation-46/` |                     37 | Disclosure titles and links                             |
| `/investors/client-relation/`                 |                     30 | Policy/document titles and files                        |
| `/blog/`                                      |                     22 | Post titles, excerpts, dates and detail links           |
| `/blog/post/`                                 |                     20 | Selected post title, date, image and article body       |

Google can render JavaScript, but rendering is a separate phase and not every crawler runs JavaScript. Google continues to recommend server-side or static rendering for important public content: <https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics>

This requires an owner-approved architecture decision because the current project contract explicitly prohibits build-time Strapi reads and uses browser-only query-ID records.

- Recommended if these pages must rank: approve SSR, an edge-rendered response, or a controlled pre-publish snapshot/export that places the same sanitized content and links in initial HTML without changing Strapi itself.
- Constraint-preserving alternative: keep the ten CMS-backed routes noindexed and accept that records/documents are not organic landing pages.
- Partial alternative: index only strengthened static listing pages, but keep individual blog/job shells noindexed until record-specific rendering and status codes are possible.

### 3. Blog/job detail pages are not unique search documents

`/blog/post/?id=<documentId>` and `/careers/job/?id=<documentId>` return one generic static shell. JavaScript updates `document.title`, but the initial description, canonical, Open Graph values and H1 remain generic until rendering. A missing or invalid ID still returns HTTP 200 and becomes an unavailable message in the browser.

Consequences:

- duplicate/generic snippets across records;
- soft-404 risk;
- no reliable record-level sitemap;
- no record-specific canonical;
- no valid initial `BlogPosting` or `JobPosting` graph;
- weaker sharing previews and discovery.

If the approved query-ID architecture remains, keep the detail shells noindexed. If record-level organic traffic is a goal, approve a rendering/routing change that provides unique initial HTML, one stable canonical URL per record and real 404/410 handling.

### 4. Migration baseline: sitemap and current `indothai.co.in` routing are not aligned

The repository sitemap is valid XML and contains 15 unique HTTPS, trailing-slash URLs. It correctly omits the two bare query shells. It is nevertheless unsafe to submit now:

- all 15 entries are noindexed;
- the live WordPress robots file points to `/sitemap_index.xml`, while this repository contains `/sitemap.xml`; the preview no longer advertises that production sitemap after the quick-fix pass;
- the live WordPress site has five Yoast child sitemaps that must be reconciled;
- on 9 September 2026, 9 of the 15 repository sitemap URLs returned a direct live 200, five Investor URLs returned 404, and Corporate Presentation redirected to a PNG rather than the planned HTML page;
- the indexed, content-rich legacy `/investors/` route is not represented in the repository sitemap.

Before cutover, export the WordPress URL inventory and Search Console data, approve a complete one-hop redirect map, decide how `/investors/` will preserve and distribute its existing relevance, and generate the final sitemap from an explicit indexable-route allowlist.

Google recommends including only canonical URLs that should appear in search: <https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap>

### 5. Financial/YMYL content is not editorially ready

The strongest trust signals are the legal company details, registration identifiers, compliance contact, history and regulator links. They are undermined by claims and inconsistencies that need owner/compliance review before indexing.

Examples:

- “low-risk commodity trading”, “maximize returns”, “promising IPOs”, “safe” investments and currency-risk protection are stated without qualifications or sources;
- the About timelines expose 2008 versus 2006 and ₹155 crore versus ₹160 crore in the same HTML;
- “over 30 years” conflicts with “last two decades”;
- the WINSTOCK paragraph contains the corrupted fragment “ard and Aadhaar…”;
- `IndoThai`, `Indo Thai` and `Indothai` are used inconsistently;
- the footer includes “Filing compliant”, other grammar problems and a stale 2024 copyright;
- company statistics and promotional superlatives have no “as of” date, methodology or source.

For financial content, Google’s people-first guidance emphasizes clear sourcing, expertise, authorship and verifiable accuracy: <https://developers.google.com/search/docs/fundamentals/creating-helpful-content>

Do not silently correct regulated facts. Obtain a single approved fact sheet and a compliance-reviewed wording/risk policy, then update every affected visual and transcript together.

## Page-by-page audit

| Route                                         | Current strength                                    | Required SEO work                                                                                                                              | Indexing recommendation                   |
| --------------------------------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `/`                                           | 777 words, strong service coverage and trust footer | Replace generic title/H1 direction, repair corrupted app copy, qualify/source claims and statistics, add contextual service links              | Index after release and editorial gates   |
| `/about-us/`                                  | 673 words, history, leadership and real photography | Reconcile milestones and tenure claims, add director credentials/bios, source dated company claims, shorten dense passages                     | Index after fact approval                 |
| `/mutual-funds/`                              | 515 words, clear process and NRI angle              | Add risk/suitability/cost/KYC/tax/jurisdiction context, expand one-line benefits, fix grammar and verify app destinations                      | Index after compliance/content expansion  |
| `/downloads/`                                 | Exact intent and usable browser UI                  | Put the catalogue or an approved static snapshot in HTML; add publisher, OS, version/date, requirements, safety and support information        | Keep noindexed until crawlable            |
| `/careers/`                                   | Clear employer CTA and accessible job UI            | Add crawlable job links plus culture, teams, locations, benefits, hiring process and equal-opportunity copy; use a search-descriptive H1/title | Conditional                               |
| `/careers/job/`                               | Sanitized descriptions and safe form workflow       | Unique response/head/status, date posted, expiry, employment type, structured location and `JobPosting` for open roles only                    | Keep noindexed under current architecture |
| `/close-account/`                             | Strong task intent and honest outcome wording       | Link prominently to the procedure; add prerequisites, holdings treatment, timing, privacy/retention and escalation information                 | Index after review                        |
| `/procedure-of-closing-account/`              | Exact source flowchart and transcript               | Make an approved equivalent step summary visible; link to the form; correct transcript wording only with synchronized artwork approval         | Index after visible content is added      |
| `/raise-a-ticket/`                            | Clear complaint task and compliance fallback        | Add response stages/timing, escalation matrix, privacy/attachment handling, SCORES and Smart ODR contextual links                              | Index after review                        |
| `/investors/overview/`                        | Exact entity intent and accessible accordions       | Render overview content in HTML, restore/add an introduction, show effective dates and sources where applicable                                | Keep noindexed until crawlable            |
| `/investors/shareholder-relation/`            | Clear category UI                                   | Create crawlable category/document discovery; non-default categories currently require interaction; restore/add an introduction                | Keep noindexed until crawlable            |
| `/investors/financial-reports/`               | Logical year/period UI                              | Render report links in HTML; add filing context; make year labels real H2-level headings                                                       | Keep noindexed until crawlable            |
| `/investors/disclosures-under-regulation-46/` | Excellent exact-intent H1                           | Render disclosure links in HTML; add the listed entity, scope and effective-date context                                                       | Keep noindexed until crawlable            |
| `/investors/client-relation/`                 | Simple document pattern                             | Clarify “Client Relation”; render titles/files in HTML; add a short scope introduction                                                         | Keep noindexed until crawlable            |
| `/investors/corporate-presentation/`          | Crawlable View/Download links                       | Add an HTML executive summary and edition date; lazy-load preview; remediate PDF metadata/tagging; choose PDF index policy                     | Index HTML after remediation              |
| `/blog/`                                      | Clean editorial layout                              | Render post links/excerpts in HTML; add editorial scope, topics and author/reviewer signals                                                    | Keep noindexed until crawlable            |
| `/blog/post/`                                 | Safe Markdown rendering                             | Unique initial metadata/content, author/reviewer, sources, disclosure, publish/modified dates, related links and `BlogPosting`                 | Keep noindexed under current architecture |

## On-page SEO

### Metadata

All 17 route-level titles and descriptions are unique and sensible lengths. The problem is specificity, not duplication.

Recommended title directions, to be validated with real query data:

| Route                            | Suggested direction                           |
| -------------------------------- | --------------------------------------------- |
| `/`                              | `Stock Broking, Trading & Investment Services | IndoThai`                      |
| `/about-us/`                     | `About IndoThai Securities                    | Company, Leadership & History` |
| `/mutual-funds/`                 | `Mutual Fund Investment & NRI Support         | IndoThai`                      |
| `/downloads/`                    | `Trading Software Downloads                   | IndoThai`                      |
| `/careers/`                      | `Careers & Current Job Openings               | IndoThai Securities`           |
| job detail                       | `[Job Title] in [Location]                    | Careers at IndoThai`           |
| `/close-account/`                | `Close Your Demat or Trading Account          | IndoThai`                      |
| `/procedure-of-closing-account/` | `Account Closure Procedure                    | IndoThai`                      |
| `/raise-a-ticket/`               | `Raise a Complaint or Support Ticket          | IndoThai`                      |
| `/investors/overview/`           | `Investor Relations                           | IndoThai Securities`           |
| shareholder page                 | `Shareholder Information & Disclosures        | IndoThai`                      |
| financial reports                | `Quarterly & Annual Financial Reports         | IndoThai`                      |
| client relation                  | `Client Policies, Forms & Disclosures         | IndoThai`                      |
| `/blog/`                         | `Investment Insights & Market Updates         | IndoThai`                      |
| blog detail                      | `[Post Title]                                 | IndoThai Insights`             |

Current social metadata includes text only. Add an owner-approved 1200×630 default image, `og:url`, `og:image`, image dimensions/alt and `summary_large_image`; use record images and `og:type="article"` on indexable blog posts.

### Headings and semantics

- One H1 is present on every built route.
- CMS heading normalization is careful and should be preserved.
- Financial Reports dynamically creates H3 period headings without a real H2 year heading.
- Careers’ inspirational H1 and the generic Home H1 do not summarize the primary search intent as clearly as they could.
- The closing procedure’s H1 and detailed transcript are visually hidden, leaving an image as the visible page experience.
- Footer H2s are valid, but on thin pages the repeated footer is much larger than the unique main content.

### Internal linking

Shared navigation reaches all 15 fixed routes, but contextual linking is sparse:

- Home has only one editorial local link, to About Us.
- Mutual Funds has no editorial link to another local content page.
- Close Account and its procedure page do not link to one another.
- Raise Ticket relies on the footer rather than contextual SCORES/ODR/escalation links.
- Blog posts have no breadcrumbs, topics, related posts or author paths.
- service cards are not a crawlable service-link graph.
- generic anchors such as “Know More”, “Read More”, “View” and “Download” rely on surrounding text.

Add deliberate user-journey links without removing the compliance footer or inventing destinations.

## Structured data

Implementation score: 0/100. All 17 built pages contain zero JSON-LD blocks, zero Microdata items and zero RDFa contexts.

After the production origin is approved, add one shared graph with stable IDs:

- `Corporation` for the legal entity, with `legalName`, approved identifiers, contact data, address and `sameAs`;
- optionally co-type as `FinancialService` only if the represented customer-facing location is verified;
- `WebSite` and a page-specific `WebPage` subtype;
- `BreadcrumbList` on secondary pages;
- `AboutPage` for About Us;
- `ContactPage` for Raise Ticket;
- `CollectionPage` for lists and Investor document hubs;
- `Blog`/`BlogPosting` only when visible record data and attribution are present;
- `JobPosting` only on a single valid open-job page with complete visible fields;
- `PresentationDigitalDocument`/`MediaObject` for the Corporate Presentation when metadata is corrected.

Do not add:

- deprecated `HowTo` rich-result markup to the account-closing procedure;
- `FAQPage` solely to chase a Google rich result for this commercial financial site;
- self-serving `Review`/`AggregateRating` markup for homepage testimonials;
- invented salary, price, rating, return, opening-hour, geo or regulatory data;
- schema for closed/unpublished jobs or unavailable documents.

The current 170×71 logo does not meet Google’s minimum 112×112 Organization-logo guidance. Add a separate approved square/high-resolution crawlable logo asset before specifying `logo`: <https://developers.google.com/search/docs/appearance/structured-data/organization>

JobPosting guidance: <https://developers.google.com/search/docs/appearance/structured-data/job-posting>  
Article guidance: <https://developers.google.com/search/docs/appearance/structured-data/article>

## Content quality, E-E-A-T and editorial governance

### Current assessment

| Factor            | Score | Assessment                                                                                     |
| ----------------- | ----: | ---------------------------------------------------------------------------------------------- |
| Experience        |    50 | Office/gallery imagery, testimonials, processes and history help; claims lack dates/methods    |
| Expertise         |    44 | Registrations are strong; there are no article authors, reviewers or credential pages          |
| Authoritativeness |    48 | Regulator/exchange references help; unsupported superlatives weaken authority                  |
| Trustworthiness   |    57 | Compliance/contact detail is strong; contradictions, staging links and stale copy weaken trust |
| Weighted E-E-A-T  |    50 | Below the level expected for indexable financial/YMYL content                                  |

Required governance:

1. Create an owner-approved company fact sheet for history, AUM/wealth-managed terminology, clients, employees, locations, group companies and leadership.
2. Add a visible “reviewed by” process for investment, tax, NRI and regulatory content.
3. Give blog posts a real author, credentials/profile URL, reviewer where needed, sources, publication date, modified date and disclosure.
4. Add an “as of” date and source/methodology to changing facts.
5. Define a compliance wording library for risks, suitability, no-guarantee language and jurisdictional limits.
6. Introduce a CMS publishing checklist for minimum completeness, uniqueness, links, headings, image alternative, sources and freshness.
7. Do not refresh dates unless content materially changes.

Google does not prescribe a preferred word count. The goal is complete, accurate coverage, not padding. The weakest topical coverage is on Mutual Funds, Careers, Downloads, support processes, the Corporate Presentation landing page and every CMS shell.

## Performance and Core Web Vitals

Performance heuristic: 86/100. This is the strongest category, but there is no deployed CrUX, PageSpeed Insights or Lighthouse field result.

A cold mobile Chromium lab run at 390×844 with simulated 150ms RTT, 1.6Mbps and 4× CPU produced:

| Route/group       |        LCP proxy |      CLS | Initial transfer |
| ----------------- | ---------------: | -------: | ---------------: |
| Home              |           2.492s |    0.025 |            555KB |
| About Us          |           0.692s |   0.0098 |            231KB |
| Mutual Funds      |           1.116s |   0.0013 |            218KB |
| Simple CMS shells | about 0.64–0.66s | 0–0.0017 |        153–180KB |

These local numbers are diagnostic only. Core Web Vitals must be judged at the 75th percentile with real-user data; the “good” targets are LCP ≤2.5s, INP ≤200ms and CLS ≤0.1: <https://web.dev/articles/vitals>

Priority performance work:

- Quick fix applied: the Corporate Presentation iframe now uses native lazy loading for its 7,227,240-byte PDF. A lightweight preview remains the stronger option if production measurements show the near-viewport iframe still transfers too early.
- The PDF is untagged and has only 72 extractable words across 31 pages. Its title is `pitch Book CTC- without real estate & key personnel.cdr`, author is `Administrator`, creation date is 2017 and modification date is 2024. Replace/remediate metadata and accessibility.
- Quick fix applied: the generic Job Details shell previously measured CLS 0.517 when the disabled application panel collapsed after parsing. The enhanced page now hides that inactive panel before paint, reserves the loading viewport and retains the readable disabled form when scripting is unavailable. A mobile regression enforces CLS ≤0.1.
- CMS lists can move the footer substantially when records arrive. Pre-rendering is best; otherwise reserve realistic space/skeleton geometry.
- Home uses a 112KB PNG CSS hero background. Account Steps uses 190KB and 245KB PNG CSS backgrounds. Generate modern alternatives and verify that only the active breakpoint downloads.
- The three local variable fonts total about 137KB. `font-display: swap` is good; verify preload benefit versus image contention and font-swap layout on real devices.
- Configure Brotli/Gzip, immutable caching for hashed assets, short/revalidated caching for HTML/robots/sitemap, and deployment-level HTTP/2 or HTTP/3.

The current DOM sizes are modest and JavaScript execution is light. Preserve those advantages.

## Images and document SEO

Strengths:

- zero missing `alt` attributes in built HTML;
- descriptive alternatives on people, offices, app screens and the closing flowchart;
- decorative icons/patterns correctly use empty alternatives;
- intrinsic dimensions are reserved;
- responsive WebP variants and `sizes` exist for important photographic/app assets;
- priority/eager loading is used on important About, Mutual Funds and closing-procedure imagery.

Work needed:

- add a crawlable social/share image and page-specific post images;
- decide whether CMS blog banners are decorative or should use the post title as their alternative;
- enforce CMS media width/height or a stable aspect ratio to avoid shifts;
- convert CSS PNG backgrounds to modern formats;
- provide a compliant square Organization logo;
- add HTML summaries for image/PDF-heavy pages;
- keep the Corporate Presentation PDF out of the sitemap and consider `X-Robots-Tag: noindex` unless direct PDF indexing is explicitly desired;
- if PDF indexing is desired, use a stable URL, accurate metadata, accessibility tagging and a deliberate canonical/header policy.

An image sitemap is optional and unnecessary for decorative/icon assets. Consider it only if image-search acquisition becomes a measured objective.

## AI-search/GEO readiness

AI-search readiness is 48/100. This is an implementation-readiness score, not a measurement of current visibility or citations in AI products.

Positive signals include exact legal identity, registration identifiers, company details, semantic headings, lists and some accessible tables. The main blockers are the same ones affecting conventional search:

- global noindex;
- browser-only primary content;
- no sources or stable citations for changing claims;
- no author/reviewer entities;
- conflicting facts and copy errors;
- no concise answer-first passages on service and support pages;
- an inaccessible, weakly extractable Corporate Presentation PDF;
- no structured entity graph.

Improve citability by adding concise definitions, dated fact blocks, cited official sources, clear eligibility/process tables, named authors/reviewers and stable HTML anchors. Do not create thin pages for every possible AI query. Google’s current AI-search guidance still centers on helpful, reliable, non-commodity content: <https://developers.google.com/search/docs/fundamentals/ai-optimization-guide>

`llms.txt` is optional and emerging. It does not replace crawlable HTML, robots, canonicals, schema or editorial authority. Google currently says it does not use `llms.txt`. Decide AI crawler/training policy separately; do not block Googlebot/Bingbot accidentally. Treat search crawlers such as OAI-SearchBot separately from model-training crawlers such as GPTBot when documenting that policy.

## Local SEO

Public-data local readiness is 32/100. This is not a Google Business Profile account audit; no GBP administration, Insights, review feed or geo-grid data was available.

The company has a registered Indore address, but the site appears to serve a wider Indian financial-services audience. Treat it as a hybrid/national business unless the registered office is confirmed as a staffed, customer-facing location. The project repeats the address and click-to-call links across all pages, but omits PIN `452010` and country, uses inconsistent capitalization, and exposes different phone numbers without a single canonical purpose model. The [CDSL DP database](https://www.cdslindia.com/eservices/DP/DPDBdetails/50900), [NSE member directory](https://enit.nseindia.com/MemDirWeb/brokerDetailPage_Beta?h_MemType=members&memID=885) and legacy Investor page broadly corroborate the Capital Tower address and main landline. A legacy Justdial listing uses the old Dawa Bazar address; verify whether it is a closed office or active branch before changing it.

Required validation before local markup or location-page work:

- verify the exact NAP, postal code, capitalization and customer-facing status;
- reconcile the multiple phone numbers and their purposes;
- confirm opening hours, directions and accessibility only from owner-approved data;
- verify/claim the Google Business Profile and matching Bing/Apple profiles;
- link the website and profiles consistently;
- monitor independent reviews and respond under a compliance-approved policy.

Audit existing GBP profiles and duplicates before creating a new profile. If Capital Tower genuinely accepts customers, add one strong Indore contact/location page with complete NAP, approved hours, directions, accessibility details, services and real office photos. Create branch pages only from an owner-approved inventory of staffed locations. Do not generate thin city pages or add `FinancialService` location markup with invented hours, coordinates or service areas. Do not derive `AggregateRating` from the six on-site testimonials.

## Backlinks and off-page authority

Off-page migration readiness is 42/100. This measures whether link equity can survive the migration, not the strength of the current backlink profile. No Moz, Search Console or Bing Webmaster credentials are configured, and Common Crawl has no cached domain metrics in this environment. A quantitative backlink-health score, toxic-link verdict and competitor gap would therefore be false precision.

A limited verified sample found branded/naked-URL references from CDSL, Screener and the Financial Times, plus strong company citations in NSE/SEBI/BSE materials. The sample is too small to infer anchor distribution, toxicity, follow ratios or link velocity. More importantly, an [official NSE governance filing](https://nsearchives.nseindia.com/corporate/ixbrl/INTEGRATED_FILING_GOVERNANCE_157988_15052026171951_iXBRL_WEB.html) cites `/investors/`, while company filings and reports also cite `/investor-overview/` and many `/wp-content/uploads/...` files. The live site has indexed root-level article URLs, while the migration uses `/blog/post/?id=...`. These URLs and media files must not disappear at cutover.

The immediate off-page task is preservation, not acquisition:

1. Export Search Console/Bing backlink, top-linked-page, landing-page and 404 data before migration.
2. Preserve `/investors/` as a compatibility page or direct 301 to the approved Investor hub; restore `/investor-overview/` with an exact direct redirect.
3. Export every WordPress media URL referenced by company or regulatory filings; retain its path or issue an exact one-hop 301 to a permanent replacement.
4. Map every legacy article slug to an equivalent permanent, crawlable article—not a generic listing or homepage.
5. Preserve the current non-`www` HTTPS canonical host and reduce alternate-host/protocol redirects to one hop where practical.
6. Remove staging-host legal/support destinations at release and keep the remaining WordPress routes behind an approved coexistence router until migrated.
7. Confirm consistent entity details on SEBI/exchange/depository/industry listings.
8. Earn links through genuinely useful assets: compliance explainers, investor-report hubs, platform guides and original market education reviewed by qualified experts.
9. Do not buy links, automate outreach or create low-quality directory citations.

## Sitemap, robots and redirects

### Sitemap

- Valid XML, correct namespace, no duplicates, all HTTPS and trailing-slash URLs.
- 15 fixed routes included; bare blog/job shells correctly excluded.
- No `lastmod`, which is valid. Add it only when it reflects a real content change, not every deployment.
- Manual maintenance creates drift risk. Generate/validate against an explicit indexable allowlist.
- Never add private uploads, signed files, resumes, complaint attachments or software binaries.

### Robots

- Local `robots.txt` allows crawling, which lets crawlers see the preview `noindex` directive.
- The quick-fix pass removed the production sitemap advertisement from preview `robots.txt`.
- Production should reference the final sitemap URL directly, without a redirect.
- AI training crawler rules are a governance choice, not a substitute for search directives.

### Redirects and status codes

- No hosting redirect rules are defined in the repository.
- Configure one-hop 301s for HTTP→HTTPS, non-preferred→preferred hostname, no-slash→slash and every approved WordPress migration.
- Add a branded custom 404 that returns an actual 404 status.
- Invalid blog/job IDs need real 404/410 handling if those records become indexable.
- Do not canonicalize genuinely different pages to an unrelated listing as a substitute for status handling.

Google recommends self-referencing canonicals in source HTML and consistent internal links to the canonical version: <https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls>

## Hosting and security checks

The repository does not define production HTTPS, compression, caching or response headers. Verify on the selected host:

- TLS and one preferred hostname;
- HSTS after HTTPS is stable;
- CSP compatible with Astro modules, Strapi and required embeds;
- `X-Content-Type-Options: nosniff`;
- `Referrer-Policy`;
- frame controls that still allow the intended PDF behavior;
- an appropriate `Permissions-Policy`;
- immutable caching for hashed assets;
- correct MIME, CORS and content-disposition headers for public files;
- no indexing of private/signed upload paths.

These are deployment checks, not proof of a current security vulnerability.

## Measurement and monitoring

No Google API credentials, Search Console, GA4, CrUX, PageSpeed API, Moz or Bing Webmaster data was available. DataForSEO was not installed. Before and after launch:

- verify a Search Console domain property;
- export current queries, pages, links and index coverage before migration;
- submit the final sitemap only after the release checks pass;
- inspect representative URLs and rendered HTML;
- configure privacy-approved analytics without collecting form PII;
- track organic landings, outbound account/app actions, successful forms and downloads as separate events;
- establish a CrUX/PageSpeed baseline after sufficient real traffic;
- monitor 404s, redirect hops, soft 404s, excluded/noindex pages and structured-data reports;
- capture an SEO-drift baseline after production is stable;
- review performance and content at 7, 30 and 90 days.

## Verification completed

- `npm run build`: passed; all 17 routes generated.
- `npm run check`: passed for 98 files with no errors, warnings or hints.
- `npm run format:check`: passed after formatting the two report artifacts.
- Parsed all 17 generated HTML pages for metadata, headings, words, links, images and schema.
- Confirmed one H1 and unique route-level title/description on all 17 pages.
- Confirmed zero canonicals, zero structured-data blocks and zero social images.
- Confirmed all fixed local pages are reachable from shared navigation and no built image lacks `alt`.
- Checked desktop and mobile rendering without page-level horizontal overflow.
- Performed local lab performance and layout-shift diagnostics; no field-data claim is made.
- Inspected the Corporate Presentation with `pdfinfo`, `pdftotext`, `file` and image inventory tools.
- Checked current production routing and sitemap transition context read-only.
- `npm test`: passed 49/49 static assertions and rebuilt all 17 routes.
- `npm run test:browser`: passed 209/209 Playwright checks against the mock-configured build, including the added Job Details CLS regression.
- `npm run test:dev`: passed 35/35 development-server responsive and asset-delivery checks.

## Limitations

- CMS records were not available in the audited static build, so individual post, job, disclosure and download content could not be editorially scored.
- No live form or CMS write was authorized or attempted.
- No Search Console, GA4, CrUX, PageSpeed field data, keyword volumes, rank tracking or authoritative backlink export was available.
- External authenticated trading/account systems were not exercised.
- Browser diagnostics were Chromium-based, not Safari/Firefox, physical-device or full assistive-technology certification.
- Production hosting behavior remains unknown until a real release candidate exists.

See [ACTION-PLAN.md](ACTION-PLAN.md) for the prioritized implementation sequence and acceptance criteria.
