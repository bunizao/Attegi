/**
 * Tags Index Page
 * Powers the /tags/ tag-card grid: custom icons from a tag's code
 * injection, a dominant-color sample for image cards, and a scrollable
 * post-preview list when a card has more posts than fit.
 */

import { qs, qsa, each } from '../core/index.js';

var VISIBLE_POST_COUNT = 3;

/**
 * Swap the default tag icon for one supplied via the tag's code
 * injection (<template data-tag-icon>...</template> or an inline SVG).
 */
function applyCustomIcons() {
  each(qsa('.tag-card'), function(card) {
    var codeInjection = card.querySelector('.tag-code-injection');
    var iconContainer = card.querySelector('.tag-card-icon');
    if (!codeInjection || !iconContainer) return;

    var source = codeInjection.content || codeInjection;
    var iconTemplate = source.querySelector('[data-tag-icon]');
    if (iconTemplate) {
      var defaultIcon = iconContainer.querySelector('.tag-icon-default');
      if (defaultIcon) {
        defaultIcon.outerHTML = iconTemplate.tagName === 'TEMPLATE'
          ? iconTemplate.innerHTML
          : iconTemplate.outerHTML;
      }
    }
    codeInjection.remove();
  });
}

/**
 * Sample a dominant color from an image for the card border/shadow.
 * Loads a detached copy with crossOrigin set so a CORS failure only
 * skips the color sample instead of breaking the visible <img>.
 */
function sampleDominantColor(card, srcImg) {
  var probe = new Image();
  probe.crossOrigin = 'anonymous';

  probe.onload = function() {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var size = 50;
    canvas.width = size;
    canvas.height = size;

    try {
      ctx.drawImage(probe, 0, 0, size, size);
      var data = ctx.getImageData(0, 0, size, size).data;
      var r = 0, g = 0, b = 0, count = 0;

      for (var i = 0; i < data.length; i += 16) {
        var pr = data[i], pg = data[i + 1], pb = data[i + 2];
        var brightness = (pr + pg + pb) / 3;
        if (brightness > 30 && brightness < 220) {
          r += pr; g += pg; b += pb; count++;
        }
      }
      if (!count) return;

      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);

      var max = Math.max(r, g, b);
      var min = Math.min(r, g, b);
      if (max !== min) {
        var mid = (max + min) / 2;
        var boost = 1.2;
        r = Math.min(255, Math.round(mid + (r - mid) * boost));
        g = Math.min(255, Math.round(mid + (g - mid) * boost));
        b = Math.min(255, Math.round(mid + (b - mid) * boost));
      }

      card.style.setProperty('--tag-image-color', 'rgb(' + r + ', ' + g + ', ' + b + ')');
    } catch (e) {
      // Canvas read blocked (CORS or otherwise) — keep the fallback color.
    }
  };

  probe.src = srcImg.currentSrc || srcImg.src;
}

function applyDominantColors() {
  each(qsa('.tag-card.has-image'), function(card) {
    var img = card.querySelector('.tag-card-bg > img');
    if (img) sampleDominantColor(card, img);
  });
}

/**
 * Move a card's post previews into a scrollable wrapper once there are
 * more than fit in the visible area.
 */
function setupScrollablePosts() {
  each(qsa('.tag-card-posts'), function(container) {
    var posts = qsa('.tag-post-preview', container);
    if (posts.length <= VISIBLE_POST_COUNT) return;

    var scrollWrapper = document.createElement('div');
    scrollWrapper.className = 'tag-posts-scroll';
    each(posts, function(post) {
      scrollWrapper.appendChild(post);
    });
    container.insertBefore(scrollWrapper, container.firstChild);
    container.classList.add('is-scrollable');
  });
}

export function initTagCards() {
  if (!qs('.tags-grid')) return;

  applyCustomIcons();
  applyDominantColors();
  setupScrollablePosts();
}
