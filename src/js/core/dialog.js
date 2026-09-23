/**
 * Dialog Helper
 * Minimal focus-trap / escape / restore behavior for modal overlays
 * (mobile menu, TOC drawer). Not a generic modal system: callers own
 * their own open/close CSS and state classes, this only manages focus.
 */

import { qsa } from './dom.js';

var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), ' +
  'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Open a dialog: move focus in, trap Tab, close on Escape.
 * @param {Element} dialogEl - The dialog container to trap focus within
 * @param {Object} [options]
 * @param {Element} [options.trigger] - Element to restore focus to on close
 * @param {Function} [options.onClose] - Called when Escape is pressed
 */
export function openDialog(dialogEl, options) {
  options = options || {};
  var trigger = options.trigger || document.activeElement;
  var onClose = options.onClose;

  function focusable() {
    return qsa(FOCUSABLE, dialogEl);
  }

  function onKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      if (onClose) onClose();
      return;
    }
    if (event.key !== 'Tab') return;

    var items = focusable();
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  dialogEl.addEventListener('keydown', onKeydown);
  dialogEl._dialogKeydown = onKeydown;
  dialogEl._dialogTrigger = trigger;

  var items = focusable();
  (items[0] || dialogEl).focus();
}

/**
 * Tear down the listener set up by openDialog and restore focus
 * to whatever triggered the dialog.
 * @param {Element} dialogEl
 */
export function closeDialog(dialogEl) {
  if (dialogEl._dialogKeydown) {
    dialogEl.removeEventListener('keydown', dialogEl._dialogKeydown);
    delete dialogEl._dialogKeydown;
  }
  var trigger = dialogEl._dialogTrigger;
  delete dialogEl._dialogTrigger;
  if (trigger && typeof trigger.focus === 'function') {
    trigger.focus();
  }
}
