/**
 * Back To Top Feature
 * Scroll-to-top button with a reading-progress ring. Only shown on posts
 * without a TOC (the TOC's own floating trigger already shows progress and
 * `.has-toc .back-to-top` hides this button in CSS).
 */
import { qs, doc } from '../core/index.js';
import { onScroll, getReadingProgress } from '../core/scroll.js';

var DEFAULT_BOTTOM = 32; // px
var BUTTON_HEIGHT = 48; // px
var FOOTER_MARGIN = 16; // px
var SHOW_AT = 200; // px scrolled before the button appears

export function setupBackToTop() {
  // The TOC already covers reading progress; skip attaching a second
  // scroll-driven RAF loop for a button that CSS keeps hidden anyway.
  if (doc.body.classList.contains('has-toc')) return;

  var btn = qs('.back-to-top');
  var progress = btn ? btn.querySelector('.progress-ring__progress') : null;
  var content = qs('.post-content');
  var footer = qs('.nav-footer');
  if (!btn || !progress || !content) return;

  var circumference = 2 * Math.PI * 20; // r=20
  var isVisible = false;
  var isScrollingDown = false;
  var lastScrollY = 0;

  function update() {
    var scrollY = window.pageYOffset;

    var readProgress = Math.min(getReadingProgress(content), 1);
    progress.style.strokeDashoffset = circumference * (1 - readProgress);

    var delta = scrollY - lastScrollY;
    if (Math.abs(delta) > 5) {
      isScrollingDown = delta > 0;
    }
    lastScrollY = scrollY;
    btn.classList.toggle('is-hidden-scroll', scrollY >= SHOW_AT && isScrollingDown);

    var shouldShow = scrollY > SHOW_AT;
    if (shouldShow !== isVisible) {
      isVisible = shouldShow;
      btn.classList.toggle('is-visible', shouldShow);
    }

    if (footer) {
      var footerTop = footer.getBoundingClientRect().top;
      var windowHeight = window.innerHeight;
      var btnBottom = windowHeight - DEFAULT_BOTTOM - BUTTON_HEIGHT;
      if (footerTop < windowHeight && footerTop < btnBottom + BUTTON_HEIGHT + FOOTER_MARGIN) {
        btn.style.bottom = (windowHeight - footerTop + FOOTER_MARGIN) + 'px';
      } else {
        btn.style.bottom = DEFAULT_BOTTOM + 'px';
      }
    }
  }

  btn.addEventListener('click', function() {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  onScroll(update);

  setTimeout(function() {
    if (window.pageYOffset > SHOW_AT) {
      isVisible = true;
      btn.classList.add('is-visible');
    }
  }, 500);
}
