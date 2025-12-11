<div align="center">

# Attegi

[![Ghost 5+](https://img.shields.io/badge/Ghost-5%2B-000?logo=ghost&logoColor=white)](https://ghost.org/)
[![MIT License](https://img.shields.io/badge/License-MIT-brightgreen.svg)](LICENSE)
[![Build](https://img.shields.io/badge/build-grunt-orange?logo=grunt&logoColor=white)](Gruntfile.js)
[![Demo](https://img.shields.io/badge/demo-attegi.tutuis.me-4F46E5)](https://attegi.tutuis.me)

A modern, elegant Ghost theme focused on clean typography, mobile readability, and deep support for [Ghost](https://ghost.org).

**[View Live Demo →](https://attegi.tutuis.me)**

[简体中文](README_zh.md)

<img src="screenshots/homepage-dark.png" alt="Attegi Theme Preview" width="700">

</div>

---

## Features

| Core | Advanced |
|------|----------|
| ✨ **Dual Theme** - Dark/light modes with system detection | 📑 **Auto TOC** - Table of contents with scroll spy |
| 📱 **Mobile First** - Optimized for all screen sizes | 🧭 **Smart Nav** - Post navigation with home fallback |
| 🎨 **Glass Effects** - Modern UI with elegant animations | 🌍 **32 Languages** - Full i18n support |
| 💻 **Code Blocks** - Syntax highlighting + copy button | 🚀 **Fast** - Optimized assets & lazy loading |

---

## Performance

Attegi achieves excellent scores on [Google PageSpeed Insights](https://pagespeed.web.dev/analysis/https-attegi-tutuis-me/jhk5dugrrn):

| Metric | Mobile | Desktop |
|--------|--------|---------|
| Performance | 97 | 97 |
| Accessibility | 96 | **100** |
| Best Practices | **100** | **100** |
| SEO | **100** | **100** |

---

## Features

### Table of Contents

> Disable TOC on specific posts with `#no-toc` internal tag.

<details>
<summary>View screenshots</summary>
<p align="center">
<img src="screenshots/desktop-toc.png" alt="Desktop TOC" width="700">
</p>
<p align="center">
<img src="screenshots/mobile-toc.png" alt="Mobile TOC" width="350">
</p>
</details>

### Mobile & Code Blocks

<details>
<summary>View screenshots</summary>
<p align="center">
<img src="screenshots/iphone.png" alt="Mobile View" width="400">
&nbsp;&nbsp;&nbsp;&nbsp;
<img src="screenshots/code-block.png" alt="Code Block" width="450">
</p>
</details>

### Navigation & 404

<details>
<summary>View screenshots</summary>
<p align="center">
<img src="screenshots/post-navigation.png" alt="Post Navigation" width="450">
&nbsp;&nbsp;&nbsp;&nbsp;
<img src="screenshots/404-Page.png" alt="404 Page" width="450">
</p>
</details>

### Glass Buttons

<details>
<summary>View screenshots</summary>
<p align="center">
<img src="screenshots/liquid-glass-button.png" alt="Glass Buttons" width="500">
</p>
</details>

---

## Quick Start

1. Download from [GitHub Releases](https://github.com/bunizao/Attegi/releases)
2. `Ghost Admin` → `Settings` → `Design` → `Upload Theme`
3. Activate `**Attegi**`
4. Enjoy!

---

## Customization

| Setting | Location |
|---------|----------|
| Accent color | Ghost Admin → Design & Branding |
| Hide elements | Code Injection (see below) |
| Styles/Scripts | Edit `src/sass` or `src/js`, then rebuild |

<details>
<summary><strong>Hide Elements via Code Injection</strong></summary>

```html
<style>
section.post-comments,
.post-share,
.nav-footer ul,
span.nav-credits,
span.nav-copy { display: none !important; }
</style>
```

</details>

---

## Development

<details>
<summary><strong>Prerequisites</strong></summary>

- Node.js 16+ and npm/yarn
- Docker (optional)
- Git

</details>

<details>
<summary><strong>Local Development with Docker</strong></summary>

```bash
docker-compose up -d
# Visit http://localhost:2368/ghost
# Activate theme in Settings → Design
```

</details>

<details>
<summary><strong>Build Commands</strong></summary>

```bash
yarn dev        # Watch mode
yarn build      # Production build
yarn compress   # Create zip
npx gscan .     # Validate theme
```

</details>

<details>
<summary><strong>Project Structure</strong></summary>

```text
Attegi/
├── assets/        # Compiled (don't edit)
├── locales/       # 32 language files
├── partials/      # Template components
├── src/
│   ├── sass/      # Source styles
│   └── js/        # Source scripts
├── *.hbs          # Templates
└── package.json
```

</details>

---

## Support

- **Docs**: [Ghost Theme Documentation](https://ghost.org/docs/themes/)
- **Issues**: [GitHub Issues](https://github.com/bunizao/Attegi/issues)
- **Discussions**: [GitHub Discussions](https://github.com/bunizao/Attegi/discussions)

---

## License

MIT (inherits from [Attila](https://github.com/zutrinken/attila)). See [LICENSE](LICENSE).
