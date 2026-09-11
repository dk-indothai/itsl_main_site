# IndoThai SEO action plan

Updated: 12 September 2026

## Completed in the repository

- [x] Configure `https://indothai.co.in` as the canonical Astro origin.
- [x] Make all 15 stable sitemap routes indexable and self-canonical.
- [x] Keep Blog post and Job Details query shells noindexed.
- [x] Add `og:url`, shared large social imagery and Twitter metadata.
- [x] Add factual Organization, WebSite and WebPage JSON-LD.
- [x] Advertise the production sitemap from production `robots.txt`.
- [x] Add `SITE_INDEXING=false` protection for public preview builds.
- [x] Add immutable caching rules for content-hashed Astro assets.
- [x] Reserve mobile result space on the five client-rendered Investor pages.
- [x] Add automated SEO/indexing and layout-stability regressions.

These items are implemented and tested locally. They do not affect production
until a new build is deployed.

## P0 — do immediately

| Action                           | Owner                     | Done when                                                                                           |
| -------------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------- |
| Deploy this remediation build    | Developer/hosting         | Live stable pages show `index, follow`, one self-canonical and JSON-LD; query shells remain noindex |
| Verify the production build flag | Developer/hosting         | Production does not set `SITE_INDEXING=false`; every public preview does                            |
| Fix `www.indothai.co.in`         | DNS/Cloudflare owner      | HTTPS `www` returns a one-hop 301/308 to the matching apex URL instead of 522                       |
| Submit the sitemap               | Search Console owner      | Google and Bing accept `https://indothai.co.in/sitemap.xml`; representative URLs are inspected      |
| Approve legacy URL decisions     | Owner + SEO               | Every known WordPress URL has a keep/301/410 destination based on real equivalence                  |
| Replace staging legal links      | Owner + legal + developer | Approved production Disclaimer, Privacy, Terms, FAQ, forms and grievance URLs exist and are linked  |
| Review financial claims          | Compliance + owner        | Claims, statistics, milestone conflicts, risks and dates have one approved source of truth          |

Do not submit forms or test live uploads/applications as part of deployment
verification.

## P1 — next 30 days

| Action                                                   | Owner                   | Done when                                                                                                                        |
| -------------------------------------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Choose an SEO rendering policy for CMS content           | Owner + developer + SEO | Blog posts, jobs, software and Investor records are either present in initial HTML or intentionally noindexed                    |
| Replace `/investors/` client redirect                    | Hosting + developer     | Edge 301/308 preserves only the approved `shareholder_type` behavior                                                             |
| Add CMS record SEO fields only if record pages will rank | Owner + CMS editor      | Stable slug, title/description, published/updated dates, author/reviewer or job location/date fields are truthful and maintained |
| Establish editorial governance                           | Compliance + editor     | Financial pages and articles have named responsibility, sources, dates and review cadence                                        |
| Publish or defer Blog                                    | Editor + compliance     | The Blog has reviewed posts with real authorship, or the empty hub is intentionally removed/noindexed                            |
| Measure field performance                                | Analytics owner         | Search Console/CrUX or privacy-approved RUM tracks p75 LCP, INP and CLS                                                          |
| Review security headers                                  | Hosting/security        | HSTS, CSP/frame protection and Permissions Policy are tested before activation                                                   |

Do not add BlogPosting or JobPosting merely to satisfy a validator. Add them only
when their required facts match visible, crawlable record pages.

## P2 — next 60–90 days

- Expand Mutual Funds with compliance-approved risk, suitability, cost, KYC and
  NRI information.
- Add software version, OS, release-date, installation and official-support details
  when Downloads contains products.
- Add truthful Careers culture, team, process, location and equal-opportunity
  information.
- Add dated HTML summaries to Investor document hubs so they remain useful before
  scripts run.
- Review image/background delivery; the Home account background is about 245 KB
  and loads before it is needed.
- Set up SEO drift checks for titles, robots, canonicals, schema, status codes and
  sitemap membership.
- Review Search Console coverage, queries, redirects and Core Web Vitals at 7, 30
  and 90 days after deployment.

## Production acceptance checks

After deployment, verify all of the following:

1. The homepage source contains `index, follow`, canonical
   `https://indothai.co.in/`, `og:url`, a reachable social image and valid JSON-LD.
2. Every sitemap URL returns direct HTTP 200 and the same canonical URL.
3. `/blog/post/` and `/careers/job/` remain `noindex, follow` and are absent from
   the sitemap.
4. Unknown URLs return HTTP 404 and remain noindexed.
5. `robots.txt` includes `Sitemap: https://indothai.co.in/sitemap.xml`.
6. `/_astro/*` responses use the immutable one-year cache policy.
7. The homepage, Investor content, menus and forms render without regression on
   phone and desktop widths.
8. No production page links to a destination that legal/ownership has withdrawn.

See [FULL-AUDIT-REPORT.md](FULL-AUDIT-REPORT.md) for evidence and limitations.
