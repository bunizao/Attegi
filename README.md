# Attegi
[![Ghost 5+](https://img.shields.io/badge/Ghost-5%2B-000?logo=ghost&logoColor=white)](https://ghost.org/)
[![MIT License](https://img.shields.io/badge/License-MIT-brightgreen.svg)](LICENSE)
[![Build](https://img.shields.io/badge/build-grunt-orange?logo=grunt&logoColor=white)](Gruntfile.js)
[![Demo](https://img.shields.io/badge/demo-attegi.tutuis.me-4F46E5)](https://Attegi.tutuis.me)

A Ghost theme focused on clean typography, mobile readability, and a calm dark/light presentation. Built on [Attila](https://github.com/zutrinken/attila) with refinements inspired by Moegi.

![Attegi logo](assets/img/attegi-logo-1.png)

[简体中文](README_zh.md)

---

## Highlights
- Mobile-friendly scale: tighter fonts, spacing, and card layouts that stay readable on phones.
- Dual theme polish: tuned dark/light colors, accent-aware states, consistent author/date meta.
- **Liquid glass** touches: softened glassy hovers on cards and meta blocks for a lightweight depth effect.
- Thoughtful details: improved captions, softer shadows, refined featured/star markers, responsive video wrappers.
- Attila-compatible: all core Attila features remain, you can still use its helpers and blocks.

---

## Quick Start
- Download the release zip (`npx grunt compress` or GitHub zip).
- Upload in Ghost Admin → Design → Upload Theme → Activate.
- For hacking and local dev, see **Development** below.

---

## Customization
- **Accent color**: Ghost Admin → Design & Branding → Accent color (set dark-mode accent if desired).
- **Hide blocks** (via Code Injection):
```html
<style>
section.post-comments,
.post-share,
.nav-footer ul,
span.nav-credits,
span.nav-copy { display: none !important; }
</style>
```
- **SCSS/JS edits**: change source in `src/sass` and `src/js`, then rebuild. Do not edit `assets/` directly.

---

## Project Structure
- Templates: root `.hbs` files + `partials/`
- Source: `src/sass`, `src/js` → compiled to `assets/`
- Package: `dist/attegi.zip` from `npx grunt compress`

---

## Demo
https://attegi.tutuis.me

---

<details>
<summary><strong>Development</strong></summary>

1) **Install deps**
```bash
npm install
```

2) **Run locally with Ghost (SQLite)**
```bash
docker-compose up -d          # starts Ghost + mounts this repo as the theme
```
Open `http://localhost:2368/ghost` to activate the theme.

3) **Live build while editing**
```bash
npx grunt                     # watches src/sass and src/js, outputs to assets/
```

4) **Package for upload**
```bash
npx grunt build && npx grunt compress   # dist/attegi.zip
```

5) **Sync to a running local Ghost + restart**
```bash
rsync -av --delete --exclude '.git' --exclude 'node_modules' --exclude 'dist' ./ /Users/tutu/Ghost/themes/attegi/ \
  && docker-compose restart ghost
```

</details>

---

## License
MIT (inherits from `Attila`). See `LICENSE`.
