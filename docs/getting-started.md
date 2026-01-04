# Getting Started with Attegi

Attegi is a modern, elegant Ghost theme optimized for mobile devices with dual theme support, comprehensive internationalization, and beautiful typography.

## Quick Installation

### Method 1: Upload via Ghost Admin (Recommended)

1. **Download the theme**
   - Visit the [Attegi releases page](https://github.com/bunizao/Attegi/releases)
   - Download the latest `attegi.zip` file

2. **Upload to Ghost**
   - Log in to your Ghost Admin panel (`yourdomain.com/ghost`)
   - Navigate to **Settings → Design**
   - Click **Change theme** at the bottom
   - Click **Upload theme** and select the `attegi.zip` file
   - Click **Activate** to enable the theme

3. **Verify installation**
   - Visit your site's homepage
   - You should see the Attegi theme with its clean, modern design

### Method 2: Manual Installation (Self-hosted Ghost)

If you're running Ghost on your own server:

```bash
# Navigate to your Ghost themes directory
cd /var/www/ghost/content/themes

# Download and extract the theme
wget https://github.com/bunizao/Attegi/releases/latest/download/attegi.zip
unzip attegi.zip

# Restart Ghost
ghost restart

# Or if using systemd
sudo systemctl restart ghost
```

Then activate the theme via Ghost Admin → Settings → Design.

## First Steps After Installation

### 1. Configure Basic Settings

Navigate to **Settings → Design** and click **Customize** to access theme settings:

- **Color Scheme**: Choose Light, Dark, or System (follows user's OS preference)
- **Dark Mode Accent Color**: Customize the accent color for dark mode (default: #82C0CC)

### 2. Set Up Your Site Identity

Go to **Settings → General**:

- **Site title**: Your blog's name
- **Site description**: A brief tagline (appears in navigation and metadata)
- **Site icon**: Upload a favicon (recommended: 512×512px PNG)
- **Site logo**: Upload your logo (appears in navigation)

### 3. Configure Navigation

Navigate to **Settings → Navigation**:

Attegi supports a clean, minimal navigation structure. Recommended setup:

```
Home        /
About       /about/
Tags        /tags/
```

The theme automatically handles mobile navigation with a hamburger menu.

### 4. Create Essential Pages

#### About Page

Create a new page via **Pages → New page**:
- Title: "About"
- URL: `about`
- Add your bio, photo, and contact information

#### Links Page (Optional)

Attegi includes a special template for displaying links:

1. Create a new page
2. Title: "Links"
3. URL: `links`
4. In the page settings (⚙️ icon), select **Page template → Links**
5. Add links in your content using this format:

```markdown
## Friends

- [Example Blog](https://example.com) - A great blog about technology
- [Another Site](https://another.com) - Interesting content here
```

#### Tags Page (Optional)

Display all your tags in a beautiful grid:

1. Create a new page
2. Title: "Tags"
3. URL: `tags`
4. In page settings, select **Page template → Tags**
5. The content will be auto-generated from your tags

## Understanding the Theme Structure

### Homepage Layout

The homepage displays your posts in a card-based grid:
- **Featured posts**: Marked with a star icon
- **Post cards**: Show featured image, title, excerpt, author, date, and reading time
- **Pagination**: Navigate between pages (8 posts per page by default)

### Post Layout

Individual posts include:
- **Header**: Title, author(s), publication date, reading time, featured image
- **Content area**: Your post content with rich formatting
- **Table of Contents**: Auto-generated from headings (H2-H6)
- **Footer**: Tags, share buttons, comments section
- **Navigation**: Previous/Next post links

### Mobile Experience

Attegi is mobile-first:
- **Responsive images**: Automatically optimized for different screen sizes
- **Touch-friendly**: Large tap targets and comfortable spacing
- **Collapsible TOC**: Table of contents becomes a drawer on mobile
- **Optimized typography**: Readable font sizes across all devices

## Theme Features Overview

### Built-in Features

- ✅ **Dual theme support**: Light, Dark, and System modes
- ✅ **Table of Contents**: Auto-generated with scroll spy
- ✅ **Code syntax highlighting**: 50+ languages supported
- ✅ **Image lightbox**: Click to zoom images
- ✅ **Lazy loading**: Images load as you scroll
- ✅ **Responsive images**: Multiple sizes with srcset
- ✅ **Share buttons**: Native or traditional social sharing
- ✅ **Comments**: Ghost native comments or Disqus integration
- ✅ **Newsletter**: Built-in subscription forms
- ✅ **32 languages**: Comprehensive internationalization
- ✅ **Special cards**: Poem cards, callouts, and more

### Performance Optimizations

- **Critical CSS**: Inlined in `<head>` for faster rendering
- **Code splitting**: Separate bundles for main, post, and TOC functionality
- **Lazy loading**: Images and embeds load on demand
- **Optimized fonts**: Subset fonts for faster loading
- **Compressed assets**: Minified CSS and JavaScript

## Next Steps

Now that you have Attegi installed, explore these guides:

- **[Theme Configuration](./theme-configuration.md)**: Customize colors, social links, and behavior
- **[Content Features](./content-features.md)**: Learn about special formatting and cards
- **[Customization Guide](./customization.md)**: Modify styles and templates
- **[Advanced Features](./advanced-features.md)**: TOC, comments, OG images, and more

## Troubleshooting

### Theme doesn't appear after upload

- Ensure you downloaded the correct `.zip` file (not the source code)
- Check that your Ghost version is 5.0.0 or higher
- Try restarting Ghost: `ghost restart`

### Images not loading

- Verify image URLs in your content
- Check Ghost's image optimization settings
- Ensure your server has sufficient permissions for the content directory

### Styles look broken

- Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for JavaScript errors
- Verify that `assets/css/style.css` exists in the theme directory

### Mobile menu not working

- Ensure JavaScript is enabled in your browser
- Check for JavaScript errors in the console
- Verify that `assets/js/script.js` is loading correctly

## Getting Help

- **Documentation**: [Full documentation](https://github.com/bunizao/Attegi/tree/main/docs)
- **Demo site**: [attegi.tutuis.me](https://attegi.tutuis.me)
- **Issues**: [GitHub Issues](https://github.com/bunizao/Attegi/issues)
- **Discussions**: [GitHub Discussions](https://github.com/bunizao/Attegi/discussions)

## System Requirements

- **Ghost**: Version 5.0.0 or higher
- **Node.js**: 18.x or higher (for development)
- **Browsers**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Mobile**: iOS 12+, Android 8+

---

**Next**: [Theme Configuration →](./theme-configuration.md)
