---
version: alpha
name: IndoThai
description: Reference-led migration of the IndoThai Home, About Us and Mutual Funds pages.
omitted:
  - section: colors
    reason: Canonical values live only in src/styles/tokens.css.
  - section: typography
    reason: Canonical families and responsive values live only in src/styles/tokens.css.
  - section: spacing
    reason: Canonical spacing and widths live only in src/styles/tokens.css.
  - section: rounded
    reason: Canonical radii live only in src/styles/tokens.css.
components:
  action: {}
  navigation: {}
  testimonial: {}
  contactPreview: {}
---

# IndoThai design guidance

## Overview

### Creative North Star

Recreate the supplied WordPress Home, About Us and Mutual Funds pages: graph-paper hero, generous Raleway
headlines, blue investment-service identity, actual office and app imagery,
clearly presented statistics, and a substantial regulatory footer. This is a migration,
not a new brand direction. The corresponding staging pages are authoritative; the previous
Astro attempt is only a structure/asset reference.

### Product context and register

English-language brand/marketing site for IndoThai’s Indian investors, including
the HNIs, corporations and mega traders named in the source. Core tasks are
understanding services and reaching existing account, investment and support
destinations. Desktop and phone layouts matter equally. There is no product/admin
workflow or local trading interface, so an application UX contract is not needed.

Avoid generic SaaS gradients, dashboard layouts, invented financial claims and
new UI kits. Keep utility navigation familiar and legal content readable.

The owner approved a focused refinement of statistics, testimonials and disclosure
icons on 2 September 2026. Those sections now prioritize aligned metric cards,
quote-first testimonial cards and compact SVG controls over the source's overlapping
statistic boxes and decorative testimonial backdrop. A later comment approved more
breathing room between sections and matching the smaller staging header actions.
Other section designs remain reference-led.

**Token owner:** `src/styles/tokens.css`, never this document. Its `@theme` exports
Tailwind utilities; responsive custom properties are consumed directly by the
section CSS. `global.css` imports it once through the layout. Prose here explains
roles without duplicating values. Static checks and review must keep component
brand/type values token-backed.

Scoped styles use Tailwind `@reference` and `theme(--breakpoint-...)` so changing
a breakpoint in the token file updates both utilities and section media queries.

## Colors

Brand blue owns actions, section headings, the About band and footer. Ink provides
body contrast and the hero’s restrained text gradient. The pale app surface and
metric icon tiles are secondary roles. White remains the main page
surface. Dark mode is not part of the source. Forced-colors mode must retain
readable text and native system controls.

## Typography

Local Raleway is the display family, Inter is the principal body family, and
Roboto preserves small-action/footer typography. All are variable fonts with
system fallbacks. Keep the measured desktop, tablet and phone scales; do not
substitute one generic responsive heading style. The hero has the sole H1.
Reference spellings and capitalization are preserved pending approval.

## Layout

`index.astro` composes named sections. Shared chrome is separate from homepage
content. Grids reflow without horizontal page overflow. About stacks at tablet
width and moves its image before copy on phones. App headings precede the image
and body on phones. Statistic cards share dimensions, padding and baselines: three
columns where the content fits, then a single column with icons beside the values.
Testimonial cards show three, two or one at the token-owned breakpoints. Their
height follows the longest quote with a modest minimum, not an oversized fixed
blank area. Keep intrinsic image dimensions.

The main container on all three routes owns the space between sections and before
the footer using `--space-section-gap` from `tokens.css`. The owner requested a
more generous rhythm across all three pages after their migration. This outer-gap
token is independent of `--space-section`, which retains internal padding in
colored bands. Do not stack section-specific outer margins/padding on top of that
rhythm. Other internal spacing (for example the About heading-to-band distance)
also remains unchanged. Header actions
have dedicated compact height/padding tokens, with a larger minimum on coarse
pointers; other calls to action keep their existing dimensions.

Secondary routes compose sections from their own folders. `content.css` supplies
patterns scoped to `.content-page`; its independent content-heading and hero tokens
must not shrink or enlarge the homepage. About Us uses a photographic hero,
image-and-story introduction that stacks at tablet width, three-column director
portraits on wider screens, original desktop/mobile timeline artwork, a blue vision
band, bordered value cards, a full-width business image, company logos and a five-photo
gallery. Portraits and gallery photos have descriptive alternatives. The timeline
has visually hidden text equivalents with every source event, with only the matching
desktop or mobile version exposed. The originals disagree on two facts; see README.

