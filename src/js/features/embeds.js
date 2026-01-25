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

  function getEmbedPadding(node) {
    var width = getNumericAttribute(node, 'width');
    var height = getNumericAttribute(node, 'height');
    if (!width || !height) return null;
    return (height / width) * 100;
  }

  function applyWrapperPadding(wrapper, padding) {
    if (!wrapper || !padding) return;
    wrapper.style.paddingBottom = padding.toFixed(4) + '%';
  }

  function applyVideoPadding(video, wrapper) {
    if (!video || !wrapper) return;
    if (!video.videoWidth || !video.videoHeight) return;
    applyWrapperPadding(wrapper, (video.videoHeight / video.videoWidth) * 100);
  }

  function wrapNode(node) {
    if (node.closest('.js-reframe')) return;
    var wrapper = doc.createElement('div');
    wrapper.className = 'js-reframe';
    var padding = getEmbedPadding(node);
    if (padding) {
      applyWrapperPadding(wrapper, padding);
    }
    node.parentNode.insertBefore(wrapper, node);
    wrapper.appendChild(node);

    if (!padding && node.tagName && node.tagName.toLowerCase() === 'video') {
      var applyOnce = function() {
        applyVideoPadding(node, wrapper);
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
