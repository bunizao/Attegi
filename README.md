# Attegi OG Image Service

Dynamic Open Graph image generation service for Ghost themes.

## Features

- Background image support with gradient overlay
- 6 color themes (dark/light/sunset/ocean/aurora/minimal)
- Chinese font support (Noto Sans SC)
- Site icon and branding
- Article metadata display

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/bunizao/attegi/tree/og-image-service)

## Local Development

```bash
npm install
npm run dev
```

## API Parameters

| Parameter | Description | Required |
|-----------|-------------|----------|
| `title` | Article title | Yes |
| `site` | Site name | Yes |
| `excerpt` | Article excerpt | No |
| `author` | Author name | No |
| `tag` | Category tag | No |
| `date` | Publication date | No |
| `reading` | Reading time | No |
| `theme` | Color theme | No (default: dark) |
| `image` | Background image URL | No |
| `icon` | Site icon URL | No |

## Themes

- `dark` - Dark overlay, works with most images
- `light` - Light overlay, for dark images
- `sunset` - Warm gradient overlay
- `ocean` - Blue gradient overlay
- `aurora` - Cyan/purple gradient overlay
- `minimal` - Subtle dark overlay

## Example

```
/api/og?title=Hello%20World&site=Blog&theme=dark&image=https://example.com/bg.jpg
```

## License

MIT
