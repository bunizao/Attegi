<div align="center">

# Attegi

[![Ghost 5+](https://img.shields.io/badge/Ghost-5%2B-000?logo=ghost&logoColor=white)](https://ghost.org/)
[![MIT License](https://img.shields.io/badge/License-MIT-brightgreen.svg)](LICENSE)
[![Build](https://img.shields.io/badge/build-grunt-orange?logo=grunt&logoColor=white)](Gruntfile.js)
[![Demo](https://img.shields.io/badge/demo-attegi.tutuis.me-4F46E5)](https://attegi.tutuis.me)

A modern, elegant Ghost theme focused on clean typography, mobile readability, and seamless dark/light mode switching.

**[View Live Demo →](https://attegi.tutuis.me)**

[简体中文](README_zh.md)

<img src="screenshots/homepage-dark.png" alt="Attegi Theme Preview" width="700">

</div>

---

## Features

<table>
<tr>
<td width="50%">

### Core

- ✨ **Dual Theme** - Dark/light modes with system detection
- 📱 **Mobile First** - Optimized for all screen sizes
- 🎨 **Glass Effects** - Modern UI with elegant animations
- 💻 **Code Blocks** - Syntax highlighting + copy button

</td>
<td width="50%">

### Advanced

- 📑 **Auto TOC** - Table of contents with scroll spy
- 🧭 **Smart Nav** - Post navigation with home fallback
- 🌍 **32 Languages** - Full i18n support
- 🚀 **Fast** - Optimized assets & lazy loading

</td>
</tr>
</table>

---

## Screenshots

<table>
<tr>
<td width="50%" align="center">
<strong>Mobile Optimized</strong><br><br>
<img src="screenshots/iphone.png" alt="Mobile View" width="280">
</td>
<td width="50%" align="center">
<strong>Code Blocks</strong><br><br>
<img src="screenshots/code-block.png" alt="Code Block" width="400">
</td>
</tr>
<tr>
<td width="50%" align="center">
<strong>Post Navigation</strong><br><br>
<img src="screenshots/post-navigation.png" alt="Post Navigation" width="400">
</td>
<td width="50%" align="center">
<strong>404 Page</strong><br><br>
<img src="screenshots/404-Page.png" alt="404 Page" width="400">
</td>
</tr>
<tr>
<td colspan="2" align="center">
<strong>Glass Buttons</strong><br><br>
<img src="screenshots/liquid-glass-button.png" alt="Glass Buttons" width="500">
</td>
</tr>
</table>

### Table of Contents

Auto-generated TOC for long articles with:
- Desktop: Fixed sidebar with scroll spy
- Mobile: Floating panel with reading progress
- Disable per-post with `#no-toc` tag

### Performance

Excellent scores on [PageSpeed Insights](https://pagespeed.web.dev/analysis/https-attegi-tutuis-me/hzaz7busnt) for both mobile and desktop.

---

## Quick Start

```bash
# 1. Download from GitHub Releases
# 2. Ghost Admin → Settings → Design → Upload Theme
# 3. Activate Attegi
```

Or build from source:

```bash
git clone https://github.com/bunizao/Attegi.git
cd Attegi && yarn install
yarn build && yarn compress
# Upload dist/attegi.zip
```

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

```
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
- **Email**: [me@tutuis.me](mailto:me@tutuis.me)

---

## License

MIT (inherits from [Attila](https://github.com/zutrinken/attila)). See [LICENSE](LICENSE).
