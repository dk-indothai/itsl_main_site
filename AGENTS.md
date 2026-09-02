# Agent instructions: IndoThai website

## Project status

The static Astro + TypeScript + Tailwind v4 Home (`/`), About Us (`/about-us/`)
and Mutual Funds (`/mutual-funds/`) pages are implemented and link locally.
All other unbuilt pages still link to staging. The previous project remains
read-only. Nothing has been deployed. Read `README.md`, `DESIGN.md`
and `VERIFICATION.md` before changes; distinguish implementation from release approval.

Owner-approved refinements include aligned statistic cards, quote-first testimonial
cards with compact controls, SVG disclosure icons, compact header actions and a
centralized section gaps across all three pages. Preserve these changes rather than restoring
the source's overlaps/backdrop; see `DESIGN.md` for their token ownership.
The NRI header now uses a shallow, card-aligned flight path and a consistently sized
original plane icon. Keep the decoration clear of the heading and do not restore
the rejected miniature flight-strip treatment.

## Scope and sources of truth

- Migrate only Home (`/`), About Us (`/about-us/`), and Mutual Funds
  (`/mutual-funds/`) to static Astro pages.
- Use the [staging website](https://staging-e356-indothaiweb.wpcomstaging.com/)
  as the design and content reference. Preserve its layouts, typography, imagery,
  content, and approved external links unless the user approves a change.
- The previous attempt is at `/home/mrrobot/Projects/itsl-website`. Use it as a
  structural reference and inspect reusable assets; it is not the authoritative
  design. Do not modify it or blindly copy its placeholders and incomplete flows.
- Do not migrate additional pages or rewrite financial or regulatory copy without
  approval. Keep navigation to unmigrated WordPress pages working using approved
  destinations; never invent URLs.

## Architecture and maintainability

- Use standard Astro components, TypeScript, semantic HTML, and Tailwind CSS v4.
  Use ordinary component CSS only where it improves clarity or handles styling
  that utilities do not express well. Keep browser JavaScript limited to
  interactions that need it.
- Tailwind CSS and its `@tailwindcss/vite` integration are approved for scaffolding.
  Compile styles through Astro's build; do not use the browser-based Play CDN.
- Follow the familiar `pages`, `layouts`, `components`, `data`, and `styles`
  structure documented in `README.md`.
- Keep pages focused on composing sections. Share the layout, header, footer,
  SEO markup, and genuinely reusable sections. Avoid both monolithic pages and
  unnecessary component splitting or generic page-builder abstractions.
- Keep repeated content in readable, typed data files. Centralize company details
  and external URLs in `src/data/site.ts`, navigation in `src/data/nav.ts`, and
  repeated page content in the corresponding page data file.
- About Us content belongs in `src/data/about.ts`; Mutual Funds content belongs
  in `src/data/mutual-funds.ts`. `src/data/apps.ts` owns the shared WINVEST copy
  and destinations. Reuse shared Contact and StoreBadges rather than duplicating them.
- Preserve all six directors, the 11-event milestone transcript, three values,
  four company links and five gallery images. The timeline uses the original
  responsive SVG artwork plus matching desktop/mobile text equivalents, not inferred
  history. Preserve and document their conflicting currency year and raised amount
  until the owner approves a correction; expose only the applicable transcript.
- Mutual Funds has five steps, six benefits and six NRI cards. Preserve the
  distinct login and Start Investing destinations and both original artwork variants.
  Do not introduce a calculator, financial transactions, gallery lightbox or new
  backend integrations without approval.
- Tailwind does not require React or shadcn/ui. Do not introduce either, a CMS,
  a state-management library, a server adapter, or another additional dependency
  without a concrete requirement and approval.
- A developer must be able to maintain, build, test, and deploy the project without
  AI. Do not make agent tools, plugins, accounts, or generated prompts prerequisites.
- Document useful conventions and non-obvious decisions in ordinary language.
  Update `README.md` alongside changes to setup, commands, structure, or deployment.

## Central design system

- `src/styles/tokens.css` is the single source of truth for shared design values:
  font families, type sizes, weights, line heights, colors, spacing, container
  sizes, radii, shadows, and shared motion values.
- Define Tailwind theme tokens with top-level `@theme` declarations and any
  supporting CSS custom properties in that same file. Keep responsive type and
  spacing overrides there too, outside `@theme` when using media queries.
- `src/styles/global.css` imports Tailwind and `tokens.css`; the shared layout
  imports this stylesheet. Keep base styling in the appropriate CSS layer so it
  does not unexpectedly override utilities.
- Use token-backed utilities for shared design values. Keep repeated styling in
  reusable Astro components rather than copying long class lists across pages.
  Component-specific CSS must consume the same tokens, not redefine brand values.
- Do not bypass central tokens with repeated arbitrary color, font-size, or spacing
  values. Use complete, statically detectable utility names rather than building
  partial class names dynamically; avoid generating large sets of unused classes.
- Secondary pages import `src/styles/content.css`; its selectors are scoped to
  `.content-page`. Keep their measured type scales separate from the homepage.
  Preserve the shared outer section rhythm; do not restore WordPress animation
  overlaps or unusable line heights merely to match a broken source state.
- Derive initial values from the reference website. Do not substitute a new visual
  direction. Documentation explains the tokens rather than maintaining a second
  independent set of values.

## Accessibility, interactions, and SEO

- Preserve meaningful HTML structure, heading hierarchy, descriptive links, image
  alternatives, associated form labels, visible focus, and reduced-motion support.
- Verify navigation by keyboard and pointer. Closed menus must not leave hidden
  links in the tab order. Preserve actions and readable layouts on mobile.
- Connect forms only to an approved submission service. Do not expose personal
  details in query strings or show success without a confirmed submission.
- The current contact section is preview-only: keep its Submit button disabled,
  fields without form ownership/names, and no submission, persistence or URL
  serialization. Preserve the status explanation and working phone/email links.
- The floating accessibility toolbar is deferred to pre-release compliance review.
  Do not add it or claim compliance approval without authorization.
- Preserve all six testimonials and the five-second token-owned autoplay interval.
  Pause for interaction and disable autoplay for reduced motion. No-JavaScript
  content must remain readable; never hide sections behind entrance animations.
- Final statistics are `10,000+ cr`, `15,000+` clients and `75+` employees. Preserve
  source anomalies listed in README until editorial approval changes them.
- Use shared SEO markup with unique titles, descriptions and social metadata.
  This preview must remain `noindex, nofollow`; production canonicals, sitemap,
  indexing activation, social image and domain-dependent structured data are
  deferred until the production origin and WordPress routing are approved.
- Preserve existing production paths where possible. Coordinate sitemap,
  `robots.txt`, redirects, and links with the remaining WordPress site.
- Keep staging/preview pages out of search indexing and verify that production
  pages are indexable. Do not assume `robots.txt` alone prevents indexing.
- Optimize images and fonts, reserve image dimensions, and avoid unnecessary
  client JavaScript. Never claim guaranteed rankings or equate an audit score with
  complete SEO readiness.

## Build, verification, and change discipline

- Use npm and preserve `package-lock.json`. Node is pinned in `.nvmrc`.
  Build the three approved static routes into `dist/`.
- Inspect `package.json` before running commands. Run `npm run format:check`,
  `npm run check`, `npm test`, and `npm run test:browser` after application changes.
  Browser tests need the development-only Playwright Chromium installation.
- After application changes, run the available formatter checks, type checks,
  relevant tests, and production build. For image/asset changes or delivery failures,
  also run `npm run test:dev`; static-output tests do not exercise `/_image/`.
  Verify affected pages in a browser,
  including narrow layouts, keyboard navigation, and applicable interaction states.
- For migration changes, compare the implemented pages with the reference, check links
  and assets, and inspect generated HTML for metadata and indexing settings.
- For documentation-only changes, check accuracy, consistency, Markdown, and file
  scope; an application build is not required.
- Recheck the working tree before editing, preserve unrelated work, and keep changes
  within the user request. Do not deploy, change domains, configure a form service,
  or expand the migration without authorization.
- Report what changed, exactly what was verified, and unresolved risks. Keep
  planned, implemented, and tested capabilities distinct.

This file follows the project-level guidance described in the
[official AGENTS.md documentation](https://learn.chatgpt.com/docs/agent-configuration/agents-md).
