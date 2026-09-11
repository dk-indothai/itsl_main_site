# IndoThai post-launch SEO audit

Audit date: 12 September 2026

Production origin: `https://indothai.co.in/`

Business type: regulated securities broker and financial-services company serving India

## Executive summary

The current live deployment has a critical launch issue: all public pages return
`noindex, nofollow`. Search engines may crawl the site, but they are explicitly
instructed not to show any of its pages in results. The live pages also omit
canonicals, `og:url`, social images and structured data.

The repository remediation in this change removes that blocker for the 15 stable
sitemap routes. It does not change the live website until a new build is deployed.
The Blog post and Job Details query shells intentionally remain `noindex, follow`
because their static, browser-only architecture cannot return record-specific
initial metadata or real 404/410 responses.

| Measurement                    |  Score | Meaning                                                                              |
| ------------------------------ | -----: | ------------------------------------------------------------------------------------ |
| Live production baseline       | 49/100 | Current deployed site, dominated by the global noindex and absent schema/canonicals  |
| Remediated repository estimate | 68/100 | Expected after deployment; architecture, content governance and routing risks remain |

The score is a prioritization aid, not a ranking forecast or compliance approval.

### Category scores

| Category            | Weight | Live | Remediated build | Remaining constraint                                                                    |
| ------------------- | -----: | ---: | ---------------: | --------------------------------------------------------------------------------------- |
| Technical SEO       |    22% |   41 |               78 | `www` failure, legacy redirects, CMS content absent from initial HTML                   |
| Content quality     |    23% |   43 |               43 | Financial claims, sourcing, authorship and copy review require owner/compliance input   |
| On-page SEO         |    20% |   58 |               72 | Stable pages improve; query records remain generic and noindexed                        |
| Structured data     |    10% |    0 |               85 | Shared factual graph added; record schema remains intentionally absent                  |
| Performance         |    10% |   76 |               82 | Hashed caching and Investor layout stability improve; no field data is available        |
| AI-search readiness |    10% |   24 |               55 | Crawlable entity graph added; important CMS records remain client-rendered              |
| Images/social       |     5% |   86 |               90 | Shared social image added; there are no record-specific Blog images in initial metadata |

## Evidence from the live site

- All 15 sitemap URLs returned direct HTTP 200 responses.
- Every sampled content route emitted `noindex, nofollow`, with no canonical or
  JSON-LD.
- `https://indothai.co.in/sitemap.xml` returned valid XML with 15 unique HTTPS,
  slash-terminated URLs. It correctly omitted the 404, redirect page and bare
  Blog/Job query shells.
- `robots.txt` permitted general search crawling but did not advertise the
  sitemap. Cloudflare prepended managed content-signal rules that allow search
  use while blocking several AI-training crawlers.
- Apex HTTP redirected to apex HTTPS in one hop. `https://www.indothai.co.in/`
  returned Cloudflare 522 and did not redirect to the preferred host.
- `/investors/` returned HTTP 200 with a meta/JavaScript redirect rather than a
  permanent HTTP redirect.
- A made-up path returned a real HTTP 404, then the current 404 document sent the
  visitor to Home.
- The live CMS rendered one Open job, zero Blog posts, zero software downloads,
  and populated Investor records after JavaScript ran.
- Hashed `/_astro/` assets used a four-hour revalidating cache policy rather than
  long-lived immutable caching.

## Changes implemented in this repository

1. Configured the approved production origin in Astro.
2. Made the 15 stable sitemap routes emit:
   - `index, follow` plus full snippet/image preview directives;
   - one absolute self-referencing canonical;
   - matching `og:url`;
   - a large shared social preview image and Twitter account metadata;
   - a factual Organization, WebSite and WebPage JSON-LD graph.
3. Kept `/blog/post/` and `/careers/job/` at `noindex, follow`, without misleading
   generic canonicals or record schema.
4. Added `SITE_INDEXING=false` as the public-preview safety switch. In this mode,
   all normal pages return `noindex, nofollow` and `robots.txt` omits the sitemap.
5. Generated `robots.txt` from the same build switch and advertised the production
   sitemap only in an indexable build.
6. Added immutable one-year caching instructions for content-hashed `/_astro/`
   assets.
7. Added mobile result-space reservation to the five CMS-backed Investor pages to
   prevent the footer from jumping when records arrive.
8. Expanded automated tests for sitemap/canonical/index alignment, JSON-LD,
   production social metadata, immutable asset caching and Investor result-space
   reservation. The preview safety switch was also built and inspected directly.

No Strapi code, schema, permission, CORS setting or record was changed. No live
form, upload, application, complaint or closure request was submitted.

## Indexing policy after deployment

