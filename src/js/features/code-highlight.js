/**
 * Code Highlight Feature
 * Syntax highlighting with copy button using highlight.js
 */

import { doc } from '../core/index.js';
import { getI18n } from '../core/i18n.js';

// Language display name mapping
var languageNames = {
  'javascript': 'JavaScript', 'js': 'JavaScript',
  'typescript': 'TypeScript', 'ts': 'TypeScript',
  'python': 'Python', 'py': 'Python',
  'java': 'Java', 'c': 'C', 'cpp': 'C++',
  'csharp': 'C#', 'cs': 'C#', 'go': 'Go',
  'rust': 'Rust', 'ruby': 'Ruby', 'rb': 'Ruby',
  'php': 'PHP', 'swift': 'Swift', 'kotlin': 'Kotlin',
  'sql': 'SQL', 'html': 'HTML', 'xml': 'XML',
  'css': 'CSS', 'scss': 'SCSS', 'json': 'JSON',
  'yaml': 'YAML', 'yml': 'YAML', 'markdown': 'Markdown',
  'md': 'Markdown', 'bash': 'Bash', 'shell': 'Shell',
  'sh': 'Shell', 'dockerfile': 'Dockerfile'
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
      doc.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      var successful = doc.execCommand && doc.execCommand('copy');
      doc.body.removeChild(textarea);
      successful ? resolve() : reject(new Error('Copy failed'));
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

function createCodeHeader(pre, code, langName) {
  var copyLabel = getI18n('copy', 'Copy');
  var copiedLabel = getI18n('copied', 'Copied!');
  var copyAria = getI18n('copy-code', 'Copy code');
  var copyIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
  var copiedIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

  var header = doc.createElement('div');
  header.className = 'code-header';

  var lang = doc.createElement('span');
  lang.className = 'code-lang';
  lang.textContent = langName || '';
  header.appendChild(lang);

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

/**
 * Initialize code highlighting
 * @param {Element} container - Container element
 * @param {string} highlightUrl - URL to highlight.js script
 */
export function highlightCode(container, highlightUrl) {
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

  function applyHighlight() {
    if (!window.hljs) return;
    window.hljs.configure({ ignoreUnescapedHTML: true });
    Array.prototype.forEach.call(blocks, function(code) {
      window.hljs.highlightElement(code);
      var pre = code.parentElement;
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
  script.onload = applyHighlight;

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(function() {
      doc.body.appendChild(script);
    }, { timeout: 500 });
  } else {
    setTimeout(function() {
      doc.body.appendChild(script);
    }, 0);
  }
}
