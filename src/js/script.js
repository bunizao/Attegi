document.addEventListener("DOMContentLoaded", function() {
  var documentElement = document.documentElement;
  var menuButton = document.getElementById("menu");
  var navMenu = document.querySelector(".nav-menu");
  var navClose = document.querySelector(".nav-close");

  function setMenuState(isOpen) {
    documentElement.classList.toggle("menu-active", isOpen);
    if (navMenu) {
      navMenu.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }
    if (navClose) {
      navClose.setAttribute("aria-hidden", isOpen ? "false" : "true");
    }
  }

  function toggleMenu(event) {
    if (event && event.type === "keydown" && event.key !== "Enter" && event.key !== " ") {
      return;
    }
    if (event) {
      event.preventDefault();
    }
    var isOpen = documentElement.classList.contains("menu-active");
    setMenuState(!isOpen);
  }

  // Add click/keyboard listeners to menu elements
  if (menuButton) {
    menuButton.addEventListener("click", toggleMenu);
    menuButton.addEventListener("keydown", toggleMenu);
  }

  if (navMenu) {
    navMenu.addEventListener("click", toggleMenu);
    navMenu.addEventListener("keydown", toggleMenu);
  }

  if (navClose) {
    navClose.addEventListener("click", toggleMenu);
    navClose.addEventListener("keydown", toggleMenu);
  }

  setMenuState(documentElement.classList.contains("menu-active"));
  documentElement.classList.add("menu-ready");

  // Close menu on window resize
  window.addEventListener("resize", function() {
    setMenuState(false);
  });

  // Close menu on orientation change
  window.addEventListener("orientationchange", function() {
    setMenuState(false);
  });

/* ==========================================================================
   Parallax cover
   ========================================================================== */

  var cover = document.querySelector('.cover');
  var coverImage = cover ? cover.querySelector('img') : null;
  var coverPosition = 0;
  var coverHeight = cover ? cover.offsetHeight : 0;
  var ticking = false;
  var coverPreActive = documentElement.classList.contains('cover-active');

  function updateCoverMetrics() {
    if (!cover) return;
    coverHeight = cover.offsetHeight || 0;
  }

  function prlx() {
    if (!cover) return;
    if (!coverHeight) updateCoverMetrics();
    var windowPosition = window.pageYOffset;
    coverPosition = windowPosition > 0 ? Math.floor(windowPosition * 0.25) : 0;
    cover.style.transform = 'translate3d(0, ' + coverPosition + 'px, 0)';
    var withinCover = coverHeight ? window.pageYOffset < coverHeight : coverPreActive;
    documentElement.classList.toggle('cover-active', withinCover);
  }

  function requestPrlx() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function() {
      prlx();
      ticking = false;
    });
  }

  updateCoverMetrics();
  prlx();

  if (coverImage) {
    coverImage.addEventListener('load', function () {
      updateCoverMetrics();
      prlx();
    });
  }

  window.addEventListener('scroll', requestPrlx, { passive: true });
  window.addEventListener('resize', function() {
    updateCoverMetrics();
    requestPrlx();
  }, { passive: true });
  window.addEventListener('orientationchange', function() {
    updateCoverMetrics();
    requestPrlx();
  }, { passive: true });

/* ==========================================================================
   Gallery
   ========================================================================== */

  function gallery() {
    'use strict';
    var images = document.querySelectorAll('.kg-gallery-image img');
    images.forEach(function(image) {
      var container = image.closest('.kg-gallery-image');
      var width = image.attributes.width.value;
      var height = image.attributes.height.value;
      var ratio = width / height;
      container.style.flex = ratio + ' 1 0%';
    });
  }
  gallery();

/* ==========================================================================
   Theme
   ========================================================================== */

  function theme() {
    'use strict';
    var toggle = document.querySelector('.js-theme');
    var toggleText = toggle ? toggle.querySelector('.theme-text') : null;
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    function system() {
      documentElement.classList.remove('theme-dark', 'theme-light');
      if (prefersDark) {
        documentElement.classList.add('theme-dark');
      }
      localStorage.setItem('attegi_theme', 'system');
      if (toggleText) {
        toggleText.textContent = toggle.getAttribute('data-system');
      }
    }

    function dark() {
      documentElement.classList.remove('theme-light');
      documentElement.classList.add('theme-dark');
      localStorage.setItem('attegi_theme', 'dark');
      if (toggleText) {
        toggleText.textContent = toggle.getAttribute('data-dark');
      }
    }

    function light() {
      documentElement.classList.remove('theme-dark');
      documentElement.classList.add('theme-light');
      localStorage.setItem('attegi_theme', 'light');
      if (toggleText) {
        toggleText.textContent = toggle.getAttribute('data-light');
      }
    }

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

    if (toggle) {
      toggle.addEventListener('click', function (e) {
        e.preventDefault();

        if (!documentElement.classList.contains('theme-dark') && !documentElement.classList.contains('theme-light')) {
          dark();
        } else if (documentElement.classList.contains('theme-dark')) {
          light();
        } else {
          system();
        }
      });
    }
  }
  theme();

/* ==========================================================================
   Lazy load Ghost Portal
   ========================================================================== */

  (function lazyLoadPortal() {
    'use strict';

    // Check if members are enabled
    if (!document.querySelector('[data-portal]')) return;

    var portalButtons = document.querySelectorAll('[data-portal]');
    var portalLoaded = false;
    var portalLoading = false;
    var portalUrl = window.ghost && window.ghost.portal ? window.ghost.portal : null;

    function loadPortalScript() {
      if (portalLoaded || portalLoading || !portalUrl) return;
      portalLoading = true;

      var script = document.createElement('script');
      script.src = portalUrl;
      script.async = true;
      script.setAttribute('data-ghost', portalUrl);
      script.onload = function() {
        portalLoaded = true;
        portalLoading = false;
      };
      script.onerror = function() {
        portalLoading = false;
        console.error('Failed to load Ghost Portal');
      };
      document.body.appendChild(script);
    }

    // Add click listeners to all portal buttons
    portalButtons.forEach(function(button) {
      // Load on click
      button.addEventListener('click', function(e) {
        if (!portalLoaded && !portalLoading) {
          e.preventDefault();
          loadPortalScript();
          // Retry click after portal loads
          setTimeout(function() {
            button.click();
          }, 500);
        }
      }, { passive: false });

      // Preload on hover for better UX
      button.addEventListener('mouseenter', function() {
        loadPortalScript();
      }, { once: true, passive: true });

      // Preload on focus (keyboard navigation)
      button.addEventListener('focus', function() {
        loadPortalScript();
      }, { once: true, passive: true });
    });
  })();
});
