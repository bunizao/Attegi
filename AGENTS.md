# AGENTS.md

Attegi is a Ghost theme: Handlebars templates, SCSS, and vanilla ES modules
bundled by esbuild. Tooling runs on Bun. `CLAUDE.md` is a symlink to this file.

## Rules

- Everything in English: comments, docs, commit messages, identifiers.
- Conventional Commits with a scope, imperative, no rationale tail
  ("to improve", "for clarity"). Examples from history:
  `fix(theme): prioritize custom og images`, `feat(dev): add local Ghost preview renderer`.
- Edit sources, never build output. `assets/css/style.css` and
  `assets/js/*.js` are generated and gitignored.
- The shipped artifact is `dist/attegi.zip`. It must pass GScan.

## Commands

```bash
bun install
bun run dev:preview   # Local .hbs render + remote Content API content, http://localhost:3020
bun run dev:hot       # BrowserSync proxy over a real Ghost (GHOST_DEV_URL), http://localhost:3010
bun run dev           # Asset watchers only: sass, tailwind, esbuild
bun run build         # Production CSS + JS
bun run validate      # build, zip to dist/attegi.zip, run GScan
```

There is no linter or test suite. `bun run validate` is the floor for every change.

- `dev:preview` is the default loop for template, CSS, and JS work. It needs
  `GHOST_CONTENT_API_URL` and `GHOST_CONTENT_API_KEY` in `.env.local`
  (see `.env.example`). It is a renderer approximation in
  `scripts/dev-preview.js`: portal, comments, search, and Ghost image transforms
  are stubbed. When a template uses a new Ghost helper, teach the renderer too.
- `dev:hot` gives real Ghost output, but template edits only show up if the
  target Ghost has this theme installed. Local `assets/` are served over it.
- Visual changes: check light and dark, and the 420 / 480 / 640 / 960 breakpoints.

## Layout

- Root templates: `default.hbs` is the shell (head, theme bootstrap script,
  navigation, footer); `index`, `post`, `page`, `tag`, `author`, `error`, plus
  custom templates `page-tags.hbs` and `page-links.hbs`. Partials in
  `partials/`, inline SVG icons in `partials/icons/`.
- `src/sass/style.scss` is the main stylesheet: one large file split by
  `/* ===== */` banners, tab-indented. Modules: `_colors`, `_fonts`,
  `_highlight`, `_toc`, `_poem-card`, `_normalize`, `_breakpoints`.
- JS: `src/js/entries/{site,post,page}.js` bundle to `assets/js/` via
  `scripts/build.js`. Features live in `src/js/features/` and export
  `init*` / `setup*` functions; shared helpers (`qs`, `qsa`, `onReady`,
  `throttle`, `getI18n`) come from `src/js/core/`. Two-space indent, semicolons, no jQuery.
- Vendor scripts (`highlight.pack.js`, `glightbox`, `tocbot`) are copied, not bundled.
- Cover `<img>` tags deliberately omit `crossorigin`: it blanks covers on
  storage adapters without CORS headers. So `cover-detect.js` brightness
  sampling only works for same-origin images; the baseline scrim must carry
  contrast on its own.
- `package.json` `config.custom` defines the Ghost admin settings read as
  `@custom.*`. The preview renderer reads defaults from there too.
- `locales/*.json` back `{{t "..."}}`. A missing key falls back to the English
  key text. `en`, `zh`, and `zh_tw` are complete; some older locales lag.

## Design system

- Color tokens are CSS custom properties in `src/sass/_colors.scss`
  (`--color-background-*`, `--color-content-*`, `--color-menu-*`). Dark mode
  overrides them under `.theme-dark:root` and, for the System setting,
  `prefers-color-scheme`. A blocking script in `default.hbs` sets the class
  before paint. Every color change needs both themes.
- Accent: `--ghost-accent-color` from Ghost admin; dark mode swaps in
  `@custom.darkmode_accent_color` from `default.hbs`.
- Type: `--gh-font-heading` and `--gh-font-body` in `_fonts.scss`, system
  stacks with CJK fallbacks. Posts are bilingual (English and Chinese), so check both.
- `html { font-size: 62.5% }`, so `1rem` is 10px. Body text sizes use `em`.
- Breakpoints: `$breakpoint-large` 960, `-medium` 640, `-small` 480,
  `-xsmall` 420. Content width is `$inner`.

## Design skills

Project skills live in `.agents/skills/`, symlinked into `.claude/skills/`,
pinned in `skills-lock.json`, all gitignored. They assume React in places;
translate to Handlebars, SCSS, and vanilla JS.

- `better-interface`: one review pass across the other `better-*` skills
  (accessibility, layout, typography, color, UI polish, writing).
- `better-typography`, `web-typography`: long-form reading, the core of this theme.
- `emil-design-eng`, `make-interfaces-feel-better`: small details and polish.
- `review-animations`, `improve-animations`, `transitions-dev`, `apple-design`: motion.
- `fixing-accessibility`, `vocabulary`, `animation-vocabulary`: audits and naming.

## Release

- `scripts/bump-version.sh patch|minor|major|x.y.z`, then commit
  `chore(release): bump version to x.y.z`. Details in `.github/RELEASE.md`.
- `build.yml` builds and runs GScan on every push and PR; a tag push attaches
  the zip to a GitHub release. `deploy.yml` is manual and uploads to the dev or
  prod Ghost through `scripts/deploy-theme.js`.
