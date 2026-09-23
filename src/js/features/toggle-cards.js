/**
 * Toggle Card Accessibility
 * Ghost core's own cards.min.js drives the open/close interaction via a
 * `data-kg-toggle-state` attribute but never sets aria-expanded/aria-controls,
 * so the trigger's state is never announced. Sync it here instead of
 * reimplementing the toggle behavior itself.
 */
import { qsa, each } from '../core/index.js';

export function initToggleCards(container) {
  var cards = qsa('.kg-toggle-card', container || document);
  if (!cards.length) return;

  each(cards, function(card, index) {
    var heading = card.querySelector('.kg-toggle-heading');
    var content = card.querySelector('.kg-toggle-content');
    if (!heading || !content) return;

    if (!content.id) content.id = 'kg-toggle-content-' + index;
    heading.setAttribute('aria-controls', content.id);

    function sync() {
      var isOpen = card.getAttribute('data-kg-toggle-state') === 'open';
      heading.setAttribute('aria-expanded', String(isOpen));
    }

    sync();
    new MutationObserver(sync).observe(card, {
      attributes: true,
      attributeFilter: ['data-kg-toggle-state']
    });
  });
}
