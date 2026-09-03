# Three-page migration verification

## Contact endpoint integration — 3 September 2026

Home and Mutual Funds now use the same browser-only JSON POST handler for the
existing Strapi contact endpoint. Static output, three-route scope, visual token
ownership and `noindex, nofollow` remain unchanged. This supersedes the preview-only
contact assertions in the historical migration results below.

Owner-requested simplification: the four fields and handler now live in
`Contact.astro`. Removed the field/response helper layer, separate submission script,
leave-page warnings and two-build test setup. Client errors stay inline; backend
errors use safe form-level feedback. Tests use one mock-configured build/server.
The checks below were rerun for this simplification.

| Check                          | Result                                                                                                                               |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| Formatting                     | `npm run format:check` passed.                                                                                                       |
| Astro/TypeScript               | `npm run check`: 51 files, zero errors, warnings or hints.                                                                           |
| Static checks                  | `npm test` passed; direct non-isolated execution passed all 18 assertions.                                                           |
| Production build               | Three static routes generated. Both the mock-configured and normal local builds passed; `dist/` was rebuilt with the local endpoint. |
| Production browser tests       | `npm run test:browser`: all 61 Chromium tests passed, including 30 contact tests.                                                    |
| Development image/layout tests | `npm run test:dev`: all 15 checks passed across the three routes on the isolated rerun.                                              |
| Design checks                  | Design-document lint and strict frontend static audit passed with zero errors/warnings; `git diff --check` passed.                   |

The first development run passed 13/15 checks; two encountered a page reload while
formatting/build verification was running alongside it (detached DOM/context errors).
Rerunning without simultaneous builds or edits passed all 15. No test assertions
were weakened to address those interruptions.

Verification covers required fields/email, optional message, international phone
formatting, exact four-field payload, no authorization/cookie/referrer headers,
duplicate-submit prevention, inline errors/focus, retained values on failure,
confirmed-success clearing, 400/422/401/403/429/500 responses, malformed responses,
network failure, and the 20-second timeout without automatic retries. A separate
composition check verifies that text composition cannot submit early. The disabled
client fallback is tested by removing the endpoint from a page fixture before its
script runs, not by maintaining a second build/server. No-JavaScript checks still
use actual generated HTML. All requests to the test endpoint `http://strapi.test`
are intercepted; automated browser tests do not create Strapi records.

Desktop (1280px), phone (390px) and narrow-phone (320px) error/success screenshots
were captured for both forms. Desktop Home errors and phone Mutual Funds success
were visually inspected; existing layout and image checks cover all three pages
at 1280, 768, 729, 390 and 320px. Form feedback uses reserved space, token-owned
error colors and an accessible status region outside the busy fieldset.
These checks are not screen-reader or full accessibility conformance approval.

**Earlier live smoke test (before simplification):** the local preview on port 4323 submitted one synthetic
enquiry from each page to `http://localhost:1337/api/contact-forms`, without an API
token. Both returned HTTP 201 with a created Strapi document, showed success and
cleared the form. Neither page acquired query parameters. The two test entries are
named `Website integration smoke test - Home` and
`Website integration smoke test - Mutual Funds`, using
`website-smoke-test@example.invalid`; they remain in Strapi. No existing enquiries
were read, changed or deleted. Strapi's repository stayed clean and its code,
schema, permissions, CORS and configuration were not changed. Admin-list retrieval
and email delivery were not tested; no email integration was added. This
simplification does not repeat those live submissions or create additional records.

Release limitations: existing backend permissions/CORS and publication behavior
remain the owner's responsibility. No backend rate limiter/honeypot or CAPTCHA is
included. Production HTTPS/origins, server-side abuse protection, staff permissions,
privacy/retention review and revoking the previously shared token remain outstanding.
The endpoint URL is public configuration; no token is used or stored by this change.

### Previous migration baseline (historical)

Implementation review: 2 September 2026. This records local Home, About Us and Mutual Funds builds,
not deployment readiness or regulatory/accessibility approval.

## Checks completed

