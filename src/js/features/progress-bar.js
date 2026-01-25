/**
 * Progress Bar Feature
 * Shows reading progress based on scroll position
 */

import { qs, doc } from '../core/index.js';

/**
 * Initialize reading progress bar
 * @param {Element} content - Post content element
 */
export function setupProgress(content) {
  var progressBar = qs('.progress-bar');
  var progressContainer = qs('.progress-container');
  if (!progressBar || !progressContainer || !content) return;

  var ticking = false;

  function update() {
    var viewportHeight = window.innerHeight || doc.documentElement.clientHeight;
    var viewportMiddle = window.scrollY + viewportHeight / 2;
    var contentTop = content.offsetTop;
    var contentBottom = contentTop + content.offsetHeight;

    var scrollableDistance = contentBottom - contentTop;
    var scrolledDistance = viewportMiddle - contentTop;

    var progress = (scrolledDistance / scrollableDistance) * 100;
    var clamped = Math.max(0, Math.min(progress, 120));
    progressBar.style.width = Math.min(clamped, 100) + '%';
    progressContainer.classList.toggle('complete', clamped > 100);
  }

  function requestTick() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function() {
      update();
      ticking = false;
    });
  }

  ['scroll', 'resize', 'orientationchange'].forEach(function(evt) {
    window.addEventListener(evt, requestTick, { passive: true });
  });

  update();
}
