# Customization Guide

This guide shows you how to customize Attegi's appearance and behavior to match your brand and preferences.

## Before You Start

### Understanding the Theme Structure

**Source files** (edit these):
- `src/sass/` - SCSS stylesheets
- `src/js/` - JavaScript source
- `*.hbs` - Handlebars templates

**Compiled files** (auto-generated):
- `assets/css/` - Compiled CSS
- `assets/js/` - Minified JavaScript

**Important**: Always edit source files, never compiled files. Your changes will be overwritten during build.

### Development Workflow

1. **Edit source files** in `src/` directory
2. **Run build command**: `npx grunt` or `npm run dev`
3. **Test changes** in local Ghost instance
4. **Package theme**: `npx grunt compress`
5. **Upload to Ghost**: Upload `dist/attegi.zip`

### Required Tools

- **Node.js**: 18.x or higher
- **npm**: Comes with Node.js
- **Text editor**: VS Code, Sublime Text, etc.
- **Local Ghost**: For testing (optional but recommended)

## Quick Customizations (No Build Required)

These customizations can be done through Ghost Admin without rebuilding the theme.

### Custom CSS

**Location**: Settings → Code injection → Site Header

Add custom styles to override theme defaults:

```html
<style>
  /* Change accent color */
  :root {
    --color-primary: #FF6B6B;
  }

  /* Change font */
  body {
    font-family: 'Georgia', serif;
  }

  /* Increase font size */
  .post-content {
    font-size: 1.125rem;
  }

  /* Hide author avatars */
  .post-meta-avatars {
    display: none;
  }

  /* Custom navigation background */
  .nav-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  /* Rounded post cards */
  .post-card {
    border-radius: 12px;
    overflow: hidden;
  }
</style>
```

### Custom JavaScript

**Location**: Settings → Code injection → Site Footer

Add custom functionality:

```html
<script>
  // Add reading progress bar
  window.addEventListener('scroll', function() {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById('progressBar').style.width = scrolled + '%';
  });

  // Add external link icons
  document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.hostname.includes(window.location.hostname)) {
      link.innerHTML += ' ↗';
    }
  });
</script>
```

### Custom Fonts

**Using Google Fonts**:

```html
<!-- Site Header -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">

<style>
  body {
    font-family: 'Inter', sans-serif;
  }
</style>
```

**Using Adobe Fonts**:

```html
<!-- Site Header -->
<link rel="stylesheet" href="https://use.typekit.net/abc1234.css">

<style>
  body {
    font-family: 'your-font-name', sans-serif;
  }
</style>
```

## Color Customization

### Understanding Color System

Attegi uses CSS custom properties for theming:

**Location**: `src/sass/_colors.scss`

**Key variables**:
```scss
:root {
  --color-primary: #15171A;        // Accent color
  --color-background: #FFFFFF;     // Page background
  --color-text: #15171A;           // Body text
  --color-text-secondary: #738A94; // Meta text
  --color-border: #E5EFF5;         // Borders
}

[data-theme="dark"] {
  --color-primary: #82C0CC;        // Dark mode accent
  --color-background: #0D0E11;     // Dark background
  --color-text: #E5E5E5;           // Light text
  --color-text-secondary: #9FABB8; // Meta text
  --color-border: #1F2428;         // Dark borders
}
```

### Changing Colors

**Method 1: CSS Injection (No rebuild)**

```html
<style>
  :root {
    --color-primary: #FF6B6B;
    --color-background: #FFF5F5;
  }

  [data-theme="dark"] {
    --color-primary: #FF8787;
    --color-background: #1A1A1A;
  }
</style>
```

**Method 2: Edit Source (Requires rebuild)**

1. Open `src/sass/_colors.scss`
2. Modify color values
3. Run `npx grunt build`
4. Upload new theme

