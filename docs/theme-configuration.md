# Theme Configuration

This guide covers all configuration options available in the Attegi theme through Ghost Admin.

## Accessing Theme Settings

1. Log in to Ghost Admin (`yourdomain.com/ghost`)
2. Navigate to **Settings → Design**
3. Click **Customize** next to the Attegi theme
4. Modify settings and click **Save** to apply changes

## General Settings

### Color Scheme

**Location**: Settings → Design → Customize → Site-wide

Control the theme appearance across your entire site.

**Options**:
- **System** (default): Automatically matches the user's operating system preference
- **Light**: Always display light mode
- **Dark**: Always display dark mode

**How it works**:
- System mode detects `prefers-color-scheme` media query
- User preference is saved in localStorage
- Theme switcher in navigation allows manual override

**Best practice**: Keep "System" as default to respect user preferences.

### Dark Mode Accent Color

**Location**: Settings → Design → Customize → Site-wide

Customize the accent color used in dark mode for links, buttons, and highlights.

**Default**: `#82C0CC` (soft cyan)

**Recommendations**:
- Use colors with sufficient contrast against dark backgrounds
- Test with WCAG contrast checker for accessibility
- Popular choices:
  - Blue: `#4A9EFF`
  - Purple: `#9D7CBF`
  - Green: `#5FB878`
  - Orange: `#FF9F43`

**Example**:
```
Light mode: Uses your Ghost accent color (Settings → General → Accent color)
Dark mode: Uses this custom color
```

## Social Media Links

**Location**: Settings → Design → Customize → Site-wide

Add social media links that appear in your site footer.

### Supported Platforms

- **Instagram**: `https://instagram.com/username`
- **GitHub**: `https://github.com/username`
- **Telegram**: `https://t.me/username`
- **Discord**: `https://discord.gg/invite-code`
- **Bluesky**: `https://bsky.app/profile/username`

**Display**: Icons appear in the footer with hover effects.

**Tips**:
- Enter full URLs including `https://`
- Leave blank to hide specific platforms
- Icons automatically match your theme colors

## Contact Information

### Email Address

**Location**: Settings → Design → Customize → Site-wide

Display an email contact link in the footer.

**Format**: `your@email.com`

**Display**: Shows as an envelope icon with hover effect.

## Footer Customization

### Footer Text

**Location**: Settings → Design → Customize → Site-wide

Add custom text or HTML to the center of your footer.

**Supports**: Plain text and HTML snippets

**Examples**:

```html
<!-- Simple text -->
Made with ❤️ in San Francisco

<!-- Link -->
<a href="/privacy">Privacy Policy</a> • <a href="/terms">Terms</a>

<!-- Badge -->
<a href="https://example.com">
  <img src="/content/images/badge.svg" alt="Badge" />
</a>
```

**Default**: If empty, displays Ghost version and theme credit.

## Post Settings

### Email Signup Text

**Location**: Settings → Design → Customize → Post

Customize the text above the email subscription form on post pages.

**Default**: "Sign up for more like this."

**Examples**:
- "Subscribe to get new posts delivered to your inbox."
- "Join 1,000+ readers getting weekly updates."
- "Never miss a post — subscribe now!"

**Note**: Only appears if Ghost Members is enabled (Settings → Membership).

### Show Recent Posts Footer

**Location**: Settings → Design → Customize → Post

Control whether to display previous/next post navigation at the bottom of posts.

**Options**:
- **Enabled** (default): Shows adjacent post links
- **Disabled**: Hides post navigation

**When enabled**, displays:
- Previous post (left): Title, excerpt, date
- Next post (right): Title, excerpt, date
- Falls back to homepage link if no adjacent posts

**Use case**: Disable if you prefer readers to return to the homepage or archive.

### Content Image Formats

**Location**: Settings → Design → Customize → Post

Automatically convert images to modern formats for better performance.

**Options**:

1. **Disabled** (default)
   - Uses original image formats
   - No conversion overhead
   - Best for: Small sites, limited server resources

2. **Auto**
   - Serves AVIF with WebP fallback
   - Best compression and quality
   - ⚠️ Warning: AVIF decoding can cause high server load
   - Best for: High-traffic sites with powerful servers

3. **WebP only**
   - Converts to WebP format
   - Good compression, wide browser support
   - Lower server load than AVIF
   - Best for: Most sites seeking performance gains

**How it works**:
```html
<!-- Auto mode generates: -->
<picture>
  <source type="image/avif" srcset="image.avif" />
  <source type="image/webp" srcset="image.webp" />
  <img src="image.jpg" alt="..." />
</picture>
```

**Performance impact**:
- AVIF: 30-50% smaller than JPEG, but CPU-intensive
- WebP: 25-35% smaller than JPEG, moderate CPU usage

### Post Share Buttons

**Location**: Settings → Design → Customize → Post

Control how readers can share your posts.

**Options**:

1. **Default**
   - Traditional social sharing buttons
   - Platforms: Twitter, Facebook, LinkedIn, Email
   - Opens share dialogs in popup windows

2. **Native**
   - Uses Web Share API (mobile-friendly)
   - Single button that opens OS share sheet
   - Falls back to Default on unsupported browsers
   - Best for: Mobile-first audiences

3. **Disabled**
   - Hides all share buttons
   - Best for: Private blogs, internal documentation

**Browser support**:
- Native sharing: iOS Safari, Android Chrome, Windows Edge
- Fallback: All modern browsers

## Comments Configuration

### Ghost Native Comments

**Location**: Settings → Membership → Enable comments

Attegi fully supports Ghost's native commenting system.

**Features**:
- Member-only comments
- Nested replies
- Upvoting
- Moderation tools

