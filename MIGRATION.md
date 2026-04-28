# Astro Migration Analysis for Attegi

## Scope and method

This document analyzes the current Ghost theme repository as the source system for an Astro fork powered by the Ghost Content API.

I reviewed:

- 49 Handlebars templates and partials
- 7 SCSS source files plus the vendored `glightbox.min.css`
- 28 JavaScript source files plus build and packaging scripts
- `package.json`, build config, Docker/dev scripts, Cloudflare worker scripts, release/docs files, locale files, and supporting repository metadata

Generated assets (`assets/css/style.css`, `assets/js/*`), binary fonts, screenshots, minified vendor bundles, and IDE metadata were inventoried and only discussed where they affect migration decisions.

## Official-doc best-practice takeaways

The current best path for an Astro + Ghost migration is:

- Use the official Ghost Content API client (`@tryghost/content-api`) plus `@tryghost/helpers` rather than reimplementing Ghost formatting rules yourself.
- Treat Ghost content as rendered HTML, not as Markdown you plan to reconstruct. Astro's Ghost guide uses `set:html`, and this theme's CSS/JS is built around Ghost's final `.kg-*` markup.
- Decide route rendering mode per page type:
  - Static public routes: Astro `getStaticPaths()` plus Ghost webhooks to trigger rebuilds.
  - Freshness-sensitive or member-aware routes: Astro on-demand rendering or SSR.
- Configure Astro remote image handling for Ghost content-image URLs before attempting optimization.
- Rebuild Ghost frontend-only features explicitly. Search, Portal, native comments, signup/account flows, and helper-driven access logic are not provided by the Content API.
- Do not assume Ghost `card_assets: true` will save you after the migration. In Astro, card CSS/JS becomes your responsibility.

Relevant official references:

- Astro Ghost CMS guide: <https://docs.astro.build/en/guides/cms/ghost/>
- Astro routing and `getStaticPaths()`: <https://docs.astro.build/en/guides/routing/>
- Astro images from CMS/CDN sources: <https://docs.astro.build/en/guides/images/>
- Astro on-demand rendering: <https://docs.astro.build/en/guides/on-demand-rendering/>
- Ghost Content API overview: <https://docs.ghost.org/content-api>
- Ghost Content API JavaScript client: <https://docs.ghost.org/content-api/javascript>
- Ghost routing: <https://docs.ghost.org/themes/routing>
- Ghost page context and `page-{slug}.hbs`: <https://docs.ghost.org/themes/contexts/page>
- Ghost comments helper: <https://docs.ghost.org/themes/helpers/comments>
- Ghost members/Portal integration: <https://docs.ghost.org/themes/members>
- Ghost search: <https://ghost.org/docs/themes/search/>
- Ghost tags API fields and internal-tag visibility: <https://docs.ghost.org/content-api/tags>

## Repository scan summary

### What matters most for the Astro fork

- `default.hbs` is the real control center. It owns layout, global head/meta logic, navigation/footer, search/member triggers, theme initialization, and conditional lightbox bootstrapping.
- `post.hbs`, `page.hbs`, `page-links.hbs`, and `page-tags.hbs` are the most important content templates to port first.
- `src/sass/style.scss` is a monolith with almost all presentation rules, including extensive `.kg-*` card styling.
- The modern JS source of truth is the modular `src/js/core`, `src/js/features`, and `src/js/entries` tree.
- Legacy JS still exists (`src/js/script.js`, `src/js/post.js`, `src/js/toc.js`, `src/js/poem.js`) because the build system keeps a fallback path and Grunt compatibility layer.
- Several runtime behaviors live outside the main JS bundles:
  - inline scripts in `default.hbs`
  - inline scripts in `post.hbs`
  - inline scripts in `page-tags.hbs`
- Two Cloudflare worker scripts exist outside the theme runtime, but one of them (`og-image-filter.js`) directly supports the custom OG-image logic used in `default.hbs`.

### Supporting files with migration impact

- `package.json`: theme config, image sizes, custom settings, build scripts
- `scripts/build.js`: modern esbuild bundling and vendor copying
- `Gruntfile.js`: legacy build pipeline still supported
- `cloudflare-worker/og-image-filter.js`: deduplicates OG tags because the theme currently emits duplicates
- `cloudflare-worker/buxx-redirects.js`: unrelated to theme rendering, but worth separating from the Astro app
- `locales/*.json`: 32 translations used by `{{t}}`
- `THIRD_PARTY_NOTICES.md`: confirms shipped third-party frontend libraries (tocbot, highlight.js, GLightbox)

### Low-impact scanned files

- `.github/FUNDING.yml`, `.github/dependabot.yml`, `.claude/settings.local.json`, `.gitignore`, `LICENSE`, screenshots, font binaries, and IDE files do not materially change the Astro migration design.

## 1. Template inventory

### Root templates

