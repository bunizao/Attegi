/**
 * Internationalization Helper
 * Retrieves translated strings from data attributes on body element
 */

/**
 * Get internationalized string from body data attribute
 * @param {string} key - The i18n key (without 'data-i18n-' prefix)
 * @param {string} fallback - Fallback value if key not found
 * @returns {string}
 */
export function getI18n(key, fallback) {
  var body = document.body;
  if (!body) return fallback;
  var value = body.getAttribute('data-i18n-' + key);
  return value || fallback;
}
