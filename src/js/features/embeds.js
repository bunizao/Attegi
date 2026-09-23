/**
 * Embeds Feature
 * Wraps video/iframe embeds for responsive sizing
 */

import { doc } from '../core/index.js';

/**
 * Wrap embed elements for responsive behavior
 * @param {Element} container - Container element to search within
 */
export function wrapEmbeds(container) {
  if (!container) return;

  var selectors = [
    'iframe[src*="youtube.com"]',
    'iframe[src*="youtu.be"]',
    'iframe[src*="vimeo.com"]',
    'iframe[src*="bilibili.com"]',
    'iframe[src*="player.spotify.com"]',
    'iframe[src*="soundcloud.com"]',
    'iframe[src*="music.163.com"]',
    'iframe[src*="qq.com"]',
    'object',
    'embed',
    'video'
  ];

  function getNumericAttribute(node, name) {
    var value = node.getAttribute(name);
    if (!value) return null;
    var trimmed = value.trim();
    if (!trimmed || /%$/.test(trimmed)) return null;
    var numberValue = parseFloat(trimmed);
    if (isNaN(numberValue)) return null;
    return numberValue > 0 ? numberValue : null;
  }

  function getEmbedRatio(node) {
    var width = getNumericAttribute(node, 'width');
    var height = getNumericAttribute(node, 'height');
    if (!width || !height) return null;
    return width + ' / ' + height;
  }

  function applyWrapperRatio(wrapper, ratio) {
    if (!wrapper || !ratio) return;
    wrapper.style.aspectRatio = ratio;
  }

  function applyVideoRatio(video, wrapper) {
    if (!video || !wrapper) return;
    if (!video.videoWidth || !video.videoHeight) return;
    applyWrapperRatio(wrapper, video.videoWidth + ' / ' + video.videoHeight);
  }

  // youtube-nocookie.com skips third-party cookies/tracking (doubleclick,
  // googleads) until the viewer actually presses play.
  function useNoCookieDomain(node) {
    var src = node.getAttribute('src') || '';
    if (src.indexOf('youtube.com/embed/') === -1) return;
    node.setAttribute('src', src.replace('youtube.com/embed/', 'youtube-nocookie.com/embed/'));
  }

  function wrapNode(node) {
    if (node.closest('.js-reframe')) return;
    if (node.tagName && node.tagName.toLowerCase() === 'video' && node.closest('.kg-video-card')) return;

    if (node.tagName && node.tagName.toLowerCase() === 'iframe') {
      useNoCookieDomain(node);
    }

    var wrapper = doc.createElement('div');
    wrapper.className = 'js-reframe';
    var ratio = getEmbedRatio(node);
    if (ratio) {
      applyWrapperRatio(wrapper, ratio);
    }
    node.parentNode.insertBefore(wrapper, node);
    wrapper.appendChild(node);

    if (!ratio && node.tagName && node.tagName.toLowerCase() === 'video') {
      var applyOnce = function() {
        applyVideoRatio(node, wrapper);
        node.removeEventListener('loadedmetadata', applyOnce);
      };
      if (node.readyState >= 1) {
        applyOnce();
      } else {
        node.addEventListener('loadedmetadata', applyOnce);
      }
    }
  }

  selectors.forEach(function(selector) {
    var nodes = container.querySelectorAll(selector);
    Array.prototype.forEach.call(nodes, wrapNode);
  });
}
