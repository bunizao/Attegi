/**
 * Table of Contents Feature
 * Auto-generates TOC from post headings with scroll spy using tocbot
 */

import { doc, qs, qsa } from '../core/index.js';
import { getI18n } from '../core/i18n.js';
import { throttle } from '../core/perf.js';

var config = { minHeadings: 2, tocBreakpoint: 1400 };
var state = {
  isOpen: false,
  isVisible: false,
  articleTop: 0,
  articleBottom: 0,
  lastScrollTop: 0,
  isScrollingDown: false
};
var elements = {
  sidebar: null,
  mobileTrigger: null,
  mobileOverlay: null,
  mobileDrawer: null,
  mobileList: null
};

function getTocLabels() {
  return {
    tocLabel: getI18n('toc-label', 'Table of Contents'),
    onThisPage: getI18n('on-this-page', 'On this page'),
    openToc: getI18n('open-toc', 'Open table of contents'),
    closeToc: getI18n('close-toc', 'Close table of contents')
  };
}

function createDesktopTOC(labels) {
  var sidebar = doc.createElement('aside');
  sidebar.className = 'toc-sidebar';
  sidebar.setAttribute('aria-label', labels.tocLabel);

  var container = doc.createElement('div');
  container.className = 'toc-container';

  var header = doc.createElement('div');
  header.className = 'toc-header';
  var title = doc.createElement('h3');
  title.className = 'toc-title';
  title.textContent = labels.onThisPage;
  header.appendChild(title);

  var list = doc.createElement('nav');
  list.className = 'toc-list';

  container.appendChild(header);
  container.appendChild(list);
  sidebar.appendChild(container);
  doc.body.appendChild(sidebar);

  elements.sidebar = sidebar;
}

function createMobileTOC(labels) {
  var circumference = 2 * Math.PI * 20;

  var trigger = doc.createElement('button');
  trigger.className = 'toc-mobile-trigger';
  trigger.setAttribute('aria-label', labels.openToc);
  trigger.innerHTML =
    '<svg class="toc-progress-ring" viewBox="0 0 44 44">' +
      '<circle class="toc-progress-ring__bg" cx="22" cy="22" r="20"></circle>' +
      '<circle class="toc-progress-ring__progress" cx="22" cy="22" r="20" ' +
        'stroke-dasharray="' + circumference + '" stroke-dashoffset="' + circumference + '"></circle>' +
    '</svg>' +
    '<svg class="toc-trigger-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round">' +
      '<line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line>' +
      '<line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line>' +
      '<line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line>' +
    '</svg>';

  var overlay = doc.createElement('div');
  overlay.className = 'toc-mobile-overlay';

  var drawer = doc.createElement('div');
  drawer.className = 'toc-mobile-drawer';
  drawer.setAttribute('role', 'dialog');

  var header = doc.createElement('div');
  header.className = 'toc-mobile-header';
  var mobileTitle = doc.createElement('h3');
  mobileTitle.className = 'toc-mobile-title';
  mobileTitle.textContent = labels.onThisPage;
  header.appendChild(mobileTitle);

  var closeBtn = doc.createElement('button');
  closeBtn.className = 'toc-mobile-close';
  closeBtn.setAttribute('aria-label', labels.closeToc);
  closeBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round">' +
    '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
  header.appendChild(closeBtn);

  var content = doc.createElement('div');
  content.className = 'toc-mobile-content';
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

function copyTocToMobile() {
  var desktopList = qs('.toc-sidebar .toc-list');
  if (!desktopList || !elements.mobileList) return;

  var clone = desktopList.cloneNode(true);
  clone.className = 'toc-mobile-list';

  var items = clone.querySelectorAll('.toc-item');
  Array.prototype.forEach.call(items, function(item) {
    item.className = item.className.replace('toc-item', 'toc-mobile-item');
  });

  var links = clone.querySelectorAll('.toc-link');
  Array.prototype.forEach.call(links, function(link) {
    link.className = link.className.replace('toc-link', 'toc-mobile-link');
    link.addEventListener('click', function(e) {
      e.preventDefault();
      var targetId = link.getAttribute('href').substring(1);
      var target = doc.getElementById(targetId);
      if (target) {
        closeMobileTOC();
        setTimeout(function() {
          window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - 100, behavior: 'smooth' });
        }, 300);
      }
    });
  });

  var nestedLists = clone.querySelectorAll('.toc-list');
  Array.prototype.forEach.call(nestedLists, function(list) {
    list.className = list.className.replace('toc-list', 'toc-mobile-list');
  });

  elements.mobileList.innerHTML = '';
  while (clone.firstChild) {
    elements.mobileList.appendChild(clone.firstChild);
  }
}

function syncMobileActiveState() {
  if (!elements.mobileList) return;
  var activeDesktopLink = qs('.toc-sidebar .toc-link.is-active');
  var activeHref = activeDesktopLink ? activeDesktopLink.getAttribute('href') : null;

  var mobileLinks = elements.mobileList.querySelectorAll('.toc-mobile-link');
  Array.prototype.forEach.call(mobileLinks, function(link) {
    if (activeHref && link.getAttribute('href') === activeHref) {
      link.classList.add('is-active');
    } else {
      link.classList.remove('is-active');
    }
  });
}