**Color palette generator**: Use tools like [Coolors](https://coolors.co/) or [Adobe Color](https://color.adobe.com/) to create harmonious palettes.

### Accent Color Usage

The accent color (`--color-primary`) is used for:
- Links
- Buttons
- Active navigation items
- TOC active section
- Code block language labels
- Hover effects
- Focus indicators

**Accessibility**: Ensure sufficient contrast (4.5:1 for text, 3:1 for UI components).

## Typography Customization

### Font System

**Location**: `src/sass/_fonts.scss`

**Current setup**:
```scss
$font-family-base: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
$font-family-mono: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace;

$font-size-base: 1rem;        // 16px
$line-height-base: 1.6;

// Heading sizes
$font-size-h1: 2.5rem;        // 40px
$font-size-h2: 2rem;          // 32px
$font-size-h3: 1.5rem;        // 24px
$font-size-h4: 1.25rem;       // 20px
$font-size-h5: 1.125rem;      // 18px
$font-size-h6: 1rem;          // 16px
```

### Changing Fonts

**Edit** `src/sass/_fonts.scss`:

```scss
// Use custom font
$font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

// Increase base font size
$font-size-base: 1.125rem;    // 18px

// Adjust line height
$line-height-base: 1.7;

// Larger headings
$font-size-h1: 3rem;          // 48px
$font-size-h2: 2.25rem;       // 36px
```

**Rebuild**: `npx grunt build`

### Responsive Typography

Attegi uses responsive font sizing:

```scss
// Mobile
@media (max-width: $breakpoint-medium) {
  $font-size-h1: 2rem;        // 32px
  $font-size-h2: 1.75rem;     // 28px
}
```

**Customize** in `src/sass/_fonts.scss` or add to custom CSS:

```css
@media (max-width: 640px) {
  .post-content {
    font-size: 1rem;
  }

  .post-title {
    font-size: 1.75rem;
  }
}
```

## Layout Customization

### Content Width

**Default**: 720px for post content, 1100px for site width

**Change content width**:

```css
<style>
  .post-content {
    max-width: 800px;  /* Default: 720px */
  }

  .inner {
    max-width: 1200px; /* Default: 1100px */
  }
</style>
```

**Or edit** `src/sass/style.scss`:

```scss
$inner: 1200px;               // Site max-width
$content-width: 800px;        // Post content max-width
```

### Sidebar Width

**TOC sidebar** (desktop only):

```css
<style>
  .toc-sidebar {
    width: 280px;     /* Default: 240px */
  }

  .post-content {
    margin-right: 320px; /* Sidebar width + gap */
  }
</style>
```

### Post Card Layout

**Change grid columns**:

```css
<style>
  .post-feed {
    grid-template-columns: repeat(3, 1fr); /* Default: 2 */
    gap: 3rem;                              /* Default: 2rem */
  }

  @media (max-width: 960px) {
    .post-feed {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    .post-feed {
      grid-template-columns: 1fr;
    }
  }
</style>
```

## Navigation Customization

### Logo Size

```css
<style>
  .site-logo img {
    max-height: 40px;  /* Default: 32px */
  }
</style>
```

### Navigation Style

**Transparent navigation**:

```css
<style>
  .nav-header {
    background: transparent;
    backdrop-filter: blur(10px);
  }
</style>
```

**Sticky navigation**:

```css
<style>
  .nav-header {
    position: sticky;
    top: 0;
    z-index: 1000;
  }
</style>
```

**Centered navigation**:

```css
<style>
  .nav-header .inner {
    justify-content: center;
  }

  .site-logo {
    margin-right: 0;
  }
</style>
```

## Post Card Customization

### Card Style

**Minimal cards**:

```css
<style>
  .post-card {
    box-shadow: none;
    border: 1px solid var(--color-border);
  }

  .post-card:hover {
    transform: none;
    box-shadow: none;
  }
</style>
```

**Rounded cards**:

```css
<style>
  .post-card {
    border-radius: 16px;
    overflow: hidden;
  }

  .post-card-image {
    border-radius: 16px 16px 0 0;
  }
</style>
```

**Overlay style**:

```css
<style>
  .post-card {
    position: relative;
  }

  .post-card-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0,0,0,0.8));
    color: white;
    padding: 2rem;
  }
</style>
```

### Featured Post Style

```css
<style>
  .post-card.featured {
    grid-column: span 2;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .post-card.featured .post-card-title {
    font-size: 2rem;
  }
</style>
```

## Footer Customization

### Footer Layout

**Three-column footer**:

```css
<style>
  .nav-footer .inner {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
</style>
```

**Centered footer**:

```css
<style>
  .nav-footer .inner {
    text-align: center;
    flex-direction: column;
  }

  .footer-social {
    justify-content: center;
  }
</style>
```

### Footer Background

```css
<style>
  .nav-footer {
    background: #F7F8FA;
    border-top: 1px solid var(--color-border);
  }

  [data-theme="dark"] .nav-footer {
    background: #0A0B0D;
  }
</style>
```

## Code Block Customization

### Syntax Highlighting Theme

**Location**: `src/sass/_highlight.scss`

**Change theme**:

1. Choose theme from [highlight.js themes](https://highlightjs.org/static/demo/)
2. Download CSS file
3. Replace content in `_highlight.scss`
4. Rebuild theme

**Popular themes**:
- GitHub
- Monokai
- Dracula
- Nord
- Atom One Dark

### Code Block Style

```css
<style>
  pre {
    border-radius: 8px;
    border: 1px solid var(--color-border);
  }

  code {
    font-size: 0.9rem;
    line-height: 1.6;
  }

  .code-toolbar {
    background: #F7F8FA;
    border-bottom: 1px solid var(--color-border);
  }
</style>
```

## Template Customization

### Modifying Templates

**Common templates**:
- `default.hbs` - Master layout
- `index.hbs` - Homepage
- `post.hbs` - Single post
- `page.hbs` - Static pages
- `author.hbs` - Author archive
- `tag.hbs` - Tag archive

**Workflow**:
1. Edit `.hbs` file
2. Test in local Ghost
3. Package theme: `npx grunt compress`
4. Upload to Ghost

### Adding Custom Sections

**Example: Add newsletter signup to homepage**

Edit `index.hbs`:

```handlebars
{{!-- After post loop --}}
<section class="newsletter-section">
  <div class="inner">
    <h2>Subscribe to Newsletter</h2>
    <p>Get the latest posts delivered to your inbox.</p>
    {{subscribe_form}}
  </div>
</section>
```

Add styles in `src/sass/style.scss`:

```scss
.newsletter-section {
  background: var(--color-primary);
  color: white;
  padding: 4rem 0;
  text-align: center;

  h2 {
    margin-bottom: 1rem;
  }
}
```

### Custom Partials

Create reusable components in `partials/` directory.

**Example**: `partials/author-card.hbs`

```handlebars
<div class="author-card">
  {{#if profile_image}}
    <img src="{{img_url profile_image size="s"}}" alt="{{name}}" />
  {{/if}}
  <h3>{{name}}</h3>
  <p>{{bio}}</p>
  <a href="{{url}}">View Profile</a>
</div>
```

**Use in templates**:

```handlebars
{{> "author-card"}}
```

## Advanced SCSS Customization

### Understanding SCSS Structure

**Main file**: `src/sass/style.scss`

**Imports**:
```scss
@import "normalize";      // CSS reset
@import "colors";         // Color variables
@import "fonts";          // Typography
@import "highlight";      // Code highlighting
@import "toc";            // Table of contents
// ... component styles
```

### Creating Custom Partials

1. Create `src/sass/_custom.scss`
2. Add your styles
3. Import in `style.scss`:

```scss
@import "custom";
```

**Example** `_custom.scss`:

```scss
// Custom button styles
.btn-custom {
  background: var(--color-primary);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
}

// Custom card style
.card-custom {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 2rem;

  @media (max-width: $breakpoint-medium) {
    padding: 1rem;
  }
}
```

### Using Mixins

**Create mixins** in `src/sass/_mixins.scss`:

```scss
// Responsive breakpoint mixin
@mixin respond-to($breakpoint) {
  @media (max-width: $breakpoint) {
    @content;
  }
}

// Flexbox center mixin
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

// Card shadow mixin
@mixin card-shadow($level: 1) {
  @if $level == 1 {
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  } @else if $level == 2 {
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  } @else {
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  }
}
```

**Use mixins**:

```scss
.custom-element {
  @include flex-center;
  @include card-shadow(2);

  @include respond-to($breakpoint-medium) {
    flex-direction: column;
  }
}
```

## JavaScript Customization

### Modifying Behavior

**Location**: `src/js/script.js`

**Common customizations**:

**Change theme toggle behavior**:

```javascript
// Auto-switch based on time
function autoTheme() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 18) {
    setTheme('light');
  } else {
    setTheme('dark');
  }
}
```

**Add scroll animations**:

```javascript
// Fade in elements on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
    }
  });
});

document.querySelectorAll('.post-card').forEach(card => {
  observer.observe(card);
});
```

**Add reading time estimator**:

```javascript
function calculateReadingTime() {
  const content = document.querySelector('.post-content');
  const words = content.textContent.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return minutes;
}
```

### Adding Custom Scripts

Create `src/js/custom.js`:

```javascript
(function() {
  // Your custom code here

  // Example: Add copy button to all code blocks
  document.querySelectorAll('pre code').forEach(block => {
    const button = document.createElement('button');
    button.textContent = 'Copy';
    button.onclick = () => {
      navigator.clipboard.writeText(block.textContent);
      button.textContent = 'Copied!';
      setTimeout(() => button.textContent = 'Copy', 2000);
    };
    block.parentElement.appendChild(button);
  });
})();
```

**Include in build**:

Edit `Gruntfile.js`:

```javascript
uglify: {
  custom: {
    files: {
      'assets/js/custom.js': ['src/js/custom.js']
    }
  }
}
```

**Load in template**:

```handlebars
<script defer src="{{asset "js/custom.js"}}"></script>
```

## Build System Customization

### Modifying Grunt Tasks

**Location**: `Gruntfile.js`

**Common modifications**:

**Change output directory**:

```javascript
sass: {
  dev: {
    files: {
      'custom-assets/css/style.css': 'src/sass/style.scss'
    }
  }
}
```

**Add new task**:

```javascript
// Add image optimization
imagemin: {
  dynamic: {
    files: [{
      expand: true,
      cwd: 'src/images/',
      src: ['**/*.{png,jpg,gif}'],
      dest: 'assets/images/'
    }]
  }
}
```

**Modify watch task**:

```javascript
watch: {
  sass: {
    files: ['src/sass/**/*.scss'],
    tasks: ['sass:dev', 'postcss:dev'],
    options: {
      livereload: true  // Enable live reload
    }
  }
}
```

## Testing Customizations

### Local Testing

**Setup local Ghost**:

```bash
# Install Ghost CLI
npm install -g ghost-cli

# Create new Ghost instance
mkdir ghost-local
cd ghost-local
ghost install local

# Start Ghost
ghost start
```

**Sync theme**:

```bash
# Copy theme to Ghost
rsync -av --delete /path/to/attegi/ /path/to/ghost/content/themes/attegi/

# Restart Ghost
ghost restart
```

### Browser Testing

**Test in multiple browsers**:
- Chrome/Edge (Chromium)
- Firefox
- Safari (macOS/iOS)

**Test responsive design**:
- Use browser DevTools
- Test on actual devices
- Check breakpoints: 480px, 640px, 960px

**Test theme switching**:
- Light mode
- Dark mode
- System preference

### Performance Testing

**Tools**:
- [Google Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
- [GTmetrix](https://gtmetrix.com/)

**Target metrics**:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

## Customization Checklist

Before deploying customizations:

- [ ] Test in local Ghost instance
- [ ] Verify responsive design (mobile, tablet, desktop)
- [ ] Test light and dark themes
- [ ] Check browser compatibility
- [ ] Validate HTML/CSS
- [ ] Test JavaScript functionality
- [ ] Run Lighthouse audit
- [ ] Check accessibility
- [ ] Verify all links work
- [ ] Test image loading
- [ ] Check code syntax highlighting
- [ ] Verify TOC generation
- [ ] Test comments (if enabled)
- [ ] Check newsletter forms
- [ ] Validate with GScan: `npx gscan .`

## Common Customization Recipes

### Recipe 1: Minimal Theme

```css
<style>
  /* Remove shadows */
  .post-card {
    box-shadow: none;
    border: 1px solid var(--color-border);
  }

  /* Simpler navigation */
  .nav-header {
    border-bottom: 1px solid var(--color-border);
  }

  /* Minimal buttons */
  .btn {
    border-radius: 0;
    border: 2px solid currentColor;
    background: transparent;
  }
</style>
```

### Recipe 2: Magazine Style

```css
<style>
  /* Large featured post */
  .post-card:first-child {
    grid-column: span 2;
    grid-row: span 2;
  }

  /* Smaller subsequent posts */
  .post-card:not(:first-child) .post-card-image {
    height: 150px;
  }

  /* Category labels */
  .post-card-tags {
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: 0.05em;
  }
</style>
```

### Recipe 3: Portfolio Style

```css
<style>
  /* Grid layout */
  .post-feed {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  /* Image-focused cards */
  .post-card-content {
    position: absolute;
    bottom: 0;
    background: linear-gradient(transparent, rgba(0,0,0,0.9));
    color: white;
  }

  /* Hide excerpts */
  .post-card-excerpt {
    display: none;
  }
</style>
```

## Getting Help

**Resources**:
- [Ghost Theme Documentation](https://ghost.org/docs/themes/)
- [Handlebars Documentation](https://handlebarsjs.com/)
- [SCSS Documentation](https://sass-lang.com/documentation)
- [Attegi GitHub](https://github.com/bunizao/Attegi)

**Community**:
- [GitHub Discussions](https://github.com/bunizao/Attegi/discussions)
- [GitHub Issues](https://github.com/bunizao/Attegi/issues)
- [Ghost Forum](https://forum.ghost.org/)

---

**Next**: [Development Guide →](./development.md)
