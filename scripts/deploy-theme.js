#!/usr/bin/env bun

/**
 * Uploads and activates a Ghost theme via the Admin API.
 * Replaces the archived third-party GitHub Action with a small, inspectable flow.
 */

const { createHmac } = require('node:crypto');

const ACCEPT_VERSION = process.env.GHOST_ADMIN_API_VERSION || 'v6.0';
const apiUrl = process.env.GHOST_ADMIN_API_URL;
const apiKey = process.env.GHOST_ADMIN_API_KEY;
const zipPath = process.argv[2];

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  printUsage(0);
}

if (!zipPath) {
  console.error('[deploy] Missing theme zip path.');
  printUsage(1);
}

if (!apiUrl || !apiKey) {
  console.error('[deploy] Missing Ghost Admin API credentials.');
  console.error('[deploy] Expected GHOST_ADMIN_API_URL and GHOST_ADMIN_API_KEY in the environment.');
  process.exit(1);
}

const zipFile = Bun.file(zipPath);
if (!(await zipFile.exists())) {
  console.error(`[deploy] Theme zip not found: ${zipPath}`);
  process.exit(1);
}

const adminApiUrl = normalizeAdminApiUrl(apiUrl);
const token = createAdminToken(apiKey);

console.log(`[deploy] Uploading ${zipPath}`);
console.log(`[deploy] Admin API: ${adminApiUrl}`);
console.log(`[deploy] Accept-Version: ${ACCEPT_VERSION}`);

const theme = await uploadTheme({
  adminApiUrl,
  token,
  zipFile,
  zipPath
});

await activateTheme({
  adminApiUrl,
  token,
  themeName: theme.name
});

console.log(`[deploy] Theme active: ${theme.name}`);

function printUsage(exitCode) {
  console.log('Usage: bun scripts/deploy-theme.js <path-to-theme-zip>');
  process.exit(exitCode);
}

function normalizeAdminApiUrl(rawUrl) {
  const trimmed = String(rawUrl).trim().replace(/\/+$/, '');
  if (!trimmed) {
    throw new Error('Ghost Admin API URL is empty.');
  }

  if (trimmed.includes('/ghost/api/admin')) {
    return trimmed.replace(/\/ghost\/api\/admin(?:\/.*)?$/, '/ghost/api/admin');
  }

  return `${trimmed}/ghost/api/admin`;
}

function createAdminToken(key) {
  const [id, secret] = String(key).trim().split(':');
  if (!id || !secret) {
    throw new Error('Ghost Admin API key must be in "<id>:<secret>" format.');
  }

  const issuedAt = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({
    alg: 'HS256',
    kid: id,
    typ: 'JWT'
  }));
  const payload = base64url(JSON.stringify({
    iat: issuedAt,
    exp: issuedAt + 5 * 60,
    aud: '/admin/'
  }));
  const unsignedToken = `${header}.${payload}`;
  const signature = base64url(
    createHmac('sha256', Buffer.from(secret, 'hex'))
      .update(unsignedToken)
      .digest()
  );

  return `${unsignedToken}.${signature}`;
}

function base64url(value) {
  return Buffer
    .from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

async function uploadTheme({ adminApiUrl, token, zipFile, zipPath }) {
  const formData = new FormData();
  const fileName = zipPath.split('/').pop() || 'theme.zip';
  const uploadFile = new File([await zipFile.arrayBuffer()], fileName, {
    type: 'application/zip'
  });
  formData.set('file', uploadFile);

  const response = await fetch(`${adminApiUrl}/themes/upload/`, {
    method: 'POST',
    headers: {
      Authorization: `Ghost ${token}`,
      'Accept-Version': ACCEPT_VERSION
    },
    body: formData
  });

  const payload = await parseResponse(response);
  const theme = payload?.themes?.[0];
  if (!theme?.name) {
    throw new Error('Ghost upload response did not include a theme name.');
  }

  console.log(`[deploy] Uploaded theme: ${theme.name}`);
  return theme;
}

async function activateTheme({ adminApiUrl, token, themeName }) {
  const response = await fetch(`${adminApiUrl}/themes/${encodeURIComponent(themeName)}/activate/`, {
    method: 'PUT',
    headers: {
      Authorization: `Ghost ${token}`,
      'Accept-Version': ACCEPT_VERSION
    }
  });

  await parseResponse(response);
}

async function parseResponse(response) {
  const text = await response.text();
  const payload = text ? safeJsonParse(text) : null;

  if (!response.ok) {
    const message = payload?.errors?.[0]?.message || payload?.message || text || response.statusText;
    throw new Error(`Ghost API ${response.status}: ${message}`);
  }

  return payload;
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
