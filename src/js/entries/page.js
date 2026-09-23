/**
 * Page Entry Point
 * Loads static page features (subset of post). Site features come from
 * site.js, which default.hbs loads on every page.
 */

import { onReady, qs, doc } from '../core/index.js';
import { wrapEmbeds } from '../features/embeds.js';
import { highlightCode } from '../features/code-highlight.js';
import { detectContentLanguage } from '../features/lang-detect.js';
import { initToggleCards } from '../features/toggle-cards.js';

onReady(function() {
  var pageContent = qs('.post-content');
  if (!pageContent) return;

  detectContentLanguage(pageContent);

  var currentScript = doc.currentScript || null;
  var highlightUrl = currentScript ? currentScript.getAttribute('data-highlight') : '';

  wrapEmbeds(pageContent);
  highlightCode(pageContent, highlightUrl);
  initToggleCards(pageContent);
});
