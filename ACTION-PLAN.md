# IndoThai SEO Action Plan

This plan converts the 9 September 2026 full-site audit into implementation work. It preserves the project’s approved preview, Strapi, content and release boundaries.

## Quick-fix progress — 9 September 2026

| Audit item | Status                                                                                                                                              |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| SEO-07     | Partial: preview `robots.txt` no longer advertises the production sitemap; production generation and validation still await routing approval        |
| SEO-12     | Complete: static, browser and development suites pass                                                                                               |
| SEO-13     | Partial: Home, Careers and Blog titles plus the Careers H1 are clearer; the remaining title/H1 review still needs query data and editorial approval |
| SEO-14     | Partial: neutral introductions now exist on Downloads, five Investor CMS shells and Corporate Presentation; crawlable CMS records remain unresolved |
| SEO-22     | Partial: Close Account links to its procedure, Raise Ticket links to SCORES/SMART ODR, and Blog action names have record context                    |
| SEO-23     | Partial: the PDF iframe uses native lazy loading; the HTML summary/date, PDF remediation and index policy remain open                               |
| SEO-24     | Complete: the Job Details pre-paint collapse is fixed and a mobile CLS ≤0.1 regression is enforced                                                  |

## P0 — Release blockers

Complete these before enabling indexing or submitting the Astro sitemap.

| ID     | Action                                                                       | Owner                       | Effort | Definition of done                                                                                                                         |
| ------ | ---------------------------------------------------------------------------- | --------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| SEO-01 | Approve production origin, preferred hostname and trailing-slash policy      | Owner + developer           | S      | One written source of truth for scheme, host and canonical paths                                                                           |
| SEO-02 | Create a default-off production indexing switch                              | Developer                   | M      | Preview stays `noindex`; approved production pages emit `index, follow`; tests fail on accidental state                                    |
| SEO-03 | Add self-referencing canonicals and `og:url`                                 | Developer                   | M      | Every indexable HTML response has one matching absolute canonical in initial source                                                        |
| SEO-04 | Export current WordPress/Yoast and Search Console URL inventories            | SEO + owner                 | M      | Pages, posts, jobs, categories, authors, media files, official-filing URLs, backlinks and top landing pages are archived                   |
| SEO-05 | Approve the complete redirect/router matrix                                  | Owner + developer + SEO     | L      | Every legacy URL has a keep/301/410 decision; `/investors/`, `/investor-overview/`, article slugs and `/job-openings/` are explicit        |
| SEO-06 | Reconcile production routes before sitemap release                           | Developer                   | M      | All intended sitemap URLs return direct 200; five Investor 404s and the Corporate Presentation image redirect are resolved                 |
| SEO-07 | Generate/validate sitemap and robots from one release inventory              | Developer                   | M      | Sitemap contains only direct-200 canonical indexable pages; production robots references it directly; preview does not advertise it        |
| SEO-08 | Decide SEO architecture for the ten browser-only routes                      | Owner + developer + SEO     | L      | Written choice: SSR/edge/static snapshot, partial indexing, or explicit permanent noindex                                                  |
| SEO-09 | Keep query-ID job/blog shells noindexed unless unique responses are approved | Developer                   | S      | Bare/invalid shells cannot enter the index; approved indexable records have unique initial head/content/status                             |
| SEO-10 | Complete owner/compliance fact and claims review                             | Owner + compliance + editor | L      | Contradictory milestones, corrupted copy, statistics, financial claims, terminology and risk language are approved once and synchronized   |
| SEO-11 | Replace staging legal/support links with approved production destinations    | Owner + developer           | S      | No production page links to the WordPress staging hostname                                                                                 |
| SEO-12 | Resolve repeatable verification failures                                     | Developer                   | S      | `npm test` passes from an unconfigured clean environment; the five Investor assertions and Raise Ticket keyboard-select check are resolved |

## P1 — High-impact implementation

Target immediately after P0 decisions, before or in the first production release.

