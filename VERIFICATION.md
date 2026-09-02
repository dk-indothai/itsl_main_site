# Homepage verification

Implementation review: 2 September 2026. This records a local homepage build,
not deployment readiness or regulatory/accessibility approval.

## Checks completed

| Check                               | Result                                                                                                                                                  |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run format:check`              | Passed.                                                                                                                                                 |
| `npm run check`                     | Passed: zero errors, warnings or hints.                                                                                                                 |
| `npm test`                          | Passed, including a production static build.                                                                                                            |
| `node tests/static-output.test.mjs` | All eight assertion groups passed.                                                                                                                      |
| `npm run test:browser`              | All 16 Chromium tests passed after the owner-requested refinements.                                                                                     |
| `npm run test:dev`                  | All five development-mode viewport/image tests passed.                                                                                                  |
| `npm run build`                     | One static page generated in `dist/`.                                                                                                                   |
| Design-document lint                | Zero errors or warnings; token groups intentionally reference the CSS owner.                                                                            |
| Version control                     | Git initialized locally. Source, local assets, lockfile, tests and documentation are included; generated artifacts and environment secrets are ignored. |

Browser asset tests used 1280px, 768px, 729px, 390px and 320px widths. At each width the
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

## Visual comparison

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

## Output and performance observations

The production page has one H1, title/description, social text metadata and
`noindex, nofollow`, with no invented production canonical. Runtime images,
styles, fonts and scripts are local; account/social/regulatory destinations remain
external links. There are no React islands, third-party carousel runtime,
analytics scripts or contact endpoints.

The inspected production build contains approximately 32 KB of CSS (about 7 KB
when gzip-compressed in a local measurement) and 3 KB of inline application
JavaScript before compression. The three local variable font files total about
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

- Only Home is built. About Us and Mutual Funds still use their staging links.
- No hosting, production routing, sitemap, canonical/social-image origin,
  indexing activation, redirects or deployment has been configured.
- Contact delivery and the floating accessibility toolbar/compliance decision
  remain deferred as requested.
- External destination values were checked against source markup; authenticated
  account, payment/transfer, IPO and trading workflows were not exercised.
- Automated browser coverage is Chromium. Safari, Firefox, physical touch devices,
  screen readers, a complete contrast/zoom audit and compliance approval remain
  outstanding. No accessibility conformance certification is claimed.
- Financial/regulatory copy, publication permissions and source anomalies require
  the website owner’s release approval.
- The previous project was not modified. Normal builds do not read it or WordPress.
