/**
 * Performance Utilities
 * Throttle, debounce, and RAF wrappers for optimized event handling
 */

/**
 * Throttle function execution
 * @param {Function} fn - Function to throttle
 * @param {number} delay - Minimum time between calls in ms
 * @returns {Function}
 */
export function throttle(fn, delay) {
  var lastCall = 0;
  var timeout = null;

  return function() {
    var now = Date.now();
    var remaining = delay - (now - lastCall);

    if (remaining <= 0) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      lastCall = now;
      fn();
    } else if (!timeout) {
      timeout = setTimeout(function() {
        lastCall = Date.now();
        timeout = null;
        fn();
      }, remaining);
    }
  };
}

/**
 * Debounce function execution
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in ms
 * @returns {Function}
 */
export function debounce(fn, delay) {
  var timeout = null;

  return function() {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(function() {
      timeout = null;
      fn();
    }, delay);
  };
}

/**
 * Request animation frame with ticking guard
 * @param {Function} fn - Function to execute in RAF
 * @returns {Function}
 */
export function raf(fn) {
  var ticking = false;

  return function() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function() {
      fn();
      ticking = false;
    });
  };
}
