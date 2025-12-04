# Attegi
[![Ghost 5+](https://img.shields.io/badge/Ghost-5%2B-000?logo=ghost&logoColor=white)](https://ghost.org/)
[![MIT License](https://img.shields.io/badge/License-MIT-brightgreen.svg)](LICENSE)
[![Build](https://img.shields.io/badge/build-grunt-orange?logo=grunt&logoColor=white)](Gruntfile.js)
[![Demo](https://img.shields.io/badge/demo-attegi.tutuis.me-4F46E5)](https://Attegi.tutuis.me)

A modern, elegant Ghost theme focused on clean typography, mobile readability, and seamless dark/light mode switching. Built on [Attila](https://github.com/zutrinken/attila) with extensive enhancements for better user experience and performance.

**[View Live Demo →](https://attegi.tutuis.me)**

[简体中文](README_zh.md)

---

## Key Features

- ✨ **Dual Theme Support** - Polished dark/light modes with system preference detection
- 📱 **Mobile Optimized** - Responsive design with optimized fonts and spacing for all devices
- 🎨 **Liquid Glass Effects** - Modern UI with elegant hover animations and glass morphism
- 💻 **Enhanced Code Blocks** - Syntax highlighting with language headers and copy-to-clipboard
- 🧭 **Smart Navigation** - Intelligent post navigation with home fallback
- 🎯 **SEO Optimized** - Clean markup, structured data, and excellent performance scores
- 🌍 **i18n Ready** - 32 language translations included
- ♿ **Accessible** - WCAG compliant with proper ARIA labels and keyboard navigation
- 🚀 **Fast Performance** - Optimized assets and lazy loading for quick page loads

## Features & Screenshots

### Dark Mode and Elegant Hover
I redesigned and created the homepage, adding elegant animations and hovers, as well as a brand new tab system.
![Homepage Light](screenshots/homepage-dark.png)

### Mobile-friendly scale
Tighter fonts, spacing, and card layouts that stay readable on phones.
![Mobile-friendly scale](screenshots/iphone.png)
### Code Blocks with Syntax Highlighting
Beautifully styled code blocks with language headers and one-click copy functionality.

![Code Block](screenshots/code-block.png)

### Smart Post Navigation
Elegant post navigation with home fallback when at the first or last post.

![Post Navigation](screenshots/post-navigation.png)

### Elegant 404 Page
Creative 404 error page with animated space theme and post recommendations.
![Elegant 404 Page](screenshots/404-Page.png)

### Liquid Glass Texture Buttons
Modern glass morphism effects on interactive elements for a premium feel.
![Liquid glass texture buttons](screenshots/liquid-glass-button.png)

### Excellent Performance

Attegi achieves high scores on Google's PageSpeed Insights for both mobile and desktop, ensuring fast load times and smooth user experience.

**[View PageSpeed Report →](https://pagespeed.web.dev/analysis/https-attegi-tutuis-me/hzaz7busnt)**

---

## Quick Start

1. **Download** the latest release from [GitHub Releases](https://github.com/bunizao/Attegi/releases)
2. **Upload** in Ghost Admin → Settings → Design → Upload Theme
3. **Activate** the Attegi theme

For local development, see the **Development** section below.

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

## Demo

**[View Live Demo →](https://attegi.tutuis.me)**

---

## Development

### Prerequisites

- Node.js 16+ and npm/yarn
- Docker (optional, for local Ghost instance)
- Git

### Setup

**1. Clone and Install**

```bash
git clone https://github.com/bunizao/Attegi.git
cd Attegi

# Using npm
npm install

# Or using yarn (recommended)
yarn install
```

**2. Development Workflow**

Choose one of the following methods:

#### Option A: Local Ghost with Docker (Recommended)

```bash
# Start Ghost with theme mounted
docker-compose up -d

# Access Ghost admin at http://localhost:2368/ghost
# Activate the Attegi theme in Settings → Design
```

#### Option B: Upload to Existing Ghost Instance

```bash
# Build and package theme
yarn build && yarn compress

# Or with npm
npm run build && npm run compress

# Upload dist/attegi.zip via Ghost Admin → Design → Upload Theme
```

**3. Live Development**

Watch for changes and auto-rebuild assets:

```bash
# Using yarn (recommended)
yarn dev

# Or using npm
npm run dev

# Or watch only
yarn watch
```

This watches `src/sass` and `src/js` and compiles to `assets/` on save.

**4. Build for Production**

```bash
# Clean build
yarn build

# Create distribution package
yarn compress

# Output: dist/attegi.zip
```

**5. Theme Validation**

```bash
# Validate theme compatibility
npx gscan .

# Check for errors before submitting
```

### Project Structure

```
Attegi/
├── assets/           # Compiled CSS/JS (don't edit directly)
├── locales/          # i18n translation files (32 languages)
├── partials/         # Reusable template components
├── src/
│   ├── sass/        # Source SCSS files
│   └── js/          # Source JavaScript files
├── *.hbs            # Handlebars templates
├── package.json     # Theme metadata and dependencies
└── Gruntfile.js     # Build configuration
```

### Making Changes

- **Styles**: Edit files in `src/sass/`, run `yarn build` to compile
- **Scripts**: Edit files in `src/js/`, run `yarn build` to compile
- **Templates**: Edit `.hbs` files directly
- **Translations**: Edit files in `locales/`

### Tips

- Use `yarn dev` during development for auto-compilation
- Test in both light and dark modes
- Verify mobile responsiveness
- Run `npx gscan .` before committing changes
- Check browser console for JavaScript errors

---

## Support

Need help with Attegi? Here's how to get support:

- **Documentation**: Check this README and the [Ghost theme documentation](https://ghost.org/docs/themes/)
- **Issues**: Report bugs or request features on [GitHub Issues](https://github.com/bunizao/Attegi/issues)
- **Questions**: Ask questions in [GitHub Discussions](https://github.com/bunizao/Attegi/discussions)
- **Contact**: Reach out via email at [me@tutuis.me](mailto:me@tutuis.me)

Before opening an issue, please:
1. Check existing issues to avoid duplicates
2. Include your Ghost version and theme version
3. Provide steps to reproduce any bugs
4. Share relevant screenshots if applicable

---

## License
MIT (inherits from `Attila`). See `LICENSE`.
