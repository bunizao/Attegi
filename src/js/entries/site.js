/**
 * Site Entry Point
 * Loads features common to all pages
 */

import { onReady } from '../core/index.js';
import { initMenu } from '../features/menu.js';
import { initParallax } from '../features/parallax.js';
import { initStickyLogo } from '../features/sticky-logo.js';
import { initGallery } from '../features/gallery.js';
import { initThemeSwitcher } from '../features/theme-switcher.js';

onReady(function() {
  // Initialize core site features
  initMenu();
  initParallax();
  initStickyLogo();

  // Defer non-critical features
  setTimeout(function() {
    initGallery();
    initThemeSwitcher();
  }, 0);
});
