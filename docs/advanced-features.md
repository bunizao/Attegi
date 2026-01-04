# Advanced Features

This guide covers Attegi's advanced features including Table of Contents, comments, performance optimizations, and special integrations.

## Table of Contents (TOC)

Attegi automatically generates a table of contents from your post headings.

### How It Works

The TOC is generated from all H2-H6 headings in your post:

```markdown
## Introduction          ← Appears in TOC
### Background          ← Appears nested
## Main Content         ← Appears in TOC
### Section 1           ← Appears nested
#### Subsection         ← Appears nested
## Conclusion           ← Appears in TOC
```

### Features

**Desktop**:
- Fixed sidebar on the right
- Scroll spy (highlights current section)
- Smooth scrolling to sections
- Collapsible nested headings
- Sticky positioning

**Mobile**:
- Collapsible drawer at top of post
- Tap to expand/collapse
- Same scroll spy functionality
- Optimized for touch

**Styling**:
- Theme-aware colors
- Accent color for active section
- Hover effects
- Responsive typography

### Disabling TOC

To disable TOC for a specific post:

1. Edit the post
2. Click the settings icon (⚙️)
3. Scroll to "Tags"
4. Add internal tag: `#no-toc`
5. Save and publish

**Note**: Internal tags (starting with `#`) don't appear publicly.

### TOC Best Practices

**Do**:
- Use descriptive heading text
- Follow proper heading hierarchy
- Keep headings concise (3-8 words)
- Use at least 3 headings for TOC to be useful

**Don't**:
- Skip heading levels (H2 → H4)
- Use headings for styling
- Make headings too long
- Use special characters excessively

### Customizing TOC Behavior

