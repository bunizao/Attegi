/**
 * Cover Brightness Detection Feature
 * Detects if cover image is bright and applies contrast enhancement
 */

import { doc, qs } from '../core/index.js';

/**
 * Initialize cover brightness detection
 */
export function setupCoverBrightnessDetection() {
  var postHeader = qs('.post-header.has-cover');
  var coverImg = postHeader ? postHeader.querySelector('.post-cover img') : null;
  if (!postHeader || !coverImg) return;

  function analyzeBrightness(img) {
    var canvas = doc.createElement('canvas');
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var sampleHeight = Math.floor(img.naturalHeight * 0.4);
    var sampleY = img.naturalHeight - sampleHeight;
    var sampleWidth = Math.min(img.naturalWidth, 100);
    var scaledHeight = Math.min(sampleHeight, 60);

    canvas.width = sampleWidth;
    canvas.height = scaledHeight;

    try {
      ctx.drawImage(img, 0, sampleY, img.naturalWidth, sampleHeight, 0, 0, sampleWidth, scaledHeight);
      var imageData = ctx.getImageData(0, 0, sampleWidth, scaledHeight);
      var data = imageData.data;
      var totalBrightness = 0;
      var pixelCount = data.length / 4;

      for (var i = 0; i < data.length; i += 4) {
        totalBrightness += (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
      }

      if (totalBrightness / pixelCount > 160) {
        postHeader.classList.add('light-cover');
      }
    } catch (e) {
      // Canvas security error - skip detection
    }
  }

  if (coverImg.complete && coverImg.naturalWidth > 0) {
    analyzeBrightness(coverImg);
  } else {
    coverImg.addEventListener('load', function() {
      analyzeBrightness(coverImg);
    });
  }
}
