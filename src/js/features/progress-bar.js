/**
 * Progress Bar Feature
 * Shows reading progress based on scroll position
 */

import { qs } from '../core/index.js';
import { onScroll, getReadingProgress } from '../core/scroll.js';

/**
 * Initialize reading progress bar
 * @param {Element} content - Post content element
 */
export function setupProgress(content) {
  var progressBar = qs('.progress-bar');
  var progressContainer = qs('.progress-container');
  if (!progressBar || !progressContainer || !content) return;

  onScroll(function() {
    var progress = getReadingProgress(content);
    progressBar.style.width = Math.min(progress, 1) * 100 + '%';
    progressContainer.classList.toggle('complete', progress > 1);
  });
}