- `default.hbs`
  Role: Master layout for all pages. Owns the global `<head>`, inline theme bootstrapping, nav/footer, search trigger, member buttons, custom OG-image override logic, global `site.js` loading, and conditional GLightbox runtime loading.
  Explicit `{{>}}` partials: `icons/icon-search`, `icons/icon-menu`, `icons/icon-rss`, `icons/icon-twitter`, `icons/icon-facebook`, `icons/icon-instagram`, `icons/icon-github`, `icons/icon-telegram`, `icons/icon-discord`, `icons/icon-bluesky`, `icons/icon-mail`, `icons/icon-sun`, `icons/icon-moon`, `icons/icon-monitor`.
  Helper-rendered partials or helper-backed templates: `{{navigation}}` uses `partials/navigation.hbs`.
  Ghost helpers/context: `{{ghost_head}}`, `{{ghost_foot}}`, `{{meta_title}}`, `{{asset}}`, `{{date}}`, `{{img_url}}`, `{{encode}}`, `{{navigation}}`, `{{body_class}}`, `{{{body}}}`, `{{{block}}}`, `{{#if}}`, `{{#unless}}`, `{{#is}}`, `{{#post}}`, `{{#primary_author}}`, translation helper `{{t}}`, plus heavy use of `@site.*`, `@custom.*`, and `@member`.
  Migration note: This file contains most of the Ghost-only coupling.

- `index.hbs`
  Role: Homepage. Renders site title/description, optional site cover image, and the main post list.
  Explicit `{{>}}` partials: `srcset`, `loop`.
  Ghost helpers/context: `{{#contentFor}}`, `{{#if}}`, `{{img_url}}`, `@site.cover_image`, `@site.title`, `@site.description`.
  Migration note: Straightforward Astro page once the shared layout exists.

- `post.hbs`
  Role: Post detail page. Renders hero, metadata, author list, feature image, post content, share UI, comments, subscribe CTA, recent-post navigation, TOC script load, and the back-to-top progress button.
  Explicit `{{>}}` partials: `srcset`, `notbyai-badge`, `icons/icon-share`, `icons/icon-twitter`, `icons/icon-facebook`, `icons/icon-linkedin`, `icons/icon-mail`, `recent-posts`.
  Helper-rendered partials or helper-backed templates: `{{subscribe_form}}` uses `partials/subscribe_form.hbs`.
  Ghost helpers/context: `{{#post}}`, `{{#foreach authors}}`, `{{#if}}`, `{{#unless}}`, `{{#has tag="#no-toc"}}`, `{{content}}`, `{{tags}}`, `{{url}}`, `{{date}}`, `{{reading_time}}`, `{{comment_count}}`, `{{comments}}`, `{{subscribe_form}}`, `{{asset}}`, `{{img_url}}`, `{{encode}}`, `{{post_class}}`, translation helper `{{t}}`, plus `@custom.post_share`, `@custom.disqus_shortname`, `@custom.email_signup_text`, `@site.members_enabled`, and `@member`.
  Migration note: This is the hardest template to port because it mixes Ghost HTML rendering, access-aware helpers, comments, membership, social sharing, and client behavior.

- `page.hbs`
  Role: Generic static page template. Optionally shows title and feature image, then renders page HTML.
  Explicit `{{>}}` partials: `srcset`.
  Ghost helpers/context: `{{#post}}`, `{{#if @page.show_title_and_feature_image}}`, `{{content}}`, `{{post_class}}`, `{{img_url}}`, `{{asset}}`, `{{title}}`.
  Migration note: The page flag `@page.show_title_and_feature_image` needs an Astro-side equivalent.

- `page-links.hbs`
  Role: Custom links page template. Wraps page content in a dedicated links-page layout and expects Ghost bookmark cards or custom HTML cards inside the page body.
  Explicit `{{>}}` partials: none.
  Ghost helpers/context: `{{#post}}`, `{{#if custom_excerpt}}`, `{{title}}`, `{{custom_excerpt}}`, `{{content}}`.
  Migration note: The page body is still Ghost HTML; the visual behavior comes mostly from CSS.

- `page-tags.hbs`
  Role: Custom topic directory page. Fetches all public tags, renders tag cards, fetches up to 10 posts per tag, extracts custom SVG icons from tag code injection, computes dominant image colors, and makes post lists scrollable.
  Explicit `{{>}}` partials: none.
  Ghost helpers/context: `{{#get "tags" ...}}`, `{{#get "posts" ...}}`, `{{#foreach}}`, `{{#if}}`, `{{#unless}}`, `{{img_url}}`, `{{plural}}`, `{{date}}`, `{{name}}`, `{{slug}}`, `{{description}}`, `{{accent_color}}`, `{{codeinjection_head}}`, `{{posts.length}}`, `{{url}}`, translation helper `{{t}}`.
  Migration note: This template maps almost directly to Astro page-level data fetching, but it needs multiple Content API calls plus careful HTML sanitization for `codeinjection_head`.

- `author.hbs`
  Role: Author archive page. Shows author profile info and then the shared post loop.
  Explicit `{{>}}` partials: `icons/icon-globe`, `icons/icon-twitter`, `icons/icon-facebook`, `srcset`, `loop`.
  Ghost helpers/context: `{{#author}}`, `{{#if}}`, `{{plural}}`, `{{img_url}}`, `{{name}}`, `{{bio}}`, `{{website}}`, `{{twitter}}`, `{{facebook}}`, translation helper `{{t}}`.
  Migration note: Easy Astro archive route once author data and pagination are in place.

