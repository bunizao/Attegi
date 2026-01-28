/**
 * Sticky Logo Feature
 * Shows a fixed logo when scrolling down the page
 */

import { qs } from '../core/index.js';

/**
 * Initialize sticky logo behavior
 */
export function initStickyLogo() {
  var originalLogo = qs('.nav-header .logo');
  if (!originalLogo) return;

  // Create sticky logo element
  var stickyLogo = document.createElement('div');
  stickyLogo.className = 'sticky-logo';
  Array.prototype.forEach.call(originalLogo.childNodes, function(node) {
    stickyLogo.appendChild(node.cloneNode(true));
  });
  document.body.appendChild(stickyLogo);

  var scrollThreshold = 100;
  var isVisible = false;
  var stickyTicking = false;

  function updateStickyLogo() {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    var shouldShow = scrollY > scrollThreshold;

    if (shouldShow !== isVisible) {
      isVisible = shouldShow;
      requestAnimationFrame(function() {
        stickyLogo.classList.toggle('is-visible', isVisible);
      });
    }
  }

  function requestStickyUpdate() {
    if (stickyTicking) return;
    stickyTicking = true;
    requestAnimationFrame(function() {
      updateStickyLogo();
      stickyTicking = false;
    });
  }

  window.addEventListener('scroll', requestStickyUpdate, { passive: true });
  updateStickyLogo();
}
