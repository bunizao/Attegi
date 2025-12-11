/**
 * Table of Contents - Elegant Navigation
 * Automatically generates TOC from post headings with scroll spy
 */
(function () {
  'use strict';

  var doc = document;
  var win = window;

  // Configuration
  var config = {
    headingSelector: '.post-content h2, .post-content h3, .post-content h4',
    minHeadings: 2,
    scrollOffset: 100,
    throttleDelay: 100
  };

  // State
  var state = {
    headings: [],
    isOpen: false,
    activeIndex: -1,
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
    tocList: null,
    mobileTocList: null,
    links: [],
    mobileLinks: []
  };

  /**
   * Initialize TOC
   */
  function init() {
    var postContent = doc.querySelector('.post-content');
    if (!postContent) return;

    // Collect headings
    var headings = postContent.querySelectorAll(config.headingSelector);
    if (headings.length < config.minHeadings) return;

    // Process headings and add IDs
    state.headings = processHeadings(headings);
    if (state.headings.length < config.minHeadings) return;

    // Create TOC elements
    createTOC();

    // Setup event listeners
    setupEventListeners();

    // Calculate article boundaries for TOC visibility
    calculateArticleBounds();

    // Initial scroll spy update and visibility check
    updateScrollSpy();
    updateTOCVisibility();

    // Show mobile trigger after a short delay
    setTimeout(function() {
      if (elements.mobileTrigger) {
        elements.mobileTrigger.classList.add('is-visible');
      }
    }, 500);
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
   * Process headings and ensure they have IDs
   */
  function processHeadings(headings) {
    var processed = [];
    var usedIds = {};

    Array.prototype.forEach.call(headings, function (heading, index) {
      // Skip empty headings
      var text = heading.textContent.trim();
      if (!text) return;

      // Generate or use existing ID
      var id = heading.id;
      if (!id) {
        id = generateId(text);
        // Ensure unique ID
        var baseId = id;
        var counter = 1;
        while (usedIds[id]) {
          id = baseId + '-' + counter;
          counter++;
        }
        heading.id = id;
      }
      usedIds[id] = true;

      // Get heading level
      var level = parseInt(heading.tagName.charAt(1), 10);

      processed.push({
        id: id,
        text: text,
        level: level,
        element: heading
      });
    });

    return processed;
  }

  /**
   * Generate URL-friendly ID from text
   */
  function generateId(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5\s-]/g, '') // Keep Chinese characters
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50) || 'heading';
  }

  /**
   * Create TOC DOM elements
   */
  function createTOC() {
    // Create desktop sidebar
    createDesktopTOC();

    // Create mobile TOC
    createMobileTOC();

    // Add class to body
    doc.body.classList.add('has-toc');
  }

  /**
   * Create desktop sidebar TOC
   * Uses fixed positioning - TOC is appended to body
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

    // List
    var list = doc.createElement('ul');
    list.className = 'toc-list';

    state.headings.forEach(function (heading, index) {
      var item = doc.createElement('li');
      item.className = 'toc-item';

      var link = doc.createElement('a');
      link.className = 'toc-link';
      link.href = '#' + heading.id;
      link.textContent = heading.text;
      link.setAttribute('data-level', heading.level);
      link.setAttribute('data-index', index);

      item.appendChild(link);
      list.appendChild(item);
      elements.links.push(link);
    });

    container.appendChild(header);
    container.appendChild(list);
    sidebar.appendChild(container);

    // Append to body for fixed positioning
    doc.body.appendChild(sidebar);

    elements.sidebar = sidebar;
    elements.tocList = list;
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

    // List
    var list = doc.createElement('ul');
    list.className = 'toc-mobile-list';

    state.headings.forEach(function (heading, index) {
      var item = doc.createElement('li');
      item.className = 'toc-mobile-item';

      var link = doc.createElement('a');
      link.className = 'toc-mobile-link';
      link.href = '#' + heading.id;
      link.textContent = heading.text;
      link.setAttribute('data-level', heading.level);
      link.setAttribute('data-index', index);

      item.appendChild(link);
      list.appendChild(item);
      elements.mobileLinks.push(link);
    });

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
    elements.mobileTocList = list;
  }

  /**
   * Update TOC visibility based on scroll position
   * Show TOC when in article content area, hide when scrolled past
   */
  function updateTOCVisibility() {
    if (!elements.sidebar) return;

    var scrollTop = win.pageYOffset || doc.documentElement.scrollTop;
    var viewportHeight = win.innerHeight;
    var tocHeight = elements.sidebar.offsetHeight;

    // Recalculate article bounds on each check (in case of dynamic content)
    var postContent = doc.querySelector('.post-content');
    if (postContent) {
      var rect = postContent.getBoundingClientRect();
      state.articleTop = rect.top + scrollTop;
      state.articleBottom = rect.bottom + scrollTop;
    }

    // TOC should be visible when:
    // 1. We've scrolled past the start of the article (with some offset)
    // 2. We haven't scrolled past the end of the article content
    var showStart = state.articleTop - 100;  // Show a bit before article starts
    var showEnd = state.articleBottom - viewportHeight + 100;  // Hide when article bottom is near viewport bottom

    var shouldShow = scrollTop >= showStart && scrollTop <= showEnd;

    if (shouldShow !== state.isVisible) {
      state.isVisible = shouldShow;
      if (shouldShow) {
        elements.sidebar.classList.add('is-visible');
      } else {
        elements.sidebar.classList.remove('is-visible');
      }
    }
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners() {
    // Scroll spy and visibility
    var throttledUpdate = throttle(function() {
      updateScrollSpy();
      updateTOCVisibility();
    }, config.throttleDelay);
    win.addEventListener('scroll', throttledUpdate, { passive: true });
    win.addEventListener('resize', throttledUpdate, { passive: true });

    // Desktop TOC link clicks
    elements.links.forEach(function (link) {
      link.addEventListener('click', handleLinkClick);
    });

    // Mobile trigger
    elements.mobileTrigger.addEventListener('click', openMobileTOC);

    // Mobile overlay click
    elements.mobileOverlay.addEventListener('click', closeMobileTOC);

    // Mobile close button
    var closeBtn = elements.mobileDrawer.querySelector('.toc-mobile-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeMobileTOC);
    }

    // Mobile link clicks
    elements.mobileLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        handleLinkClick(e);
        closeMobileTOC();
      });
    });

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
   * Handle TOC link click
   */
  function handleLinkClick(e) {
    e.preventDefault();
    var href = e.currentTarget.getAttribute('href');
    var targetId = href.substring(1);
    var target = doc.getElementById(targetId);

    if (target) {
      var offsetTop = target.getBoundingClientRect().top + win.pageYOffset - config.scrollOffset;
      win.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });

      // Update URL hash without jumping
      if (history.pushState) {
        history.pushState(null, null, href);
      }
    }
  }

  /**
   * Update scroll spy - highlight current section
   */
  function updateScrollSpy() {
    var scrollTop = win.pageYOffset || doc.documentElement.scrollTop;
    var viewportHeight = win.innerHeight;
    var activeIndex = -1;

    // Find the current active heading
    for (var i = state.headings.length - 1; i >= 0; i--) {
      var heading = state.headings[i];
      var rect = heading.element.getBoundingClientRect();
      var offsetTop = rect.top + scrollTop;

      if (scrollTop >= offsetTop - config.scrollOffset - 50) {
        activeIndex = i;
        break;
      }
    }

    // Update active state if changed
    if (activeIndex !== state.activeIndex) {
      state.activeIndex = activeIndex;

      // Update desktop links
      elements.links.forEach(function (link, index) {
        link.classList.toggle('is-active', index === activeIndex);
      });

      // Update mobile links
      elements.mobileLinks.forEach(function (link, index) {
        link.classList.toggle('is-active', index === activeIndex);
      });

      // Scroll active item into view in desktop TOC
      if (activeIndex >= 0 && elements.tocList) {
        var activeLink = elements.links[activeIndex];
        if (activeLink) {
          var listRect = elements.tocList.getBoundingClientRect();
          var linkRect = activeLink.getBoundingClientRect();

          if (linkRect.top < listRect.top || linkRect.bottom > listRect.bottom) {
            activeLink.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          }
        }
      }
    }
  }

  /**
   * Open mobile TOC
   */
  function openMobileTOC() {
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
