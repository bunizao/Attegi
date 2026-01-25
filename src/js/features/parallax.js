/**
 * Parallax Cover Feature
 * Applies parallax effect to cover images on scroll
 */

import { qs, docEl } from '../core/index.js';

/**
 * Initialize parallax effect for cover images
 */
export function initParallax() {
  var cover = qs('.cover');
  var coverImage = cover ? cover.querySelector('img') : null;
  var coverPosition = 0;
  var coverHeight = cover ? cover.offsetHeight : 0;
  var ticking = false;
  var coverPreActive = docEl.classList.contains('cover-active');

  function updateCoverMetrics() {
    if (!cover) return;
    coverHeight = cover.offsetHeight || 0;
  }

  function prlx() {
    if (!cover) return;
    if (!coverHeight) updateCoverMetrics();
    var windowPosition = window.pageYOffset;
    coverPosition = windowPosition > 0 ? Math.floor(windowPosition * 0.25) : 0;
    cover.style.transform = 'translate3d(0, ' + coverPosition + 'px, 0)';
    var withinCover = coverHeight ? window.pageYOffset < coverHeight : coverPreActive;
    docEl.classList.toggle('cover-active', withinCover);
  }

  function requestPrlx() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function() {
      prlx();
      ticking = false;
    });
  }

  updateCoverMetrics();
  prlx();

  if (coverImage) {
    coverImage.addEventListener('load', function() {
      updateCoverMetrics();
      prlx();
    });
  }

  window.addEventListener('scroll', requestPrlx, { passive: true });
  window.addEventListener('resize', function() {
    updateCoverMetrics();
    requestPrlx();
  }, { passive: true });
  window.addEventListener('orientationchange', function() {
    updateCoverMetrics();
    requestPrlx();
  }, { passive: true });
}
