#!/usr/bin/env node

/**
 * Attegi Theme Build Script
 * Uses esbuild for fast JavaScript bundling with ES module support
 */

const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  srcDir: 'src/js',
  outDir: 'assets/js',
  // Entry points for different page types
  entries: {
    'site': 'src/js/entries/site.js',
    'post': 'src/js/entries/post.js',
    'page': 'src/js/entries/page.js'
  },
  // Vendor libraries to copy (not bundled)
  vendorCopy: [
    { src: 'src/js/libs/highlight.pack.js', dest: 'assets/js/highlight.pack.js' },
    { src: 'src/js/libs/glightbox.min.js', dest: 'assets/js/glightbox.min.js' },
    { src: 'node_modules/tocbot/dist/tocbot.min.js', dest: 'assets/js/tocbot.min.js' }
  ]
};

// Determine build mode from command line
const args = process.argv.slice(2);
const isWatch = args.includes('--watch');
const isDev = args.includes('--dev') || isWatch;
const isProduction = args.includes('--prod') || args.includes('--production');

/**
 * Copy vendor files that should not be bundled
 */
function copyVendorFiles() {
  config.vendorCopy.forEach(({ src, dest }) => {
    const srcPath = path.resolve(src);
    const destPath = path.resolve(dest);

    if (fs.existsSync(srcPath)) {
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(srcPath, destPath);
      console.log(`  Copied: ${src} -> ${dest}`);
    } else {
      console.warn(`  Warning: ${src} not found, skipping...`);
    }
  });
}

/**
 * Copy font files
 */
function copyFonts() {
  const srcDir = path.resolve('src/font');
  const destDir = path.resolve('assets/font');

  if (!fs.existsSync(srcDir)) {
    console.warn('  Warning: src/font directory not found');
    return;
  }

  fs.mkdirSync(destDir, { recursive: true });

  const files = fs.readdirSync(srcDir);
  files.forEach(file => {
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
  });

  console.log(`  Copied ${files.length} font files`);
}

/**
 * Copy CSS vendor files
 */
function copyCssVendor() {
  const src = 'src/sass/glightbox.min.css';
  const dest = 'assets/css/glightbox.min.css';

  if (fs.existsSync(src)) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    console.log(`  Copied: ${src} -> ${dest}`);
  }
}

/**
 * Build JavaScript with esbuild
 */
async function buildJS() {
  console.log('\n[JS] Building JavaScript bundles...');

  // Check if entry files exist, if not use legacy files
  const entryPoints = {};
  let useLegacy = false;

  for (const [name, entryPath] of Object.entries(config.entries)) {
    if (fs.existsSync(entryPath)) {
      entryPoints[name] = entryPath;
    } else {
      useLegacy = true;
    }
  }

  // Fallback to legacy build if new entries don't exist yet
  if (useLegacy) {
    console.log('  Using legacy entry points (new modular structure not yet created)');
    const legacyEntries = {
      'script': 'src/js/script.js',
      'post': 'src/js/post.js',
      'toc': 'src/js/toc.js',
      'poem': 'src/js/poem.js'
    };

    for (const [name, entryPath] of Object.entries(legacyEntries)) {
      if (fs.existsSync(entryPath)) {
        entryPoints[name] = entryPath;
      }
    }
  }

  const buildOptions = {
    entryPoints,
    bundle: true,
    outdir: config.outDir,
    format: 'iife',
    target: ['es2018'],
    minify: isProduction,
    sourcemap: isDev ? 'inline' : false,
    logLevel: 'info',
    // Tree shaking for production
    treeShaking: isProduction,
    // Keep names for better debugging in dev
    keepNames: isDev,
  };

  if (isWatch) {
    const ctx = await esbuild.context(buildOptions);
    await ctx.watch();
    console.log('  Watching for changes...');
    return ctx;
  } else {
    await esbuild.build(buildOptions);
    console.log('  JavaScript build complete');
  }
}

/**
 * Main build function
 */
async function build() {
  console.log(`\n========================================`);
  console.log(`  Attegi Theme Build`);
  console.log(`  Mode: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
  console.log(`========================================`);

  const startTime = Date.now();

  try {
    // Copy assets
    console.log('\n[Assets] Copying static files...');
    copyVendorFiles();
    copyFonts();
    copyCssVendor();

    // Build JavaScript
    await buildJS();

    const elapsed = Date.now() - startTime;
    console.log(`\n[Done] Build completed in ${elapsed}ms`);

  } catch (error) {
    console.error('\n[Error] Build failed:', error.message);
    process.exit(1);
  }
}

// Run build
build();
