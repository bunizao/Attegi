/**
 * Parallax Cover Feature
 * Applies parallax effect to cover images on scroll. Also owns the one
 * site-wide scroll listener that toggles `.nav-scrolled` (the nav header's
 * scrolled-state border) so nothing else needs to register its own.
 */

import { qs, docEl } from '../core/index.js';
import { onScroll } from '../core/scroll.js';

var NAV_SCROLL_THRESHOLD = 4;
var REDUCE_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Initialize parallax effect for cover images
 */
export function initParallax() {
  var cover = qs('.cover');
  var coverImage = cover ? cover.querySelector('img') : null;
  var coverPosition = 0;
  var coverHeight = cover ? cover.offsetHeight : 0;
  var coverPreActive = docEl.classList.contains('cover-active');
  var prefersReducedMotion = window.matchMedia && window.matchMedia(REDUCE_MOTION_QUERY).matches;

  function updateCoverMetrics() {
    if (!cover) return;
    coverHeight = cover.offsetHeight || 0;
  }

  function prlx() {
    docEl.classList.toggle('nav-scrolled', window.pageYOffset > NAV_SCROLL_THRESHOLD);

    if (!cover) return;
    if (!coverHeight) updateCoverMetrics();
    var windowPosition = window.pageYOffset;
    // Kill the transform entirely under reduced motion; the cover still
    // needs its scroll-position class kept in sync.
    coverPosition = (!prefersReducedMotion && windowPosition > 0) ? Math.floor(windowPosition * 0.25) : 0;
    cover.style.transform = 'translate3d(0, ' + coverPosition + 'px, 0)';
    var withinCover = coverHeight ? window.pageYOffset < coverHeight : coverPreActive;
    docEl.classList.toggle('cover-active', withinCover);
  }

  if (coverImage) {
    coverImage.addEventListener('load', function() {
      updateCoverMetrics();
      prlx();
    });
  }

  // core/scroll.js batches scroll/resize/orientationchange with one
  // rAF-throttled listener and calls back immediately on subscribe.
  onScroll(function() {
    updateCoverMetrics();
    prlx();
  });
}
