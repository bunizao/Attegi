/**
 * Site Entry Point
 * Loads features common to all pages
 */

import { onReady } from '../core/index.js';
import { initMenu } from '../features/menu.js';
import { initParallax } from '../features/parallax.js';
import { initGallery } from '../features/gallery.js';
import { initThemeSwitcher } from '../features/theme-switcher.js';
import { initExcerptClean } from '../features/excerpt-clean.js';
import { initTagCards } from '../features/tag-cards.js';
import { initLinksMotion } from '../features/links-motion.js';
import { initFloatNav } from '../features/float-nav.js';

onReady(function() {
  // Initialize core site features
  initMenu();
  initParallax();
  initExcerptClean();
  initTagCards();
  initLinksMotion();
  initFloatNav();

  // Defer non-critical features
  setTimeout(function() {
    initGallery();
    initThemeSwitcher();
  }, 0);
});
