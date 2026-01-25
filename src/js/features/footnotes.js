/**
 * Footnotes Feature
 * Fixes footnote navigation links and IDs
 */

import { doc } from '../core/index.js';

/**
 * Setup footnote navigation
 * @param {Element} container - Post content container
 */
export function setupFootnotes(container) {
  if (!container) return;

  var sups = container.querySelectorAll('sup');
  var footnoteRefs = [];

  Array.prototype.forEach.call(sups, function(sup) {
    var text = sup.textContent.trim();
    var match = text.match(/^\[(\d+)\]$/);
    if (match) {
      footnoteRefs.push({ element: sup, number: parseInt(match[1], 10) });
    }
  });

  if (!footnoteRefs.length) return;

  var lists = container.querySelectorAll('ol');
  var footnoteList = null;

  Array.prototype.forEach.call(lists, function(list) {
    var items = list.querySelectorAll('li');
    Array.prototype.forEach.call(items, function(item) {
      if (item.textContent.indexOf('↩︎') !== -1) {
        footnoteList = list;
      }
    });
  });

  if (!footnoteList) return;

  var footnoteItems = footnoteList.querySelectorAll('li');
  if (footnoteItems.length !== footnoteRefs.length) return;

  // Hide redundant HR before footnotes
  var prev = footnoteList.previousElementSibling;
  var hrCount = 0;
  while (prev && prev.tagName === 'HR' && hrCount < 2) {
    prev.classList.add('footnote-separator');
    prev = prev.previousElementSibling;
    hrCount++;
  }

  // Add IDs and fix back-reference links
  Array.prototype.forEach.call(footnoteItems, function(item, index) {
    var number = index + 1;
    if (!item.id) item.id = 'fn' + number;

    var backLink = item.querySelector('a');
    if (backLink && backLink.textContent.indexOf('↩︎') !== -1) {
      backLink.href = '#fnref' + number;
      backLink.setAttribute('aria-label', 'Back to reference ' + number);
    }
  });

  // Convert references to links
  footnoteRefs.forEach(function(ref) {
    var number = ref.number;
    ref.element.id = 'fnref' + number;

    var wrapperLink = ref.element.parentElement;
    if (wrapperLink && wrapperLink.tagName === 'A') {
      wrapperLink.href = '#fn' + number;
      wrapperLink.setAttribute('aria-label', 'Footnote ' + number);
      return;
    }

    var existingLink = ref.element.querySelector('a');
    if (existingLink) {
      existingLink.href = '#fn' + number;
      existingLink.setAttribute('aria-label', 'Footnote ' + number);
      return;
    }

    var link = doc.createElement('a');
    link.href = '#fn' + number;
    link.textContent = '[' + number + ']';
    link.setAttribute('aria-label', 'Footnote ' + number);
    ref.element.textContent = '';
    ref.element.appendChild(link);
  });
}
