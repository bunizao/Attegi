# Development Guide

This comprehensive guide covers theme development, contribution guidelines, and advanced development workflows for Attegi.

## Development Environment Setup

### Prerequisites

**Required**:
- **Node.js**: 18.x or higher ([download](https://nodejs.org/))
- **npm**: 9.x or higher (comes with Node.js)
- **Git**: For version control
- **Text editor**: VS Code, Sublime Text, or similar

**Recommended**:
- **Docker**: For local Ghost instance
- **Ghost CLI**: For Ghost management
- **Browser DevTools**: Chrome/Firefox developer tools

### Initial Setup

**1. Clone the repository**:

```bash
git clone https://github.com/bunizao/Attegi.git
cd Attegi
```

**2. Install dependencies**:

```bash
npm install
```

**3. Verify installation**:

```bash
# Check Node.js version
node --version  # Should be 18.x or higher

# Check npm version
npm --version   # Should be 9.x or higher

# List available scripts
npm run
```

### Local Ghost Setup

#### Option 1: Docker (Recommended)

**Using docker-compose**:

```bash
# Start Ghost with SQLite
docker-compose up -d

# Access Ghost
# Admin: http://localhost:2368/ghost
# Site: http://localhost:2368

# View logs
docker-compose logs -f

# Stop Ghost
docker-compose down
```

**Configuration**:

```yaml
# docker-compose.yml
version: '3.8'
services:
  ghost:
    image: ghost:5-alpine
    ports:
      - "2368:2368"
    environment:
      url: http://localhost:2368
      database__client: sqlite3
      database__connection__filename: /var/lib/ghost/content/data/ghost.db
    volumes:
      - ./:/var/lib/ghost/content/themes/attegi
      - ghost-data:/var/lib/ghost/content/data

volumes:
  ghost-data:
```

**Sync theme changes**:

```bash
# Sync to running container
rsync -av --delete --exclude '.git' --exclude 'node_modules' --exclude 'dist' ./ /Users/tutu/Ghost/themes/attegi/

# Restart Ghost to pick up changes
docker-compose restart ghost
```

#### Option 2: Ghost CLI

**Install Ghost CLI**:

```bash
npm install -g ghost-cli
```

**Create local instance**:

```bash
# Create directory
mkdir ghost-local
cd ghost-local

# Install Ghost
ghost install local

# Start Ghost
ghost start

# Access at http://localhost:2368
```

**Link theme**:

```bash
# Create symlink to theme
ln -s /path/to/Attegi /path/to/ghost-local/content/themes/attegi

# Restart Ghost
ghost restart
```

### Development Workflow

**1. Start development mode**:

```bash
npm run dev
# or
npx grunt
```

This starts watch mode:
- Compiles SCSS on save
- Minifies JavaScript on save
- Copies fonts automatically
- Outputs to `assets/` directory

**2. Make changes**:

- Edit files in `src/` directory
- Modify templates (`.hbs` files)
- Changes compile automatically

**3. Test in browser**:

- Visit http://localhost:2368
- Refresh to see changes
- Use DevTools for debugging

**4. Build for production**:

```bash
npm run build
# or
npx grunt build
```

**5. Package theme**:

```bash
npm run compress
# or
npx grunt compress
```

Output: `dist/attegi.zip`

## Project Structure

```
Attegi/
├── src/                          # Source files (EDIT THESE)
│   ├── sass/                     # SCSS stylesheets
│   │   ├── style.scss            # Main entry point
│   │   ├── _colors.scss          # Color variables
│   │   ├── _fonts.scss           # Typography
│   │   ├── _normalize.scss       # CSS reset
│   │   ├── _highlight.scss       # Code highlighting
│   │   └── _toc.scss             # Table of contents
│   ├── js/                       # JavaScript source
│   │   ├── script.js             # Main theme JS
│   │   ├── post.js               # Post features
│   │   ├── toc.js                # TOC logic
│   │   ├── poem.js               # Poem card parser
│   │   └── libs/                 # Vendor libraries
│   └── font/                     # Font files
├── assets/                       # Compiled output (AUTO-GENERATED)
│   ├── css/                      # Compiled CSS
│   ├── js/                       # Minified JS
│   └── font/                     # Copied fonts
├── partials/                     # Handlebars partials
│   ├── loop.hbs                  # Post card loop
│   ├── pagination.hbs            # Pagination
│   ├── navigation.hbs            # Main nav
│   ├── subscribe_form.hbs        # Newsletter form
│   └── icons/                    # SVG icons
├── locales/                      # i18n translations (32 languages)
├── cloudflare-worker/            # OG image service
├── dist/                         # Distribution package
│   └── attegi.zip                # Packaged theme
├── *.hbs                         # Root templates
├── default.hbs                   # Master layout
├── package.json                  # Project config & Ghost settings
├── Gruntfile.js                  # Build configuration
└── README.md                     # Documentation
```

## Build System

### Grunt Tasks

Attegi uses Grunt for task automation.

**Available tasks**:

```bash
# Development (watch mode)
npx grunt              # Default task
npx grunt watch        # Watch only

# Production build
npx grunt build        # Compressed CSS/JS

# Package theme
npx grunt compress     # Creates dist/attegi.zip

# Clean
npx grunt clean:dist   # Remove dist directory
```

### Task Configuration

**Location**: `Gruntfile.js`

**Key tasks**:

**1. SASS Compilation**:

```javascript
sass: {
  dev: {
    options: {
      sourceMap: true,
      outputStyle: 'expanded'
    },
    files: {
      'assets/css/style.css': 'src/sass/style.scss'
    }
  },
  build: {
    options: {
      sourceMap: false,
      outputStyle: 'compressed'
    },
    files: {
      'assets/css/style.css': 'src/sass/style.scss'
    }
  }
}
```

**2. PostCSS Processing**:

```javascript
postcss: {
  options: {
    processors: [
      require('autoprefixer')(),
      require('cssnano')()
    ]
  },
  dev: {
    src: 'assets/css/style.css'
  }
}
```

**3. JavaScript Minification**:

```javascript
uglify: {
  build: {
    files: {
      'assets/js/script.js': ['src/js/script.js'],
      'assets/js/post.js': ['src/js/post.js'],
      'assets/js/toc.js': ['src/js/toc.js']
    }
  }
}
```

**4. Watch Task**:

```javascript
watch: {
  sass: {
    files: ['src/sass/**/*.scss'],
    tasks: ['sass:dev', 'postcss:dev']
  },
  js: {
    files: ['src/js/**/*.js'],
    tasks: ['uglify:build']
  },
  fonts: {
    files: ['src/font/**/*'],
    tasks: ['copy:fonts']
  }
}
```

**5. Compression**:

```javascript
compress: {
  main: {
    options: {
      archive: 'dist/attegi.zip'
    },
    files: [{
      expand: true,
      src: [
        '**',
        '!node_modules/**',
        '!src/**',
        '!dist/**',
        '!.git/**',
        '!*.md',
        '!Gruntfile.js'
      ]
    }]
  }
}
```

### Adding Custom Tasks

**Example: Image optimization**

```javascript
// Install plugin
npm install grunt-contrib-imagemin --save-dev

// Add to Gruntfile.js
imagemin: {
  dynamic: {
    files: [{
      expand: true,
      cwd: 'src/images/',
      src: ['**/*.{png,jpg,gif,svg}'],
      dest: 'assets/images/'
    }]
  }
}

// Register task
grunt.registerTask('images', ['imagemin']);
```

## SCSS Architecture

### File Organization

**Main entry point**: `src/sass/style.scss`

```scss
// Imports (order matters)
@import "normalize";      // CSS reset
@import "colors";         // Color system
@import "fonts";          // Typography

// Base styles
@import "base";           // HTML elements

// Components
@import "navigation";     // Header/nav
@import "cards";          // Post cards
@import "post";           // Post content
@import "footer";         // Footer

// Features
@import "highlight";      // Code highlighting
@import "toc";            // Table of contents
@import "comments";       // Comments

// Utilities
@import "utilities";      // Helper classes
```

### Naming Conventions

**BEM methodology** (Block Element Modifier):

```scss
// Block
.post-card { }

// Element
.post-card__title { }
.post-card__excerpt { }

// Modifier
.post-card--featured { }
.post-card--large { }
```

**Example**:

```scss
.post-card {
  background: var(--color-background);
  border-radius: 8px;

  &__image {
    width: 100%;
    aspect-ratio: 16/9;
  }

  &__content {
    padding: 1.5rem;
  }

  &__title {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  &--featured {
    grid-column: span 2;

    .post-card__title {
      font-size: 2rem;
    }
  }
}
```

### Variables and Mixins

**Color variables** (`_colors.scss`):

```scss
:root {
  // Brand colors
  --color-primary: #15171A;
  --color-secondary: #738A94;

  // Backgrounds
  --color-background: #FFFFFF;
  --color-surface: #F7F8FA;

  // Text
  --color-text: #15171A;
  --color-text-secondary: #738A94;

  // Borders
  --color-border: #E5EFF5;

  // States
  --color-success: #5FB878;
  --color-warning: #FFC107;
  --color-error: #F44336;
}
```

**Typography variables** (`_fonts.scss`):

```scss
// Font families
$font-family-base: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
$font-family-mono: "SF Mono", Monaco, Consolas, monospace;

// Font sizes
$font-size-base: 1rem;
$font-size-small: 0.875rem;
$font-size-large: 1.125rem;

// Line heights
$line-height-base: 1.6;
$line-height-heading: 1.2;

// Font weights
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-bold: 700;
```

**Breakpoints**:

```scss
$breakpoint-xsmall: 420px;
$breakpoint-small: 480px;
$breakpoint-medium: 640px;
$breakpoint-large: 960px;
$inner: 1100px;
```

**Mixins**:

```scss
// Responsive breakpoint
@mixin respond-to($breakpoint) {
  @media (max-width: $breakpoint) {
    @content;
  }
}

// Usage
.element {
  font-size: 1.5rem;

  @include respond-to($breakpoint-medium) {
    font-size: 1.25rem;
  }
}
```

## JavaScript Architecture

### Code Organization

**Three main bundles**:

1. **script.js** - Core theme functionality
2. **post.js** - Post-specific features
3. **toc.js** - Table of contents

### Coding Standards

**Style guide**:
- Two-space indentation
- Semicolons required
- Single quotes for strings
- Descriptive variable names
- Comments for complex logic

**Example**:

```javascript
(function() {
  'use strict';

  // Theme switching functionality
  var themeToggle = document.querySelector('.theme-toggle');
  var currentTheme = localStorage.getItem('theme') || 'system';

  /**
   * Set theme and update UI
   * @param {string} theme - Theme name (light, dark, system)
   */
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateToggleIcon(theme);
  }

  /**
   * Update toggle button icon
   * @param {string} theme - Current theme
   */
  function updateToggleIcon(theme) {
    var icon = themeToggle.querySelector('.icon');
    icon.className = 'icon icon-' + theme;
  }

  // Event listeners
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      var themes = ['system', 'light', 'dark'];
      var currentIndex = themes.indexOf(currentTheme);
      var nextIndex = (currentIndex + 1) % themes.length;
      currentTheme = themes[nextIndex];
      setTheme(currentTheme);
    });
  }

  // Initialize
  setTheme(currentTheme);
})();
```

### Adding New Features

**Example: Reading progress bar**

**1. Create feature file** (`src/js/reading-progress.js`):

```javascript
(function() {
  'use strict';

  var progressBar = document.createElement('div');
  progressBar.className = 'reading-progress';
  document.body.appendChild(progressBar);

  function updateProgress() {
    var winScroll = document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
})();
```

**2. Add styles** (`src/sass/_reading-progress.scss`):

```scss
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 0;
  height: 3px;
  background: var(--color-primary);
  z-index: 9999;
  transition: width 0.2s ease;
}
```

**3. Update Gruntfile.js**:

```javascript
uglify: {
  build: {
    files: {
      'assets/js/reading-progress.js': ['src/js/reading-progress.js']
    }
  }
}
```

**4. Include in template**:

```handlebars
{{#is "post"}}
  <script defer src="{{asset "js/reading-progress.js"}}"></script>
{{/is}}
```

## Template Development

### Handlebars Basics

**Variables**:

```handlebars
{{title}}                 {{!-- Post title --}}
{{excerpt}}               {{!-- Post excerpt --}}
{{content}}               {{!-- Post content --}}
{{url}}                   {{!-- Post URL --}}
```

**Helpers**:

```handlebars
{{#if featured}}          {{!-- Conditional --}}
  <span>Featured</span>
{{/if}}

{{#foreach posts}}        {{!-- Loop --}}
  <h2>{{title}}</h2>
{{/foreach}}

{{#has tag="news"}}       {{!-- Check for tag --}}
  <span>News</span>
{{/has}}
```

**Ghost helpers**:

```handlebars
{{img_url feature_image size="l"}}
{{date format="MMMM DD, YYYY"}}
{{reading_time}}
{{tags separator=", "}}
{{excerpt words="50"}}
```

### Creating Custom Templates

**Example: Portfolio template**

**1. Create template** (`custom-portfolio.hbs`):

```handlebars
{{!< default}}

<main class="portfolio">
  <div class="inner">
    <header class="portfolio-header">
      <h1>{{title}}</h1>
      {{#if custom_excerpt}}
        <p class="portfolio-description">{{custom_excerpt}}</p>
      {{/if}}
    </header>

    <div class="portfolio-grid">
      {{#foreach posts}}
        <article class="portfolio-item">
          {{#if feature_image}}
            <a href="{{url}}" class="portfolio-image">
              <img src="{{img_url feature_image size="m"}}" alt="{{title}}" />
            </a>
          {{/if}}
          <div class="portfolio-content">
            <h2><a href="{{url}}">{{title}}</a></h2>
            {{#if custom_excerpt}}
              <p>{{custom_excerpt}}</p>
            {{/if}}
            <a href="{{url}}" class="portfolio-link">View Project →</a>
          </div>
        </article>
      {{/foreach}}
    </div>
  </div>
</main>
```

**2. Add styles** (`src/sass/_portfolio.scss`):

```scss
.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.portfolio-item {
  background: var(--color-surface);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
}

.portfolio-image {
  display: block;
  aspect-ratio: 16/9;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.portfolio-content {
  padding: 1.5rem;
}
```

**3. Register in package.json**:

```json
{
  "config": {
    "custom_templates": [
      {
        "name": "Portfolio",
        "filename": "custom-portfolio"
      }
    ]
  }
}
```

### Partials

**Creating partials**:

**1. Create file** (`partials/author-bio.hbs`):

```handlebars
<div class="author-bio">
  {{#if profile_image}}
    <img src="{{img_url profile_image size="s"}}" alt="{{name}}" class="author-avatar" />
  {{/if}}
  <div class="author-info">
    <h3>{{name}}</h3>
    {{#if bio}}
      <p>{{bio}}</p>
    {{/if}}
    {{#if website}}
      <a href="{{website}}" target="_blank" rel="noopener">Visit Website</a>
    {{/if}}
  </div>
</div>
```

**2. Use in templates**:

```handlebars
{{#post}}
  {{#primary_author}}
    {{> "author-bio"}}
  {{/primary_author}}
{{/post}}
```

## Testing

### Manual Testing

**Checklist**:

- [ ] Homepage loads correctly
- [ ] Post pages display properly
- [ ] Navigation works (desktop & mobile)
- [ ] Theme switching functions
- [ ] TOC generates and scrolls
- [ ] Code blocks highlight correctly
- [ ] Images load and lazy-load
- [ ] Comments load (if enabled)
- [ ] Forms submit correctly
- [ ] Search works
- [ ] Pagination functions
- [ ] 404 page displays
- [ ] Author pages work
- [ ] Tag pages work

### Browser Testing

**Test in**:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

**Responsive breakpoints**:
- 420px (small mobile)
- 480px (mobile)
- 640px (large mobile / small tablet)
- 960px (tablet / small desktop)
- 1100px+ (desktop)

### GScan Validation

**Ghost's official theme validator**:

```bash
# Install GScan
npm install -g gscan

# Validate theme
npx gscan .

# Validate packaged theme
npx gscan dist/attegi.zip

# Output results to file
npx gscan . --output results.json
```

**Common issues**:
- Missing required templates
- Invalid Ghost helpers
- Deprecated features
- Missing package.json fields
- Invalid image sizes

**Fix errors before publishing**.

### Performance Testing

**Lighthouse audit**:

```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit
lighthouse http://localhost:2368 --view

# Specific categories
lighthouse http://localhost:2368 --only-categories=performance,accessibility
```

**Target scores**:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

**WebPageTest**:

Visit [webpagetest.org](https://www.webpagetest.org/) and test your site:
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.8s
- Cumulative Layout Shift (CLS): < 0.1

## Version Management

### Semantic Versioning

Attegi follows [SemVer](https://semver.org/):

**Format**: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes

**Examples**:
- `6.9.10` → `6.9.11`: Bug fix
- `6.9.11` → `6.10.0`: New feature
- `6.10.0` → `7.0.0`: Breaking change

### Updating Version

**Using script**:

```bash
# Bump patch version (6.9.10 → 6.9.11)
./scripts/bump-version.sh patch

# Bump minor version (6.9.11 → 6.10.0)
./scripts/bump-version.sh minor

# Bump major version (6.10.0 → 7.0.0)
./scripts/bump-version.sh major
```

**Manual update**:

1. Edit `package.json`:
```json
{
  "version": "6.9.11"
}
```

2. Create git tag:
```bash
git tag -a v6.9.11 -m "Version 6.9.11"
git push origin v6.9.11
```

## Contributing

### Contribution Workflow

**1. Fork repository**:

```bash
# Fork on GitHub, then clone
git clone https://github.com/YOUR_USERNAME/Attegi.git
cd Attegi
```

**2. Create branch**:

```bash
# Feature branch
git checkout -b feature/new-feature

# Bug fix branch
git checkout -b fix/bug-description
```

**3. Make changes**:

- Follow coding standards
- Test thoroughly
- Update documentation

**4. Commit changes**:

```bash
git add .
git commit -m "feat: add new feature"
```

**Commit message format**:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Tests
- `chore:` Maintenance

**5. Push and create PR**:

```bash
git push origin feature/new-feature
```

Then create Pull Request on GitHub.

### Code Review

**PR checklist**:

- [ ] Code follows style guide
- [ ] Tests pass
- [ ] GScan validation passes
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] No breaking changes (or documented)
- [ ] Screenshots included (for UI changes)

### Reporting Issues

**Bug reports should include**:

- Ghost version
- Theme version
- Browser and OS
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Console errors (if any)

**Feature requests should include**:

- Use case description
- Proposed solution
- Alternative solutions considered
- Additional context

## Deployment

### Packaging for Release

**1. Update version**:

```bash
./scripts/bump-version.sh minor
```

**2. Update changelog**:

Edit `CHANGELOG.md`:

```markdown
## [6.10.0] - 2025-01-04

### Added
- New poem card feature
- Image format preferences

### Fixed
- Post metadata display issue
- Textarea styling

### Changed
- Improved image URL handling
```

**3. Build and package**:

```bash
npm run build
npm run compress
```

**4. Test package**:

```bash
npx gscan dist/attegi.zip
```

**5. Create release**:

```bash
git add .
git commit -m "chore: release v6.10.0"
git tag -a v6.10.0 -m "Release v6.10.0"
git push origin main --tags
```

**6. GitHub release**:

- Go to GitHub Releases
- Create new release
- Upload `dist/attegi.zip`
- Add release notes from changelog

### CI/CD

**GitHub Actions workflows**:

**Build validation** (`.github/workflows/build.yml`):

```yaml
name: Build

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npx gscan .
```

**Release workflow** (`.github/workflows/release.yml`):

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run build
      - run: npm run compress
      - uses: softprops/action-gh-release@v1
        with:
          files: dist/attegi.zip
```

## Troubleshooting

### Build Issues

**SASS compilation fails**:

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check SASS version
npm list sass
```

**JavaScript minification fails**:

```bash
# Check for syntax errors
npx eslint src/js/

# Test individual files
npx uglifyjs src/js/script.js -o test.js
```

**Watch not detecting changes**:

```bash
# Restart watch
npx grunt watch

# Check file permissions
ls -la src/sass/
```

### Ghost Issues

**Theme not appearing**:

```bash
# Check theme directory
ls -la /path/to/ghost/content/themes/attegi/

# Restart Ghost
ghost restart

# Check Ghost logs
ghost log
```

**Assets not loading**:

```bash
# Verify assets exist
ls -la assets/css/
ls -la assets/js/

# Check file permissions
chmod -R 755 assets/
```

### Development Tips

**Hot reload**:

Use browser extensions:
- LiveReload
- BrowserSync

**Debugging**:

```javascript
// Add debug logging
console.log('Debug:', variable);

// Breakpoints in DevTools
debugger;

// Performance monitoring
console.time('operation');
// ... code ...
console.timeEnd('operation');
```

**SCSS debugging**:

```scss
// Enable source maps in Gruntfile.js
sass: {
  dev: {
    options: {
      sourceMap: true
    }
  }
}
```

## Resources

### Documentation

- [Ghost Theme Documentation](https://ghost.org/docs/themes/)
- [Handlebars Documentation](https://handlebarsjs.com/)
- [SCSS Documentation](https://sass-lang.com/documentation)
- [Grunt Documentation](https://gruntjs.com/)

### Tools

- [GScan](https://github.com/TryGhost/GScan) - Theme validator
- [Ghost CLI](https://ghost.org/docs/ghost-cli/) - Ghost management
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance audit
- [Can I Use](https://caniuse.com/) - Browser compatibility

### Community

- [Attegi GitHub](https://github.com/bunizao/Attegi)
- [GitHub Discussions](https://github.com/bunizao/Attegi/discussions)
- [GitHub Issues](https://github.com/bunizao/Attegi/issues)
- [Ghost Forum](https://forum.ghost.org/)

---

**Congratulations!** You now have comprehensive knowledge of Attegi theme development. Happy coding!
