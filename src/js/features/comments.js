/**
 * Comments Feature
 * Lazy loading for Disqus and Ghost native comments
 */

import { doc, qs } from '../core/index.js';

function sanitizeDisqusShortname(value) {
  if (!value) return '';
  var trimmed = value.trim();
  return /^[a-z0-9_-]+$/i.test(trimmed) ? trimmed : '';
}

/**
 * Initialize Disqus lazy loading
 */
export function setupDisqus() {
  var thread = doc.getElementById('disqus_thread');
  var rawShortname = thread && thread.dataset ? thread.dataset.disqusShortname : '';
  var shortname = sanitizeDisqusShortname(rawShortname);
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
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
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
 * Initialize Ghost native comments lazy loading
 */
export function setupLazyComments() {
  var template = doc.getElementById('ghost-comments-template');
  var placeholder = qs('[data-comments-placeholder]');
  var trigger = qs('.js-load-comments');
  if (!template || !placeholder || !trigger) return;

  var hasLoaded = false;

  function cloneTemplateContent(node) {
    if (!node) return null;
    if (node.content && node.content.cloneNode) {
      return node.content.cloneNode(true);
    }
    if (!node.childNodes || !node.childNodes.length) return null;
    var fragment = doc.createDocumentFragment();
    Array.prototype.forEach.call(node.childNodes, function(child) {
      fragment.appendChild(child.cloneNode(true));
    });
    return fragment.childNodes.length ? fragment : null;
  }

  function activateScripts(container, scripts) {
    Array.prototype.forEach.call(scripts, function(original) {
      var replacement = doc.createElement('script');
      Array.prototype.forEach.call(original.attributes, function(attr) {
        if (attr.name === 'type') {
          var normalized = /text\/javascript/i.test(attr.value) ? 'text/javascript' : attr.value;
          if (normalized) replacement.setAttribute('type', normalized);
          return;
        }
        replacement.setAttribute(attr.name, attr.value);
      });
      replacement.textContent = original.textContent;
      if (original.src) replacement.src = original.src;
      container.appendChild(replacement);
    });
  }

  function loadComments() {
    if (hasLoaded) return;
    hasLoaded = true;
    trigger.setAttribute('aria-busy', 'true');
    trigger.classList.add('is-loading');

    setTimeout(function() {
      try {
        var content = cloneTemplateContent(template);
        if (!content) {
          hasLoaded = false;
          trigger.classList.remove('is-loading');
          trigger.removeAttribute('aria-busy');
          return;
        }

        var fragmentScripts = content.querySelectorAll ? content.querySelectorAll('script') : [];
        var storedScripts = [];
        Array.prototype.forEach.call(fragmentScripts, function(script) {
          storedScripts.push(script);
          if (script.parentNode) script.parentNode.removeChild(script);
        });

        placeholder.appendChild(content);

        setTimeout(function() {
          activateScripts(placeholder, storedScripts);
        }, 50);

        trigger.classList.add('is-loaded');
        trigger.setAttribute('hidden', 'true');
        trigger.removeAttribute('aria-busy');
      } catch (err) {
        hasLoaded = false;
        trigger.classList.remove('is-loading');
        trigger.removeAttribute('aria-busy');
      }
    }, 100);
  }

  trigger.addEventListener('click', loadComments);

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          loadComments();
          observer.disconnect();
        }
      });
    }, { rootMargin: '200px 0px' });
    observer.observe(placeholder);
  }
}
