document.addEventListener("DOMContentLoaded", function() {
  var documentElement = document.documentElement;
  var menuButton = document.getElementById("menu");
  var navMenu = document.querySelector(".nav-menu");
  var navClose = document.querySelector(".nav-close");

  function setMenuState(isOpen) {
    // Use RAF to batch DOM operations and sync with browser repaint
    requestAnimationFrame(function() {
      documentElement.classList.toggle("menu-active", isOpen);
      if (navMenu) {
        navMenu.setAttribute("aria-expanded", isOpen ? "true" : "false");
      }
      if (navClose) {
        navClose.setAttribute("aria-hidden", isOpen ? "false" : "true");
      }
    });
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
   Sticky Logo
   ========================================================================== */

  (function initStickyLogo() {
    var navHeader = document.querySelector('.nav-header');
    var originalLogo = document.querySelector('.nav-header .logo');
    if (!originalLogo) return;

    // Create sticky logo element
    var stickyLogo = document.createElement('div');
    stickyLogo.className = 'sticky-logo';
    stickyLogo.innerHTML = originalLogo.innerHTML;
    document.body.appendChild(stickyLogo);

    var scrollThreshold = 100; // Show after scrolling 100px
    var isVisible = false;
    var stickyTicking = false;

    function updateStickyLogo() {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;
      var shouldShow = scrollY > scrollThreshold;

      if (shouldShow !== isVisible) {
        isVisible = shouldShow;
        requestAnimationFrame(function() {
          stickyLogo.classList.toggle('is-visible', isVisible);
        });
      }
    }

    function requestStickyUpdate() {
      if (stickyTicking) return;
      stickyTicking = true;
      requestAnimationFrame(function() {
        updateStickyLogo();
        stickyTicking = false;
      });
    }

    window.addEventListener('scroll', requestStickyUpdate, { passive: true });
    updateStickyLogo(); // Initial check
  })();

/* ==========================================================================
   Gallery
   ========================================================================== */

  function gallery() {
    'use strict';
    var images = document.querySelectorAll('.kg-gallery-image img');
    // Batch all style changes in a single RAF to avoid multiple reflows
    requestAnimationFrame(function() {
      Array.prototype.forEach.call(images, function(image) {
        function getNumericValue(value) {
          if (!value) return null;
          var numberValue = parseFloat(value);
          if (isNaN(numberValue)) return null;
          return numberValue > 0 ? numberValue : null;
        }

        function getImageRatio(img) {
          var widthAttr = getNumericValue(img.getAttribute('width'));
          var heightAttr = getNumericValue(img.getAttribute('height'));
          if (widthAttr && heightAttr) return widthAttr / heightAttr;
          if (img.naturalWidth && img.naturalHeight) {
            return img.naturalWidth / img.naturalHeight;
          }
          return null;
        }

        function applyRatio(img) {
          var container = img.closest('.kg-gallery-image');
          if (!container) return;
          var ratio = getImageRatio(img);
          if (!ratio) return;
          container.style.flex = ratio + ' 1 0%';
        }

        if (image.complete && image.naturalWidth > 0) {
          applyRatio(image);
        } else {
          var onLoad = function () {
            applyRatio(image);
            image.removeEventListener('load', onLoad);
          };
          image.addEventListener('load', onLoad);
        }
      });
    });
  }

  // Defer gallery calculation to next event loop
  setTimeout(gallery, 0);

/* ==========================================================================
   Theme
   ========================================================================== */

  function theme() {
    'use strict';
    var toggle = document.querySelector('.js-theme');
    var toggleText = toggle ? toggle.querySelector('.theme-text') : null;
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    function system() {
      // Use RAF to batch theme changes and sync with browser repaint
      requestAnimationFrame(function() {
        documentElement.classList.remove('theme-dark', 'theme-light');
        if (prefersDark) {
          documentElement.classList.add('theme-dark');
        }
        if (toggleText) {
          toggleText.textContent = toggle.getAttribute('data-system');
        }
      });
      localStorage.setItem('attegi_theme', 'system');
    }

    function dark() {
      // Use RAF to batch theme changes and sync with browser repaint
      requestAnimationFrame(function() {
        documentElement.classList.remove('theme-light');
        documentElement.classList.add('theme-dark');
        if (toggleText) {
          toggleText.textContent = toggle.getAttribute('data-dark');
        }
      });
      localStorage.setItem('attegi_theme', 'dark');
    }

    function light() {
      // Use RAF to batch theme changes and sync with browser repaint
      requestAnimationFrame(function() {
        documentElement.classList.remove('theme-dark');
        documentElement.classList.add('theme-light');
        if (toggleText) {
          toggleText.textContent = toggle.getAttribute('data-light');
        }
      });
      localStorage.setItem('attegi_theme', 'light');
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

  // Defer theme toggle setup to next event loop (theme is already set in <head>)
  setTimeout(theme, 0);

});
