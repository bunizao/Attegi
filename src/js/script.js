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

  function updateCoverMetrics() {
    if (!cover) return;
    var measured = cover.getBoundingClientRect().height || cover.offsetHeight || 0;
    if (!measured && coverImage && coverImage.naturalWidth) {
      var ratio = coverImage.naturalHeight / coverImage.naturalWidth;
      measured = cover.clientWidth * ratio;
    }
    coverHeight = measured || coverHeight;
  }

  function prlx() {
    if (!cover) return;
    if (!coverHeight) {
      updateCoverMetrics();
    }
    var windowPosition = window.pageYOffset;
    coverPosition = windowPosition > 0 ? Math.floor(windowPosition * 0.25) : 0;
    cover.style.transform = 'translate3d(0, ' + coverPosition + 'px, 0)';
    if (window.pageYOffset < coverHeight) {
      documentElement.classList.add('cover-active');
    } else {
      documentElement.classList.remove('cover-active');
    }
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

  if (cover) {
    documentElement.classList.add('cover-active');
  }

  if (coverImage) {
    if (coverImage.complete) {
      updateCoverMetrics();
      prlx();
    } else {
      coverImage.addEventListener('load', function () {
        updateCoverMetrics();
        prlx();
      }, { once: true });
    }
    setTimeout(function () {
      updateCoverMetrics();
      prlx();
    }, 300);
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
});
