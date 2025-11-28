(function () {
  var doc = document;

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

    function wrapNode(node) {
      if (node.closest('.js-reframe')) return;
      var wrapper = doc.createElement('div');
      wrapper.className = 'js-reframe';
      node.parentNode.insertBefore(wrapper, node);
      wrapper.appendChild(node);
    }

    selectors.forEach(function (selector) {
      var nodes = container.querySelectorAll(selector);
      Array.prototype.forEach.call(nodes, wrapNode);
    });
  }

  function highlightCode(container, highlightUrl) {
    if (!container) return;
    var blocks = container.querySelectorAll('pre code');
    if (!blocks.length) return;

    function applyHighlight() {
      if (!window.hljs) return;
      Array.prototype.forEach.call(blocks, function (code) {
        window.hljs.highlightElement(code);
        if (code.classList.contains('language-text')) return;
        if (code.parentElement.querySelector('.lines')) return;

        var sanitized = code.innerHTML.replace(/\n+$/, '');
        var lineCount = sanitized.split(/\n(?!$)/g).length + 1;
        if (lineCount < 2) return;

        var lines = doc.createElement('div');
        lines.className = 'lines';

        var numbers = '';
        for (var i = 1; i < lineCount; i++) {
          numbers += '<span class="line" aria-hidden="true">' + i + '</span>';
        }

        lines.innerHTML = numbers;
        code.parentElement.appendChild(lines);
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
      var postBottom = content.offsetTop + content.offsetHeight;
      var progress = 100 - (((postBottom - (window.scrollY + viewportHeight) + viewportHeight / 3) / (postBottom - viewportHeight + viewportHeight / 3)) * 100);
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
  }

  onReady(init);
})();
