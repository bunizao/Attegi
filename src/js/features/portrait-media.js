/**
 * Portrait Media Feature
 * Detects and styles portrait videos and images
 */

import { qsa } from '../core/index.js';

function getNumericAttribute(node, name) {
  var value = node.getAttribute(name);
  if (!value) return null;
  var parsed = parseFloat(value);
  return parsed > 0 ? parsed : null;
}

/**
 * Setup portrait video detection
 */
export function setupPortraitVideos() {
  var videoCards = qsa('.kg-video-card');
  if (!videoCards.length) return;

  Array.prototype.forEach.call(videoCards, function(card) {
    var video = card.querySelector('video');
    if (!video) return;

    function applyPortraitStyle(width, height) {
      if (!width || !height || height <= width) return;
      card.classList.add('kg-video-portrait');
      card.style.setProperty('--kg-video-aspect-ratio', width + ' / ' + height);
    }

    // Ghost emits width/height attributes on the video element itself, so
    // the aspect ratio is known before a single byte downloads -- no need
    // to wait for loadedmetadata and risk a landscape-assumption reflow.
    var attrWidth = getNumericAttribute(video, 'width');
    var attrHeight = getNumericAttribute(video, 'height');
    if (attrWidth && attrHeight) {
      applyPortraitStyle(attrWidth, attrHeight);
      return;
    }

    function onMetadata() {
      applyPortraitStyle(video.videoWidth, video.videoHeight);
    }
    if (video.readyState >= 1) {
      onMetadata();
    } else {
      video.addEventListener('loadedmetadata', onMetadata);
    }
  });
}

/**
 * Setup portrait image detection
 */
export function setupPortraitImages() {
  var imageCards = qsa('.kg-image-card');
  if (!imageCards.length) return;

  Array.prototype.forEach.call(imageCards, function(card) {
    var img = card.querySelector('.kg-image');
    if (!img) return;

    // Ghost emits width/height attributes on kg-image, so the aspect ratio
    // is known before the bytes arrive -- avoids a flash of full intrinsic
    // size before the portrait cap lands.
    var attrWidth = getNumericAttribute(img, 'width');
    var attrHeight = getNumericAttribute(img, 'height');
    if (attrWidth && attrHeight) {
      if (attrHeight > attrWidth) card.classList.add('kg-image-portrait');
      return;
    }

    function applyPortraitStyle() {
      if (img.naturalHeight > img.naturalWidth) {
        card.classList.add('kg-image-portrait');
      }
    }
    if (img.complete && img.naturalWidth > 0) {
      applyPortraitStyle();
    } else {
      img.addEventListener('load', applyPortraitStyle);
    }
  });
}