function scrollMobileTOCToActiveItem() {
  if (!elements.mobileDrawer || !elements.mobileList) return;
  var content = elements.mobileDrawer.querySelector('.toc-mobile-content');
  var activeLink = elements.mobileList.querySelector('.toc-mobile-link.is-active');
  if (!content || !activeLink) return;

  requestAnimationFrame(function() {
    var contentRect = content.getBoundingClientRect();
    var linkRect = activeLink.getBoundingClientRect();
    var linkTop = linkRect.top - contentRect.top + content.scrollTop;
    var targetScroll = linkTop - (contentRect.height / 2) + (linkRect.height / 2);
    var maxScroll = content.scrollHeight - contentRect.height;

    content.scrollTo({
      top: Math.max(0, Math.min(targetScroll, maxScroll)),
      behavior: 'auto'
    });
  });
}

function openMobileTOC() {
  syncMobileActiveState();
  state.isOpen = true;
  elements.mobileTrigger.classList.add('is-hidden');
  elements.mobileOverlay.classList.add('is-open');
  elements.mobileDrawer.classList.add('is-open');

  setTimeout(function() {
    scrollMobileTOCToActiveItem();
  }, 250);
}

function closeMobileTOC() {
  state.isOpen = false;
  elements.mobileTrigger.classList.remove('is-hidden');
  elements.mobileOverlay.classList.remove('is-open');
  elements.mobileDrawer.classList.remove('is-open');
}

function updateProgressRing() {
  if (!elements.mobileTrigger) return;
  var progressCircle = elements.mobileTrigger.querySelector('.toc-progress-ring__progress');
  if (!progressCircle) return;

  var scrollTop = window.pageYOffset;
  var viewportMiddle = scrollTop + window.innerHeight / 2;
  var scrollableDistance = state.articleBottom - state.articleTop;
  var progress = scrollableDistance > 0 ? Math.max(0, Math.min((viewportMiddle - state.articleTop) / scrollableDistance, 1)) : 0;

  var circumference = 2 * Math.PI * 20;
  progressCircle.style.strokeDashoffset = circumference * (1 - progress);
}

function updateTOCVisibility() {
  if (!elements.sidebar) return;
  var scrollTop = window.pageYOffset;
  var viewportHeight = window.innerHeight;

  var postContent = qs('.post-content');
  if (postContent) {
    var rect = postContent.getBoundingClientRect();
    state.articleTop = rect.top + scrollTop;
    state.articleBottom = rect.bottom + scrollTop;
  }

  var showStart = state.articleTop - 100;
  var showEnd = state.articleBottom - viewportHeight + 100;
  var shouldShow = scrollTop >= showStart && scrollTop <= showEnd;

  if (shouldShow !== state.isVisible) {
    state.isVisible = shouldShow;
    elements.sidebar.classList.toggle('is-visible', shouldShow);
  }

  syncMobileActiveState();
}

/**
 * Initialize Table of Contents
 */
export function initTOC() {
  var postContent = qs('.post-content');
  if (!postContent || postContent.classList.contains('no-toc')) return;

  var headings = postContent.querySelectorAll('h2, h3, h4');
  var tocHeadings = Array.prototype.filter.call(headings, function(h) {
    return !h.closest('.kg-poem-card');
  });
  if (tocHeadings.length < config.minHeadings) return;

  var labels = getTocLabels();
  createDesktopTOC(labels);
  createMobileTOC(labels);

  if (typeof tocbot !== 'undefined') {
    tocbot.init({
      tocSelector: '.toc-list',
      contentSelector: '.post-content',
      headingSelector: 'h2, h3, h4',
      ignoreSelector: '.js-toc-ignore, .kg-poem-card h2, .kg-poem-card h3, .kg-poem-card h4, .gh-post-upgrade-cta h2',
      hasInnerContainers: true,
      linkClass: 'toc-link',
      activeLinkClass: 'is-active',
      listClass: 'toc-list',
      listItemClass: 'toc-item',
      collapseDepth: 6,
      scrollSmooth: true,
      scrollSmoothOffset: -100,
      headingsOffset: 100,
      throttleTimeout: 50,
      orderedList: false,
      onClick: function() { if (state.isOpen) closeMobileTOC(); }
    });
    setTimeout(function() {
      copyTocToMobile();
      syncMobileActiveState();
      updateTOCVisibility();
    }, 100);
  }

  var throttledUpdate = throttle(function() {
    updateTOCVisibility();
    updateProgressRing();
  }, 100);

  window.addEventListener('scroll', throttledUpdate, { passive: true });
  window.addEventListener('resize', throttledUpdate, { passive: true });
  updateTOCVisibility();
  updateProgressRing();

  elements.mobileTrigger.addEventListener('click', openMobileTOC);
  elements.mobileOverlay.addEventListener('click', closeMobileTOC);
  elements.mobileDrawer.querySelector('.toc-mobile-close').addEventListener('click', closeMobileTOC);
  doc.addEventListener('keydown', function(e) { if (e.key === 'Escape' && state.isOpen) closeMobileTOC(); });

  doc.body.classList.add('has-toc');
  setTimeout(function() { elements.mobileTrigger.classList.add('is-visible'); }, 500);
}
