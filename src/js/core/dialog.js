/**
 * Dialog Focus Helper
 * Minimal open/close focus management for modal-style overlays (mobile menu,
 * TOC drawer): moves focus in, traps Tab inside, Escape closes, and restores
 * focus to the trigger on close.
 */

var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), ' +
  'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusable(dialogEl) {
  return Array.prototype.filter.call(
    dialogEl.querySelectorAll(FOCUSABLE),
    function(el) { return el.offsetParent !== null; }
  );
}

var MAX_FOCUS_ATTEMPTS = 10;

// Retry `el.focus()` across a few frames until it actually takes. Needed
// because a caller-driven `visibility: hidden <-> visible` CSS transition
// makes `.focus()` a silent no-op until the browser applies the new style,
// and that can take a few frames longer than a single rAF deferral.
function retryFocus(el, attempt) {
  el.focus();
  if (document.activeElement === el || attempt >= MAX_FOCUS_ATTEMPTS) return;
  requestAnimationFrame(function() {
    retryFocus(el, attempt + 1);
  });
}

function focusFirstFocusable(dialogEl, attempt) {
  var focusable = getFocusable(dialogEl);
  if (focusable.length) {
    retryFocus(focusable[0], attempt);
    return;
  }
  if (attempt < MAX_FOCUS_ATTEMPTS) {
    requestAnimationFrame(function() {
      focusFirstFocusable(dialogEl, attempt + 1);
    });
  } else {
    // Give up waiting for a focusable child; focus the dialog itself.
    dialogEl.setAttribute('tabindex', '-1');
    dialogEl.focus();
  }
}

function trapTab(dialogEl, event) {
  if (event.key !== 'Tab') return;
  var focusable = getFocusable(dialogEl);
  if (!focusable.length) return;

  var first = focusable[0];
  var last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

/**
 * Open a dialog: focuses its first focusable element and starts trapping
 * Tab/Escape. Store the returned trigger so `closeDialog` can restore focus.
 * @param {Element} dialogEl
 * @param {{trigger?: Element, onClose?: Function}} [options]
 */
export function openDialog(dialogEl, options) {
  options = options || {};
  var trigger = options.trigger || document.activeElement;

  function onKeydown(event) {
    if (event.key === 'Escape') {
      // Run the caller's close logic first: it typically un-hides the
      // trigger, which `closeDialog` then needs to be focusable again.
      if (options.onClose) options.onClose();
      closeDialog(dialogEl);
    } else {
      trapTab(dialogEl, event);
    }
  }

  dialogEl._dialogTrigger = trigger;
  dialogEl._dialogKeydown = onKeydown;
  dialogEl.addEventListener('keydown', onKeydown);

  // Callers typically add the "open" class in the same task that calls this,
  // and if that class transitions `visibility`, `.focus()` is a silent no-op
  // until the browser actually applies the new style. Neither a single
  // requestAnimationFrame nor a setTimeout(0) reliably lands after that:
  // retry across a few frames and confirm the focus actually landed, instead
  // of guessing how many frames the style flush takes.
  focusFirstFocusable(dialogEl, 0);
}

/**
 * Close a dialog opened with `openDialog`: stops the Tab trap and restores
 * focus to the element that opened it.
 * @param {Element} dialogEl
 */
export function closeDialog(dialogEl) {
  if (dialogEl._dialogKeydown) {
    dialogEl.removeEventListener('keydown', dialogEl._dialogKeydown);
    dialogEl._dialogKeydown = null;
  }
  var trigger = dialogEl._dialogTrigger;
  dialogEl._dialogTrigger = null;
  if (trigger && typeof trigger.focus === 'function') {
    retryFocus(trigger, 0);
  }
}
