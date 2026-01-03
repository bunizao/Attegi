(function () {
  var doc = document;

  function getI18n(key, fallback) {
    var body = doc.body;
    if (!body) return fallback;
    var value = body.getAttribute('data-i18n-' + key);
    return value || fallback;
  }

  function onReady(fn) {
    if (doc.readyState === 'loading') {
      doc.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function wrapEmbeds(container) {
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
        var applyOnce = function () {
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

    selectors.forEach(function (selector) {
      var nodes = container.querySelectorAll(selector);
      Array.prototype.forEach.call(nodes, wrapNode);
    });
  }

  // Language display name mapping
  var languageNames = {
    'javascript': 'JavaScript',
    'js': 'JavaScript',
    'typescript': 'TypeScript',
    'ts': 'TypeScript',
    'python': 'Python',
    'py': 'Python',
    'java': 'Java',
    'c': 'C',
    'cpp': 'C++',
    'csharp': 'C#',
    'cs': 'C#',
    'go': 'Go',
    'rust': 'Rust',
    'ruby': 'Ruby',
    'rb': 'Ruby',
    'php': 'PHP',
    'swift': 'Swift',
    'kotlin': 'Kotlin',
    'scala': 'Scala',
    'r': 'R',
    'sql': 'SQL',
    'html': 'HTML',
    'xml': 'XML',
    'css': 'CSS',
    'scss': 'SCSS',
    'sass': 'Sass',
    'less': 'Less',
    'json': 'JSON',
    'yaml': 'YAML',
    'yml': 'YAML',
    'markdown': 'Markdown',
    'md': 'Markdown',
    'bash': 'Bash',
    'shell': 'Shell',
    'sh': 'Shell',
    'zsh': 'Zsh',
    'powershell': 'PowerShell',
    'ps1': 'PowerShell',
    'dockerfile': 'Dockerfile',
    'docker': 'Docker',
    'nginx': 'Nginx',
    'apache': 'Apache',
    'lua': 'Lua',
    'perl': 'Perl',
    'haskell': 'Haskell',
    'elixir': 'Elixir',
    'erlang': 'Erlang',
    'clojure': 'Clojure',
    'lisp': 'Lisp',
    'scheme': 'Scheme',
    'ocaml': 'OCaml',
    'fsharp': 'F#',
    'dart': 'Dart',
    'groovy': 'Groovy',
    'julia': 'Julia',
    'matlab': 'MATLAB',
    'objectivec': 'Objective-C',
    'objc': 'Objective-C',
    'assembly': 'Assembly',
    'asm': 'Assembly',
    'vb': 'Visual Basic',
    'vbnet': 'VB.NET',
    'graphql': 'GraphQL',
    'toml': 'TOML',
    'ini': 'INI',
    'makefile': 'Makefile',
    'cmake': 'CMake',
    'diff': 'Diff',
    'plaintext': 'Plain Text',
    'text': 'Plain Text'
  };

  function getLanguageDisplayName(langClass) {
    if (!langClass) return null;
    var match = langClass.match(/language-(\w+)/i);
    if (!match) return null;
    var lang = match[1].toLowerCase();
    return languageNames[lang] || lang.charAt(0).toUpperCase() + lang.slice(1);
  }

  function legacyCopy(text) {
    return new Promise(function(resolve, reject) {
      try {
        var textarea = doc.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.top = '-9999px';
        textarea.style.left = '-9999px';
        doc.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);
        var successful = doc.execCommand && doc.execCommand('copy');
        doc.body.removeChild(textarea);
        if (successful) {
          resolve();
        } else {
          reject(new Error('Copy failed'));
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text)['catch'](function() {
        return legacyCopy(text);
      });
    }
    return legacyCopy(text);
  }

  function highlightCode(container, highlightUrl) {
    if (!container) return;
    var blocks = container.querySelectorAll('pre code');
    if (!blocks.length) return;

    function sanitizeHighlightUrl(url) {
      if (!url) return '';
      try {
        var parsed = new URL(url, doc.baseURI);
        return parsed.origin === location.origin ? parsed.href : '';
      } catch (err) {
        return '';
      }
    }

    function createCodeHeader(pre, code, langName) {
      var copyLabel = getI18n('copy', 'Copy');
      var copiedLabel = getI18n('copied', 'Copied!');
      var copyAria = getI18n('copy-code', 'Copy code');
      var copyIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
      var copiedIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
      var header = doc.createElement('div');
      header.className = 'code-header';

      // Language label
      var lang = doc.createElement('span');
      lang.className = 'code-lang';
      lang.textContent = langName || '';
      header.appendChild(lang);

      // Copy button
      var btn = doc.createElement('button');
      btn.className = 'code-copy-btn';
      btn.setAttribute('aria-label', copyAria);

      function setCopyButtonState(isCopied) {
        btn.innerHTML = isCopied ? copiedIcon : copyIcon;
        var label = doc.createElement('span');
        label.textContent = isCopied ? copiedLabel : copyLabel;
        btn.appendChild(label);
      }

      setCopyButtonState(false);

      btn.addEventListener('click', function() {
        var text = code.textContent || code.innerText;
        copyToClipboard(text).then(function() {
          btn.classList.add('copied');
          setCopyButtonState(true);
          setTimeout(function() {
            btn.classList.remove('copied');
            setCopyButtonState(false);
          }, 2000);
        })['catch'](function() {});
      });

      header.appendChild(btn);
      pre.insertBefore(header, pre.firstChild);
    }

    function applyHighlight() {
      if (!window.hljs) return;
      // Suppress security warnings for code blocks from trusted Ghost editor
      window.hljs.configure({ ignoreUnescapedHTML: true });
      Array.prototype.forEach.call(blocks, function (code) {
        window.hljs.highlightElement(code);

        var pre = code.parentElement;

        // Add header with language and copy button
        if (!pre.querySelector('.code-header')) {
          var langName = getLanguageDisplayName(code.className);
          createCodeHeader(pre, code, langName);
        }
      });
    }

    if (window.hljs) {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(applyHighlight, { timeout: 300 });
      } else {
        setTimeout(applyHighlight, 0);
      }
      return;
    }

    highlightUrl = sanitizeHighlightUrl(highlightUrl);
    if (!highlightUrl) return;
    var script = doc.createElement('script');
    script.src = highlightUrl;
    script.defer = true;
    script.onload = function () {
      applyHighlight();
    };
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(function () {
        doc.body.appendChild(script);
      }, { timeout: 500 });
    } else {
      setTimeout(function () {
        doc.body.appendChild(script);
      }, 0);
    }
  }

  function setupProgress(content) {
    var progressBar = doc.querySelector('.progress-bar');
    var progressContainer = doc.querySelector('.progress-container');
    if (!progressBar || !progressContainer || !content) return;

    var ticking = false;

    function update() {
      var viewportHeight = window.innerHeight || doc.documentElement.clientHeight;
      var viewportMiddle = window.scrollY + viewportHeight / 2;
      var contentTop = content.offsetTop;
      var contentBottom = contentTop + content.offsetHeight;

      // Progress starts when viewport middle reaches content top
      // Progress ends when viewport middle reaches content bottom
      var scrollableDistance = contentBottom - contentTop;
      var scrolledDistance = viewportMiddle - contentTop;

      var progress = (scrolledDistance / scrollableDistance) * 100;
      var clamped = Math.max(0, Math.min(progress, 120));
      progressBar.style.width = Math.min(clamped, 100) + '%';
      progressContainer.classList.toggle('complete', clamped > 100);
    }

    function requestTick() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        update();
        ticking = false;
      });
    }

    ['scroll', 'resize', 'orientationchange'].forEach(function (evt) {
      window.addEventListener(evt, requestTick, { passive: true });
    });

    update();
  }

  function setupShare() {
    var shareButton = doc.getElementById('share-button');
    if (!shareButton) return;
    if (!navigator.share) {
      shareButton.setAttribute('aria-hidden', 'true');
      shareButton.setAttribute('tabindex', '-1');
      shareButton.style.display = 'none';
      return;
    }

    shareButton.addEventListener('click', function (event) {
      event.preventDefault();
      navigator.share({
        title: doc.title,
        url: window.location.href
      })['catch'](function () {});
    });
  }

  function setupDisqus() {
    var thread = doc.getElementById('disqus_thread');
    var shortname = thread && thread.dataset ? thread.dataset.disqusShortname : '';
    if (!thread || !shortname) return;

    var loaded = false;

    function loadDisqus() {
      if (loaded) return;
      loaded = true;
      var script = doc.createElement('script');
      script.src = 'https://' + shortname + '.disqus.com/embed.js';
      script.async = true;
      script.setAttribute('data-timestamp', String(Date.now()));
      doc.body.appendChild(script);
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            loadDisqus();
            observer.disconnect();
          }
        });
      }, { rootMargin: '400px 0px' });
      observer.observe(thread);
    } else {
      window.addEventListener('scroll', loadDisqus, { passive: true });
      window.addEventListener('touchstart', loadDisqus, { passive: true });
    }
  }

  /**
   * Lazy-load Ghost native comments to avoid upfront JS weight
   */
    function setupLazyComments() {
      var template = doc.getElementById('ghost-comments-template');
      var placeholder = doc.querySelector('[data-comments-placeholder]');
      var trigger = doc.querySelector('.js-load-comments');
      if (!template || !placeholder || !trigger) return;

      var hasLoaded = false;

      function normalizeScriptType(value) {
        if (!value) return '';
        if (/text\/javascript/i.test(value)) {
          return 'text/javascript';
        }
        return value;
      }

      function activateScripts(container, scripts) {
        Array.prototype.forEach.call(scripts, function (original) {
          var replacement = doc.createElement('script');
          Array.prototype.forEach.call(original.attributes, function (attr) {
            if (attr.name === 'type') {
              var normalizedType = normalizeScriptType(attr.value);
              if (normalizedType) {
                replacement.setAttribute('type', normalizedType);
              }
              return;
            }
            replacement.setAttribute(attr.name, attr.value);
          });
          replacement.textContent = original.textContent;
          if (original.src) {
            replacement.src = original.src;
          }
          container.appendChild(replacement);
      });
    }

    function loadComments() {
      if (hasLoaded) return;
      hasLoaded = true;
      trigger.setAttribute('aria-busy', 'true');
      trigger.setAttribute('aria-expanded', 'true');
      trigger.classList.add('is-loading');

      // Use setTimeout to ensure DOM is ready
      setTimeout(function () {
        try {
          // Enhanced template content extraction for WebKit compatibility
          var content = null;
          if (template.content && template.content.cloneNode) {
            // Modern browsers with proper template support
            content = template.content.cloneNode(true);
          } else if (template.innerHTML) {
            // Fallback for older WebKit versions
            var tempDiv = doc.createElement('div');
            tempDiv.innerHTML = template.innerHTML;
            content = doc.createDocumentFragment();
            while (tempDiv.firstChild) {
              content.appendChild(tempDiv.firstChild);
            }
          }

          if (!content) {
            hasLoaded = false;
            trigger.classList.remove('is-loading');
            trigger.removeAttribute('aria-busy');
            return;
          }

          // Extract and store scripts before appending
          var fragmentScripts = content.querySelectorAll ? content.querySelectorAll('script') : [];
          var storedScripts = [];
          Array.prototype.forEach.call(fragmentScripts, function (script) {
            storedScripts.push(script);
            if (script.parentNode) {
              script.parentNode.removeChild(script);
            }
          });

          // Append content to placeholder
          placeholder.appendChild(content);

          // Activate scripts after a short delay to ensure DOM is ready
          setTimeout(function () {
            activateScripts(placeholder, storedScripts);
          }, 50);

          trigger.classList.add('is-loaded');
          trigger.setAttribute('hidden', 'true');
          trigger.removeAttribute('aria-busy');
        } catch (err) {
          // Fallback: directly insert template innerHTML
          hasLoaded = false;
          trigger.classList.remove('is-loading');
          trigger.removeAttribute('aria-busy');
          if (template.innerHTML) {
            placeholder.innerHTML = template.innerHTML;
            trigger.classList.add('is-loaded');
            trigger.setAttribute('hidden', 'true');
          }
        }
      }, 100);
    }

    trigger.addEventListener('click', function () {
      loadComments();
    });

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            loadComments();
            observer.disconnect();
          }
        });
      }, { rootMargin: '200px 0px' });
      observer.observe(placeholder);
    }
  }

  /**
   * Detect if cover image is bright and apply contrast enhancement
   * Samples the bottom portion of the image where text overlays
   */
  function setupCoverBrightnessDetection() {
    var postHeader = doc.querySelector('.post-header.has-cover');
    var coverImg = postHeader ? postHeader.querySelector('.post-cover img') : null;
    if (!postHeader || !coverImg) return;

    function analyzeBrightness(img) {
      var canvas = doc.createElement('canvas');
      var ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Sample the bottom 40% of the image (where text typically overlays)
      var sampleHeight = Math.floor(img.naturalHeight * 0.4);
      var sampleY = img.naturalHeight - sampleHeight;

      // Use a smaller sample size for performance
      var sampleWidth = Math.min(img.naturalWidth, 100);
      var scaledHeight = Math.min(sampleHeight, 60);

      canvas.width = sampleWidth;
      canvas.height = scaledHeight;

      try {
        ctx.drawImage(
          img,
          0, sampleY, img.naturalWidth, sampleHeight,  // source
          0, 0, sampleWidth, scaledHeight               // destination
        );

        var imageData = ctx.getImageData(0, 0, sampleWidth, scaledHeight);
        var data = imageData.data;
        var totalBrightness = 0;
        var pixelCount = data.length / 4;

        // Calculate average brightness using perceived luminance formula
        for (var i = 0; i < data.length; i += 4) {
          var r = data[i];
          var g = data[i + 1];
          var b = data[i + 2];
          // Perceived brightness: 0.299*R + 0.587*G + 0.114*B
          totalBrightness += (0.299 * r + 0.587 * g + 0.114 * b);
        }

        var avgBrightness = totalBrightness / pixelCount;

        // If brightness > 160 (out of 255), consider it a light image
        if (avgBrightness > 160) {
          postHeader.classList.add('light-cover');
        }
      } catch (e) {
        // Canvas security error (cross-origin image) - skip detection
      }
    }

    // Check if image is already loaded
    if (coverImg.complete && coverImg.naturalWidth > 0) {
      analyzeBrightness(coverImg);
    } else {
      coverImg.addEventListener('load', function() {
        analyzeBrightness(coverImg);
      });
    }
  }

  /**
   * Detect portrait videos and apply special styling
   * Also fixes padding for videos without numeric width/height attributes
   */
  function setupPortraitVideos() {
    var videoCards = doc.querySelectorAll('.kg-video-card');
    if (!videoCards.length) return;

    Array.prototype.forEach.call(videoCards, function(card) {
      var video = card.querySelector('video');
      if (!video) return;

      function applyPortraitStyle() {
        var width = video.videoWidth;
        var height = video.videoHeight;
        if (!width || !height) return;

        // Check if portrait (height > width)
        if (height > width) {
          card.classList.add('kg-video-portrait');
        }

        // Fix padding for .js-reframe wrapper if it wasn't set correctly
        // This handles cases where width/height attributes were missing or non-numeric
        var wrapper = video.closest('.js-reframe');
        if (wrapper) {
          var currentPadding = wrapper.style.paddingBottom;
          // If no padding was set, calculate from actual video dimensions
          if (!currentPadding || currentPadding === '0%' || currentPadding === '') {
            var padding = (height / width) * 100;
            wrapper.style.paddingBottom = padding.toFixed(4) + '%';
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
   * Detect portrait images and apply special styling
   */
  function setupPortraitImages() {
    var imageCards = doc.querySelectorAll('.kg-image-card');
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

  /**
   * Fix footnote navigation by adding proper links and IDs
   * Handles cases where Ghost markdown renderer strips href attributes
   */
  function setupFootnotes(container) {
    if (!container) return;

    // Find all superscript elements that look like footnote references
    var sups = container.querySelectorAll('sup');
    var footnoteRefs = [];

    Array.prototype.forEach.call(sups, function(sup) {
      var text = sup.textContent.trim();
      var match = text.match(/^\[(\d+)\]$/);
      if (match) {
        footnoteRefs.push({
          element: sup,
          number: parseInt(match[1], 10)
        });
      }
    });

    if (!footnoteRefs.length) return;

    // Find the footnote list (usually the last <ol> in the content)
    var lists = container.querySelectorAll('ol');
    var footnoteList = null;

    // Look for a list that has items with back-reference links (↩︎)
    Array.prototype.forEach.call(lists, function(list) {
      var items = list.querySelectorAll('li');
      var hasBackRefs = false;
      Array.prototype.forEach.call(items, function(item) {
        if (item.textContent.indexOf('↩︎') !== -1) {
          hasBackRefs = true;
        }
      });
      if (hasBackRefs) {
        footnoteList = list;
      }
    });

    if (!footnoteList) return;

    var footnoteItems = footnoteList.querySelectorAll('li');
    if (footnoteItems.length !== footnoteRefs.length) return;

    // Hide redundant horizontal rules before footnotes
    // Ghost markdown renderer adds <hr> tags before footnotes
    var prev = footnoteList.previousElementSibling;
    var hrCount = 0;
    while (prev && prev.tagName === 'HR' && hrCount < 2) {
      prev.classList.add('footnote-separator');
      prev = prev.previousElementSibling;
      hrCount++;
    }

    // Add IDs to footnote list items and fix back-reference links
    Array.prototype.forEach.call(footnoteItems, function(item, index) {
      var number = index + 1;
      var footnoteId = 'fn' + number;
      var refId = 'fnref' + number;

      // Add ID to the list item
      if (!item.id) {
        item.id = footnoteId;
      }

      // Fix the back-reference link
      var backLink = item.querySelector('a');
      if (backLink && backLink.textContent.indexOf('↩︎') !== -1) {
        backLink.href = '#' + refId;
        backLink.setAttribute('aria-label', 'Back to reference ' + number);
      }
    });

    // Convert footnote references to links
    footnoteRefs.forEach(function(ref) {
      var number = ref.number;
      var refId = 'fnref' + number;
      var footnoteId = 'fn' + number;

      // Add ID to the reference
      ref.element.id = refId;

      // Reuse wrapper link when Ghost outputs <a><sup>[n]</sup></a>
      var wrapperLink = ref.element.parentElement;
      if (wrapperLink && wrapperLink.tagName === 'A') {
        wrapperLink.href = '#' + footnoteId;
        wrapperLink.setAttribute('aria-label', 'Footnote ' + number);
        return;
      }

      // Check if there's already a link inside
      var existingLink = ref.element.querySelector('a');
      if (existingLink) {
        existingLink.href = '#' + footnoteId;
        existingLink.setAttribute('aria-label', 'Footnote ' + number);
        return;
      }

      // Create a link element
      var link = doc.createElement('a');
      link.href = '#' + footnoteId;
      link.textContent = '[' + number + ']';
      link.setAttribute('aria-label', 'Footnote ' + number);

      // Replace the text content with the link
      ref.element.textContent = '';
      ref.element.appendChild(link);
    });
  }

  function setupContentImagesFormats(container) {
    if (!container) return;

    function parseImageSizes() {
      var sizes = [];
      var body = doc.body;
      var attr = body ? body.getAttribute('data-image-sizes') : '';
      if (attr) {
        attr.split(',').forEach(function (item) {
          var value = parseInt(item.trim(), 10);
          if (!isNaN(value) && value > 0) {
            sizes.push(value);
          }
        });
      }

      if (!sizes.length) {
        sizes = [320, 640, 960, 1920];
      }

      sizes.sort(function (a, b) {
        return a - b;
      });

      var seen = {};
      var unique = [];
      sizes.forEach(function (size) {
        if (seen[size]) return;
        seen[size] = true;
        unique.push(size);
      });
      return unique;
    }

    function hasFileExtension(pathname) {
      var filename = pathname.split('/').pop();
      return !!(filename && filename.indexOf('.') !== -1);
    }

    function isExcludedGhostPath(pathname) {
      return /\/content\/images\/(?:size\/w\d+\/)?(?:thumbnail|icon)\//.test(pathname);
    }

    function isGhostContentImage(url) {
      if (!/\/content\/images\//.test(url.pathname)) return false;
      if (isExcludedGhostPath(url.pathname)) return false;
      if (!hasFileExtension(url.pathname)) return false;
      return true;
    }

    function normalizeGhostImagePath(pathname) {
      return pathname
        .replace(/\/content\/images\/size\/w\d+\//, '/content/images/')
        .replace(/\/content\/images\/format\/[^/]+\//, '/content/images/');
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
      probe.searchParams.delete('format');

      if (!/\/content\/images\/size\/w\d+\//.test(probe.pathname)) {
        probe.pathname = probe.pathname.replace('/content/images/', '/content/images/size/w50/');
      }

      return applyGhostImageFormat(probe, format);
    }

    function getFirstSrcsetCandidate(srcset) {
      if (!srcset) return '';
      var candidate = srcset.split(',')[0];
      if (!candidate) return '';
      return candidate.trim().split(/\s+/)[0];
    }

    function getSampleImageUrl(images) {
      var sample = '';
      Array.prototype.some.call(images, function (img) {
        if (!img) return false;
        var src = img.getAttribute('src');
        if (!src || /^(data:|blob:)/i.test(src)) return false;
        var parsed;
        try {
          parsed = new URL(src, doc.baseURI);
        } catch (err) {
          return false;
        }
        if (!isGhostContentImage(parsed)) return false;
        var srcset = img.getAttribute('srcset');
        sample = getFirstSrcsetCandidate(srcset) || src;
        return true;
      });
      return sample;
    }

    function detectFormatSupport(sampleUrl) {
      var cached = window.__attegiImageFormats;
      if (cached) return Promise.resolve(cached);

      var results = { avif: false, webp: false };

      // Skip detection if no sample URL or fetch API unavailable
      if (!sampleUrl || !window.fetch) {
        window.__attegiImageFormats = results;
        return Promise.resolve(results);
      }

      // Skip detection in local development (localhost or 127.0.0.1)
      var hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') {
        window.__attegiImageFormats = results;
        return Promise.resolve(results);
      }

      var base;
      try {
        base = new URL(sampleUrl, doc.baseURI);
      } catch (err) {
        window.__attegiImageFormats = results;
        return Promise.resolve(results);
      }

      var formats = ['avif', 'webp'];
      return Promise.all(formats.map(function (format) {
        var testUrl = buildFormatProbeUrl(base, format);
        return fetch(testUrl.toString(), { method: 'HEAD', cache: 'no-store' })
          .then(function (response) {
            return response.ok;
          })
          .catch(function () {
            // Silently fail - format not supported
            return false;
          })
          .then(function (ok) {
            results[format] = ok;
          });
      })).then(function () {
        window.__attegiImageFormats = results;
        return results;
      });
    }

    function buildFormatSrcsetFromExisting(srcset, format) {
      var candidates = srcset.split(',').map(function (item) {
        return item.trim();
      }).filter(Boolean);
      if (!candidates.length) return '';

      var allSized = candidates.every(function (candidate) {
        return /\/content\/images\/size\/w\d+\//.test(candidate);
      });
      if (!allSized) return '';

      var formattedCandidates = [];
      for (var i = 0; i < candidates.length; i += 1) {
        var parts = candidates[i].split(/\s+/);
        var candidateUrl = parts.shift();
        var descriptor = parts.join(' ');
        var parsed;
        try {
          parsed = new URL(candidateUrl, doc.baseURI);
        } catch (err) {
          return '';
        }
        if (!isGhostContentImage(parsed)) return '';
        parsed = applyGhostImageFormat(parsed, format);
        formattedCandidates.push(parsed.toString() + (descriptor ? ' ' + descriptor : ''));
      }

      return formattedCandidates.join(', ');
    }

    function getSizedWidths(img, widths) {
      var widthAttr = img.getAttribute('width');
      if (!widthAttr) return widths.slice();
      var maxWidth = parseInt(widthAttr, 10);
      if (isNaN(maxWidth) || maxWidth <= 0) return widths.slice();
      var filtered = widths.filter(function (width) {
        return width <= maxWidth;
      });
      return filtered.length ? filtered : [maxWidth];
    }

    function buildFormatSrcsetFromSizes(url, widths, format) {
      if (!widths.length) return '';
      var basePath = normalizeGhostImagePath(url.pathname);
      if (!/\/content\/images\//.test(basePath)) return '';
      if (isExcludedGhostPath(basePath)) return '';
      if (!hasFileExtension(basePath)) return '';

      var results = [];
      for (var i = 0; i < widths.length; i += 1) {
        var width = widths[i];
        var sizedUrl = new URL(url.href);
        sizedUrl.pathname = basePath.replace('/content/images/', '/content/images/size/w' + width + '/');
        sizedUrl = applyGhostImageFormat(sizedUrl, format);
        results.push(sizedUrl.toString() + ' ' + width + 'w');
      }

      return results.join(', ');
    }

    function buildFormatSrcset(img, url, widths, format) {
      var existingSrcset = img.getAttribute('srcset');
      if (existingSrcset) {
        var fromExisting = buildFormatSrcsetFromExisting(existingSrcset, format);
        if (fromExisting) return fromExisting;
      }

      var sizedWidths = getSizedWidths(img, widths);
      return buildFormatSrcsetFromSizes(url, sizedWidths, format);
    }

    function run() {
      var imageWidths = parseImageSizes();
      var images = container.querySelectorAll('img');
      var sampleUrl = getSampleImageUrl(images);

      detectFormatSupport(sampleUrl).then(function (formatSupport) {
        if (!formatSupport.avif && !formatSupport.webp) return;

        Array.prototype.forEach.call(images, function (img) {
          if (!img || img.closest('picture')) return;
          if (img.hasAttribute('data-no-webp')) return;

          var src = img.getAttribute('src');
          if (!src || /^(data:|blob:)/i.test(src)) return;

          var parsed;
          try {
            parsed = new URL(src, doc.baseURI);
          } catch (err) {
            return;
          }
          if (!isGhostContentImage(parsed)) return;

          var avifSrcset = formatSupport.avif ? buildFormatSrcset(img, parsed, imageWidths, 'avif') : '';
          var webpSrcset = formatSupport.webp ? buildFormatSrcset(img, parsed, imageWidths, 'webp') : '';
          if (!avifSrcset && !webpSrcset) return;

          var picture = doc.createElement('picture');
          var sizes = img.getAttribute('sizes');
          if (avifSrcset) {
            var avifSource = doc.createElement('source');
            avifSource.type = 'image/avif';
            avifSource.srcset = avifSrcset;
            if (sizes) {
              avifSource.setAttribute('sizes', sizes);
            }
            picture.appendChild(avifSource);
          }

          if (webpSrcset) {
            var webpSource = doc.createElement('source');
            webpSource.type = 'image/webp';
            webpSource.srcset = webpSrcset;
            if (sizes) {
              webpSource.setAttribute('sizes', sizes);
            }
            picture.appendChild(webpSource);
          }

          var parent = img.parentNode;
          if (!parent) return;

          parent.insertBefore(picture, img);
          picture.appendChild(img);
        });
      });
    }

    if (doc.readyState === 'loading') {
      doc.addEventListener('DOMContentLoaded', function () {
        setTimeout(run, 0);
      });
      return;
    }

    setTimeout(run, 0);
  }

  function init() {
    var postContent = doc.querySelector('.post-content');
    if (!postContent) return;

    var currentScript = doc.currentScript || null;
    var highlightUrl = currentScript ? currentScript.getAttribute('data-highlight') : '';

    wrapEmbeds(postContent);
    highlightCode(postContent, highlightUrl);
    setupProgress(postContent);
    setupShare();
    setupDisqus();
    setupLazyComments();
    setupCoverBrightnessDetection();
    setupPortraitVideos();
    setupPortraitImages();
    setupFootnotes(postContent);
    setupContentImagesFormats(postContent);
  }

  onReady(init);
})();