- `tag.hbs`
  Role: Tag archive page. Shows tag metadata and the shared post loop.
  Explicit `{{>}}` partials: `srcset`, `loop`.
  Ghost helpers/context: `{{#if}}`, `{{plural}}`, `{{img_url}}`, `{{tag.name}}`, `{{tag.description}}`, translation helper `{{t}}`.
  Migration note: Easy Astro archive route once tag data and pagination are in place.

- `error.hbs`
  Role: Full-page 404/error experience with custom illustration plus three recommended posts.
  Explicit `{{>}}` partials: `icons/icon-arrow-left`.
  Ghost helpers/context: `{{#contentFor}}`, `{{#get "posts"}}`, `{{#foreach}}`, `{{#if}}`, `{{img_url}}`, `{{date}}`, `{{url}}`, `{{title}}`, `{{name}}`, translation helper `{{t}}`, `@site.url`.
  Migration note: Simpler in Astro than in Ghost. Also worth noting that Ghost docs recommend keeping error templates less helper-heavy than this implementation.

### Functional partials

- `partials/loop.hbs`
  Role: Shared post-list/card renderer for index, author, and tag archives.
  Explicit `{{>}}` partials: none.
  Helper-rendered partials or helper-backed templates: `{{pagination}}` uses `partials/pagination.hbs`.
  Ghost helpers/context: `{{#foreach posts visibility="all"}}`, `{{#if}}`, `{{post_class}}`, `{{url}}`, `{{date}}`, `{{excerpt}}`, `{{pagination}}`, translation helper `{{t}}`.
  Migration note: Convert to an Astro component and keep `featured`, tags, and excerpt logic together.

- `partials/navigation-meta.hbs`
  Role: Empty placeholder partial.
  Explicit `{{>}}` partials: none.
  Ghost helpers/context: none.
  Migration note: Safe to drop unless you want to reuse the slot name.

- `partials/navigation.hbs`
  Role: Renders the primary navigation menu.
  Explicit `{{>}}` partials: none.
  Ghost helpers/context: `{{#foreach navigation}}`, `{{#if current}}`, `{{slug}}`, `{{url absolute="true"}}`, `{{label}}`.
  Migration note: In Astro, this becomes ordinary site settings data.

- `partials/notbyai-badge.hbs`
  Role: Shows the Not By AI badge when the post contains the internal tag `#not-by-ai`.
  Explicit `{{>}}` partials: `icons/notbyai/written-white`, `icons/notbyai/written-black`.
  Ghost helpers/context: `{{#has tag="#not-by-ai"}}`, translation helper `{{t}}`.
  Migration note: Internal tags must remain available in Astro data fetching, not stripped out too early.

- `partials/pagination.hbs`
  Role: Previous/next archive pagination UI.
  Explicit `{{>}}` partials: `icons/icon-arrow-left`, `icons/icon-arrow-right`.
  Ghost helpers/context: `{{#if prev}}`, `{{#if next}}`, `{{page_url}}`, translation helper `{{t}}`.
  Migration note: Rebuild with Astro route params and manual page URL generation.

- `partials/recent-posts.hbs`
  Role: Footer navigation below posts. On post pages it shows next/previous post or home fallback. On non-post pages it fetches the latest two posts.
  Explicit `{{>}}` partials: `icons/icon-arrow-left`, `icons/icon-arrow-right`, `icons/icon-home`.
  Ghost helpers/context: `{{#match}}`, `{{#is}}`, `{{#next_post}}`, `{{#prev_post}}`, `{{#get "posts"}}`, `{{#foreach}}`, `{{excerpt}}`, `{{date}}`, `{{url}}`, `{{title}}`, `@site.url`, `@site.description`, translation helper `{{t}}`.
  Migration note: Split this into two Astro behaviors instead of carrying the Ghost helper branching directly.

- `partials/srcset.hbs`
  Role: Generates responsive image `srcset` strings from Ghost image sizes and optional format arguments.
  Explicit `{{>}}` partials: none.
  Ghost helpers/context: `{{#if format}}`, `{{#if include_xl}}`, `{{img_url}}`.
  Migration note: Replace with Astro image helpers or a small utility around Ghost image URLs.

- `partials/subscribe_form.hbs`
  Role: Theme override template used by the Ghost `subscribe_form` helper.
  Explicit `{{>}}` partials: none.
  Ghost helpers/context: `{{action}}`, `{{hidden}}`, `{{input_email}}`, `{{script}}`, `{{#if error}}`, `{{error.message}}`, `{{button_class}}`, `{{form_class}}`, translation helper `{{t}}`.
  Migration note: This only works inside Ghost's theme runtime. It will not survive headless rendering unchanged.

### SVG icon partials

All files in this table are static SVG fragments. Explicit `{{>}}` partials: none. Ghost helpers/context: none.

