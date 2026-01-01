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
    articleBottom: 0,
    lastScrollTop: 0,
    isScrollingDown: false
  };

  // DOM Elements
  var elements = {
    sidebar: null,
    mobileTrigger: null,
    mobileOverlay: null,
    mobileDrawer: null,
    mobileList: null
  };

  function getI18n(key, fallback) {
    var body = doc.body;
    if (!body) return fallback;
    var value = body.getAttribute('data-i18n-' + key);
    return value || fallback;
  }

  function getTocLabels() {
    return {
      tocLabel: getI18n('toc-label', 'Table of Contents'),
      onThisPage: getI18n('on-this-page', 'On this page'),
      openToc: getI18n('open-toc', 'Open table of contents'),
      closeToc: getI18n('close-toc', 'Close table of contents')
    };
  }

  /**
   * Initialize TOC
   */
  function init() {
    var postContent = doc.querySelector('.post-content');
    if (!postContent) return;

    // Check if TOC is disabled via #no-toc tag
    if (postContent.classList.contains('no-toc')) return;

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
    var labels = getTocLabels();

    // Create desktop sidebar
    createDesktopTOC(labels);

    // Create mobile TOC
    createMobileTOC(labels);
  }

  /**
   * Create desktop sidebar TOC
   */
  function createDesktopTOC(labels) {
    var sidebar = doc.createElement('aside');
    sidebar.className = 'toc-sidebar';
    sidebar.setAttribute('aria-label', labels.tocLabel);

    var container = doc.createElement('div');
    container.className = 'toc-container';

    // Header
    var header = doc.createElement('div');
    header.className = 'toc-header';
    var title = doc.createElement('h3');
    title.className = 'toc-title';
    title.textContent = labels.onThisPage;
    header.appendChild(title);

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
   * Create mobile TOC (trigger button, overlay, mini panel)
   */
  function createMobileTOC(labels) {
    // Trigger button with progress ring
    var trigger = doc.createElement('button');
    trigger.className = 'toc-mobile-trigger';
    trigger.setAttribute('aria-label', labels.openToc);

    // Progress ring SVG (circumference = 2 * PI * radius, radius = 20)
    var circumference = 2 * Math.PI * 20;
    trigger.innerHTML =
      '<svg class="toc-progress-ring" viewBox="0 0 44 44">' +
        '<circle class="toc-progress-ring__bg" cx="22" cy="22" r="20"></circle>' +
        '<circle class="toc-progress-ring__progress" cx="22" cy="22" r="20" ' +
          'stroke-dasharray="' + circumference + '" stroke-dashoffset="' + circumference + '"></circle>' +
      '</svg>' +
      '<svg class="toc-trigger-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<line x1="8" y1="6" x2="21" y2="6"></line>' +
        '<line x1="8" y1="12" x2="21" y2="12"></line>' +
        '<line x1="8" y1="18" x2="21" y2="18"></line>' +
        '<line x1="3" y1="6" x2="3.01" y2="6"></line>' +
        '<line x1="3" y1="12" x2="3.01" y2="12"></line>' +
        '<line x1="3" y1="18" x2="3.01" y2="18"></line>' +
      '</svg>';

    // Overlay (for click-outside-to-close)
    var overlay = doc.createElement('div');
    overlay.className = 'toc-mobile-overlay';

    // Mini panel
    var drawer = doc.createElement('div');
    drawer.className = 'toc-mobile-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-label', labels.tocLabel);

    // Panel header
    var header = doc.createElement('div');
    header.className = 'toc-mobile-header';
    var mobileTitle = doc.createElement('h3');
    mobileTitle.className = 'toc-mobile-title';
    mobileTitle.textContent = labels.onThisPage;
    header.appendChild(mobileTitle);

    // Close button
    var closeBtn = doc.createElement('button');
    closeBtn.className = 'toc-mobile-close';
    closeBtn.setAttribute('aria-label', labels.closeToc);
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

    // Detect scroll direction
    var scrollDelta = scrollTop - state.lastScrollTop;
    var isScrollingDown = scrollDelta > 0;

    // Only update if scroll direction changed and scrolled more than 5px
    if (Math.abs(scrollDelta) > 5 && isScrollingDown !== state.isScrollingDown) {
      state.isScrollingDown = isScrollingDown;
      updateMobileTriggerVisibility();
    }

    state.lastScrollTop = scrollTop;

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
   * Update mobile trigger button visibility based on scroll direction
   */
  function updateMobileTriggerVisibility() {
    if (!elements.mobileTrigger) return;

    var scrollTop = win.pageYOffset || doc.documentElement.scrollTop;

    // Don't hide if at the top of the page (less than 200px)
    if (scrollTop < 200) {
      elements.mobileTrigger.classList.remove('is-hidden-scroll');
      return;
    }

    // Hide when scrolling down, show when scrolling up
    if (state.isScrollingDown) {
      elements.mobileTrigger.classList.add('is-hidden-scroll');
    } else {
      elements.mobileTrigger.classList.remove('is-hidden-scroll');
    }
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners() {
    // Scroll visibility and sync
    var throttledUpdate = throttle(function() {
      updateTOCVisibility();
      updateProgressRing();
    }, 100);

    // Use passive listeners for better performance
    var scrollOptions = { passive: true };

    // Add webkit-specific optimization
    if ('webkitRequestAnimationFrame' in win) {
      scrollOptions.passive = true;
    }

    win.addEventListener('scroll', throttledUpdate, scrollOptions);
    win.addEventListener('resize', throttledUpdate, scrollOptions);

    // iOS Safari specific: handle orientation change
    win.addEventListener('orientationchange', function() {
      setTimeout(function() {
        calculateArticleBounds();
        updateTOCVisibility();
        updateProgressRing();
      }, 100);
    }, scrollOptions);

    // Initial progress ring update
    updateProgressRing();

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
    elements.mobileTrigger.classList.add('is-hidden');
    elements.mobileOverlay.classList.add('is-open');
    elements.mobileDrawer.classList.add('is-open');

    // Scroll to active item after animation completes
    // Use setTimeout to avoid layout thrashing during animation
    setTimeout(function() {
      scrollMobileTOCToActiveItem();
    }, 250);
  }

  /**
   * Close mobile TOC
   */
  function closeMobileTOC() {
    state.isOpen = false;
    elements.mobileTrigger.classList.remove('is-hidden');
    elements.mobileOverlay.classList.remove('is-open');
    elements.mobileDrawer.classList.remove('is-open');
  }

  /**
   * Scroll mobile TOC to center the active item
   */
  function scrollMobileTOCToActiveItem() {
    var content = elements.mobileDrawer.querySelector('.toc-mobile-content');
    var activeLink = elements.mobileList.querySelector('.toc-mobile-link.is-active');
    if (!content || !activeLink) return;

    // Use requestAnimationFrame to avoid layout thrashing
    requestAnimationFrame(function() {
      var contentRect = content.getBoundingClientRect();
      var linkRect = activeLink.getBoundingClientRect();
      var linkTop = linkRect.top - contentRect.top + content.scrollTop;
      var targetScroll = linkTop - (contentRect.height / 2) + (linkRect.height / 2);
      var maxScroll = content.scrollHeight - contentRect.height;

      // Use instant scroll on first open to avoid stutter
      content.scrollTo({
        top: Math.max(0, Math.min(targetScroll, maxScroll)),
        behavior: 'auto'
      });
    });
  }

  /**
   * Setup swipe down to close mobile drawer (disabled for mini panel)
   */
  function setupSwipeToClose() {
    // Swipe gesture not needed for mini floating panel
  }

  /**
   * Update progress ring on mobile trigger button
   * Progress is based on viewport middle position within article content
   */
  function updateProgressRing() {
    if (!elements.mobileTrigger) return;

    var progressCircle = elements.mobileTrigger.querySelector('.toc-progress-ring__progress');
    if (!progressCircle) return;

    var scrollTop = win.pageYOffset || doc.documentElement.scrollTop;
    var viewportHeight = win.innerHeight;
    var viewportMiddle = scrollTop + viewportHeight / 2;

    // Calculate progress based on viewport middle position
    // Progress starts when viewport middle reaches article top
    // Progress ends when viewport middle reaches article bottom
    var articleStart = state.articleTop;
    var articleEnd = state.articleBottom;
    var scrollableDistance = articleEnd - articleStart;

    var progress = 0;
    if (scrollableDistance > 0) {
      var scrolledDistance = viewportMiddle - articleStart;
      progress = Math.max(0, Math.min(scrolledDistance / scrollableDistance, 1));
    }

    var circumference = 2 * Math.PI * 20;
    var offset = circumference * (1 - progress);
    progressCircle.style.strokeDashoffset = offset;
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
