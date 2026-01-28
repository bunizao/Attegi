/**
 * DOM Utilities
 * Shared DOM helper functions used across all modules
 */

/**
 * Execute callback when DOM is ready
 * @param {Function} fn - Callback to execute
 */
export function onReady(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
}

/**
 * Query selector shorthand
 * @param {string} selector - CSS selector
 * @param {Element} [context=document] - Context element
 * @returns {Element|null}
 */
export function qs(selector, context = document) {
  return context.querySelector(selector);
}

/**
 * Query selector all shorthand
 * @param {string} selector - CSS selector
 * @param {Element} [context=document] - Context element
 * @returns {NodeList}
 */
export function qsa(selector, context = document) {
  return context.querySelectorAll(selector);
}

/**
 * Iterate over NodeList with callback
 * @param {NodeList|Array} nodes - Nodes to iterate
 * @param {Function} callback - Callback function
 */
export function each(nodes, callback) {
  Array.prototype.forEach.call(nodes, callback);
}

/**
 * Document element reference
 */
export const docEl = document.documentElement;

/**
 * Document reference
 */
export const doc = document;
