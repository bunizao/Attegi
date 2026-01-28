/**
 * Gallery Feature
 * Sets proper aspect ratios for Ghost gallery images
 */

import { qsa } from '../core/index.js';

/**
 * Initialize gallery image aspect ratio handling
 */
export function initGallery() {
  var images = qsa('.kg-gallery-image img');

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
        var onLoad = function() {
          applyRatio(image);
          image.removeEventListener('load', onLoad);
        };
        image.addEventListener('load', onLoad);
      }
    });
  });
}