| Routes                                    | Policy                             | Reason                                                                            |
| ----------------------------------------- | ---------------------------------- | --------------------------------------------------------------------------------- |
| The 15 URLs in `sitemap.xml`              | Indexable and self-canonical       | Stable public landing pages                                                       |
| `/blog/post/?id=…`                        | `noindex, follow`; no canonical    | Record metadata/content/status are unavailable in initial static HTML             |
| `/careers/job/?id=…`                      | `noindex, follow`; no canonical    | Same limitation; current fields are also insufficient for valid JobPosting markup |
| `/investors/`                             | `noindex, nofollow` redirect shell | Compatibility path, not a landing page                                            |
| Unknown paths/404                         | `noindex, nofollow`                | Error response                                                                    |
| Public preview with `SITE_INDEXING=false` | `noindex, nofollow`                | Prevent duplicate preview indexing                                                |

Shareholder category parameters canonicalize to the base Shareholder Relation
page. Marketing parameters similarly consolidate to each stable page's clean URL.

## Remaining high-priority issues

### 1. Deploy and verify the remediation

The live site remains noindexed until this repository build is deployed. After
deployment, verify the homepage, one Investor page and one support page directly,
then submit `https://indothai.co.in/sitemap.xml` in Google Search Console and Bing
Webmaster Tools. Indexing is not instantaneous or guaranteed.

### 2. Fix the `www` hostname at Cloudflare

`www.indothai.co.in` currently returns 522. Configure the hostname/DNS/origin and
permanently redirect every `www` URL to the matching apex HTTPS URL. This is a
hosting change, not a repository-only fix.

### 3. Create a legacy WordPress redirect map

Previously discoverable paths such as `/job-openings/`, `/job-role/`,
`/category/uncategorized/`, `/site-map/`, `/disclaimer/` and
`/product-services/` currently return 404. Approve a keep/301/410 decision from
the old URL inventory and Search Console data. Do not redirect unrelated pages to
Home.

The `/investors/` compatibility shell should become an edge/server 301 or 308 only
when the platform can preserve `shareholder_type`, including an empty value, while
dropping unrelated query parameters.

### 4. Decide whether CMS records must rank

Downloads, Careers, Blog and five Investor pages fetch records in the browser.
Their stable hubs may be indexed after this change, but important records and
document links are absent from initial HTML. Search engines may render them later;
many AI and accessibility-adjacent crawlers will not.

If Blog posts, individual jobs or disclosure documents must be organic landing
pages, approve an SEO rendering architecture that provides stable URLs, unique
initial HTML/head metadata, accurate HTTP status codes and record-level sitemaps.
The current project contract prohibits build-time Strapi reads and a server
adapter, so that work is not safe to infer from this audit.

### 5. Replace staging legal destinations only after approval

Disclaimer, RA Disclaimer, Privacy Policy, Terms of Use, Site Map, FAQ, Download
Forms and the grievance matrix still point to the approved WordPress staging
host. This weakens trust on a live financial site, but this audit did not invent
production destinations or migrate unapproved pages.

### 6. Complete financial-content governance

Financial/YMYL statements need a compliance-reviewed fact sheet, source or
methodology, responsible reviewer and an “as of” date where appropriate. Examples
include “low-risk commodity trading”, “maximize returns”, “higher efficiency”,
“safe” investments, managed-wealth/client counts, locations and 24/7 support.
The known ₹155 crore/₹160 crore timeline conflict and other source anomalies remain
unchanged under the project instructions.

The Blog currently contains no published posts and has no author/reviewer/source
fields. Do not add BlogPosting markup or scale financial articles until visible
authorship, credentials, review, sources and update dates are maintained.

### 7. Hosting and field-performance follow-up

The live host has Brotli, HTTPS, `X-Content-Type-Options` and a strict-origin
referrer policy. HSTS, CSP/frame protection and Permissions Policy were not
observed; configure them only after testing application, PDF and third-party
behavior.

No Search Console, GA4, CrUX or PageSpeed credentials were available. PageSpeed's
unauthenticated endpoint returned 429. Fresh unthrottled mobile Chromium lab data
showed LCP under 2.5 seconds on sampled Home, About and Blog pages; a valid job
detail measured 2.37 seconds. These are not field Core Web Vitals. The original
five Investor pages showed poor insertion CLS of 0.27–0.39, which the new
result-space reservation targets.

## Content and search-experience priorities

- Keep official company identity, SEBI registrations, address, phone/email,
  regulator links and grievance information prominent; these are the strongest
  trust signals.
- Publish compliance-reviewed Blog material before treating Blog as a growth hub.
- Add useful, sourced risk, suitability, fee, process and NRI context to Mutual
  Funds without generic padding.
- Add approved operating-system, version, update-date and support information to
  Downloads once software is published.
- Expand Careers with truthful team, location, process and workplace information.
- Improve visible grammar and readability only through an approved editorial pass;
  several awkward or misspelled source phrases remain intentionally preserved.
- Build contextual links only to approved routes. Do not invent service pages.

## Tool limitations

- No Google Search Console, GA4, CrUX, PageSpeed API, Moz or Bing Webmaster
  credentials were available.
- No DataForSEO integration was available.
- Performance figures are lab observations, not real-user p75 data.
- The remediation build cannot be live-verified until it is deployed.
- Rank checks were not treated as reliable evidence while the site is explicitly
  noindexed.

See [ACTION-PLAN.md](ACTION-PLAN.md) for the ordered handoff.
