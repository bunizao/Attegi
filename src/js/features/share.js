/**
 * Share Feature
 * Native Web Share API integration
 */

import { doc } from '../core/index.js';

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
