/**
 * Share Feature
 * Native Web Share API integration
 */

import { doc, qsa } from '../core/index.js';

/**
 * Initialize native share button
 */
export function setupShare() {
  var shareButton = doc.getElementById('share-button');
  if (!shareButton) return;

  if (!navigator.share) {
    shareButton.setAttribute('aria-hidden', 'true');
    shareButton.setAttribute('tabindex', '-1');
    shareButton.style.display = 'none';
    return;
  }

  shareButton.addEventListener('click', function(event) {
    event.preventDefault();
    navigator.share({
      title: doc.title,
      url: window.location.href
    })['catch'](function() {});
  });
}

/**
 * Open the default (Twitter/Facebook/LinkedIn) share links in a popup
 * window instead of a full navigation. Delegated via a click listener
 * rather than inline `onclick` attributes, which a strict CSP would block.
 */
export function setupSharePopups() {
  var links = qsa('.js-share-popup');
  if (!links.length) return;

  Array.prototype.forEach.call(links, function(link) {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      var size = (link.dataset.popupSize || '600,400').split(',');
      window.open(link.href, 'share-popup', 'width=' + size[0] + ',height=' + size[1]);
    });
  });
}