| File | Responsibility |
| --- | --- |
| `partials/icons/icon-arrow-left.hbs` | Left arrow icon. |
| `partials/icons/icon-arrow-right.hbs` | Right arrow icon. |
| `partials/icons/icon-bluesky.hbs` | Bluesky social icon. |
| `partials/icons/icon-discord.hbs` | Discord social icon. |
| `partials/icons/icon-facebook.hbs` | Facebook social icon. |
| `partials/icons/icon-friends.hbs` | Friends/people icon. Currently unused. |
| `partials/icons/icon-github.hbs` | GitHub social icon. |
| `partials/icons/icon-globe.hbs` | Website/globe icon. |
| `partials/icons/icon-home.hbs` | Home icon. |
| `partials/icons/icon-instagram.hbs` | Instagram social icon. |
| `partials/icons/icon-linkedin.hbs` | LinkedIn social icon. |
| `partials/icons/icon-mail.hbs` | Email icon. |
| `partials/icons/icon-menu.hbs` | Hamburger-menu lines. |
| `partials/icons/icon-monitor.hbs` | Monitor/system-theme icon. |
| `partials/icons/icon-moon.hbs` | Dark-mode icon. |
| `partials/icons/icon-rss.hbs` | RSS icon. |
| `partials/icons/icon-search.hbs` | Search icon. |
| `partials/icons/icon-share.hbs` | Share icon. |
| `partials/icons/icon-star.hbs` | Star icon. Currently unused. |
| `partials/icons/icon-sun.hbs` | Light-mode icon. |
| `partials/icons/icon-telegram.hbs` | Telegram social icon. |
| `partials/icons/icon-twitter.hbs` | Twitter/X social icon. |

### Not By AI badge partials

All files in this table are static badge assets. Explicit `{{>}}` partials: none. Ghost helpers/context: none.

| File | Responsibility |
| --- | --- |
| `partials/icons/notbyai/authored-black.hbs` | "Authored" badge, black variant. Currently unused. |
| `partials/icons/notbyai/authored-white.hbs` | "Authored" badge, white variant. Currently unused. |
| `partials/icons/notbyai/coded-black.hbs` | "Coded" badge, black variant. Currently unused. |
| `partials/icons/notbyai/coded-white.hbs` | "Coded" badge, white variant. Currently unused. |
| `partials/icons/notbyai/created-black.hbs` | "Created" badge, black variant. Currently unused. |
| `partials/icons/notbyai/created-white.hbs` | "Created" badge, white variant. Currently unused. |
| `partials/icons/notbyai/researched-black.hbs` | "Researched" badge, black variant. Currently unused. |
| `partials/icons/notbyai/researched-white.hbs` | "Researched" badge, white variant. Currently unused. |
| `partials/icons/notbyai/written-black.hbs` | "Written" badge, black variant. Used by `partials/notbyai-badge.hbs`. |
| `partials/icons/notbyai/written-white.hbs` | "Written" badge, white variant. Used by `partials/notbyai-badge.hbs`. |

Additional note: several unused Not By AI files are not clean SVG-only partials. At least `authored-black`, `coded-black`, `coded-white`, and `created-black` are large exported HTML documents embedded in `.hbs` files. They should not be copied blindly into an Astro codebase.

## 2. Style architecture

### Source structure

- `src/sass/style.scss`
  Main stylesheet entry. Imports shared partials and contains almost all component/page styling.

- `src/sass/_normalize.scss`
  Normalize/reset stylesheet.

- `src/sass/_colors.scss`
  Theme tokens and dark-mode token overrides.

- `src/sass/_fonts.scss`
  Typography stacks and scale tokens.

- `src/sass/_highlight.scss`
  highlight.js theme tokens and code-block UI rules.

- `src/sass/_toc.scss`
  Desktop and mobile TOC UI styles.

- `src/sass/_poem-card.scss`
  Styles for the custom pseudo-card created from `[!poem]` blockquotes.

- `src/sass/glightbox.min.css`
  Vendored CSS copied to `assets/css/glightbox.min.css`.

### Typography

- Heading stack: `-apple-system`, `BlinkMacSystemFont`, `SF Pro Display`, `SF Pro Text`, `system-ui`, `Segoe UI`, `PingFang SC`, `Hiragino Sans GB`, `Microsoft YaHei`, `Noto Sans SC`, emoji fallbacks.
- Body stack: `-apple-system`, `BlinkMacSystemFont`, `SF Pro Text`, `system-ui`, `Segoe UI`, `PingFang SC`, `Hiragino Sans GB`, `Microsoft YaHei`, `Noto Sans SC`, `Source Han Sans SC`, emoji fallbacks.
- Monospace stack: `JetBrains Mono` first, then standard monospace fallbacks.
- Runtime font loading:
  - `JetBrains Mono` is preloaded and loaded from Google Fonts in `default.hbs`.
  - Current SCSS does not declare any `@font-face`.
- Legacy asset note:
  - `assets/font/` still contains Cardo and Fira Sans binaries.
  - Current SCSS does not reference them.
  - `scripts/build.js` still tries to copy `src/font/`, but that directory does not exist in this repository.