| Check                        | Result                                                                                                                                                                                                |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run format:check`       | Passed.                                                                                                                                                                                               |
| `npm run check`              | Passed: zero errors, warnings or hints.                                                                                                                                                               |
| `npm test`                   | Passed, including a production static build.                                                                                                                                                          |
| Direct static test execution | Eight homepage/shared groups and ten secondary-page groups passed (18 total).                                                                                                                         |
| `npm run test:browser`       | All 33 Chromium tests passed, including the 16 homepage regressions, static NRI overlay and About Us viewport/header checks.                                                                          |
| `npm run test:dev`           | All 15 development-mode viewport/image tests passed across three routes.                                                                                                                              |
| `npm run build`              | Three static routes generated in `dist/`: Home, About Us and Mutual Funds.                                                                                                                            |
| Design-document lint         | Zero errors or warnings; token groups intentionally reference the CSS owner.                                                                                                                          |
| Frontend static audit        | Strict audit passed with zero findings; not a substitute for browser/accessibility review.                                                                                                            |
| Version control              | Homepage and secondary-page commits retained. This changeset contains the NRI illustration and About Us hero/header refinements. Generated artifacts remain ignored; no push or deployment performed. |

Browser asset tests used 1280px, 768px, 729px, 390px and 320px widths on every route. At each width the
document fit within the viewport, every tested image loaded, and no page-level
JavaScript errors were observed. The reference itself measured 394px wide at a
390px viewport; this overflow was not reproduced in the migration.

Verified interactions: primary and utility navigation, nested disclosure keyboard
operation, Escape focus restoration, outside-click dismissal, closed-menu tab
order, mobile account actions, all six testimonials, previous/next controls,
pause/resume, the five-second autoplay interval, reduced-motion automatic-motion
suppression, and readable no-JavaScript content/native disclosures.

The contact safety test filled synthetic values and pressed Enter: no submission
request or value-containing URL occurred. The button remained disabled; the fields
have no form owner or names. Static checks also enforce those constraints.

## About Us and Mutual Funds verification

- Checked complete section order: nine About Us sections and seven Mutual Funds
  sections, with shared footer after each. No contact form was added to About Us.
- About Us retains six directors, three values, four company links, five gallery
  photographs and all 11 milestone events. Original desktop/mobile timeline SVGs
  use matching responsive text transcripts. Only one transcript is exposed at a
  time. The source's currency-year and raised-amount disagreements are recorded
  in README, not silently reconciled.
- Mutual Funds retains three introductory paragraphs, five investment steps,
  six benefit cards, WINVEST content and six NRI support cards. Its login,
  Start Investing and store-badge links retain their distinct original URLs.
- Normalized heading/text-widget comparison covered 33 source widgets on About Us
  and 23 on Mutual Funds; none were missing from the generated HTML. This checks
  copy preservation, not the truth of financial or company-history claims.
- All 42 added image/icon assets are local (23 About Us, 19 Mutual Funds).
  Thirty-two were byte-equal to the prior project's assets. Responsive picture
  sources, images, styles and scripts resolve within build output.
- Tested current-page navigation, local links in both directions, nested keyboard
  disclosure controls, Escape focus restoration, outside-click dismissal and
  closed-menu tab order on both new routes. No-JavaScript/reduced-motion contexts
  retain readable sections and native navigation.
- Contact safety was tested separately on Mutual Funds with synthetic values.
  No submission or URL serialization occurred; phone/email links remain available.
- Both new routes returned HTTP 200 on the user's existing development preview
  at port 4323. All 22 About Us and 19 Mutual Funds main-content image elements
  decoded successfully, with no observed HTTP error responses.

The initial new mobile-menu test tried to click a heading covered by the open
menu; it was corrected to click genuinely outside the menu. The passing tests
do not bypass pointer hit-testing. Initial captures overlapping a rebuild were
refreshed from the completed build.

## Visual comparison

### Static NRI overlay and full-screen About Us follow-up

The owner requested a left-to-right flight trajectory crossing the NRI heading
and cards, then clarified that it must not animate. The resulting illustration
is a static, subtle foreground overlay with the original plane at its right
endpoint. It has no script, animation or pointer hit target and is hidden from
assistive technology. The earlier experimental animation was removed, not paused.
This explicitly supersedes the separated-divider treatments recorded below.

The regression checks eight widths from 320px to 1920px, including the reported
1327px viewport: overlay depth, heading/card overlap, zero animations, the 64px
plane box, containment, 60px heading-to-card gap and no horizontal overflow.
Live development screenshots at 1327px, 768px and 390px were captured; desktop
and phone captures were inspected for the line crossing content and the card layout.

About Us now fills the small viewport height with the cover-cropped office photo.
Its sticky header overlays the photo with a 50%-opaque white background; the header
itself has opacity 1, so its logo, text and actions are not faded. The menu remains
solid white. Automated checks at 1327px, 768px, 390px and 320px confirmed the hero
starts at y=0 and fills a 926px-high viewport, the photograph fills the hero,
the header remains sticky, and Escape restores focus after opening the menu.
Home and Mutual Funds retain solid header backgrounds.

Formatting, Astro checks (50 files, zero diagnostics), static-output tests,
the three-route production build, all 33 production browser tests and all 15
development asset/layout tests passed. Design lint and the strict frontend audit
reported zero errors or warnings. Screenshot evidence is ignored under
`artifacts/flight-and-about/` and browser test output. An initial capture was
interrupted by hot reload; a later lazy-image capture was corrected to scroll
the plane into view before decoding it. The final capture completed successfully.
These checks remain Chromium-only, not full contrast/compliance certification.

### Previous card-aligned NRI flight-path refinement (superseded)

After the owner rejected the miniature divider, the heading decoration was
recomposed as a wide, shallow SVG route aligned with the card grid. The line has
a non-scaling stroke; the original plane is independently sized and positioned
inside the reserved track. The complete decoration remains below the heading in
normal flow. This supersedes both flight-layout experiments recorded below.

The track is 80px high with 12px heading clearance and 40px separation before the
cards. The plane image box stays 64px square, including its transparent inset,
rather than shrinking with the illustration. Its embedded PNG bytes match the
original `fund-bg.svg`; both original flight files remain untouched. The new
shallow curve is an intentional owner-requested design refinement, not an exact
copy of the original flight path. No wording, heading typography, card styles,
page-wide section gaps or browser behavior changed.

Local preview screenshots at 1081px, 1679px, 768px and 390px were inspected.
The regression covers eight widths from 320px to 1920px, checking card alignment,
stable plane size, track containment, text clearance and no horizontal overflow.
Evidence is ignored under `artifacts/nri-flight-layout/` and browser test output.
Formatting, Astro/TypeScript checks, static-output tests, the production build,
32 production browser tests, 15 development browser tests, design lint and the
strict frontend audit passed for this revision.

### Compact NRI flight-divider follow-up

The owner found the full-width flight artwork left too much space beneath the
heading at 1081px. It is now centered and capped by `--nri-flight-max`, with the
smaller `--space-xs` heading gap. Original artwork proportions are preserved;
normal document flow still prevents text overlap. Card spacing and the shared
outer section rhythm are unchanged. These dimensions supersede the initial
overlap repair below.

Live preview screenshots were inspected at 1081px, 1679px, 768px and 390px. At
1081px the heading/artwork group is approximately 264px tall, about 120px shorter
than the preceding full-width version. The updated regression covers eight
widths from 320px to 1920px and checks an 8px heading gap, centered artwork no
wider than 560px or taller than 150px, preserved card clearance and no overflow.
Evidence is ignored under `artifacts/nri-flight-compact/` and browser test output.
Formatting, Astro checks, all 18 static assertion groups, the build, 32 production
and 15 development browser tests, design lint and the strict frontend audit passed.
The development server emitted one Astro toolbar audit `Failed to fetch` message;
the page asset and browser-error assertions still passed on all three routes.

### NRI flight-path overlap follow-up

The owner reported the flight path crossing the Mutual Funds NRI heading at
1679px. Its full-width artwork was absolutely positioned inside a smaller fixed
padding allowance. It now follows the heading in normal document flow, using the
existing spacing tokens. Original artwork, wording, typography and card styles
are unchanged; no JavaScript or new design values were added.

The new browser regression checks heading/artwork and artwork/card separation
at 1920px, 1679px, 1280px, 768px, 729px, 390px and 320px. Live development-preview
measurements at 1679px, 768px and 390px showed 20px heading clearance, 40px card
clearance and no horizontal overflow; screenshots at those widths were inspected.
Evidence is ignored under `artifacts/nri-flight/` and the browser test output.

Formatting, Astro checks, the production build, all 18 static assertion groups,
32 production browser tests, 15 development tests and the strict frontend audit
passed. Design lint passed using the locally cached official CLI after the npm
registry lookup failed. A direct static check initially overlapped a rebuild and
found no `dist/index.html`; rerunning it after the build passed both groups.

### Section-spacing follow-up

The owner requested more breathing room across all three pages after migration.
The new `--space-section-gap` token controls both the gaps between main sections
and the space before the footer: 128px desktop, 96px tablet and 72px phone.
Live measurements at 1280px, 768px and 390px confirmed those distances on every
route. Internal colored-band padding remains 96px, 80px and 56px respectively;
the separate `--space-section` token was not changed. Content, typography,
imagery and controls are unchanged.

Before/after boundary screenshots were captured on all three routes at those
widths and representative desktop/tablet/phone comparisons were inspected.
The 31 production browser tests and 15 development tests passed with stronger
assertions for exact section gaps and footer separation at five widths.
Formatting, Astro checks, all 18 static assertion groups, the static build,
design-document lint and the strict frontend audit passed. Evidence for this
follow-up is ignored under `artifacts/section-spacing/`. These gap values supersede
the earlier homepage measurements below; they are an owner-requested refinement,
not a claim of pixel equality with staging.

### Initial migration comparison

Both new routes were captured at 1280px, 768px, 390px and 320px; staging captures
cover the first three widths. Review covered the heroes, company/profile photos,
portraits, timeline variants, values, logos/gallery, investment artwork/steps,
blue bands, app promotion and NRI cards. Corrections included the tablet company
stack, source hero/subtitle scales, value-card borders, heading colors, original
mobile artwork and descriptive image alternatives. About Us hero text measures
80/60/40px and Mutual Funds 80/60/44px at desktop/tablet/phone. Source mobile
heading line heights as small as 3.2px were not reproduced. The shared outer
section rhythm remains unchanged.

These are measured and visual checks, not pixel-perfect approval. WordPress
entrance/scroll animations can leave the source timeline overlapping its next
section or produce temporarily blank content in full-page screenshots; use the
section captures and static artwork for comparison. The migration does not copy
those transient failures. Browser screenshot stitching can also show displaced
fixed-header/skip-link fragments; live DOM checks confirmed the skip link remains
offscreen until focused and the wrapped director role remains within its section.

### Homepage regression context

Staging and local screenshots were captured at desktop, tablet and phone widths.
The local capture also includes 320px. Section inspection covered the hero,
services, office imagery/About band, statistics, account-opening panel, app
promotions, testimonials, contact and regulatory footer. The original icons,
portraits, artwork and fonts are local. Shared Raleway hero sizes match the source
at desktop/tablet/phone, and the final statistic values are rendered directly.

The initial comparison corrected app-heading wording, image order, the account panel,
statistic-card arrangement, footer colors and narrow-screen wrapping. It is a
visual inspection, **not** a pixel-difference acceptance score. Owner sign-off
on exact spacing/crops is still appropriate before release.

Later owner-approved changes supersede the original statistics/testimonial layout:
equal-sized metric cards, quote-first testimonial cards with compact controls below,
SVG menu/close and nested chevron icons, a single responsive gap between sections,
and smaller desktop header actions. The gap measured 96px at desktop, 80px at
tablet and 56px below the tablet breakpoint. Header actions measured 40px high at
1644px, matching the captured staging CSS (20px line height plus 10px top/bottom
padding); coarse-pointer devices retain at least 44px targets. All values remain
owned by `tokens.css`, and the design decisions are documented in `DESIGN.md`.

Checks cover consistent metric-card geometry at 729px, 390px and 320px, testimonial
card sizing and pause-control stability, position updates, menu icon states,
section-to-section gaps, and the desktop button height. All six quotes, final
figures, source wording, destinations and reduced-motion behavior are preserved.

Other intentional differences: semantic heading hierarchy; explicit contact labels and
preview status; visible carousel controls; no entrance-animation hiding; safer
tablet/phone reflow; complete regulatory copy on mobile; visible focus states;
and the deferred accessibility toolbar. Source copy/link anomalies are listed in
README and are not silently corrected.

Generated comparison files are ignored artifacts under `artifacts/reference/`
and `artifacts/local/`; browser-test screenshots/traces are in `test-results/`.
The capture commands regenerate them. They are not shipped in `dist/`.

## Previous migration output and performance observations

Each production-build page has one H1, unique title/description, social text metadata and
`noindex, nofollow`, with no invented production canonical. Runtime images,
styles, fonts and scripts are local; account/social/regulatory destinations remain
external links. There are no React islands, third-party carousel runtime,
analytics scripts or contact endpoints.

The inspected build serves a shared CSS bundle of approximately 25 KB plus
page CSS: 4 KB for About Us, 6 KB for Mutual Funds and 11 KB for Home. Combined
gzip sizes are approximately 7–8 KB per route in a local measurement. Each new
page has about 0.85 KB of inline navigation JavaScript; Home has about 3.2 KB
including the carousel. The three local variable font files total about
137 KB. These are file-size observations, not Lighthouse scores, network-transfer
guarantees or measured Core Web Vitals. Host compression/caching and real-device
performance remain release checks.

## Remaining limitations

### Development-image repair (2 September 2026)

The original static-build checks did not catch the user's development-server
failure. Live `/_image/` requests returned HTTP 500 with `MissingSharp`, although
`sharp` was installed and importable from Node. A fresh server initially worked,
but configuration reloads brought the failure back. Explicitly externalizing
`sharp` in the Vite SSR configuration restored native-module loading without
changing imagery, styles, dependencies or production image optimization.

Follow-up checks:

- The exact user preview on port 4323 loaded all 27 image elements, with zero
  broken images and zero HTTP error responses during the full-page inspection.
- An isolated development server returned HTTP 200 for an optimized image before
  and after two simulated configuration-change events; the source file was not
  edited by this probe.
- `npm run test:dev` now runs five viewport/asset checks against a fresh
  development server, separately from the 16 production-preview browser tests.
  The heading assertion is scoped to `main` to exclude Astro's dev-toolbar shadow
  DOM. Both browser suites passed.
- Screenshots confirmed the service icons, office photograph and WINSTOCK artwork
  on the repaired development URL. No visual redesign was made.
- The additional frontend static audit initially reported a missing explicit
  `scrollbar-width` declaration. The subsequent requested UI refinement now
  declares the existing default (`auto`); the latest audit passed with zero findings.

### Release work still pending

- All three approved pages are built. Other WordPress pages remain external;
  no additional page, calculator, transaction or account flow was migrated.
- No hosting, production routing, sitemap, canonical/social-image origin,
  indexing activation, redirects or deployment has been configured.
- The contact client and local endpoint smoke test are implemented as recorded
  above; production contact security/privacy configuration is not included.
  The floating accessibility toolbar/compliance decision remains deferred.
- External destination values were checked against source markup; authenticated
  account, payment/transfer, IPO and trading workflows were not exercised.
- Automated browser coverage is Chromium. Safari, Firefox, physical touch devices,
  screen readers, a complete contrast/zoom audit and compliance approval remain
  outstanding. No accessibility conformance certification is claimed.
- Financial/regulatory copy, publication permissions and source anomalies require
  the website owner’s release approval.
- The previous project was not modified. Normal builds do not read it or WordPress.
