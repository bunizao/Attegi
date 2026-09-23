/**
 * Shared Scroll Source
 * A single passive scroll/resize listener, batched with requestAnimationFrame
 * and fanned out to subscribers, so features don't each attach their own
 * listener and recompute layout independently.
 */
import { docEl } from './dom.js';

var callbacks = [];
var ticking = false;
var started = false;

function tick() {
  ticking = false;
  callbacks.forEach(function(callback) { callback(); });
}

function requestTick() {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(tick);
}

function start() {
  if (started) return;
  started = true;
  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick, { passive: true });
  window.addEventListener('orientationchange', requestTick, { passive: true });
}

/**
 * Subscribe to the shared scroll/resize tick. Calls back immediately once,
 * then on every batched scroll/resize/orientation change.
 * @param {Function} callback
 * @returns {Function} unsubscribe
 */
export function onScroll(callback) {
  start();
  callbacks.push(callback);
  callback();
  return function unsubscribe() {
    callbacks = callbacks.filter(function(cb) { return cb !== callback; });
  };
}

/**
 * Reading progress of `content`, measured as how far the viewport's vertical
 * middle has crossed the element's top-to-bottom span. Shared by the
 * progress bar, back-to-top ring and TOC trigger ring so they agree.
 *
 * Not clamped above 1: callers that only need "how far through" clamp to
 * `Math.min(progress, 1)` themselves; the progress bar uses the overshoot
 * past 1 to trigger its "complete" state.
 * @param {Element} content
 * @returns {number} 0 at the top, 1 when the viewport middle reaches the
 *   content's bottom edge, and above 1 once scrolled past it.
 */
export function getReadingProgress(content) {
  var rect = content.getBoundingClientRect();
  var scrollY = window.pageYOffset || docEl.scrollTop;
  var contentTop = rect.top + scrollY;
  var contentHeight = rect.height;
  if (contentHeight <= 0) return 0;

  var viewportMiddle = scrollY + window.innerHeight / 2;
  return Math.max(0, (viewportMiddle - contentTop) / contentHeight);
}