### Color and theme tokens

Primary token groups in `_colors.scss`:

| Token group | Purpose |
| --- | --- |
| `--color-background-main`, `--color-background-secondary`, `--color-background-contrast` | Core surfaces for light/dark themes. |
| `--color-content-lead`, `--color-content-main`, `--color-content-secondary` | Primary text hierarchy. |
| `--color-menu-*` | Mobile menu-specific translucent dark palette. |
| `--color-social-*` | Brand colors for social actions. |
| `--color-highlight` | Callout/highlight accent. |
| `--liquid-glass-bg` | Gradient base for glassmorphism effects. |
| `--brandcolor`, `--brand-color` | Mirrors `--ghost-accent-color` so Ghost Portal/comments inherit the theme accent. |

Dark mode is implemented in three layers:

- explicit `.theme-dark:root`
- system fallback `html:not(.theme-light):root` under `prefers-color-scheme: dark`
- runtime class switching via inline script plus `theme-switcher.js`

### Responsive breakpoints

The repo uses these breakpoints:

| Breakpoint | Value | Where used |
| --- | --- | --- |
| `xsmall` | `420px` | Narrow-device adjustments in `style.scss`. |
| `small` | `480px` | Tight mobile layouts, poem cards, tag grid, links page, TOC small breakpoint. |
| `medium` | `640px` | Main mobile/tablet cutover for prose, poem cards, titles, cards. |
| `tablet` | `768px` | GLightbox/mobile control adjustments and some layout tuning. |
| `large` | `960px` | Main content-width breakpoint in `style.scss`. |
| `mid-wide` | `1100px` | Sticky-logo/content-overlap tuning. |
| `toc-wide` | `1400px` | Desktop TOC only appears above this width; mobile TOC below it. |

### Major styling domains inside `style.scss`

- Base layout and CLS prevention
  - intrinsic image sizing
  - cover containment
  - skeleton placeholders
  - content visibility for lower-page blocks

- Prose system
  - headings, lists, tables, blockquotes, code blocks, links
  - callout styling and emoji-based legacy callout fallback

- Ghost card styling
  - buttons, files, images, galleries, videos, embeds, code, bookmarks, toggles, header cards, signup cards, product cards, CTA cards

- Site chrome
  - mobile menu
  - sticky logo
  - footer
  - theme toggle

- Post chrome
  - archive cards
  - post header/meta
  - comments
  - Portal-related buttons
  - back-to-top button
  - TOC

- Template-specific pages
  - links page
  - tags directory
  - full-screen error page

- Lightbox
  - GLightbox overlay, controls, mobile gesture tuning

### Style migration recommendation

Do not rewrite the CSS architecture on day one. Port `src/sass` almost verbatim, wire it to Astro, and only then reduce it. The stylesheet is large, but it already encodes the `.kg-*` contract you need for headless Ghost content.

## 3. JS dependencies

### Runtime entry points actually used by templates

| Bundle | Loaded from | Purpose |
| --- | --- | --- |
| `assets/js/site.js` | `default.hbs` | Common site behavior on all pages. |
| `assets/js/post.js` | `post.hbs` | Post-only behavior. |
| `assets/js/page.js` | `page.hbs` | Generic page behavior. |

Important exception:

- `page-links.hbs` does not load `page.js`.
- `page-tags.hbs` does not load `page.js`.
- Both templates rely on `site.js` plus inline scripts only.

### Modern modular JS source of truth

### Core utilities

| File | Responsibility |
| --- | --- |
| `src/js/core/dom.js` | DOM-ready helper, query helpers, shared document/documentElement references. |
| `src/js/core/i18n.js` | Reads translated strings from `<body data-i18n-*>`. |
| `src/js/core/perf.js` | `throttle`, `debounce`, and RAF wrapper helpers. |
| `src/js/core/index.js` | Re-export barrel. |

### Entry points

| File | Responsibility |
| --- | --- |
| `src/js/entries/site.js` | Boots menu, parallax, sticky logo, gallery sizing, theme switcher. |
| `src/js/entries/post.js` | Adds embeds, code highlighting, TOC, comments, share, cover detection, portrait media, footnotes, poem cards. |
| `src/js/entries/page.js` | Adds embeds and code highlighting to standard static pages. |

### Feature modules

| File | Responsibility |
| --- | --- |
| `src/js/features/menu.js` | Mobile menu open/close and accessibility state. |
| `src/js/features/parallax.js` | Cover-image parallax effect. |
| `src/js/features/sticky-logo.js` | Sticky logo that appears after scroll. |
| `src/js/features/gallery.js` | Sets gallery image flex ratios from image dimensions. |
| `src/js/features/theme-switcher.js` | Light/dark/system switching with `localStorage`. |
| `src/js/features/embeds.js` | Wraps embeds and videos for responsive sizing. |
| `src/js/features/code-highlight.js` | Lazy highlight.js loading, language labels, copy button. |
| `src/js/features/progress-bar.js` | Orphaned reading-progress bar logic for `.progress-container` and `.progress-bar`. |
| `src/js/features/share.js` | Native Web Share API handling. |
| `src/js/features/comments.js` | Lazy-load Ghost native comments or Disqus. |
| `src/js/features/cover-detect.js` | Detects bright cover images and toggles contrast class. |
| `src/js/features/portrait-media.js` | Detects portrait images/videos and applies modifier classes. |
| `src/js/features/footnotes.js` | Repairs footnote anchors/backlinks. |
| `src/js/features/toc.js` | Builds desktop/mobile TOC UI around tocbot. |
| `src/js/features/poem-cards.js` | Converts `[!poem]` blockquotes into custom cards. |