**Setup**:
1. Enable Members: Settings → Membership → Enable members
2. Enable Comments: Settings → Membership → Enable comments
3. Comments appear automatically on posts

**Customization**:
- Comments load on demand (click "Show Comments")
- Displays comment count in header
- Fully styled to match theme

### Disqus Integration

**Location**: Settings → Design → Customize → Post

Alternative commenting system using Disqus.

**Setup**:
1. Create a Disqus account at [disqus.com](https://disqus.com)
2. Register your site and get your shortname
3. Enter shortname in theme settings: `your-site-shortname`

**Note**: Disqus only appears if Ghost native comments are disabled.

**Comparison**:

| Feature | Ghost Comments | Disqus |
|---------|---------------|--------|
| Privacy | Self-hosted | Third-party |
| Members | Required | Optional |
| Moderation | Ghost Admin | Disqus dashboard |
| Performance | Faster | External scripts |
| Cost | Free | Free + paid tiers |

## Open Graph Image Service

### OG Service URL

**Location**: Settings → Design → Customize → Site-wide

Use a custom Open Graph image generation service.

**Default**: Uses Ghost's default OG images

**Format**: `https://your-og-service.com`

**Use case**: Generate dynamic social media preview images with custom branding.

**Example services**:
- Cloudflare Workers (see `cloudflare-worker/` directory)
- Vercel OG Image
- Custom API endpoint

### OG Service Theme

**Location**: Settings → Design → Customize → Post

Specify a theme name for your OG image service.

**Format**: Theme identifier string (e.g., `attegi`, `dark`, `minimal`)

**How it works**:
```
https://your-og-service.com/api/og?title=Post+Title&theme=attegi
```

**Note**: Requires compatible OG service that accepts theme parameter.

## Posts Per Page

**Location**: `package.json` (requires theme modification)

**Default**: 8 posts per page

**To change**:
1. Edit `package.json` in theme directory
2. Modify `config.posts_per_page` value
3. Re-upload theme to Ghost

```json
{
  "config": {
    "posts_per_page": 12
  }
}
```

**Recommendations**:
- 6-8: Best for image-heavy blogs
- 10-12: Good for text-focused content
- 15+: May slow page load times

## Image Sizes

**Location**: `package.json` (requires theme modification)

Attegi defines responsive image sizes for optimal delivery.

**Default sizes**:
```json
{
  "s": { "width": 320 },   // Mobile portrait
  "m": { "width": 640 },   // Mobile landscape / Tablet portrait
  "l": { "width": 960 },   // Tablet landscape / Desktop
  "xl": { "width": 1920 }  // High-resolution displays
}
```

**How it's used**:
```handlebars
{{img_url feature_image size="l"}}
```

**Customization**: Modify values in `package.json` and re-upload theme.

## Language Configuration

**Location**: Automatic based on Ghost settings

Attegi supports 32 languages out of the box.

**Supported languages**:
English, German, French, Japanese, Chinese (Simplified & Traditional), Spanish, Italian, Portuguese, Russian, Polish, Ukrainian, Dutch, Swedish, Danish, Norwegian, Finnish, Czech, Hungarian, Romanian, Greek, Turkish, Farsi, Arabic, Vietnamese, Thai, Indonesian, Esperanto, Irish, Georgian, Lithuanian

**To change language**:
1. Go to Settings → General
2. Select **Publication language**
3. Choose from dropdown
4. Save changes

**Translations include**:
- Navigation labels
- Post metadata (reading time, comments)
- Buttons and CTAs
- Error messages
- Pagination

## Advanced Configuration

### Custom CSS

**Location**: Settings → Code injection → Site Header

Add custom styles to override theme defaults.

**Example**:
```html
<style>
  /* Custom accent color for light mode */
  :root {
    --color-primary: #FF6B6B;
  }

  /* Custom font */
  body {
    font-family: 'Your Custom Font', sans-serif;
  }

  /* Hide author avatars */
  .post-meta-avatars {
    display: none;
  }
</style>
```

### Custom JavaScript

**Location**: Settings → Code injection → Site Footer

Add custom functionality or analytics.

**Example**:
```html
<script>
  // Google Analytics
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Code Injection Locations

- **Site Header**: Loads on every page before `</head>`
- **Site Footer**: Loads on every page before `</body>`
- **Post Header**: Loads only on post pages before `</head>`
- **Post Footer**: Loads only on post pages before `</body>`

## Configuration Checklist

After installing Attegi, complete this checklist:

- [ ] Set color scheme preference
- [ ] Configure dark mode accent color
- [ ] Add social media links
- [ ] Set email address
- [ ] Customize footer text
- [ ] Configure post share buttons
- [ ] Enable comments (Ghost or Disqus)
- [ ] Set email signup text
- [ ] Test mobile responsiveness
- [ ] Verify all links work
- [ ] Check image loading
- [ ] Test theme switching

## Best Practices

### Performance

- Use "WebP only" for content images unless you have a powerful server
- Enable lazy loading (built-in)
- Optimize images before upload (recommended: 1920px max width)
- Minimize custom code injection

### Accessibility

- Ensure dark mode accent color has sufficient contrast (4.5:1 minimum)
- Test with screen readers
- Verify keyboard navigation works
- Add alt text to all images

### SEO

- Configure OG image service for better social sharing
- Use descriptive post excerpts
- Add meta descriptions to pages
- Verify structured data in Google Search Console

### User Experience

- Keep navigation simple (3-5 items)
- Use "System" color scheme to respect user preferences
- Enable native sharing for mobile users
- Test on actual mobile devices

---

**Next**: [Content Features →](./content-features.md)
