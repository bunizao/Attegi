/**
 * Floating Site Menu
 * The popover opens and closes itself (Popover API). This only closes it
 * when one of its items is used, so Ghost's search and portal overlays are
 * not covered by a panel sitting in the top layer.
 */

import { qs } from '../core/index.js';

export function initFloatNav() {
  var panel = qs('#float-nav-panel');
  if (!panel || typeof panel.hidePopover !== 'function') return;

  panel.addEventListener('click', function(event) {
    if (event.target.closest('a, button')) panel.hidePopover();
  });
}
