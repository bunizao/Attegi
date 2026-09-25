/**
 * Menu Toggle Feature
 * Handles the mobile navigation sheet: open/close, focus trap, Escape.
 */

import { qs, qsa, docEl } from '../core/index.js';
import { openDialog, closeDialog, isPointerClick } from '../core/dialog.js';

/**
 * Initialize menu toggle functionality
 */
export function initMenu() {
  var trigger = qs('.nav-menu');
  var closeButton = qs('.site-menu-close');
  var sheet = qs('#site-menu');
  if (!trigger || !sheet) return;

  // The TOC's mobile trigger and drawer live on <body>, outside the page
  // wrapper, and are created later by post.js; query them on each open.
  function setBackgroundInert(isInert) {
    var background = qsa('.nav-header, .page-wrapper, .toc-mobile-trigger, .toc-mobile-overlay, .toc-mobile-drawer');
    Array.prototype.forEach.call(background, function(el) {
      if (isInert) {
        el.setAttribute('inert', '');
      } else {
        el.removeAttribute('inert');
      }
    });
  }

  function open(pointer) {
    docEl.classList.add('menu-active');
    trigger.setAttribute('aria-expanded', 'true');
    setBackgroundInert(true);
    openDialog(sheet, { trigger: trigger, onClose: close, pointer: pointer });
  }

  function close(pointer) {
    docEl.classList.remove('menu-active');
    trigger.setAttribute('aria-expanded', 'false');
    setBackgroundInert(false);
    closeDialog(sheet, { pointer: pointer });
  }

  trigger.addEventListener('click', function(event) {
    event.preventDefault();
    if (docEl.classList.contains('menu-active')) {
      close(isPointerClick(event));
    } else {
      open(isPointerClick(event));
    }
  });

  if (closeButton) {
    closeButton.addEventListener('click', function(event) {
      event.preventDefault();
      close(isPointerClick(event));
    });
  }

  // Close on navigation (a link inside the sheet was followed) and on
  // viewport changes that make the mobile sheet no longer applicable.
  sheet.addEventListener('click', function(event) {
    if (event.target.closest('a')) close(isPointerClick(event));
  });

  window.addEventListener('resize', function() {
    if (docEl.classList.contains('menu-active')) close();
  });

  // Coming back through the back/forward cache restores the page frozen
  // with the sheet still open.
  window.addEventListener('pageshow', function(event) {
    if (event.persisted && docEl.classList.contains('menu-active')) close(true);
  });
}