### Third-party frontend libraries

| Library | Source | Use |
| --- | --- | --- |
| tocbot | `node_modules/tocbot/dist/tocbot.min.js` | Heading parsing and active-state tracking for TOC. |
| highlight.js | `src/js/libs/highlight.pack.js` | Code syntax highlighting. |
| GLightbox | `src/js/libs/glightbox.min.js` plus `src/sass/glightbox.min.css` | Lightbox for Ghost gallery images. |

### Legacy JS still present

| File | Status |
| --- | --- |
| `src/js/script.js` | Legacy monolithic site script. |
| `src/js/post.js` | Legacy monolithic post script. |
| `src/js/toc.js` | Legacy monolithic TOC script. |
| `src/js/poem.js` | Legacy monolithic poem-card script. |

Why they still matter:

- `scripts/build.js` contains a legacy fallback path if the modular entries are missing.
- `Gruntfile.js` still builds the legacy files directly.
- In the Astro fork, you should treat the modular tree as the source of truth and archive or delete the legacy path once the migration is stable.

### Non-bundle JS embedded in templates

- `default.hbs`
  - instant theme class application
  - local analytics suppression in dev
  - theme-toggle visibility and dark-accent injection
  - conditional GLightbox bootstrapping and gesture handling

- `post.hbs`
  - share-mode visibility switch based on `@custom.post_share`
  - back-to-top progress ring behavior

- `page-tags.hbs`
  - tag icon extraction from `codeinjection_head`
  - dominant-color extraction from tag images
  - scrollable tag-post list enhancement

### JS migration recommendation

- Port the modular feature files, not the legacy monoliths.
- Keep inline behaviors close to the Astro pages/layouts that use them.
- Remove or ignore orphaned logic:
  - `progress-bar.js` has styles and JS, but there is no matching template markup in the current theme.

## 4. Ghost-specific feature dependencies

### Ghost card coverage

The theme styles or scripts against these Ghost card/output classes:

| Card/output type | Evidence in repo | Migration implication |
| --- | --- | --- |
| Callout card | `.kg-callout-card*` in `style.scss` | Keep Ghost HTML output and port the styles. |
| Button card | `a.kg-btn` in `style.scss` | CSS-only carryover. |
| File card | `.kg-file-card*` in `style.scss` | CSS-only carryover. |
| Image card | `.kg-image-card`, `.kg-image` in CSS and `portrait-media.js` | Keep markup and image sizing logic. |
| Gallery card | `.kg-gallery-card`, `.kg-gallery-image` in CSS, `gallery.js`, and GLightbox loader in `default.hbs` | Requires CSS plus client lightbox behavior. |
| Video card | `.kg-video-card` in CSS and `portrait-media.js` | Requires CSS plus portrait detection. |
| Embed card | `.kg-embed-card` in CSS and `embeds.js` | Requires responsive embed wrapper logic. |
| Code card | `.kg-code-card` plus highlight.js integration | Requires CSS plus highlight.js bootstrapping. |
| Bookmark card | `.kg-bookmark-card*` in CSS, especially restyled for `page-links.hbs` | Important for links-page parity. |
| Toggle card | `.kg-toggle-card*` in CSS | CSS-only carryover. |
| Header card | `.kg-header-card*` in CSS | CSS-only carryover. |
| Signup card | `.kg-signup-card*` in CSS | Ghost membership semantics do not port automatically. |
| Product card | `.kg-product-card*` in CSS | CSS-only carryover, but check your Content API fields if you use product cards heavily. |
| CTA card | `.kg-cta-card*` in CSS | CSS-only carryover. |

Non-native but theme-defined content format:

- Poem card
  - Not a native Ghost card.
  - Implemented by parsing blockquotes containing `[!poem]`.
  - Converted client-side into `.kg-poem-card`.

### Membership, comments, and search dependencies

