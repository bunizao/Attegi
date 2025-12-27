import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// Theme configurations for overlay styles
const themes: Record<string, {
  overlay: string;
  textColor: string;
  subtextColor: string;
  accentColor: string;
  tagBg: string;
}> = {
  // Dark overlay - works with most images
  dark: {
    overlay: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.85) 100%)',
    textColor: '#ffffff',
    subtextColor: 'rgba(255,255,255,0.8)',
    accentColor: 'rgba(255,255,255,0.6)',
    tagBg: 'rgba(255,255,255,0.15)',
  },
  // Light overlay - for dark images
  light: {
    overlay: 'linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0.95) 100%)',
    textColor: '#1a1a1a',
    subtextColor: 'rgba(0,0,0,0.7)',
    accentColor: 'rgba(0,0,0,0.5)',
    tagBg: 'rgba(0,0,0,0.08)',
  },
  // Gradient overlay - colorful
  sunset: {
    overlay: 'linear-gradient(135deg, rgba(255,100,50,0.7) 0%, rgba(150,50,150,0.8) 50%, rgba(50,50,100,0.9) 100%)',
    textColor: '#ffffff',
    subtextColor: 'rgba(255,255,255,0.85)',
    accentColor: 'rgba(255,200,150,0.9)',
    tagBg: 'rgba(255,255,255,0.2)',
  },
  // Ocean blue overlay
  ocean: {
    overlay: 'linear-gradient(135deg, rgba(0,50,100,0.7) 0%, rgba(0,100,150,0.8) 50%, rgba(0,50,80,0.9) 100%)',
    textColor: '#ffffff',
    subtextColor: 'rgba(255,255,255,0.85)',
    accentColor: 'rgba(100,200,255,0.9)',
    tagBg: 'rgba(255,255,255,0.15)',
  },
  // Aurora - cyan/purple
  aurora: {
    overlay: 'linear-gradient(135deg, rgba(0,100,100,0.7) 0%, rgba(50,0,100,0.8) 50%, rgba(20,20,60,0.9) 100%)',
    textColor: '#ffffff',
    subtextColor: 'rgba(255,255,255,0.85)',
    accentColor: 'rgba(0,255,200,0.9)',
    tagBg: 'rgba(255,255,255,0.15)',
  },
  // Minimal - subtle dark
  minimal: {
    overlay: 'linear-gradient(to bottom, rgba(20,20,25,0.5) 0%, rgba(20,20,25,0.8) 50%, rgba(20,20,25,0.95) 100%)',
    textColor: '#ffffff',
    subtextColor: 'rgba(255,255,255,0.75)',
    accentColor: 'rgba(255,255,255,0.5)',
    tagBg: 'rgba(255,255,255,0.1)',
  },
};

// Default background when no image provided
const defaultBackgrounds: Record<string, string> = {
  dark: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
  light: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 50%, #d1d5db 100%)',
  sunset: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 25%, #ff4757 50%, #c44569 75%, #574b90 100%)',
  ocean: 'linear-gradient(135deg, #0077b6 0%, #00b4d8 25%, #0096c7 50%, #023e8a 75%, #03045e 100%)',
  aurora: 'linear-gradient(135deg, #00d9ff 0%, #00ff87 25%, #7b2cbf 50%, #3a0ca3 75%, #0a0a1a 100%)',
  minimal: 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 50%, #0d0d0d 100%)',
};

