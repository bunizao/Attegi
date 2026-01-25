/**
 * Image Formats Feature
 * AVIF/WebP optimization for Ghost content images
 */

import { doc } from '../core/index.js';

/**
 * Setup content image format optimization
 * @param {Element} container - Post content container
 */
export function setupContentImagesFormats(container) {
  if (!container) return;

  function parseImageSizes() {
    var sizes = [];
    var body = doc.body;
    var attr = body ? body.getAttribute('data-image-sizes') : '';
    if (attr) {
      attr.split(',').forEach(function(item) {
        var value = parseInt(item.trim(), 10);
        if (!isNaN(value) && value > 0) sizes.push(value);
      });
    }
    if (!sizes.length) sizes = [320, 640, 960, 1920];
    sizes.sort(function(a, b) { return a - b; });
    return sizes.filter(function(size, i, arr) { return arr.indexOf(size) === i; });
  }

  function getContentImageFormatPreference() {
    var body = doc.body;
    var attr = body ? body.getAttribute('data-image-formats') : '';
    var value = attr ? attr.trim().toLowerCase() : '';
    if (!value || value === 'disabled' || value === 'off') return { enabled: false, formats: [] };
    if (value === 'auto') return { enabled: true, formats: ['avif', 'webp'] };
    if (value === 'webp only' || value === 'webp') return { enabled: true, formats: ['webp'] };
    return { enabled: true, formats: ['avif', 'webp'] };
  }

  function hasFileExtension(pathname) {
    var filename = pathname.split('/').pop();
    return !!(filename && filename.indexOf('.') !== -1);
  }

  function isExcludedGhostPath(pathname) {
    return /\/content\/images\/(?:size\/w\d+\/)?(?:thumbnail|icon)\//.test(pathname);
  }

  function normalizeGhostImagePath(pathname) {
    return pathname
      .replace(/\/content\/images\/size\/w\d+\//, '/content/images/')
      .replace(/\/content\/images\/format\/[^/]+\//, '/content/images/');
  }

  function isGhostContentImage(url) {
    var basePath = normalizeGhostImagePath(url.pathname);
    if (!/\/content\/images\//.test(basePath)) return false;
    if (isExcludedGhostPath(basePath)) return false;
    if (!hasFileExtension(basePath)) return false;
    return true;
  }

  function applyGhostImageFormat(url, format) {
    var formatted = new URL(url.href);
    formatted.searchParams.delete('format');
    formatted.pathname = formatted.pathname.replace(
      /(\/content\/images\/size\/w\d+\/)(?:format\/[^/]+\/)?/,
      '$1format/' + format + '/'
    );
    return formatted;
  }

  function buildFormatProbeUrl(url, format) {
    var probe = new URL(url.href);
    if (!/\/content\/images\/size\/w\d+\//.test(probe.pathname)) {
      probe.pathname = probe.pathname.replace('/content/images/', '/content/images/size/w50/');
    }
    return applyGhostImageFormat(probe, format);
  }

  function detectFormatSupport(sampleUrl, formats) {
    var cached = window.__attegiImageFormats;
    if (cached) return Promise.resolve(cached);

    var results = { avif: false, webp: false };
    if (!sampleUrl || !window.fetch) {
      window.__attegiImageFormats = results;
      return Promise.resolve(results);
    }

    var hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') {
      window.__attegiImageFormats = results;
      return Promise.resolve(results);
    }

    var base;
    try { base = new URL(sampleUrl, doc.baseURI); }
    catch (err) { window.__attegiImageFormats = results; return Promise.resolve(results); }

    return Promise.all(formats.map(function(format) {
      var testUrl = buildFormatProbeUrl(base, format);
      return fetch(testUrl.toString(), { method: 'HEAD', cache: 'no-store' })
        .then(function(r) { return r.ok; })
        .catch(function() { return false; })
        .then(function(ok) { results[format] = ok; });
    })).then(function() {
      window.__attegiImageFormats = results;
      return results;
    });
  }

  function run() {
    var imageWidths = parseImageSizes();
    var images = container.querySelectorAll('img');
    var formatPreference = getContentImageFormatPreference();
    if (!formatPreference.enabled) return;

    var sampleUrl = '';
    Array.prototype.some.call(images, function(img) {
      var src = img.getAttribute('src');
      if (!src || /^(data:|blob:)/i.test(src)) return false;
      try {
        var parsed = new URL(src, doc.baseURI);
        if (isGhostContentImage(parsed)) {
          sampleUrl = img.getAttribute('srcset') ? img.getAttribute('srcset').split(',')[0].trim().split(/\s+/)[0] : src;
          return true;
        }
      } catch (e) {}
      return false;
    });

    detectFormatSupport(sampleUrl, formatPreference.formats).then(function(formatSupport) {
      if (!formatSupport.avif && !formatSupport.webp) return;

      Array.prototype.forEach.call(images, function(img) {
        if (!img || img.closest('picture') || img.hasAttribute('data-no-webp')) return;
        var src = img.getAttribute('src');
        if (!src || /^(data:|blob:)/i.test(src)) return;

        var parsed;
        try { parsed = new URL(src, doc.baseURI); }
        catch (e) { return; }
        if (!isGhostContentImage(parsed)) return;

        var basePath = normalizeGhostImagePath(parsed.pathname);
        var picture = doc.createElement('picture');
        var sizes = img.getAttribute('sizes');

        ['avif', 'webp'].forEach(function(format) {
          if (!formatSupport[format]) return;
          var source = doc.createElement('source');
          source.type = 'image/' + format;
          // Build srcset for this format
          var srcsetParts = imageWidths.map(function(w) {
            var sizedUrl = new URL(parsed.href);
            sizedUrl.pathname = basePath.replace('/content/images/', '/content/images/size/w' + w + '/');
            sizedUrl = applyGhostImageFormat(sizedUrl, format);
            return sizedUrl.toString() + ' ' + w + 'w';
          });
          source.srcset = srcsetParts.join(', ');
          if (sizes) source.setAttribute('sizes', sizes);
          picture.appendChild(source);
        });

        var parent = img.parentNode;
        if (!parent) return;
        parent.insertBefore(picture, img);
        picture.appendChild(img);
      });
    });
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', function() { setTimeout(run, 0); });
  } else {
    setTimeout(run, 0);
  }
}
