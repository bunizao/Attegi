# Attegi Style Guide

Welcome to the Attegi theme style guide! This page demonstrates all available formatting options and content features. Use this as a reference when creating your posts.

---

## Typography

### Headings

Attegi supports six levels of headings with beautiful typography optimized for readability.

# Heading 1 (H1)
## Heading 2 (H2)
### Heading 3 (H3)
#### Heading 4 (H4)
##### Heading 5 (H5)
###### Heading 6 (H6)

**Best practice**: Use only one H1 per page (your post title). H2-H6 automatically appear in the Table of Contents.

### Text Formatting

You can format text in multiple ways:

- **Bold text** for emphasis and key terms
- *Italic text* for subtle emphasis or book titles
- ~~Strikethrough~~ for corrections or deprecated information
- `Inline code` for variable names, commands, or file names
- [Links](https://attegi.tutuis.me) styled with accent color

You can also combine formatting: ***bold and italic***, **bold with `code`**, and more.

### Paragraphs

This is a standard paragraph. Attegi optimizes paragraph spacing and line height for maximum readability. The theme uses optimal line length (60-80 characters) and comfortable line height (1.6-1.8) to reduce eye strain.

Keep paragraphs concise (3-5 sentences) and use blank lines between them for better readability. Break up long text with headings, images, and other visual elements.

---

## Lists

### Unordered Lists

Use bullet points for unordered information:

- First item in the list
- Second item with more details
- Third item
  - Nested item level 1
  - Another nested item
    - Nested item level 2
- Back to main level

### Ordered Lists

Use numbered lists for sequential information:

1. First step in the process
2. Second step with instructions
3. Third step
   1. Sub-step A
   2. Sub-step B
4. Final step

### Task Lists

Create interactive checklists (requires Markdown mode):

- [x] Completed task
- [x] Another completed task
- [ ] Incomplete task
- [ ] Another incomplete task

---

## Blockquotes

> This is a standard blockquote. Use it for pull quotes, citations, or to emphasize important information.
>
> Blockquotes can span multiple paragraphs and will be styled beautifully with a left border in your accent color.

> **Tip**: You can include formatting inside blockquotes, like **bold text**, *italics*, and even `code`.

### Quote with Attribution

> Two roads diverged in a wood, and I—
> I took the one less traveled by,
> And that has made all the difference.
>
> — Robert Frost, *The Road Not Taken*

---

## Code Blocks

### Inline Code

Use inline code for short snippets: `const greeting = "Hello, World!"` or commands like `npm install`.

### Code Blocks with Syntax Highlighting

Attegi supports syntax highlighting for 50+ programming languages:

**JavaScript:**

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
  return true;
}

greet('World');
```

**Python:**

```python
def calculate_fibonacci(n):
    if n <= 1:
        return n
    return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)

print(calculate_fibonacci(10))
```

**HTML:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Example Page</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is a paragraph.</p>
</body>
</html>
```

**CSS:**

```css
.post-card {
  background: var(--color-background);
  border-radius: 8px;
  transition: transform 0.2s ease;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}
```

**Bash:**

```bash
#!/bin/bash

# Install dependencies
npm install

# Build for production
npm run build

# Deploy to server
rsync -av dist/ user@server:/var/www/
```

Each code block includes a copy button and language label for easy reference.

---

## Callouts & Alerts

Use callouts to highlight important information:

> 💡 **Tip**: This is a helpful tip for your readers. Use callouts sparingly to maintain their impact.

> ⚠️ **Warning**: This is a warning about potential issues or important considerations.

> ℹ️ **Info**: This provides additional context or supplementary information.

> ✅ **Success**: This indicates a successful operation or positive outcome.

> ❌ **Error**: This highlights errors or things to avoid.

---

## Poem Cards

**Unique to Attegi**: Display beautiful poetry with elegant formatting.

### Standard Poem

> [!poem] The Road Not Taken
> Two roads diverged in a yellow wood,
> And sorry I could not travel both
> And be one traveler, long I stood
> And looked down one as far as I could
> To where it bent in the undergrowth;
>
> — Robert Frost

### Centered Poem

> [!poem] Haiku [center]
> An old silent pond
> A frog jumps into the pond—
> Splash! Silence again.
>
> — Matsuo Bashō

### Plain Text Poem

> [!poem] Modern Verse [plain]
> This poem uses plain text
> Without italic styling
> For a contemporary look
>
> — Anonymous

---

## Tables

Create data tables with Markdown syntax:

| Feature | Attegi | Other Themes |
|---------|--------|--------------|
| Mobile-first | ✅ Yes | ⚠️ Sometimes |
| Dark mode | ✅ Yes | ⚠️ Sometimes |
| TOC | ✅ Auto | ❌ No |
| Code highlighting | ✅ 50+ languages | ⚠️ Limited |
| Performance | ✅ 90+ score | ⚠️ Varies |

### Aligned Columns

| Left Aligned | Center Aligned | Right Aligned |
|:-------------|:--------------:|--------------:|
| Text | Text | Text |
| More text | More text | More text |
| Even more | Even more | Even more |

---

## Images

### Single Image

Images are responsive and support lazy loading for optimal performance:

![Example landscape image](https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200)

*Caption: Beautiful mountain landscape at sunset*

### Image Sizes

**Normal width** (default):
![Normal width image](https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=960)