// Load Chinese font
async function loadFont(): Promise<ArrayBuffer | null> {
  try {
    const fontUrl = 'https://fonts.gstatic.com/s/notosanssc/v36/k3kCo84MPvpLmixcA63oeAL7Iqp5IZJF9bmaG9_FnYxNbPzS5HE.woff2';
    const response = await fetch(fontUrl);
    if (!response.ok) return null;
    return await response.arrayBuffer();
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Required parameters
  const title = searchParams.get('title') || 'Untitled';
  const site = searchParams.get('site') || 'Blog';

  // Optional parameters
  const excerpt = searchParams.get('excerpt') || '';
  const author = searchParams.get('author') || '';
  const tag = searchParams.get('tag') || '';
  const date = searchParams.get('date') || '';
  const reading = searchParams.get('reading') || '';
  const theme = searchParams.get('theme') || 'dark';
  const image = searchParams.get('image') || ''; // Background image URL
  const icon = searchParams.get('icon') || ''; // Site icon URL

  const selectedTheme = themes[theme] || themes.dark;
  const defaultBg = defaultBackgrounds[theme] || defaultBackgrounds.dark;

  // Truncate text for display
  const displayTitle = title.length > 60 ? title.slice(0, 57) + '...' : title;
  const displayExcerpt = excerpt.length > 120 ? excerpt.slice(0, 117) + '...' : excerpt;

  // Load font for Chinese support
  const fontData = await loadFont();
  const hasChinese = /[\u4e00-\u9fff]/.test(title + excerpt);

  // Calculate font size based on title length
  const titleFontSize = displayTitle.length > 40 ? 42 : displayTitle.length > 25 ? 52 : 64;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          fontFamily: hasChinese ? '"Noto Sans SC", sans-serif' : 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Background layer - image or gradient */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            backgroundImage: image ? `url(${image})` : defaultBg,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Overlay gradient for text readability */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            background: selectedTheme.overlay,
          }}
        />

        {/* Content container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            padding: '48px 56px',
            position: 'relative',
          }}
        >
          {/* Top section: Site branding + Tag */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {/* Site branding */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              {/* Site icon */}
              {icon ? (
                <img
                  src={icon}
                  width={44}
                  height={44}
                  style={{
                    borderRadius: '10px',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: selectedTheme.tagBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    fontWeight: 700,
                    color: selectedTheme.textColor,
                  }}
                >
                  {site.charAt(0).toUpperCase()}
                </div>
              )}
              <span
                style={{
                  fontSize: '24px',
                  fontWeight: 600,
                  color: selectedTheme.textColor,
                  letterSpacing: '-0.3px',
                }}
              >
                {site}
              </span>
            </div>

            {/* Tag badge */}
            {tag && (
              <div
                style={{
                  display: 'flex',
                  padding: '10px 20px',
                  borderRadius: '24px',
                  background: selectedTheme.tagBg,
                  color: selectedTheme.subtextColor,
                  fontSize: '16px',
                  fontWeight: 500,
                }}
              >
                {tag}
              </div>
            )}
          </div>

          {/* Middle section: Title and excerpt */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              flex: 1,
              justifyContent: 'center',
              paddingTop: '20px',
              paddingBottom: '20px',
            }}
          >
            <h1
              style={{
                fontSize: `${titleFontSize}px`,
                fontWeight: 700,
                color: selectedTheme.textColor,
                lineHeight: 1.15,
                margin: 0,
                letterSpacing: '-1px',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              }}
            >
              {displayTitle}
            </h1>

            {displayExcerpt && (
              <p
                style={{
                  fontSize: '22px',
                  color: selectedTheme.subtextColor,
                  lineHeight: 1.5,
                  margin: 0,
                  maxWidth: '90%',
                  fontWeight: 400,
                }}
              >
                {displayExcerpt}
              </p>
            )}
          </div>

          {/* Bottom section: Meta info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Author */}
            {author && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: selectedTheme.tagBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 600,
                    color: selectedTheme.textColor,
                  }}
                >
                  {author.charAt(0).toUpperCase()}
                </div>
                <span
                  style={{
                    fontSize: '18px',
                    fontWeight: 500,
                    color: selectedTheme.textColor,
                  }}
                >
                  {author}
                </span>
              </div>
            )}

            {/* Date and reading time */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                marginLeft: 'auto',
              }}
            >
              {date && (
                <span
                  style={{
                    fontSize: '16px',
                    color: selectedTheme.accentColor,
                    fontWeight: 500,
                  }}
                >
                  {date}
                </span>
              )}
              {reading && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '16px',
                    color: selectedTheme.accentColor,
                    fontWeight: 500,
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {reading}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: fontData
        ? [
            {
              name: 'Noto Sans SC',
              data: fontData,
              style: 'normal',
              weight: 400,
            },
          ]
        : undefined,
    }
  );
}
