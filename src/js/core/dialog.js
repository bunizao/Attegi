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

  var active = document.activeElement;
  if (event.shiftKey && (active === first || active === dialogEl)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

/**
 * True when a click came from a mouse or touch rather than Enter/Space on a
 * focused button (keyboard activation reports `detail === 0`).
 * @param {Event} [event]
 * @returns {boolean}
 */
export function isPointerClick(event) {
  return Boolean(event && event.type === 'click' && event.detail > 0);
}

/**
 * Open a dialog: moves focus in and starts trapping Tab/Escape. Keyboard
 * opens focus the first focusable element; pointer opens focus the dialog
 * itself, so screen readers still land inside but no focus ring flashes on
 * a control the user never tabbed to.
 * @param {Element} dialogEl
 * @param {{trigger?: Element, onClose?: Function, pointer?: boolean}} [options]
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
  if (options.pointer) {
    dialogEl.setAttribute('tabindex', '-1');
    retryFocus(dialogEl, 0);
  } else {
    focusFirstFocusable(dialogEl, 0);
  }
}

/**
 * Close a dialog opened with `openDialog`: stops the Tab trap and restores
 * focus to the element that opened it. Pointer closes drop focus instead:
 * a script-focused trigger shows a focus ring in WebKit after a tap.
 * @param {Element} dialogEl
 * @param {{pointer?: boolean}} [options]
 */
export function closeDialog(dialogEl, options) {
  if (dialogEl._dialogKeydown) {
    dialogEl.removeEventListener('keydown', dialogEl._dialogKeydown);
    dialogEl._dialogKeydown = null;
  }
  var trigger = dialogEl._dialogTrigger;
  dialogEl._dialogTrigger = null;
  if (options && options.pointer) {
    if (dialogEl.contains(document.activeElement)) document.activeElement.blur();
  } else if (trigger && typeof trigger.focus === 'function') {
    retryFocus(trigger, 0);
  }
}