| ID     | Action                                                            | Owner                          | Effort | Definition of done                                                                                                             |
| ------ | ----------------------------------------------------------------- | ------------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------ |
| SEO-13 | Improve static titles and H1 intent                               | SEO + editor + developer       | M      | Home, Careers, Blog, Investor and service titles clearly describe the page; no duplication                                     |
| SEO-14 | Add useful static introductions to CMS-backed pages               | Editor + developer             | M      | Each list/hub has visible entity, scope, task and contact context even before records load                                     |
| SEO-15 | Make CMS links/content crawlable according to SEO-08              | Developer                      | XL     | Important records and document links exist in initial HTML or affected pages remain deliberately noindexed                     |
| SEO-16 | Add real record metadata/status handling for indexable jobs/posts | Developer + CMS editor         | XL     | Unique title, description, canonical, social data, H1 and 404/410 behavior per record                                          |
| SEO-17 | Expand the job content contract if JobPosting is a goal           | Owner + developer + CMS editor | L      | Visible date posted, location address/remote rules, employment type and optional expiry are maintained without invented fields |
| SEO-18 | Add blog authorship/review/source fields and visible UI           | Owner + compliance + developer | L      | Every financial article identifies author, credentials/profile, reviewer where needed, sources and publish/modified dates      |
| SEO-19 | Add Organization/WebSite/page/breadcrumb JSON-LD                  | Developer + SEO                | L      | Valid shared `Corporation` graph with stable IDs; page types and breadcrumbs validate in built source                          |
| SEO-20 | Add BlogPosting and open-role JobPosting only when eligible       | Developer + SEO                | L      | Markup matches visible content, passes Google tests and disappears when a job is not Open                                      |
| SEO-21 | Add a compliant Organization logo and social-image system         | Designer + developer           | M      | Crawlable ≥112×112 logo; approved 1200×630 default; per-post images where available                                            |
| SEO-22 | Strengthen contextual internal journeys                           | Editor + developer             | M      | Close↔Procedure, Ticket→escalation/ODR/SCORES, service links, Investor paths, breadcrumbs and related posts are present        |
| SEO-23 | Remediate the Corporate Presentation landing page/PDF             | Owner + designer + developer   | L      | HTML summary/date exists; iframe is lazy; PDF is tagged, titled and accessible; index policy is explicit                       |
| SEO-24 | Eliminate the Job Details first-paint layout collapse             | Developer                      | M      | Local cold mobile CLS no longer jumps when the inactive application panel is hidden; no-JS contract remains readable           |
| SEO-25 | Stabilize CMS insertion layouts                                   | Developer                      | M      | Realistic reserved geometry or pre-rendering prevents footer jumps on lists and detail pages                                   |
| SEO-26 | Configure production caching, compression and essential headers   | Hosting + developer            | M      | HTTPS/hostname redirect, Brotli/Gzip, immutable hashed assets and reviewed security headers pass live checks                   |
| SEO-27 | Add a branded real-404 page                                       | Developer + designer           | S      | Unknown paths return HTTP 404 with useful navigation and no misleading success shell                                           |

## P2 — Content depth, authority and conversion quality

Target during the first 30–60 days.

| ID     | Action                                                 | Owner                         | Effort | Definition of done                                                                                                |
| ------ | ------------------------------------------------------ | ----------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------- |
| SEO-28 | Expand Mutual Funds and NRI guidance                   | Qualified editor + compliance | L      | Risks, costs, KYC, suitability, process, tax/jurisdiction caveats and support boundaries are complete and sourced |
| SEO-29 | Expand Careers and hiring information                  | HR + editor                   | M      | Culture, teams, locations, benefits, process and equal-opportunity copy answer candidate questions                |
| SEO-30 | Expand Downloads guidance                              | Product/support + editor      | M      | OS/version/date, requirements, installation, integrity/safety and support information are present                 |
| SEO-31 | Expand account-closure and complaint guidance          | Compliance + editor           | M      | Prerequisites, timing, next steps, privacy, escalation and channel choice are visible and cross-linked            |
| SEO-32 | Add HTML summaries and dates to Investor document hubs | Investor relations + editor   | M      | Each hub states entity, purpose, reporting scope and freshness without duplicating regulated documents            |
| SEO-33 | Create director/author/reviewer expertise profiles     | Owner + compliance + editor   | L      | Credentials and responsibility are accurate, visible and internally linked                                        |
| SEO-34 | Establish an editorial publishing checklist            | Owner + compliance + SEO      | M      | Minimum uniqueness, sources, authorship, dates, links, image text and update rules are enforced                   |
| SEO-35 | Improve mobile reading scale where approved            | Designer + developer          | S      | Long-form body text is comfortably readable at phone widths without breaking reference-led layouts                |
| SEO-36 | Convert CSS PNG backgrounds to modern delivery         | Developer + designer          | M      | WebP/AVIF or equivalent loads by breakpoint with visual parity and no duplicate transfer                          |

## P3 — Growth and measurement

Start only after indexability and measurement are stable.

