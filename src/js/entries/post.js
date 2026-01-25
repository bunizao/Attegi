/**
 * Post Entry Point
 * Loads all features for post pages (includes site features)
 */

import { onReady, qs, doc } from '../core/index.js';

// Site features
import { initMenu } from '../features/menu.js';
import { initParallax } from '../features/parallax.js';
import { initStickyLogo } from '../features/sticky-logo.js';
import { initGallery } from '../features/gallery.js';
import { initThemeSwitcher } from '../features/theme-switcher.js';

// Post-specific features
import { wrapEmbeds } from '../features/embeds.js';
import { highlightCode } from '../features/code-highlight.js';
import { setupProgress } from '../features/progress-bar.js';
import { setupShare } from '../features/share.js';
import { setupDisqus, setupLazyComments } from '../features/comments.js';
import { setupCoverBrightnessDetection } from '../features/cover-detect.js';
import { setupPortraitVideos, setupPortraitImages } from '../features/portrait-media.js';
import { setupFootnotes } from '../features/footnotes.js';
import { setupContentImagesFormats } from '../features/image-formats.js';
import { initTOC } from '../features/toc.js';
import { initPoemCards } from '../features/poem-cards.js';

onReady(function() {
  // Initialize site features first
  initMenu();
  initParallax();
  initStickyLogo();

  // Defer non-critical site features
  setTimeout(function() {
    initGallery();
    initThemeSwitcher();
  }, 0);

  // Initialize post-specific features
  var postContent = qs('.post-content');
  if (!postContent) return;

  // Get highlight.js URL from script tag
  var currentScript = doc.currentScript || null;
  var highlightUrl = currentScript ? currentScript.getAttribute('data-highlight') : '';

  // Core post features
  wrapEmbeds(postContent);
  highlightCode(postContent, highlightUrl);
  setupProgress(postContent);
  setupShare();
  setupDisqus();
  setupLazyComments();
  setupCoverBrightnessDetection();
  setupPortraitVideos();
  setupPortraitImages();
  setupFootnotes(postContent);
  setupContentImagesFormats(postContent);

  // Initialize TOC (uses tocbot from external script)
  initTOC();

  // Initialize poem cards
  initPoemCards();
});
