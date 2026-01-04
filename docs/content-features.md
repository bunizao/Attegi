# Content Features

Attegi enhances Ghost's powerful content editor with beautiful styling and special features. This guide covers all content formatting options available.

## Ghost Editor Basics

Attegi works seamlessly with Ghost's editor. Access it by:
- Creating a new post: **Posts → New post**
- Creating a new page: **Pages → New page**

**Editor shortcuts**:
- `/` - Open card menu
- `Markdown` - Toggle Markdown mode
- `Ctrl/Cmd + Enter` - Publish/Update

## Typography

### Headings

Use headings to structure your content. Attegi supports all six heading levels with beautiful typography.

```markdown
# Heading 1 (H1) - Reserved for post title
## Heading 2 (H2) - Main sections
### Heading 3 (H3) - Subsections
#### Heading 4 (H4) - Minor sections
##### Heading 5 (H5) - Rarely used
###### Heading 6 (H6) - Rarely used
```

**Best practices**:
- Use only one H1 per page (the post title)
- Follow hierarchical order (don't skip levels)
- H2-H6 automatically appear in Table of Contents
- Keep headings concise (3-8 words)

### Text Formatting

**Bold**: `**bold text**` or `Ctrl/Cmd + B`
- Use for emphasis and key terms

**Italic**: `*italic text*` or `Ctrl/Cmd + I`
- Use for subtle emphasis, book titles, foreign words

**Strikethrough**: `~~strikethrough~~`
- Use for corrections or deprecated information

**Inline code**: `` `code` ``
- Use for variable names, commands, file names

**Links**: `[link text](https://example.com)` or `Ctrl/Cmd + K`
- Styled with accent color
- Hover effect with underline
- Opens in same tab by default

### Paragraphs

Attegi optimizes paragraph spacing and line height for readability.

**Features**:
- Optimal line length (60-80 characters)
- Comfortable line height (1.6-1.8)
- Proper paragraph spacing
- Responsive font sizing

**Tips**:
- Keep paragraphs 3-5 sentences
- Use blank lines between paragraphs
- Break up long text with headings and images

## Lists

### Unordered Lists

```markdown
- First item
- Second item
  - Nested item
  - Another nested item
- Third item
```

**Styling**:
- Clean bullet points
- Proper indentation for nested lists
- Comfortable spacing

### Ordered Lists

```markdown
1. First step
2. Second step
   1. Sub-step
   2. Another sub-step
3. Third step
```

**Features**:
- Automatic numbering
- Supports nested lists
- Maintains alignment

### Task Lists

```markdown
- [ ] Incomplete task
- [x] Completed task
- [ ] Another task
```

**Note**: Requires Markdown mode in Ghost editor.

## Blockquotes

Create beautiful quotes with proper attribution.

```markdown
> This is a blockquote. It can span multiple lines and will be styled beautifully in Attegi.
>
> — Author Name
```

**Styling**:
- Left border in accent color
- Italic text
- Increased font size
- Proper spacing

**Use cases**:
- Pull quotes from your content
- Citations and references
- Testimonials
- Important notes

## Code Blocks

Attegi includes syntax highlighting for 50+ programming languages.

### Inline Code

Use backticks for inline code:

```markdown
The `console.log()` function prints to the console.
```

### Code Blocks

Use triple backticks with language identifier:

````markdown
```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet('World');
```
````

### Supported Languages

**Popular languages**:
- JavaScript, TypeScript, JSX, TSX
- Python, Ruby, PHP, Go, Rust
- Java, C, C++, C#, Swift, Kotlin
- HTML, CSS, SCSS, Less
- SQL, GraphQL, JSON, YAML
- Bash, Shell, PowerShell
- Markdown, LaTeX

**Features**:
- Automatic language detection
- Language label display (e.g., "JavaScript")
- Copy button for easy copying
- Line numbers (optional)
- Syntax highlighting with theme-aware colors

**Example output**:
```
┌─ JavaScript ─────────────────────────┐
│ const greeting = "Hello, World!";    │
│ console.log(greeting);                │
│                              [Copy]   │
└──────────────────────────────────────┘
```

### Code Block Tips

- Always specify the language for proper highlighting
- Keep code blocks under 50 lines for readability
- Add comments to explain complex code
- Use inline code for short snippets

## Images

Attegi provides beautiful image handling with lazy loading and responsive sizing.

### Single Images

Add images via:
- Drag and drop into editor
- Click `+` and select "Image"
- Paste from clipboard

**Features**:
- Responsive sizing (320px to 1920px)
- Lazy loading for performance
- AVIF/WebP support (if enabled)
- Click to zoom (lightbox)
- Caption support

**Image captions**:
```markdown
![Alt text](image.jpg)
*Image caption goes here*
```

**Best practices**:
- Use descriptive alt text for accessibility
- Optimize images before upload (max 1920px width)
- Use WebP or AVIF for better compression
- Add captions to provide context

### Image Galleries

Create beautiful image galleries:

1. Click `+` in editor
2. Select "Gallery"
3. Upload multiple images
4. Arrange in grid

**Features**:
- Responsive grid layout
- 2-3 columns on desktop
- Single column on mobile
- Lightbox for full-size viewing
- Maintains aspect ratios

### Image Cards

Ghost's image card with Attegi styling:

**Wide images**: Full content width
**Full-width images**: Edge-to-edge on mobile

**Tips**:
- Use wide images for landscapes
- Use portrait images for emphasis
- Mix image sizes for visual interest

## Special Cards

### Callout Cards

Create attention-grabbing callouts:

```markdown
> 💡 **Tip**: This is a helpful tip for readers.

> ⚠️ **Warning**: Be careful with this operation.

> ℹ️ **Info**: Additional information here.

> ✅ **Success**: Operation completed successfully.
```

**Styling**:
- Colored left border
- Icon support
- Background tint
- Responsive design

**Use cases**:
- Tips and tricks
- Warnings and cautions
- Additional information
- Success messages

### Poem Cards

**Unique to Attegi**: Display beautiful poetry with elegant formatting.

#### Using Markdown (Recommended)

```markdown
> [!poem] The Road Not Taken
> Two roads diverged in a yellow wood,
> And sorry I could not travel both
> And be one traveler, long I stood
> And looked down one as far as I could
>
> — Robert Frost
```

#### Using HTML

```html
<div class="kg-poem-card">
  <div class="kg-poem-header">
    <h3 class="kg-poem-title">The Road Not Taken</h3>
  </div>
  <div class="kg-poem-content">
    <p class="kg-poem-line">Two roads diverged in a yellow wood,</p>
    <p class="kg-poem-line">And sorry I could not travel both</p>
    <p class="kg-poem-line">And be one traveler, long I stood</p>
  </div>
  <p class="kg-poem-author">— Robert Frost</p>
</div>
```

#### Poem Card Modifiers

Add modifiers to customize layout:

**Center alignment**:
```markdown
> [!poem] Spring Dawn [center]
> Spring sleep, unaware of dawn,
> Everywhere I hear singing birds.
>
> — Meng Haoran
```

**Plain text (no italics)**:
```markdown
> [!poem] Haiku [plain]
> An old silent pond
> A frog jumps into the pond—
> Splash! Silence again.
>
> — Matsuo Bashō
```

**Combined modifiers**:
```markdown
> [!poem] Title [center] [plain]
> Poem content here
>
> — Author
```

#### Poem Card Features

- Auto theme adaptation (light/dark)
- Elegant hover effects
- Responsive typography
- Optional divider line
- Flexible layout options

**Best practices**:
- Use for poetry, lyrics, or verse
- Keep lines short for mobile readability
- Always include author attribution
- Use [center] for short poems
- Use [plain] for modern poetry

### Bookmark Cards

Create rich link previews:

1. Click `+` in editor
2. Select "Bookmark"
3. Paste URL
4. Ghost fetches title, description, and image

**Features**:
- Automatic metadata extraction
- Thumbnail image
- Title and description
- Domain display
- Hover effects

**Use cases**:
- Reference external articles
- Link to resources
- Showcase related content

### Button Cards

Add call-to-action buttons:

```html
<div class="kg-card kg-button-card kg-align-center">
  <a href="https://example.com" class="kg-btn kg-btn-accent">
    Click Me
  </a>
</div>
```

**Styling**:
- Accent color background
- Hover effects
- Responsive sizing
- Center or left alignment

## Embeds

Attegi automatically wraps and styles embedded content.

### Supported Platforms

**Video**:
- YouTube
- Vimeo
- Bilibili

**Audio**:
- Spotify
- SoundCloud
- NetEase Music
- QQ Music

**Social**:
- Twitter/X
- Instagram
- TikTok

**Other**:
- CodePen
- GitHub Gists
- Google Maps

### How to Embed

1. Click `+` in editor
2. Select platform (e.g., "YouTube")
3. Paste URL
4. Embed appears automatically

**Features**:
- Responsive aspect ratios
- Lazy loading
- Theme-aware styling
- Mobile-optimized

**Example**:
```
Paste: https://www.youtube.com/watch?v=dQw4w9WgXcQ
Result: Embedded YouTube player
```

## Tables

Create data tables with Markdown:

```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Row 1    | Data     | Data     |
| Row 2    | Data     | Data     |
| Row 3    | Data     | Data     |
```

**Features**:
- Responsive scrolling on mobile
- Striped rows for readability
- Header styling
- Proper spacing

**Alignment**:
```markdown
| Left | Center | Right |
|:-----|:------:|------:|
| L    | C      | R     |
```

**Tips**:
- Keep tables simple (max 5-6 columns)
- Use for data, not layout
- Consider using lists for mobile-friendly content
- Add caption above table

## Horizontal Rules

Separate content sections:

```markdown
---
```

**Styling**:
- Subtle gray line
- Proper spacing
- Theme-aware color

**Use cases**:
- Section breaks
- Topic transitions
- Visual separation

## HTML Cards

For advanced formatting, use HTML cards:

1. Click `+` in editor
2. Select "HTML"
3. Write custom HTML

**Examples**:

**Two-column layout**:
```html
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
  <div>
    <h3>Column 1</h3>
    <p>Content here</p>
  </div>
  <div>
    <h3>Column 2</h3>
    <p>Content here</p>
  </div>
</div>
```

**Custom alert**:
```html
<div style="background: #FFF3CD; border-left: 4px solid #FFC107; padding: 1rem; margin: 2rem 0;">
  <strong>⚠️ Important:</strong> This is a custom alert.
</div>
```

**Note**: HTML cards require knowledge of HTML/CSS.

## Markdown Cards

For Markdown purists:

1. Click `+` in editor
2. Select "Markdown"
3. Write Markdown syntax

**Supports**:
- All standard Markdown
- GitHub Flavored Markdown
- Tables, task lists, footnotes

## Content Best Practices

### Structure

- Start with a compelling introduction
- Use headings to organize content
- Break up text with images and lists
- End with a conclusion or call-to-action

### Readability

- Keep paragraphs short (3-5 sentences)
- Use active voice
- Vary sentence length
- Add white space

### Engagement

- Use images every 300-500 words
- Include code examples for technical content
- Add callouts for important information
- Use lists for scannable content

### SEO

- Use descriptive headings with keywords
- Add alt text to all images
- Write compelling meta descriptions
- Use internal links

### Accessibility

- Provide alt text for images
- Use proper heading hierarchy
- Ensure sufficient color contrast
- Write descriptive link text (not "click here")

### Mobile Optimization

- Test on actual mobile devices
- Keep images under 1MB
- Use responsive embeds
- Avoid wide tables

## Content Checklist

Before publishing, verify:

- [ ] Headings follow proper hierarchy
- [ ] All images have alt text
- [ ] Code blocks specify language
- [ ] Links open correctly
- [ ] Embeds load properly
- [ ] Content is mobile-friendly
- [ ] Spelling and grammar checked
- [ ] Meta description added
- [ ] Featured image set
- [ ] Tags added

## Advanced Formatting

### Custom Styling

Add custom CSS to specific elements:

```html
<p style="font-size: 1.5rem; text-align: center; color: var(--color-primary);">
  Large, centered, colored text
</p>
```

### Footnotes

Add footnotes in Markdown mode:

```markdown
This is a statement[^1] that needs citation.

[^1]: Source: Example Book, Page 123
```

### Keyboard Shortcuts

Display keyboard shortcuts:

```html
Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy
```

### Abbreviations

Define abbreviations:

```html
<abbr title="HyperText Markup Language">HTML</abbr>
```

## Troubleshooting

### Images not displaying

- Check image URL is correct
- Verify image file isn't corrupted
- Ensure image size is under Ghost's limit (10MB default)
- Try re-uploading the image

### Code highlighting not working

- Specify language in code block
- Check that `post.js` is loading
- Verify highlight.js is included
- Clear browser cache

### Embeds not loading

- Verify URL is correct and public
- Check platform is supported
- Ensure JavaScript is enabled
- Try refreshing the page

### Poem cards not rendering

- Check Markdown syntax is correct
- Verify `poem.js` is loading
- Ensure `[!poem]` tag is at start of blockquote
- Try using HTML version instead

---

**Next**: [Advanced Features →](./advanced-features.md)
