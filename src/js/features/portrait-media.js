/**
 * Portrait Media Feature
 * Detects and styles portrait videos and images
 */

import { qsa } from '../core/index.js';

/**
 * Setup portrait video detection
 */
export function setupPortraitVideos() {
  var videoCards = qsa('.kg-video-card');
  if (!videoCards.length) return;

  Array.prototype.forEach.call(videoCards, function(card) {
    var video = card.querySelector('video');
    if (!video) return;

    function applyPortraitStyle() {
      var width = video.videoWidth;
      var height = video.videoHeight;
      if (!width || !height) return;

      if (height > width) {
        card.classList.add('kg-video-portrait');
      }

      var wrapper = video.closest('.js-reframe');
      if (wrapper) {
        var currentPadding = wrapper.style.paddingBottom;
        if (!currentPadding || currentPadding === '0%' || currentPadding === '') {
          wrapper.style.paddingBottom = ((height / width) * 100).toFixed(4) + '%';
        }
      }
    }

    if (video.readyState >= 1) {
      applyPortraitStyle();
    } else {
      video.addEventListener('loadedmetadata', applyPortraitStyle);
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
