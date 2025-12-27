export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>OG Image Service</h1>
      <p>Dynamic Open Graph image generation for Ghost themes.</p>

      <h2>Usage</h2>
      <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px' }}>
        /api/og?title=Hello&amp;site=Blog&amp;theme=dark
      </pre>

      <h2>Parameters</h2>
      <ul>
        <li><code>title</code> - Article title (required)</li>
        <li><code>site</code> - Site name (required)</li>
        <li><code>excerpt</code> - Article excerpt</li>
        <li><code>author</code> - Author name</li>
        <li><code>tag</code> - Category tag</li>
        <li><code>date</code> - Publication date</li>
        <li><code>reading</code> - Reading time</li>
        <li><code>theme</code> - dark/light/sunset/ocean/aurora/minimal</li>
        <li><code>image</code> - Background image URL</li>
        <li><code>icon</code> - Site icon URL</li>
      </ul>

      <h2>Demo</h2>
      <p>
        <a href="/api/og?title=Hello%20World&site=Demo&theme=dark&excerpt=This%20is%20a%20test%20article">
          Dark Theme
        </a>
        {' | '}
        <a href="/api/og?title=Hello%20World&site=Demo&theme=sunset&excerpt=This%20is%20a%20test%20article">
          Sunset Theme
        </a>
        {' | '}
        <a href="/api/og?title=Hello%20World&site=Demo&theme=ocean&excerpt=This%20is%20a%20test%20article">
          Ocean Theme
        </a>
      </p>
    </main>
  );
}
