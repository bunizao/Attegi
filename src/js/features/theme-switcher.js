/**
 * Theme Switcher Feature
 * Handles light/dark/system theme toggling with localStorage persistence.
 * A page can have more than one toggle button (footer + mobile menu); all
 * of them share state through the same `.theme-dark`/`.theme-light`/
 * `.theme-system` classes on <html>.
 */

import { qs, qsa, each, docEl } from '../core/index.js';

/**
 * Keep <meta name="theme-color"> in sync with the resolved theme.
 * Mirrors the same update the inline bootstrap script in default.hbs runs
 * before first paint.
 */
function updateThemeColor(isDark) {
  var color = isDark ? '#1D1F21' : '#FFFFFF';
  each(qsa('meta[name="theme-color"]'), function(meta) {
    meta.setAttribute('content', color);
  });
}

/**
 * Update every toggle button's accessible name to include the resolved
 * state, so a screen reader user hears confirmation after activating it.
 */
function updateToggleLabels(toggles, stateLabel) {
  var base = toggles.length ? toggles[0].getAttribute('data-label') : '';
  each(toggles, function(toggle) {
    toggle.setAttribute('aria-label', base + ': ' + stateLabel);
  });
}

/**
 * Initialize theme switcher
 */
export function initThemeSwitcher() {
  var toggles = qsa('.js-theme');
  if (!toggles.length) return;

  // Cache the static aria-label ("Toggle theme") once, before it gets
  // rewritten to include the current state.
  each(toggles, function(toggle) {
    if (!toggle.getAttribute('data-label')) {
      toggle.setAttribute('data-label', toggle.getAttribute('aria-label'));
    }
  });

  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  function apply(mode) {
    docEl.classList.remove('theme-dark', 'theme-light', 'theme-system');
    var dark = mode === 'dark' || (mode === 'system' && prefersDark);
    docEl.classList.add(dark ? 'theme-dark' : 'theme-light');
    if (mode === 'system') docEl.classList.add('theme-system');
    updateThemeColor(dark);
    updateToggleLabels(toggles, toggles[0].getAttribute('data-' + mode));
    localStorage.setItem('attegi_theme', mode);
  }

  // Apply saved theme
  var stored = localStorage.getItem('attegi_theme');
  apply(stored === 'dark' || stored === 'light' ? stored : 'system');

  // Cycle: system -> dark -> light -> system
  each(toggles, function(toggle) {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      var current = localStorage.getItem('attegi_theme') || 'system';
      apply(current === 'system' ? 'dark' : current === 'dark' ? 'light' : 'system');
    });
  });
}