| Feature | Where it appears | What it depends on today | Astro migration impact |
| --- | --- | --- | --- |
| Search | `default.hbs` | `data-ghost-search` trigger plus Ghost search app/runtime | Must be reimplemented or intentionally dropped. The button markup alone is not enough. |
| Portal auth/account | `default.hbs` | `data-portal="signin"`, `data-portal="signup"`, `data-portal="account"`, `@member`, `@site.members_enabled`, `@site.members_invite_only` | Theme-level Portal buttons do not survive headless rendering automatically. |
| Native comments | `post.hbs`, `comments.js` | `{{#if comments}}`, `{{comment_count}}`, `{{comments}}` helper, lazy script activation | Requires a new integration plan. This is Ghost frontend behavior, not Content API data rendering. |
| Disqus fallback | `post.hbs`, `comments.js` | `@custom.disqus_shortname` plus client embed script | Easier to keep than native Ghost comments if you still want third-party comments. |
| Post subscribe form | `post.hbs`, `partials/subscribe_form.hbs` | `{{subscribe_form}}` helper plus Ghost member backend | Needs a new form flow or Portal embed strategy. |
| Portal/comments accent sync | `_colors.scss`, `style.scss` | `--brandcolor` and `--brand-color` mapped to Ghost accent | If Portal/comments are removed, this bridge can go with them. |

### Internal tags and metadata-driven behavior

| Dependency | Current behavior | Astro migration note |
| --- | --- | --- |
| Internal tag `#no-toc` | Disables TOC by adding `.no-toc` to `.post-content`. | Do not strip internal tags before feature logic runs. |
| Internal tag `#not-by-ai` | Enables Not By AI badge. | Same rule: internal tags stay useful in headless mode. |
| `accent_color` on tags | Drives tag-card border/icon/theme color. | Fetch tag color from Content API and preserve it. |
| `feature_image` on tags | Drives tag-card background image mode. | Straightforward to keep. |
| `codeinjection_head` on tags | Stores optional custom SVG icon for a tag. | This is unusual and needs sanitization before reuse in Astro. |
| `@page.show_title_and_feature_image` | Controls generic page hero rendering. | Needs Astro-side page metadata or a replacement convention. |
| `feature_image_caption` | Used as post hero credit/caption. | Preserve in post data mapping. |
| `reading_time` | Used in post meta and OG-image query string. | Recreate with `@tryghost/helpers` or equivalent utility. |
| `primary_tag`, `primary_author`, author social fields | Used in UI and OG-image generation. | Keep those fields in the Content API include list. |

### OG-image and external-runtime coupling

- `default.hbs` emits custom `og:image` and `twitter:image` meta tags when `@custom.og_service_url` is present.
- `ghost_head` also emits Ghost's own OG tags.
- The repo includes `cloudflare-worker/og-image-filter.js` to remove the duplicate/default tags after the HTML is already rendered.

Migration implication:

- In Astro, you should generate the final OG tags yourself and delete the duplicate-removal worker from the architecture.
- The separate Spotify iframe rewrite in that worker should also be evaluated independently, not bundled into content rendering.

### Internationalization dependency

- The theme uses 32 locale files in `locales/*.json`.
- Template translations come from `{{t}}`.
- Client-side JS reads translations from `<body data-i18n-*>`, which are populated in `default.hbs`.

Migration implication:

- Astro must either keep Ghost as the translation source or move strings into Astro i18n.
- Do not port the JS without also porting the `data-i18n-*` hydration pattern or replacing it cleanly.

## 5. Routing structure and package config

### There is no custom routes config in this repo

Findings:

- `package.json` does not define a `routes` object.
- There is no `routes.yaml` checked into this repository.
- Therefore, the theme currently relies on Ghost's default route resolution and template hierarchy.

### Effective route map inferred from templates and Ghost conventions

| Route shape | Current template | Notes |
| --- | --- | --- |
| `/` | `index.hbs` | Homepage. |
| `/page/:n/` | `index.hbs` + `partials/pagination.hbs` | Archive pagination; `posts_per_page` is 8. |
| `/:post-slug/` | `post.hbs` | Post detail route under Ghost's normal permalink system. |
| `/:page-slug/` | `page.hbs` | Generic static pages. |
| `/links/` | `page-links.hbs` | Slug-specific page template by Ghost page-template hierarchy. |
| `/tags/` | `page-tags.hbs` | Slug-specific page template by Ghost page-template hierarchy. |
| `/tag/:slug/` | `tag.hbs` | Tag archive. |
| `/tag/:slug/page/:n/` | `tag.hbs` | Tag archive pagination. |
| `/author/:slug/` | `author.hbs` | Author archive. |
| `/author/:slug/page/:n/` | `author.hbs` | Author archive pagination. |
| `404` / not-found | `error.hbs` | Error page. |
| `#search` | Ghost search UI hook | Hash/modal trigger, not a real page route. |
| `#/portal/signin`, `#/portal/signup`, `#/portal/account` | Ghost Portal UI hooks | Hash/modal triggers, not real page routes. |

### `package.json` theme config

### Core config

| Key | Value | Migration relevance |
| --- | --- | --- |
| `config.posts_per_page` | `8` | Archive pagination size should stay explicit in Astro. |
| `config.image_sizes.s.width` | `320` | Existing responsive-image size map. |
| `config.image_sizes.m.width` | `640` | Existing responsive-image size map. |
| `config.image_sizes.l.width` | `960` | Existing responsive-image size map. |
| `config.image_sizes.xl.width` | `1920` | Existing responsive-image size map. |
| `config.card_assets` | `true` | Ghost injects card assets in theme mode; Astro will not. |

### Custom settings

