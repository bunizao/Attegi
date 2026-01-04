# Poem Card

Display beautiful poetry in your Ghost posts with automatic Markdown parsing or custom HTML.

**[View Full Tutorial →](https://attegi.tutuis.me/poem-card-tutorial/)**

## Quick Start

### Using Markdown (Recommended)

```markdown
> [!poem] The Road Not Taken
> Two roads diverged in a yellow wood,
> And sorry I could not travel both
> And be one traveler, long I stood
>
> — Robert Frost
```

### Using HTML

```html
<div class="kg-poem-card">
  <div class="kg-poem-content">
    <p class="kg-poem-line">Two roads diverged in a yellow wood,</p>
    <p class="kg-poem-line">And sorry I could not travel both</p>
  </div>
  <p class="kg-poem-author">— Robert Frost</p>
</div>
```

## Modifiers

Add modifiers in the title to customize layout:

- `[center]` - Center-align the poem
- `[plain]` - Remove italic styling

```markdown
> [!poem] Spring Dawn [center] [plain]
> Spring sleep, unaware of dawn,
> Everywhere I hear singing birds.
>
> — Meng Haoran
```

## Features

- Auto theme adaptation (light/dark mode)
- Responsive design for all screen sizes
- Elegant hover effects with accent colors
- Flexible layout options

For detailed documentation, examples, and advanced usage, visit the [complete tutorial](https://attegi.tutuis.me/poem-card-tutorial/).