Mutual Funds uses its own larger phone hero scale, original responsive investment
artwork, blue introduction and benefit bands, five numbered vertical steps, WINVEST
download banner and app artwork, flight-path illustration and NRI cards. On phones,
cards and app content stack. Keep the source-specific login and investing button
styles without changing shared header actions. The NRI heading has a shallow,
card-aligned flight path with a non-scaling dashed stroke and the original plane
icon at a consistent size. The owner rejected the preceding tiny, centered image.
The flight track remains in normal flow below the heading; only the plane is
positioned inside that reserved track. `--nri-flight-*` and `--nri-plane-*` tokens
own its geometry, while `--space-sm` owns the heading clearance. Do not scale the
whole illustration down, stretch the plane, or let decoration overlap the text.
Both pages remain ordinary readable HTML without animation-dependent
visibility; do not reproduce the source's broken mobile line heights or timeline
overlap during entrance animation.

## Elevation & Depth

Use restrained service-card borders, subtle aligned statistic-card elevation and a
small utility-dropdown shadow. Testimonials use white cards with a light border;
there is no floating backdrop. Do not introduce frosted glass or decorative panels.

## Shapes

Use the token-owned control/card corners, asymmetric account-panel corners,
rounded office image and app surface, and circular testimonial portraits. Metrics
and testimonials share the panel-radius and panel-border tokens; controls retain
separate rounded, touch-sized geometry.

## Components

### Foundational visual states

Actions have hover and visible keyboard focus states. White-on-blue sections
use white focus outlines. Disabled submission remains clearly unavailable with
nearby explanatory text. There are no fake loading, success or error states.

### Buttons and actions

`ActionLink` owns reusable link-as-button styling. Primary actions are blue;
secondary actions use borders. External new-tab actions expose an accessible
new-tab notice. Account and IPO actions navigate to existing approved services.

### Navigation and data display

Header disclosures are non-modal, not focus-trapped drawers. Native details/summary
provide the no-JavaScript baseline. Enhancements handle Escape, outside dismissal,
focus restoration and expanded state. Closed descendants leave the tab order.
Home, About Us and Mutual Funds route locally, with the current page marked in
desktop and mobile navigation. Other destinations remain on their existing services.

The main menu uses an SVG menu/close pair; nested disclosures have a rotating SVG
chevron. Open-state styling is driven by native details state and works without
JavaScript. Testimonials lead with readable, non-italic quotes, followed by an
aligned portrait/name/role row. Compact previous/next, position and pause controls
sit below the cards; the accessible pause label remains explicit even when its
visible text is shortened. Disabled reduced-motion controls remain readable.

### Forms and overlays

Contact, shared by Home and Mutual Funds, is a labeled preview group, deliberately not a submitting HTML form.
It has no form owner, field names or persistence. The disabled button and status
explanation remain until the submission service is approved. No modal overlays,
native alerts or toast messages are needed.

### Iconography

Reuse the original extracted service and statistic icons. Decorative icons have
empty alternatives; meaningful controls have text/accessible names. No additional
icon library is required.

### Motion

The carousel interval is token-owned. Pause on hover, focus and direct interaction;
stop automatic motion for reduced-motion users and offscreen/hidden pages. All six
quotes remain in HTML and can be scrolled without JavaScript. No entrance animation
may make essential content invisible. Counters render their approved final values.

### Content and data visualization

Preserve source wording and external destinations; document anomalies rather than
quietly rewriting regulated/promotional content. Final statistics are informational
text, not an animated financial chart. The footer retains the complete regulatory
copy on phones even where the source hides parts of it.

## Do’s and Don’ts

- Do compare every section with staging at the same viewport dimensions.
- Do edit shared visual values only in the token file and keep source images local.
- Don’t copy old-project counter values or placeholder links.
- Don’t confuse homepage completion with deployment, compliance or editorial approval.
- Don’t invent director biographies, gallery interactions, fund calculators or
  investment integrations. A static migration does not add those product behaviors.