| Setting | Type | Default | Current use |
| --- | --- | --- | --- |
| `color_scheme` | `select` | `System` | Controls theme boot logic and theme-toggle visibility. |
| `darkmode_accent_color` | `color` | `#82C0CC` | Overrides accent color in dark mode. |
| `instagram_url` | `text` | none | Footer social link. |
| `github_url` | `text` | none | Footer social link. |
| `telegram_url` | `text` | none | Footer social link. |
| `discord_url` | `text` | none | Footer social link. |
| `bluesky_url` | `text` | none | Footer social link. |
| `email_address` | `text` | none | Footer email link. |
| `footer_text` | `text` | none | Custom footer-center HTML. |
| `og_service_url` | `text` | none | Enables custom OG-image meta generation. |
| `og_service_theme` | `text` | none | Optional theme parameter for OG-image service. |
| `email_signup_text` | `text` | `Sign up for more like this.` | Post subscribe CTA copy. |
| `show_recent_posts_footer` | `boolean` | `true` | Controls `partials/recent-posts.hbs`. |
| `post_share` | `select` | `Default` | Toggles native/default/disabled share UI. |
| `disqus_shortname` | `text` | empty string | Enables Disqus fallback comments. |

### Routing-related migration recommendation

- Rebuild the current structure explicitly in Astro instead of relying on Ghost's template hierarchy magic.
- Suggested Astro route groups:
  - `/`
  - `/posts/[slug]`
  - `/pages/[slug]`
  - `/tags/[slug]`
  - `/authors/[slug]`
  - `/404`
- Handle the current slug-special pages (`links`, `tags`) as explicit Astro routes or as page-type switches inside `/pages/[slug]`.

## 6. Special migration hotspots

- `default.hbs` is over-loaded.
  - It is not just a layout.
  - It contains Ghost runtime hooks, member/search UI, OG-image logic, theme boot code, and a lightbox loader.
  - In Astro, split it into layout, head utilities, and page-level client scripts.

- Ghost HTML is the source of truth.
  - The theme expects Ghost's rendered `.kg-*` markup, not raw Markdown.
  - If you try to "rebuild" cards from Markdown or Lexical source, you will create extra work for no upside.

- `page-tags.hbs` is the most Ghost-specific data composition.
  - It relies on nested `{{#get}}` calls.
  - It uses `codeinjection_head` as a data channel for tag icons.
  - It adds inline JS for color extraction and scrolling.
  - This should become a dedicated Astro page, not a generic template clone.

- Membership, comments, and search are not content-only features.
  - The theme depends on Ghost's frontend runtime, not just API data.
  - Decide early whether the Astro fork will:
    - keep Ghost Portal/search/comments,
    - replace them,
    - or drop them.
  - Otherwise you will end up half-porting them and wasting time.

- `card_assets: true` hides work you will need to own.
  - In Ghost theme mode, card assets can be injected for you.
  - In Astro, every supported card style or behavior must be shipped intentionally.

- There is a modern JS architecture and a legacy JS architecture in the same repo.
  - Do not port both.
  - The modular `src/js/core`, `src/js/features`, and `src/js/entries` tree is the only sane starting point.

- There is at least one dead feature branch.
  - `progress-bar.js` and `.progress-container` / `.progress-bar` styles still exist, but no current template outputs the matching markup.
  - This is a candidate to drop during migration.

- The stylesheet is large but already valuable.
  - Rewriting the CSS from scratch would be self-inflicted pain.
  - Port it first, then trim dead branches with coverage or grep-driven cleanup.

- Font assets are messy.
  - The runtime typography uses system fonts plus JetBrains Mono from Google Fonts.
  - The checked-in `assets/font/` payload appears legacy and currently unused.
  - `scripts/build.js` still expects a missing `src/font/` directory.
  - Clean this before baking font assumptions into the Astro fork.

- The Not By AI assets need cleanup.
  - Only `written-black` and `written-white` are actually used.
  - Several other badge partials are huge exported HTML blobs in `.hbs` files.
  - That is not something you want to keep in a clean Astro component tree.

- The current OG-image architecture is a workaround stack.
  - Theme emits custom OG tags.
  - Ghost emits its own tags.
  - Cloudflare worker strips duplicates.
  - Astro should own this cleanly and remove the workaround chain.

- Locale handling is coupled to `default.hbs`.
  - Client scripts read translated strings from body data attributes.
  - If Astro changes the translation source, the JS contract must change too.

### Practical recommendation for the Astro fork

If the goal is a clean migration with low risk, the best sequence is:

1. Keep Ghost as the CMS and editor, use the Content API for data, and render Ghost HTML directly in Astro.
2. Port the global layout and `post`, `page`, `links`, and `tags` pages first.
3. Bring over `src/sass` largely intact.
4. Port only the modular JS features that still have matching markup.
5. Make an explicit product decision on Portal/search/comments before wiring secondary pages.
6. Delete workaround layers after Astro owns the output:
   - duplicate OG-image filtering worker
   - legacy JS build path
   - unused icon/font assets

That path keeps the migration boring. Boring wins.
