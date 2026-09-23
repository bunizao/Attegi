/**
 * Page Entry Point
 * Loads static page features (subset of post). Site features come from
 * site.js, which default.hbs loads on every page.
 */

import { onReady, qs, doc } from '../core/index.js';
import { wrapEmbeds } from '../features/embeds.js';
import { highlightCode } from '../features/code-highlight.js';

onReady(function() {
  var pageContent = qs('.post-content');
  if (!pageContent) return;

  var currentScript = doc.currentScript || null;
  var highlightUrl = currentScript ? currentScript.getAttribute('data-highlight') : '';

  wrapEmbeds(pageContent);
  highlightCode(pageContent, highlightUrl);
});
