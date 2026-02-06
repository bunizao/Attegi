#!/usr/bin/env node

/**
 * Hot-reload development server.
 * Proxies a running Ghost instance and reloads when theme files change.
 */

const browserSync = require('browser-sync').create();

const DEFAULT_GHOST_URL = 'http://127.0.0.1:2368';
const DEFAULT_HOT_PORT = 3010;

function normalizeUrl(rawUrl) {
  const value = (rawUrl || '').trim();

  if (!value) {
    return DEFAULT_GHOST_URL;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return `http://${value}`;
}

function parsePort(rawPort, fallback) {
  const parsed = Number.parseInt(String(rawPort || ''), 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function parseBoolean(rawValue) {
  const normalized = String(rawValue || '').trim().toLowerCase();
  return ['1', 'true', 'yes', 'on'].includes(normalized);
}

const ghostUrl = normalizeUrl(process.env.GHOST_DEV_URL || process.env.GHOST_URL);
const hotPort = parsePort(process.env.DEV_HOT_PORT, DEFAULT_HOT_PORT);
const autoOpen = parseBoolean(process.env.DEV_HOT_OPEN);
const hotProtocol = ghostUrl.startsWith('https://') ? 'https' : 'http';

const watchFiles = [
  'assets/css/**/*.css',
  'assets/js/**/*.js',
  '*.hbs',
  'partials/**/*.hbs',
  'locales/**/*.json'
];

console.log('\n========================================');
console.log('  Attegi Hot Dev Server');
console.log('========================================');
console.log(`  Proxy target: ${ghostUrl}`);
console.log(`  Hot URL:      ${hotProtocol}://localhost:${hotPort}`);
console.log('  Watching:     assets + hbs + locales');
console.log('========================================\n');

browserSync.init(
  {
    proxy: ghostUrl,
    port: hotPort,
    open: autoOpen,
    notify: false,
    ghostMode: false,
    injectChanges: true,
    ui: false,
    files: watchFiles,
    reloadDebounce: 120,
    logPrefix: 'hot'
  },
  (error) => {
    if (!error) {
      return;
    }

    console.error('\n[hot] Failed to start hot reload proxy.');
    console.error(`[hot] Could not connect to Ghost at: ${ghostUrl}`);
    console.error('[hot] Start Ghost first, or set GHOST_DEV_URL to an available URL.\n');
    process.exit(1);
  }
);

function shutdown() {
  browserSync.exit();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
