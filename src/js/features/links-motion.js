/**
 * Links Page Reduced Motion
 * The Möbius header uses SMIL (<animate>/<animateMotion>) for its
 * sparkles and particles, which `prefers-reduced-motion` cannot stop via
 * CSS alone. Watch the media query in JS and freeze/hide the moving
 * pieces when the user asked for reduced motion.
 */

import { qs, qsa, each } from '../core/index.js';

function freezeSmil(svg) {
  each(qsa('animate, animateMotion', svg), function(anim) {
    anim.setAttribute('repeatCount', '0');
    if (typeof anim.endElement === 'function') {
      try {
        anim.endElement();
      } catch (e) {
        // Some browsers throw if the animation hasn't started yet.
      }
    }
  });
}

export function initLinksMotion() {
  var svg = qs('.links-symbol');
  if (!svg) return;

  var query = window.matchMedia('(prefers-reduced-motion: reduce)');

  function apply(reduced) {
    each(qsa('.sparkles, .particle-main, .particle-secondary', svg), function(el) {
      el.style.display = reduced ? 'none' : '';
    });
    if (reduced) freezeSmil(svg);
  }

  apply(query.matches);

  if (typeof query.addEventListener === 'function') {
    query.addEventListener('change', function(event) {
      apply(event.matches);
    });
  } else if (typeof query.addListener === 'function') {
    query.addListener(function(event) {
      apply(event.matches);
    });
  }
}
