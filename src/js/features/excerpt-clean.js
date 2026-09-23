/**
 * Excerpt Cleanup
 * Ghost's excerpt helper falls back to stripped post HTML when no custom
 * excerpt is set, which can leak raw content directives (e.g. "[!poem]")
 * into feed and card excerpts. Strip them client-side rather than
 * post-processing every place `{{excerpt}}` is called.
 */

import { qsa, each } from '../core/index.js';

var DIRECTIVE_PATTERN = /\[\/?!?[a-z0-9_-]+\]/gi;

export function initExcerptClean() {
  each(qsa('.post-excerpt, .post-nav-excerpt'), function(el) {
    if (!DIRECTIVE_PATTERN.test(el.textContent)) return;
    DIRECTIVE_PATTERN.lastIndex = 0;
    el.textContent = el.textContent.replace(DIRECTIVE_PATTERN, '').replace(/\s{2,}/g, ' ').trim();
  });
}
