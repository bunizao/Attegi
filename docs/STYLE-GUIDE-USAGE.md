# Style Guide Templates - Usage Instructions

This directory contains comprehensive style guide templates for the Attegi Ghost theme in both English and Chinese.

## Files

- **style-guide-template.md** - English version
- **style-guide-template-zh.md** - Chinese (Simplified) version

## How to Use

### Option 1: Copy Content to Ghost

1. **Create a new page** in Ghost Admin
2. **Copy the entire content** from the template file
3. **Paste into Ghost editor** (use Markdown mode for best results)
4. **Replace placeholder text** with actual embeds:
   - `[YouTube embed would be inserted here]` → Insert actual YouTube video
   - `[Gallery would be inserted here via Ghost editor]` → Add image gallery
   - `[Bookmark card would be inserted here]` → Add bookmark cards
5. **Set page URL** to `/style-guide/`
6. **Publish the page**

### Option 2: Use as Reference

Use these templates as a reference when creating your own style guide:

1. Pick sections relevant to your site
2. Customize examples with your own content
3. Add or remove sections as needed
4. Adjust styling examples to match your customizations

## What's Included

### Typography Section
- All 6 heading levels
- Text formatting (bold, italic, strikethrough, code, links)
- Paragraph styling examples

### Lists Section
- Unordered lists with nesting
- Ordered lists with sub-steps
- Task lists (checkboxes)

### Blockquotes Section
- Standard blockquotes
- Quotes with attribution
- Formatted quotes with emphasis

### Code Blocks Section
- Inline code examples
- Syntax-highlighted code blocks in multiple languages:
  - JavaScript
  - Python
  - HTML
  - CSS
  - Bash

### Callouts & Alerts
- Tip callouts (💡)
- Warning callouts (⚠️)
- Info callouts (ℹ️)
- Success callouts (✅)
- Error callouts (❌)

### Poem Cards Section
**Unique to Attegi!**
- Standard poem layout
- Centered poem with `[center]` modifier
- Plain text poem with `[plain]` modifier

### Tables Section
- Basic data tables
- Tables with aligned columns (left, center, right)

### Images Section
- Single images with captions
- Different image widths (normal, wide, full)
- Image gallery placeholder

### Buttons Section
- Call-to-action button examples

### Embeds Section
Placeholders for:
- Video: YouTube, Vimeo, Bilibili
- Audio: Spotify, SoundCloud, NetEase Music, QQ Music
- Social: Twitter, Instagram, Weibo
- Code: CodePen, GitHub Gist

### Bookmark Cards
- Link preview card placeholder

### Special HTML Elements
- Keyboard shortcuts (`<kbd>`)
- Abbreviations (`<abbr>`)
- Subscript and superscript

### Advanced Layouts
- Two-column layout (responsive)
- Custom alert boxes
- Highlight boxes

### Best Practices Sections
- Writing tips
- SEO tips
- Accessibility tips
- Mobile optimization notes
- Performance tips

## Customization Tips

### Add Your Branding

Replace generic examples with your own:

```markdown
<!-- Before -->
[Download Theme](https://github.com/bunizao/Attegi/releases)

<!-- After -->
[Download Our App](https://yoursite.com/download)
```

### Add Real Examples

Replace placeholders with actual content:

```markdown
<!-- Before -->
[YouTube embed would be inserted here]

<!-- After -->
<!-- Insert actual YouTube video via Ghost editor -->
```

### Adjust for Your Audience

- **Technical blog**: Emphasize code blocks and technical examples
- **Creative writing**: Focus on poem cards and typography
- **Business site**: Highlight callouts and professional layouts
- **Portfolio**: Showcase image galleries and layouts

### Localization

For other languages:

1. Copy the English template
2. Translate all text content
3. Keep Markdown syntax intact
4. Adjust examples to be culturally relevant
5. Save with language suffix (e.g., `style-guide-template-ja.md` for Japanese)

## Ghost Editor Tips

### Using Markdown Mode

1. Click the **⚙️** icon in the editor
2. Select **Markdown**
3. Paste the template content
4. Ghost will render it properly

### Adding Embeds

For placeholder sections like `[YouTube embed would be inserted here]`:

1. Delete the placeholder text
2. Click **+** to add a card
3. Select the embed type (YouTube, Spotify, etc.)
4. Paste the URL
5. Ghost will create the embed automatically

### Creating Galleries

1. Delete `[Gallery would be inserted here via Ghost editor]`
2. Click **+** to add a card
3. Select **Gallery**
4. Upload multiple images
5. Arrange as desired

### Adding Bookmark Cards

1. Delete `[Bookmark card would be inserted here via Ghost editor]`
2. Click **+** to add a card
3. Select **Bookmark**
4. Paste a URL
5. Ghost will fetch the preview automatically

## Testing Your Style Guide

After creating your style guide page:

### Visual Check
- [ ] All headings render correctly
- [ ] Code blocks have syntax highlighting
- [ ] Images load and are responsive
- [ ] Tables display properly
- [ ] Poem cards render with correct styling
- [ ] Callouts have proper icons and colors

### Functionality Check
- [ ] All links work
- [ ] Embeds load correctly
- [ ] Image galleries open in lightbox
- [ ] Code copy buttons work
- [ ] Bookmark cards show previews
- [ ] Page is mobile-responsive

### Content Check
- [ ] No placeholder text remains
- [ ] All examples are relevant
- [ ] Language is consistent
- [ ] Spelling and grammar are correct
- [ ] Links point to correct destinations

## Maintenance

Update your style guide when:

- **New features added**: Document new Attegi features
- **Customizations made**: Show your custom styling
- **Content strategy changes**: Adjust examples to match
- **User feedback**: Add clarifications based on questions

## Examples from Demo Site

The Attegi demo site has a style guide at:
https://attegi.tutuis.me/style-guide/

You can reference it for:
- Real embed examples
- Actual image galleries
- Working bookmark cards
- Live interactive elements

## Support

If you need help with the style guide:

- **Documentation**: [Full Attegi docs](../README.md)
- **GitHub Issues**: [Report problems](https://github.com/bunizao/Attegi/issues)
- **Discussions**: [Ask questions](https://github.com/bunizao/Attegi/discussions)

---

**Pro Tip**: Keep your style guide updated as you add new content types or customize the theme. It's a valuable reference for you and any contributors to your site!
