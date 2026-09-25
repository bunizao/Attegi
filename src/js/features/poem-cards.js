/**
 * Poem Cards Feature
 * Converts specially formatted blockquotes into poem cards
 */

import { qsa, doc } from '../core/index.js';

/**
 * Parse poem blockquote content
 */
function parsePoemBlockquote(blockquote) {
  var lines = [];
  var paragraphs = blockquote.querySelectorAll('p');

  if (paragraphs.length > 0) {
    Array.prototype.forEach.call(paragraphs, function(p) {
      var text = p.textContent.trim();
      if (text) lines.push(text);
    });
  } else {
    var clone = blockquote.cloneNode(true);
    var brs = clone.querySelectorAll('br');
    Array.prototype.forEach.call(brs, function(br) {
      br.replaceWith('\n');
    });
    var parts = (clone.textContent || '').split(/\r?\n/);
    parts.forEach(function(part) {
      var text = part.trim();
      if (text) lines.push(text);
    });
  }

  if (lines.length === 0) return null;

  // The marker must open the quote; a quote that merely mentions `[!poem]`
  // in its prose stays a plain blockquote.
  var poemMatch = lines[0].match(/^\[!poem\](.*)$/);
  if (!poemMatch) return null;

  var title = poemMatch[1].trim();
  var contentLines = lines.slice(1);
  var author = '';
  var verses = contentLines;

  // Only the LAST line can be the author credit, and only if it reads like
  // one (short) -- a legitimate poem line that happens to start with a dash
  // is usually longer than a "-- Name" credit and shouldn't be misread.
  var AUTHOR_LINE_MAX_LENGTH = 40;
  var lastLine = contentLines[contentLines.length - 1];
  if (lastLine && lastLine.length <= AUTHOR_LINE_MAX_LENGTH &&
      (lastLine.startsWith('—') || lastLine.startsWith('--') || lastLine.startsWith('- '))) {
    author = lastLine.replace(/^--/, '—').replace(/^- /, '— ');
    verses = contentLines.slice(0, contentLines.length - 1);
  }

  var centered = title.includes('[center]') || title.includes('[居中]');
  var plain = title.includes('[plain]') || title.includes('[非斜体]');

  var cleanTitle = title
    .replace(/\[center\]/gi, '')
    .replace(/\[居中\]/g, '')
    .replace(/\[plain\]/gi, '')
    .replace(/\[非斜体\]/g, '')
    .trim();

  return {
    title: cleanTitle,
    verses: verses.filter(function(v) { return v.length > 0; }),
    author: author,
    centered: centered,
    plain: plain
  };
}

/**
 * Create poem card HTML element
 */
function createPoemCard(data) {
  // <figure>/<blockquote>/<figcaption> keeps native quotation semantics;
  // a plain <p> for the title avoids skipping a heading level depending on
  // where the poem lands in the post's own h1-h6 outline.
  var card = doc.createElement('figure');
  card.className = 'kg-poem-card';

  if (data.centered) card.classList.add('kg-poem-centered');
  if (data.plain) card.classList.add('kg-poem-plain');

  if (data.title) {
    var header = doc.createElement('div');
    header.className = 'kg-poem-header';
    var titleEl = doc.createElement('p');
    titleEl.className = 'kg-poem-title';
    titleEl.textContent = data.title;
    header.appendChild(titleEl);
    card.appendChild(header);

    var divider1 = doc.createElement('div');
    divider1.className = 'kg-poem-divider';
    card.appendChild(divider1);
  }

  if (data.verses.length > 0) {
    var content = doc.createElement('blockquote');
    content.className = 'kg-poem-content';
    data.verses.forEach(function(verse) {
      var line = doc.createElement('p');
      line.className = 'kg-poem-line';
      line.textContent = verse;
      content.appendChild(line);
    });
    card.appendChild(content);
  }

  if (data.author) {
    var authorEl = doc.createElement('figcaption');
    authorEl.className = 'kg-poem-author';
    authorEl.textContent = data.author;
    card.appendChild(authorEl);
  }

  return card;
}

/**
 * Initialize poem cards
 */
export function initPoemCards() {
  var blockquotes = qsa('.post-content blockquote');

  Array.prototype.forEach.call(blockquotes, function(blockquote) {
    if (!/^\s*\[!poem\]/.test(blockquote.textContent)) return;

    var poemData = parsePoemBlockquote(blockquote);
    if (poemData) {
      var poemCard = createPoemCard(poemData);
      blockquote.parentNode.replaceChild(poemCard, blockquote);
    } else {
      // Not a parsable poem after all: show the plain blockquote again.
      blockquote.classList.remove('kg-poem-pending');
    }
  });
}