| ID     | Action                                                   | Owner                       | Effort      | Definition of done                                                                                                 |
| ------ | -------------------------------------------------------- | --------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------ |
| SEO-37 | Verify Search Console and Bing Webmaster properties      | Owner + SEO                 | S           | Domain properties are verified and access is shared with accountable staff                                         |
| SEO-38 | Add privacy-approved analytics and SEO conversion events | Owner + privacy + developer | M           | No PII is collected; organic landings, outbound actions, forms and downloads are measurable                        |
| SEO-39 | Submit final sitemap and inspect representative URLs     | SEO                         | S           | Sitemap accepted; Home, service, support, Investor, Blog and job examples pass URL Inspection                      |
| SEO-40 | Establish CrUX/PageSpeed and real-user monitoring        | Developer + SEO             | M           | LCP/INP/CLS tracked at p75 on mobile and desktop; regression owners are assigned                                   |
| SEO-41 | Capture an SEO drift baseline                            | SEO + developer             | S           | Canonicals, robots, titles, descriptions, headings, schema and sitemap are monitored across releases               |
| SEO-42 | Run first-party keyword/SERP research                    | SEO                         | M           | GSC queries and approved live SERP data validate titles, page types and content priorities                         |
| SEO-43 | Build a compliance-led content cluster program           | SEO + qualified authors     | L ongoing   | Each article serves a real audience need, has expert review, original value and internal links                     |
| SEO-44 | Preserve and grow authoritative mentions                 | PR + compliance + SEO       | L ongoing   | Regulator/exchange/entity listings are consistent; useful assets earn editorial links; no paid/link-scheme tactics |
| SEO-45 | Review launch at 7, 30 and 90 days                       | Owner + SEO + developer     | S recurring | Coverage, redirects, CWV, queries, conversions and errors have written follow-ups                                  |

## Recommended content clusters

Validate these with Search Console and live SERP research before committing a calendar. Do not target broad financial terms without demonstrable expertise and compliance review.

Do not scale the Blog while every article uses the generic `/blog/post/?id=...` shell. First approve permanent crawlable slugs, unique initial metadata/content and a content model that separates intent: a commercial Services hub, an educational Learn hub, Support, Investors, and a Blog/archive view that does not duplicate the educational URLs. These are information-architecture recommendations, not authorization to migrate or add routes.

1. Demat/trading account operations: opening, modification, closure, holdings, statements and support.
2. Mutual-fund education: goals, risk profiles, costs, KYC, review/rebalancing and NRI workflows.
3. Trading-platform support: WINSTOCK/WINVEST installation, updates, security, troubleshooting and official downloads.
4. Investor relations: results, annual reports, governance, Regulation 46 and shareholder processes.
5. Complaint resolution: IndoThai support, escalation, SCORES, Smart ODR and expected timelines.
6. Market education: only topics authored/reviewed by qualified people with sources, dates and clear risk language.

The recommended first editorial cluster is a source-backed “Mutual Funds for Beginners in India” pillar, supported by:

- what mutual funds are and how they work;
- types of mutual funds in India;
- NAV, expense ratio and exit load;
- how to start a SIP;
- SIP versus lump sum;
- mutual-fund KYC and documents;
- the mutual-fund Riskometer;
- direct versus regular funds;
- how to read a fund factsheet;
- NRI mutual-fund investing;
- NRI KYC documents;
- NRE versus NRO accounts and repatriation.

The pillar should link to every spoke; each spoke should link back and cross-link only to genuinely related siblings. Reposition `/mutual-funds/` as the commercial service page so it does not compete with the educational pillar. Consolidate wording variants such as “what is a mutual fund”/“mutual funds for beginners” and “SIP vs lump sum”/“which is better” unless a full India-localized SERP overlap study proves different intent. The limited spot checks used here are not keyword-volume or ranking evidence.

## Release acceptance checklist

Do not activate indexing until every applicable item is true.

- [ ] Approved production origin and preferred hostname are configured.
- [ ] Preview remains noindexed.
- [ ] Each indexable page has one self-canonical in initial HTML.
- [ ] Every sitemap URL is indexable, canonical and a direct HTTP 200.
- [ ] WordPress/Yoast URLs and backlinks have a keep/redirect/410 decision.
- [ ] All five new Investor routes resolve on production.
- [ ] Corporate Presentation resolves to HTML, not an image redirect.
- [ ] Staging legal/support links are gone from production.
- [ ] Browser-only pages follow the approved index/noindex architecture.
- [ ] Bare/invalid blog and job detail URLs cannot create indexable soft 404s.
- [ ] Compliance approves facts, claims, statistics, risks and regulated copy.
- [ ] Structured data matches visible content and validates.
- [ ] Social images and record-specific metadata are present where applicable.
- [ ] PDF indexing/accessibility policy is implemented.
- [ ] Redirects, 404, HTTPS, caching, compression and headers pass live tests.
- [ ] `npm run format:check`, `npm run check`, `npm test`, browser tests and production build pass from the intended configuration.
- [ ] Search Console ownership and monitoring are ready before sitemap submission.

## Guardrails

- Do not change Strapi code, schema, permissions, CORS or configuration as a shortcut for SEO.
- Do not perform live contact, complaint, closure, upload or application tests without separate approval.
- Do not invent URLs, authors, salaries, returns, ratings, hours, coordinates, dates or financial facts.
- Do not remove preview `noindex` before the release checklist is approved.
- Do not add `HowTo`, self-review rating markup or unsupported FAQ rich-result markup.
- Do not replace the current WordPress sitemap/routing until the legacy inventory and redirects are reconciled.
- Do not treat an audit score, Lighthouse run or schema validation as compliance or ranking approval.

See [FULL-AUDIT-REPORT.md](FULL-AUDIT-REPORT.md) for evidence, scores and route-level findings.