The TOC uses [tocbot](https://tscanlin.github.io/tocbot/) library. Configuration is in `src/js/toc.js`:

```javascript
tocbot.init({
  tocSelector: '.toc-list',
  contentSelector: '.post-content',
  headingSelector: 'h2, h3, h4, h5, h6',
  hasInnerContainers: true,
  scrollSmooth: true,
  scrollSmoothDuration: 420,
  headingsOffset: 80,
  scrollEndCallback: function(e) { /* ... */ }
});
```

**Customization options**:
- `headingSelector`: Which headings to include
- `scrollSmoothDuration`: Animation speed (ms)
- `headingsOffset`: Scroll offset from top (px)
- `collapseDepth`: Auto-collapse nested levels

## Comments

Attegi supports both Ghost native comments and Disqus integration.

### Ghost Native Comments

**Setup**:
1. Enable Members: Settings → Membership → Enable members
2. Enable Comments: Settings → Membership → Enable comments
3. Comments appear automatically on posts

**Features**:
- Member-only commenting
- Nested replies (up to 3 levels)
- Upvoting system
- Real-time updates
- Moderation tools in Ghost Admin
- Email notifications

**Customization**:

Comments load on demand to improve performance:
- Initial state: "Show Comments" button
- Click to load: Comments appear
- Comment count displayed in header

**Styling**:
```css
/* Custom comment styles */
.post-comments {
  /* Container styles */
}

.post-comments-header {
  /* Header with title and count */
}

.post-comments-load {
  /* Load button */
}
```

**Moderation**:
- Approve/reject comments in Ghost Admin
- Ban users
- Delete comments
- Edit comment content

### Disqus Comments

**Setup**:
1. Create account at [disqus.com](https://disqus.com)
2. Register your site
3. Get your shortname
4. Add to theme settings: Settings → Design → Customize → Post → Disqus Shortname

**Features**:
- Guest commenting (no login required)
- Social login (Twitter, Facebook, Google)
- Spam filtering
- Moderation dashboard
- Email notifications
- Analytics

**Note**: Disqus only appears if Ghost native comments are disabled.

**Privacy considerations**:
- Disqus is a third-party service
- Tracks users across sites
- Displays ads (free tier)
- Consider GDPR implications

### Choosing Between Ghost and Disqus

| Feature | Ghost Comments | Disqus |
|---------|---------------|--------|
| **Privacy** | Self-hosted, private | Third-party tracking |
| **Performance** | Faster, no external scripts | Slower, external dependencies |
| **Members** | Requires Ghost membership | Optional, supports guests |
| **Moderation** | Ghost Admin | Disqus dashboard |
| **Cost** | Free | Free + paid tiers |
| **Spam filtering** | Basic | Advanced |
| **Social login** | No | Yes |
| **Analytics** | Limited | Comprehensive |

**Recommendation**: Use Ghost native comments for privacy and performance. Use Disqus if you need guest commenting or advanced features.

## Theme Switching

Attegi includes a sophisticated theme switching system.

### How It Works

**Three modes**:
1. **Light**: Always light theme
2. **Dark**: Always dark theme
3. **System**: Follows OS preference

**Detection**:
```javascript
// Detects OS preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
```

**Persistence**:
- User preference saved in localStorage
- Persists across sessions
- Per-device setting

**Switching**:
- Click theme toggle in navigation
- Cycles through: System → Light → Dark → System
- Smooth transition animation
- Icon changes to reflect current mode

### Theme Toggle Location

**Desktop**: Top right of navigation bar
**Mobile**: Inside hamburger menu

**Icons**:
- 🌙 Moon: Dark mode
- ☀️ Sun: Light mode
- 💻 Monitor: System mode

### Custom Theme Colors

**Light mode**:
- Uses Ghost accent color (Settings → General → Accent color)
- Default: `#15171A` (dark gray)

**Dark mode**:
- Uses custom accent color (Settings → Design → Customize → Dark Mode Accent Color)
- Default: `#82C0CC` (soft cyan)

**CSS variables**:
```css
:root {
  --color-primary: #15171A;
  --color-background: #FFFFFF;
  --color-text: #15171A;
}

[data-theme="dark"] {
  --color-primary: #82C0CC;
  --color-background: #0D0E11;
  --color-text: #E5E5E5;
}
```

### Customizing Theme Behavior

Edit `src/js/script.js` to modify theme switching:

```javascript
// Change default theme
const defaultTheme = 'light'; // or 'dark', 'system'

// Disable transition animation
document.documentElement.style.setProperty('--theme-transition', 'none');

// Add custom theme
const customTheme = {
  name: 'custom',
  colors: {
    primary: '#FF6B6B',
    background: '#FFF5F5',
    text: '#2D2D2D'
  }
};
```

## Performance Optimizations

Attegi is built for speed with multiple optimization techniques.

### Critical CSS

**What it is**: Essential CSS inlined in `<head>` for instant rendering.

**Location**: `default.hbs` lines 20-150

**Benefits**:
- Eliminates render-blocking CSS
- Faster First Contentful Paint (FCP)
- Improves Lighthouse scores

**What's included**:
- Layout structure
- Typography basics
- Navigation styles
- Above-the-fold content

**Full CSS**: Loaded asynchronously in `<body>`

### Lazy Loading

**Images**:
```html
<img src="image.jpg" loading="lazy" decoding="async" />
```

**Benefits**:
- Faster initial page load
- Reduced bandwidth usage
- Better mobile performance

**How it works**:
- Images load as user scrolls
- Native browser feature
- Fallback for older browsers

**Embeds**:
- YouTube, Vimeo, etc. load on demand
- Reduces initial JavaScript execution
- Improves Time to Interactive (TTI)

### Responsive Images

**Multiple sizes**:
```html
<img
  srcset="
    image-320.jpg 320w,
    image-640.jpg 640w,
    image-960.jpg 960w,
    image-1920.jpg 1920w
  "
  sizes="(max-width: 640px) 100vw, 960px"
  src="image-960.jpg"
  alt="Description"
/>
```

**Benefits**:
- Optimal image size for each device
- Reduced bandwidth on mobile
- Faster loading times

**Modern formats**:
```html
<picture>
  <source type="image/avif" srcset="image.avif" />
  <source type="image/webp" srcset="image.webp" />
  <img src="image.jpg" alt="Description" />
</picture>
```

**Compression savings**:
- AVIF: 30-50% smaller than JPEG
- WebP: 25-35% smaller than JPEG

### Code Splitting

**Three separate bundles**:

1. **script.js** (Main theme)
   - Navigation
   - Theme switching
   - Parallax effects
   - ~8KB minified

2. **post.js** (Post features)
   - Code highlighting
   - Copy buttons
   - Image lightbox
   - Embed wrapping
   - ~15KB minified

3. **toc.js** (Table of contents)
   - TOC generation
   - Scroll spy
   - ~12KB minified

**Benefits**:
- Smaller initial bundle
- Faster parsing and execution
- Only load what's needed

**Loading strategy**:
```html
<!-- Main theme: Loads on all pages -->
<script defer src="{{asset "js/script.js"}}"></script>

<!-- Post features: Only on post pages -->
{{#is "post"}}
  <script defer src="{{asset "js/post.js"}}"></script>
  <script defer src="{{asset "js/toc.js"}}"></script>
{{/is}}
```

### Font Optimization

**Subset fonts**:
- Only includes used characters
- Reduces file size by 60-80%
- Faster download and parsing

**Font loading**:
```css
@font-face {
  font-family: 'Custom Font';
  src: url('/assets/font/font.woff2') format('woff2');
  font-display: swap;
}
```

**`font-display: swap`**:
- Shows fallback font immediately
- Swaps to custom font when loaded
- Prevents invisible text (FOIT)

### Asset Compression

**CSS**:
- Minified with CSSNano
- Autoprefixed for browser compatibility
- Gzip compressed by server

**JavaScript**:
- Minified with Uglify.js
- Dead code elimination
- Gzip compressed by server

**Images**:
- Optimized by Ghost
- Responsive sizes generated
- Modern format conversion (optional)

### Performance Metrics

**Target scores** (Lighthouse):
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

**Core Web Vitals**:
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

**Optimization tips**:
- Enable image format conversion (WebP/AVIF)
- Use CDN for static assets
- Enable HTTP/2 or HTTP/3
- Implement server-side caching
- Optimize database queries

## Open Graph Images

Attegi supports custom OG image generation for better social sharing.

### Default Behavior

Ghost automatically generates OG images:
- Uses featured image if available
- Falls back to site logo + title
- Includes site branding

### Custom OG Service

**Setup**:
1. Deploy OG image service (see `cloudflare-worker/` directory)
2. Add service URL: Settings → Design → Customize → OG Service URL
3. Add theme name: Settings → Design → Customize → OG Service Theme

**How it works**:
```
https://your-og-service.com/api/og?
  title=Post+Title&
  theme=attegi&
  author=Author+Name&
  date=2025-01-04
```

**Benefits**:
- Consistent branding across all posts
- Dynamic text rendering
- Custom layouts and styles
- Better social media previews

### Cloudflare Worker Example

Attegi includes a Cloudflare Worker for OG image generation:

**Location**: `cloudflare-worker/`

**Features**:
- Serverless deployment
- Fast global CDN
- Custom themes
- Image caching

**Deployment**:
```bash
cd cloudflare-worker
npm install
npx wrangler deploy
```

**Configuration**:
```javascript
// wrangler.toml
name = "attegi-og-images"
main = "src/index.js"
compatibility_date = "2025-01-01"
```

### Testing OG Images

**Tools**:
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

**Verification**:
1. Publish post
2. Copy post URL
3. Paste into validator
4. Check preview image

## Back to Top Button

Attegi includes a smart back-to-top button with progress indicator.

### Features

**Progress ring**:
- Shows reading progress (0-100%)
- Circular progress indicator
- Smooth animation

**Behavior**:
- Appears after scrolling 200px
- Hides when scrolling down
- Shows when scrolling up
- Avoids footer overlap

**Interaction**:
- Click to scroll to top
- Smooth scroll animation
- Keyboard accessible

### Customization

Edit `post.hbs` lines 260-383 to modify behavior:

```javascript
// Change appearance threshold
var shouldShow = scrollY > 300; // Default: 200

// Change scroll animation speed
window.scrollTo({ top: 0, behavior: 'smooth' });

// Change button position
var defaultBottom = 48; // Default: 32 (px)
```

**Styling**:
```css
.back-to-top {
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 48px;
  height: 48px;
  /* ... */
}
```

## Search Functionality

Attegi supports Ghost's native search feature.

### Enabling Search

**Ghost 5.0+**:
1. Search is enabled by default
2. Appears in navigation automatically
3. No configuration needed

**Search features**:
- Full-text search
- Instant results
- Keyboard shortcuts (Ctrl/Cmd + K)
- Mobile-optimized

**Customization**:
- Search icon in navigation
- Modal overlay for results
- Styled to match theme

## Newsletter Integration

Attegi fully supports Ghost's membership and newsletter features.

### Subscription Forms

**Locations**:
- Post footer (after content)
- Custom pages
- Popup forms (Ghost feature)

**Styling**:
- Matches theme design
- Responsive layout
- Accent color buttons
- Validation messages

**Customization**:
```handlebars
{{subscribe_form
  placeholder=(t "Your email address")
  form_class="custom-form"
  input_class="custom-input"
  button_class="custom-button"
}}
```

### Member Features

**Member-only content**:
```markdown
<!--members-only-->
This content is only visible to members.
<!--/members-only-->
```

**Paid member content**:
```markdown
<!--paid-members-only-->
This content is only visible to paid members.
<!--/paid-members-only-->
```

**Member cards**:
- Shows member status
- Upgrade prompts
- Account management links

## Analytics Integration

### Google Analytics

**Setup**:
1. Go to Settings → Code injection → Site Footer
2. Add Google Analytics script:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Plausible Analytics

**Setup**:
```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

### Fathom Analytics

**Setup**:
```html
<script src="https://cdn.usefathom.com/script.js" data-site="YOUR_SITE_ID" defer></script>
```

## Internationalization

Attegi supports 32 languages with automatic translation.

### How It Works

**Language detection**:
- Based on Ghost publication language setting
- Settings → General → Publication Language

**Translation files**:
- Located in `locales/` directory
- JSON format
- ~2,437 translation lines

**Usage in templates**:
```handlebars
{{t "Article"}}           → "Article" (English)
{{t "Article"}}           → "文章" (Chinese)
{{t "% min read"}}        → "% min read" (English)
{{t "% min read"}}        → "% 分钟阅读" (Chinese)
```

### Supported Languages

**European**:
English, German, French, Spanish, Italian, Portuguese, Russian, Polish, Ukrainian, Dutch, Swedish, Danish, Norwegian, Finnish, Czech, Hungarian, Romanian, Greek, Irish, Lithuanian

**Asian**:
Japanese, Chinese (Simplified), Chinese (Traditional), Vietnamese, Thai, Indonesian, Georgian

**Middle Eastern**:
Turkish, Farsi, Arabic

**Constructed**:
Esperanto

### Adding Custom Translations

1. Copy `locales/en.json`
2. Rename to your language code (e.g., `ko.json` for Korean)
3. Translate all strings
4. Submit pull request or use locally

**Example**:
```json
{
  "Article": "기사",
  "% min read": "% 분 읽기",
  "Share": "공유하기"
}
```

## Accessibility Features

Attegi is built with accessibility in mind.

### Keyboard Navigation

**Supported shortcuts**:
- `Tab`: Navigate between links
- `Enter`: Activate links/buttons
- `Esc`: Close modals
- `Ctrl/Cmd + K`: Open search

**Focus indicators**:
- Visible focus outlines
- Skip to content link
- Logical tab order

### Screen Reader Support

**ARIA labels**:
```html
<button aria-label="Toggle theme">
  <svg aria-hidden="true">...</svg>
</button>
```

**Semantic HTML**:
- Proper heading hierarchy
- Landmark regions
- Alt text for images

### Color Contrast

**WCAG AA compliance**:
- Text: 4.5:1 minimum
- Large text: 3:1 minimum
- UI components: 3:1 minimum

**Testing**:
- Use browser DevTools
- Check with contrast checker
- Test in both light and dark modes

### Reduced Motion

**Respects user preference**:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Advanced Customization

### Custom Post Templates

Create custom templates for specific posts:

1. Create `custom-template.hbs` in theme root
2. Add to `package.json`:
```json
{
  "config": {
    "custom_templates": [
      {
        "name": "Custom Template",
        "filename": "custom-template"
      }
    ]
  }
}
```
3. Select in post settings

### Custom Page Templates

Attegi includes two custom page templates:

**Links page** (`page-links.hbs`):
- Displays links in a grid
- Automatic formatting
- Responsive layout

**Tags page** (`page-tags.hbs`):
- Shows all tags
- Post count per tag
- Grid layout

**Create your own**:
1. Create `page-custom.hbs`
2. Copy structure from existing page template
3. Modify content area
4. Select in page settings

### Custom Helpers

Add custom Handlebars helpers:

**Location**: Create `helpers/` directory in theme

**Example** (`helpers/uppercase.js`):
```javascript
module.exports = function(text) {
  return text.toUpperCase();
};
```

**Usage**:
```handlebars
{{uppercase "hello"}}  → "HELLO"
```

---

**Next**: [Customization Guide →](./customization.md)
