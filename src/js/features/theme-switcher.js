/**
 * Theme Switcher Feature
 * Handles light/dark/system theme toggling with localStorage persistence
 */

import { qs, docEl } from '../core/index.js';

/**
 * Initialize theme switcher
 */
export function initThemeSwitcher() {
  var toggle = qs('.js-theme');
  var toggleText = toggle ? toggle.querySelector('.theme-text') : null;
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  function system() {
    requestAnimationFrame(function() {
      docEl.classList.remove('theme-dark', 'theme-light');
      if (prefersDark) {
        docEl.classList.add('theme-dark');
      }
      if (toggleText) {
        toggleText.textContent = toggle.getAttribute('data-system');
      }
    });
    localStorage.setItem('attegi_theme', 'system');
  }

  function dark() {
    requestAnimationFrame(function() {
      docEl.classList.remove('theme-light');
      docEl.classList.add('theme-dark');
      if (toggleText) {
        toggleText.textContent = toggle.getAttribute('data-dark');
      }
    });
    localStorage.setItem('attegi_theme', 'dark');
  }

  function light() {
    requestAnimationFrame(function() {
      docEl.classList.remove('theme-dark');
      docEl.classList.add('theme-light');
      if (toggleText) {
        toggleText.textContent = toggle.getAttribute('data-light');
      }
    });
    localStorage.setItem('attegi_theme', 'light');
  }

  // Apply saved theme
  switch (localStorage.getItem('attegi_theme')) {
    case 'dark':
      dark();
      break;
    case 'light':
      light();
      break;
    default:
      system();
      break;
  }

  // Toggle click handler
  if (toggle) {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();

      if (!docEl.classList.contains('theme-dark') && !docEl.classList.contains('theme-light')) {
        dark();
      } else if (docEl.classList.contains('theme-dark')) {
        light();
      } else {
        system();
      }
    });
  }
}
