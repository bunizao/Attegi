#!/usr/bin/env node

/**
 * Theme Compression Script
 * Creates a zip file for Ghost theme upload
 */

const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

// Read package.json for theme name
const pkg = require('../package.json');
const themeName = pkg.name || 'attegi';

// Output configuration
const distDir = path.resolve('dist');
const outputPath = path.join(distDir, `${themeName}.zip`);

// Files and directories to exclude
const excludePatterns = [
  'node_modules/**',
  'src/**',
  'dist/**',
  'screenshots/**',
  '.git/**',
  '.github/**',
  'scripts/**',
  '.gitignore',
  '.gitattributes',
  'Gruntfile.js',
  'package-lock.json',
  'docker-compose.yml',
  'AGENTS.md',
  'README_zh.md',
  '.DS_Store',
  '.lighthouseci/**',
  '.playwright-mcp/**',
  'postcss.config.js',
  '*.log'
];

async function compress() {
  console.log('\n========================================');
  console.log('  Attegi Theme Compression');
  console.log('========================================\n');

  // Ensure dist directory exists
  fs.mkdirSync(distDir, { recursive: true });

  // Remove existing zip if present
  if (fs.existsSync(outputPath)) {
    fs.unlinkSync(outputPath);
  }

  // Create write stream
  const output = fs.createWriteStream(outputPath);
  const archive = archiver('zip', {
    zlib: { level: 9 } // Maximum compression
  });

  // Handle events
  output.on('close', () => {
    const sizeKB = (archive.pointer() / 1024).toFixed(2);
    console.log(`\n[Done] Created ${outputPath}`);
    console.log(`       Size: ${sizeKB} KB`);
  });

  archive.on('warning', (err) => {
    if (err.code === 'ENOENT') {
      console.warn('[Warning]', err.message);
    } else {
      throw err;
    }
  });

  archive.on('error', (err) => {
    throw err;
  });

  // Pipe archive to file
  archive.pipe(output);

  // Add all files except excluded patterns
  archive.glob('**/*', {
    ignore: excludePatterns,
    dot: false
  });

  // Finalize archive
  await archive.finalize();
}

compress().catch(err => {
  console.error('[Error]', err.message);
  process.exit(1);
});