**Wide image** (extends beyond content):
![Wide image](https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200)

**Full-width image** (edge-to-edge on mobile):
![Full width image](https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920)

### Image Gallery

Create beautiful image galleries that open in a lightbox:

[Gallery would be inserted here via Ghost editor]

---

## Buttons

Add call-to-action buttons to your content:

[Download Theme](https://github.com/bunizao/Attegi/releases) [View Demo](https://attegi.tutuis.me) [Documentation](https://github.com/bunizao/Attegi/tree/main/docs)

---

## Embeds

### Video Embeds

**YouTube:**

[YouTube embed would be inserted here]

**Vimeo:**

[Vimeo embed would be inserted here]

### Audio Embeds

**Spotify:**

[Spotify embed would be inserted here]

**SoundCloud:**

[SoundCloud embed would be inserted here]

### Social Media

**Twitter/X:**

[Twitter embed would be inserted here]

**Instagram:**

[Instagram embed would be inserted here]

### Code Embeds

**CodePen:**

[CodePen embed would be inserted here]

**GitHub Gist:**

[GitHub Gist embed would be inserted here]

---

## Bookmark Cards

Create rich link previews for external resources:

[Bookmark card would be inserted here via Ghost editor]

Example: Link to Ghost documentation, GitHub repository, or related articles.

---

## Horizontal Rules

Use horizontal rules to separate content sections:

---

Like the one above! They're subtle but effective for visual separation.

---

## Special HTML Elements

### Keyboard Shortcuts

Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy, <kbd>Ctrl</kbd> + <kbd>V</kbd> to paste.

Use <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> to open the command palette.

### Abbreviations

The <abbr title="HyperText Markup Language">HTML</abbr> specification is maintained by the <abbr title="World Wide Web Consortium">W3C</abbr>.

### Subscript and Superscript

- Water formula: H<sub>2</sub>O
- Einstein's equation: E=mc<sup>2</sup>
- Footnote reference<sup>1</sup>

---

## Advanced Layouts

### Two-Column Layout

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin: 2rem 0;">
  <div>
    <h4>Column 1</h4>
    <p>This is the first column. You can add any content here including text, images, or lists.</p>
    <ul>
      <li>Feature 1</li>
      <li>Feature 2</li>
      <li>Feature 3</li>
    </ul>
  </div>
  <div>
    <h4>Column 2</h4>
    <p>This is the second column. Columns stack on mobile for better readability.</p>
    <ul>
      <li>Benefit 1</li>
      <li>Benefit 2</li>
      <li>Benefit 3</li>
    </ul>
  </div>
</div>

### Custom Alert Box

<div style="background: #FFF3CD; border-left: 4px solid #FFC107; padding: 1rem 1.5rem; margin: 2rem 0; border-radius: 4px;">
  <strong>⚠️ Important Notice:</strong> This is a custom alert box created with HTML. Use it for important announcements or warnings.
</div>

### Highlight Box

<div style="background: var(--color-primary); color: white; padding: 2rem; margin: 2rem 0; border-radius: 8px; text-align: center;">
  <h3 style="margin-top: 0; color: white;">Featured Content</h3>
  <p style="margin-bottom: 0;">This is a highlighted section that draws attention to important content.</p>
</div>

---

## Content Best Practices

### Writing Tips

1. **Start strong**: Hook readers with a compelling introduction
2. **Use headings**: Break content into scannable sections
3. **Add visuals**: Include images every 300-500 words
4. **Keep paragraphs short**: 3-5 sentences maximum
5. **Use lists**: Make content scannable
6. **Include examples**: Show, don't just tell
7. **End with action**: Clear call-to-action or conclusion

### SEO Tips

- Use descriptive headings with keywords
- Add alt text to all images
- Write compelling meta descriptions
- Use internal links to related content
- Keep URLs short and descriptive
- Optimize images before upload (max 1920px width)

### Accessibility Tips

- Ensure sufficient color contrast (4.5:1 minimum)
- Use proper heading hierarchy (don't skip levels)
- Add alt text to images
- Write descriptive link text (not "click here")
- Test with keyboard navigation
- Verify screen reader compatibility

---

## Mobile Optimization

Attegi is mobile-first, meaning all content is optimized for smartphones:

- **Responsive images**: Automatically sized for each device
- **Touch-friendly**: Large tap targets and comfortable spacing
- **Readable fonts**: Optimized sizes across all screens
- **Collapsible TOC**: Table of contents becomes a drawer on mobile
- **Fast loading**: Lazy loading and optimized assets

Test your content on actual mobile devices to ensure the best experience.

---

## Performance Tips

1. **Optimize images**: Use WebP/AVIF formats when possible
2. **Limit embeds**: Too many can slow page load
3. **Use lazy loading**: Built-in for images and embeds
4. **Minimize custom code**: Keep HTML/CSS injection minimal
5. **Test regularly**: Use Lighthouse for performance audits

---

## Conclusion

This style guide demonstrates all formatting options available in Attegi. Experiment with different combinations to create engaging, readable content.

**Need help?** Check out the [full documentation](https://github.com/bunizao/Attegi/tree/main/docs) or visit the [demo site](https://attegi.tutuis.me).

---

**Last updated**: January 4, 2026
**Theme version**: 6.9.12

---

*This style guide is a living document. As new features are added to Attegi, this page will be updated to reflect them.*
