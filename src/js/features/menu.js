/**
 * Menu Toggle Feature
 * Handles the mobile navigation sheet: open/close, focus trap, Escape.
 */

import { qs, docEl } from '../core/index.js';
import { openDialog, closeDialog, isPointerClick } from '../core/dialog.js';

/**
 * Initialize menu toggle functionality
 */
export function initMenu() {
  var trigger = qs('.nav-menu');
  var closeButton = qs('.site-menu-close');
  var sheet = qs('#site-menu');
  var background = [qs('.nav-header'), qs('.page-wrapper')];
  if (!trigger || !sheet) return;

  function setBackgroundInert(isInert) {
    background.forEach(function(el) {
      if (!el) return;
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
    if (event.target.tagName === 'A') close();
  });

  window.addEventListener('resize', function() {
    if (docEl.classList.contains('menu-active')) close();
  });
}
