/**
 * Menu Toggle Feature
 * Handles mobile navigation menu open/close
 */

import { qs, docEl } from '../core/index.js';

/**
 * Initialize menu toggle functionality
 */
export function initMenu() {
  var menuButton = document.getElementById('menu');
  var navMenu = qs('.nav-menu');
  var navClose = qs('.nav-close');

  function setMenuState(isOpen) {
    requestAnimationFrame(function() {
      docEl.classList.toggle('menu-active', isOpen);
      if (navMenu) {
        navMenu.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      }
      if (navClose) {
        navClose.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      }
    });
  }

  function toggleMenu(event) {
    if (event && event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') {
      return;
    }
    if (event) {
      event.preventDefault();
    }
    var isOpen = docEl.classList.contains('menu-active');
    setMenuState(!isOpen);
  }

  // Add click/keyboard listeners
  if (menuButton) {
    menuButton.addEventListener('click', toggleMenu);
    menuButton.addEventListener('keydown', toggleMenu);
  }

  if (navMenu) {
    navMenu.addEventListener('click', toggleMenu);
    navMenu.addEventListener('keydown', toggleMenu);
  }

  if (navClose) {
    navClose.addEventListener('click', toggleMenu);
    navClose.addEventListener('keydown', toggleMenu);
  }

  setMenuState(docEl.classList.contains('menu-active'));
  docEl.classList.add('menu-ready');

  // Close menu on window resize/orientation change
  window.addEventListener('resize', function() {
    setMenuState(false);
  });

  window.addEventListener('orientationchange', function() {
    setMenuState(false);
  });
}
