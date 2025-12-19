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

  function highlightCode(container, highlightUrl) {
    if (!container) return;
    var blocks = container.querySelectorAll('pre code');
    if (!blocks.length) return;

    function createCodeHeader(pre, code, langName) {
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
      btn.setAttribute('aria-label', 'Copy code');
      btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg><span>Copy</span>';

      btn.addEventListener('click', function() {
        var text = code.textContent || code.innerText;
        navigator.clipboard.writeText(text).then(function() {
          btn.classList.add('copied');
          btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Copied!</span>';
          setTimeout(function() {
            btn.classList.remove('copied');
            btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg><span>Copy</span>';
          }, 2000);
        });
      });

      header.appendChild(btn);
      pre.insertBefore(header, pre.firstChild);
    }

    function applyHighlight() {
      if (!window.hljs) return;
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
