/**
 * Page Entry Point
 * Loads features for static pages (subset of post features)
 */

import { onReady, qs, doc } from '../core/index.js';

// Site features
import { initMenu } from '../features/menu.js';
import { initParallax } from '../features/parallax.js';
import { initStickyLogo } from '../features/sticky-logo.js';
import { initGallery } from '../features/gallery.js';
import { initThemeSwitcher } from '../features/theme-switcher.js';

// Page-specific features (subset of post)
import { wrapEmbeds } from '../features/embeds.js';
import { highlightCode } from '../features/code-highlight.js';

onReady(function() {
  // Initialize site features
  initMenu();
  initParallax();
  initStickyLogo();

  // Defer non-critical site features
  setTimeout(function() {
    initGallery();
    initThemeSwitcher();
  }, 0);

  // Initialize page-specific features
  var pageContent = qs('.post-content');
  if (!pageContent) return;

  var currentScript = doc.currentScript || null;
  var highlightUrl = currentScript ? currentScript.getAttribute('data-highlight') : '';

  wrapEmbeds(pageContent);
  highlightCode(pageContent, highlightUrl);
});
