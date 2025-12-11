/**
 * Table of Contents - Using tocbot
 * Automatically generates TOC from post headings with scroll spy
 */
(function () {
  'use strict';

  var doc = document;
  var win = window;

  // Configuration
  var config = {
    minHeadings: 2,
    tocBreakpoint: 1400
  };

  // State
  var state = {
    isOpen: false,
    isVisible: false,
    articleTop: 0,
    articleBottom: 0
  };

  // DOM Elements
  var elements = {
    sidebar: null,
    mobileTrigger: null,
    mobileOverlay: null,
    mobileDrawer: null,
    mobileList: null
  };

  /**
   * Initialize TOC
   */
  function init() {
    var postContent = doc.querySelector('.post-content');
    if (!postContent) return;

    // Check if there are enough headings
    var headings = postContent.querySelectorAll('h2, h3, h4');
    if (headings.length < config.minHeadings) return;

    // Create TOC elements
    createTOCElements();

    // Initialize tocbot for desktop only
    if (typeof tocbot !== 'undefined') {
      tocbot.init({
        tocSelector: '.toc-list',
        contentSelector: '.post-content',
        headingSelector: 'h2, h3, h4',
        ignoreSelector: '.js-toc-ignore, .gh-post-upgrade-cta h2',
        hasInnerContainers: true,
        linkClass: 'toc-link',
        activeLinkClass: 'is-active',
        listClass: 'toc-list',
        listItemClass: 'toc-item',
        activeListItemClass: 'is-active-li',
        collapseDepth: 6,
        scrollSmooth: true,
        scrollSmoothOffset: -100,
        headingsOffset: 100,
        throttleTimeout: 50,
        orderedList: false,
        onClick: function(e) {
          // Close mobile drawer if open
          if (state.isOpen) {
            closeMobileTOC();
          }
        }
      });

      // Copy TOC content to mobile after tocbot generates it
      setTimeout(function() {
        copyTocToMobile();
      }, 100);

      // Setup auto-scroll for TOC sidebar
      setupTOCAutoScroll();
    }

    // Setup event listeners
    setupEventListeners();

    // Calculate article boundaries for TOC visibility
    calculateArticleBounds();

    // Initial visibility check
    updateTOCVisibility();

    // Add class to body
    doc.body.classList.add('has-toc');

    // Show mobile trigger after a short delay
    setTimeout(function() {
      if (elements.mobileTrigger) {
        elements.mobileTrigger.classList.add('is-visible');
      }
    }, 500);
  }

  /**
   * Setup auto-scroll for TOC sidebar when active item changes
   * Uses MutationObserver to detect when tocbot changes the active class
   */
  function setupTOCAutoScroll() {
    var tocList = doc.querySelector('.toc-sidebar .toc-list');
    if (!tocList || !elements.sidebar) return;

    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          var target = mutation.target;
          if (target.classList.contains('is-active') && target.classList.contains('toc-link')) {
            scrollTOCToActiveItem(target);
          }
        }
      });
    });

    observer.observe(tocList, {
      attributes: true,
      subtree: true,
      attributeFilter: ['class']
    });
  }

  /**
   * Scroll TOC sidebar to center the active item
   */
  function scrollTOCToActiveItem(activeLink) {
    if (!elements.sidebar || !activeLink) return;

    var sidebar = elements.sidebar;
    var sidebarRect = sidebar.getBoundingClientRect();
    var linkRect = activeLink.getBoundingClientRect();

    // Calculate the link's position relative to the sidebar
    var linkTop = linkRect.top - sidebarRect.top + sidebar.scrollTop;
    var linkHeight = linkRect.height;
    var sidebarHeight = sidebarRect.height;

    // Calculate scroll position to center the active item
    var targetScroll = linkTop - (sidebarHeight / 2) + (linkHeight / 2);

    // Clamp to valid scroll range
    var maxScroll = sidebar.scrollHeight - sidebarHeight;
    targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));

    // Smooth scroll to the target position
    sidebar.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  }

  /**
   * Copy desktop TOC content to mobile TOC
   */
  function copyTocToMobile() {
    var desktopList = doc.querySelector('.toc-sidebar .toc-list');
    if (!desktopList || !elements.mobileList) return;

    // Clone the content
    var clone = desktopList.cloneNode(true);

    // Replace classes for mobile styling
    clone.className = 'toc-mobile-list';

    // Update all nested elements
    var items = clone.querySelectorAll('.toc-item');
    items.forEach(function(item) {
      item.className = item.className.replace('toc-item', 'toc-mobile-item');
    });

    var links = clone.querySelectorAll('.toc-link');
    links.forEach(function(link) {
      link.className = link.className.replace('toc-link', 'toc-mobile-link');
      // Add click handler
      link.addEventListener('click', function(e) {
        e.preventDefault();
        var href = link.getAttribute('href');
        var targetId = href.substring(1);
        var target = doc.getElementById(targetId);
        if (target) {
          closeMobileTOC();
          setTimeout(function() {
            var offsetTop = target.getBoundingClientRect().top + win.pageYOffset - 100;
            win.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });
          }, 300);
        }
      });
    });

    var nestedLists = clone.querySelectorAll('.toc-list');
    nestedLists.forEach(function(list) {
      list.className = list.className.replace('toc-list', 'toc-mobile-list');
    });

    // Replace mobile list content
    elements.mobileList.innerHTML = '';
    while (clone.firstChild) {
      elements.mobileList.appendChild(clone.firstChild);
    }
  }

  /**
   * Sync active state from desktop to mobile
   */
  function syncMobileActiveState() {
    if (!elements.mobileList) return;

    // Get active link from desktop
    var activeDesktopLink = doc.querySelector('.toc-sidebar .toc-link.is-active');
    var activeHref = activeDesktopLink ? activeDesktopLink.getAttribute('href') : null;

    // Update mobile links
    var mobileLinks = elements.mobileList.querySelectorAll('.toc-mobile-link');
    mobileLinks.forEach(function(link) {
      if (activeHref && link.getAttribute('href') === activeHref) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });
  }

  /**
   * Create TOC DOM elements
   */
  function createTOCElements() {
    // Create desktop sidebar
    createDesktopTOC();

    // Create mobile TOC
    createMobileTOC();
  }

  /**
   * Create desktop sidebar TOC
   */
  function createDesktopTOC() {
    var sidebar = doc.createElement('aside');
    sidebar.className = 'toc-sidebar';
    sidebar.setAttribute('aria-label', 'Table of Contents');

    var container = doc.createElement('div');
    container.className = 'toc-container';

    // Header
    var header = doc.createElement('div');
    header.className = 'toc-header';
    header.innerHTML = '<h3 class="toc-title">On this page</h3>';

    // List - tocbot will populate this
    var list = doc.createElement('nav');
    list.className = 'toc-list';

    container.appendChild(header);
    container.appendChild(list);
    sidebar.appendChild(container);

    // Append to body for fixed positioning
    doc.body.appendChild(sidebar);

    elements.sidebar = sidebar;
  }

  /**
   * Create mobile TOC (trigger button, overlay, drawer)
   */
  function createMobileTOC() {
    // Trigger button
    var trigger = doc.createElement('button');
    trigger.className = 'toc-mobile-trigger';
    trigger.setAttribute('aria-label', 'Open table of contents');
    trigger.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<line x1="8" y1="6" x2="21" y2="6"></line>' +
        '<line x1="8" y1="12" x2="21" y2="12"></line>' +
        '<line x1="8" y1="18" x2="21" y2="18"></line>' +
        '<line x1="3" y1="6" x2="3.01" y2="6"></line>' +
        '<line x1="3" y1="12" x2="3.01" y2="12"></line>' +
        '<line x1="3" y1="18" x2="3.01" y2="18"></line>' +
      '</svg>';

    // Overlay
    var overlay = doc.createElement('div');
    overlay.className = 'toc-mobile-overlay';

    // Drawer
    var drawer = doc.createElement('div');
    drawer.className = 'toc-mobile-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-label', 'Table of Contents');

    // Drawer handle
    var handle = doc.createElement('div');
    handle.className = 'toc-mobile-handle';

    // Drawer header
    var header = doc.createElement('div');
    header.className = 'toc-mobile-header';
    header.innerHTML =
      '<h3 class="toc-mobile-title">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<line x1="8" y1="6" x2="21" y2="6"></line>' +
          '<line x1="8" y1="12" x2="21" y2="12"></line>' +
          '<line x1="8" y1="18" x2="21" y2="18"></line>' +
          '<line x1="3" y1="6" x2="3.01" y2="6"></line>' +
          '<line x1="3" y1="12" x2="3.01" y2="12"></line>' +
          '<line x1="3" y1="18" x2="3.01" y2="18"></line>' +
        '</svg>' +
        'On this page' +
      '</h3>';

    // Close button
    var closeBtn = doc.createElement('button');
    closeBtn.className = 'toc-mobile-close';
    closeBtn.setAttribute('aria-label', 'Close table of contents');
    closeBtn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<line x1="18" y1="6" x2="6" y2="18"></line>' +
        '<line x1="6" y1="6" x2="18" y2="18"></line>' +
      '</svg>';
    header.appendChild(closeBtn);

    // Content
    var content = doc.createElement('div');
    content.className = 'toc-mobile-content';

    // List - will be populated by copying from desktop
    var list = doc.createElement('nav');
    list.className = 'toc-mobile-list';

    content.appendChild(list);
    drawer.appendChild(handle);
    drawer.appendChild(header);
    drawer.appendChild(content);

    doc.body.appendChild(trigger);
    doc.body.appendChild(overlay);
    doc.body.appendChild(drawer);

    elements.mobileTrigger = trigger;
    elements.mobileOverlay = overlay;
    elements.mobileDrawer = drawer;
    elements.mobileList = list;
  }

  /**
   * Calculate article content boundaries
   */
  function calculateArticleBounds() {
    var postContent = doc.querySelector('.post-content');
    if (postContent) {
      var rect = postContent.getBoundingClientRect();
      state.articleTop = rect.top + win.pageYOffset;
      state.articleBottom = rect.bottom + win.pageYOffset;
    }
  }

  /**
   * Update TOC visibility based on scroll position
   */
  function updateTOCVisibility() {
    if (!elements.sidebar) return;

    var scrollTop = win.pageYOffset || doc.documentElement.scrollTop;
    var viewportHeight = win.innerHeight;

    // Recalculate article bounds
    var postContent = doc.querySelector('.post-content');
    if (postContent) {
      var rect = postContent.getBoundingClientRect();
      state.articleTop = rect.top + scrollTop;
      state.articleBottom = rect.bottom + scrollTop;
    }

    // TOC should be visible when in article content area
    var showStart = state.articleTop - 100;
    var showEnd = state.articleBottom - viewportHeight + 100;
    var shouldShow = scrollTop >= showStart && scrollTop <= showEnd;

    if (shouldShow !== state.isVisible) {
      state.isVisible = shouldShow;
      if (shouldShow) {
        elements.sidebar.classList.add('is-visible');
      } else {
        elements.sidebar.classList.remove('is-visible');
      }
    }

    // Sync mobile active state
    syncMobileActiveState();
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners() {
    // Scroll visibility and sync
    var throttledUpdate = throttle(function() {
      updateTOCVisibility();
    }, 100);
    win.addEventListener('scroll', throttledUpdate, { passive: true });
    win.addEventListener('resize', throttledUpdate, { passive: true });

    // Mobile trigger
    elements.mobileTrigger.addEventListener('click', openMobileTOC);

    // Mobile overlay click
    elements.mobileOverlay.addEventListener('click', closeMobileTOC);

    // Mobile close button
    var closeBtn = elements.mobileDrawer.querySelector('.toc-mobile-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeMobileTOC);
    }

    // Escape key to close mobile TOC
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && state.isOpen) {
        closeMobileTOC();
      }
    });

    // Handle swipe down to close
    setupSwipeToClose();
  }

  /**
   * Open mobile TOC
   */
  function openMobileTOC() {
    // Sync active state before opening
    syncMobileActiveState();

    state.isOpen = true;
    doc.body.classList.add('toc-open');
    elements.mobileOverlay.classList.add('is-open');
    elements.mobileDrawer.classList.add('is-open');
    elements.mobileTrigger.setAttribute('aria-expanded', 'true');
  }

  /**
   * Close mobile TOC
   */
  function closeMobileTOC() {
    state.isOpen = false;
    doc.body.classList.remove('toc-open');
    elements.mobileOverlay.classList.remove('is-open');
    elements.mobileDrawer.classList.remove('is-open');
    elements.mobileTrigger.setAttribute('aria-expanded', 'false');
  }

  /**
   * Setup swipe down to close mobile drawer
   */
  function setupSwipeToClose() {
    var drawer = elements.mobileDrawer;
    var handle = drawer.querySelector('.toc-mobile-handle');
    if (!handle) return;

    var startY = 0;
    var currentY = 0;
    var isDragging = false;

    handle.addEventListener('touchstart', function (e) {
      startY = e.touches[0].clientY;
      isDragging = true;
    }, { passive: true });

    handle.addEventListener('touchmove', function (e) {
      if (!isDragging) return;
      currentY = e.touches[0].clientY;
      var diff = currentY - startY;

      if (diff > 0) {
        drawer.style.transform = 'translateY(' + diff + 'px)';
      }
    }, { passive: true });

    handle.addEventListener('touchend', function () {
      if (!isDragging) return;
      isDragging = false;

      var diff = currentY - startY;
      drawer.style.transform = '';

      if (diff > 100) {
        closeMobileTOC();
      }
    }, { passive: true });
  }

  /**
   * Throttle function
   */
  function throttle(fn, delay) {
    var lastCall = 0;
    var timeout = null;

    return function () {
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
        timeout = setTimeout(function () {
          lastCall = Date.now();
          timeout = null;
          fn();
        }, remaining);
      }
    };
  }

  /**
   * Initialize when DOM is ready
   */
  function onReady(fn) {
    if (doc.readyState === 'loading') {
      doc.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  onReady(init);
})();
