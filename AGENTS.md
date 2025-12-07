# Repository Guidelines

## Project Structure & Module Organization
- Core theme templates live at the root (`index.hbs`, `post.hbs`, `tag.hbs`, `page.hbs`, `default.hbs`, `author.hbs`) with shared partials in `partials/`.
- Source assets are in `src/` (`sass/` for styles, `js/` for scripts); compiled outputs are written to `assets/css/` and `assets/js/` by Grunt—edit source, not compiled files.
- Fonts/screenshots live in `src/font/` and `src/screenshot-*.jpg`; translations are under `locales/`.

## Build, Test, and Development Commands
- `npm install` — install dev dependencies (Grunt + plugins).
- `npx grunt` — dev mode: builds CSS/JS, copies fonts, then watches `src/sass` and `src/js` for live rebuilds.
- `npx grunt build` — production build: compressed CSS/JS and copied fonts in `assets/`.
- `npx grunt compress` — package the theme as `dist/attegi.zip` for Ghost upload; run after a fresh `grunt build`.

## Local Debugging
- Start Ghost (SQLite): `docker-compose up -d` (http://localhost:2368; mounts this repo to `content/themes/attegi`; content lives at `/Users/tutu/Ghost`). If a MySQL config exists, remove `/Users/tutu/Ghost/config.production.json` to regenerate for SQLite.
- Run `npx grunt` for live SCSS/JS rebuilds; the container picks up the updated `assets/`.
- Open Ghost Admin at `http://localhost:2368/ghost` to switch the theme and test; DevTools uses SCSS source maps from `sass:dev`.
- After edits, sync to the running Ghost and restart: `rsync -av --delete --exclude '.git' --exclude 'node_modules' --exclude 'dist' ./ /Users/tutu/Ghost/themes/attegi/ && docker-compose restart ghost`.

## Coding Style & Naming Conventions
- SCSS uses tab indentation and shared variables in `src/sass/colors`, `fonts`, and `highlight`; prefer existing breakpoints (`$breakpoint-*`, `$inner`).
- JavaScript is jQuery-driven with two-space indentation and semicolons; keep DOM selectors consistent with existing class names and avoid introducing global variables.
- Follow existing naming for partials and templates; new assets belong in `src/` with logical prefixes (e.g., `src/js/libs/` for vendor code).

## Testing Guidelines
- No automated tests; verify with `npx grunt` and a local Ghost instance (docker-compose).
- Check responsive breakpoints (480/640/960) and light/dark schemes; confirm `grunt compress` yields a working zip.

## Commit & Pull Request Guidelines
- Use short, imperative commit subjects; the history favors concise prefixes like `Fix: ...` and `Chore: ...`.
- Keep PRs focused; describe the change, affected templates/assets, and steps to verify in Ghost. Include before/after screenshots for visual tweaks and mention if `dist/attegi.zip` was regenerated.
- Link related issues when available and note any configuration steps (e.g., required Code Injection or accent color settings).

## Theme Packaging & Deployment Tips
- Rebuild before zipping: `npx grunt build && npx grunt compress` to refresh `dist/attegi.zip`.
- Share only the zip from `dist/`; do not ship `node_modules/` or `src/` to Ghost.
