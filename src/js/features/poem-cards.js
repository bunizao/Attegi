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

  var poemLineIndex = -1;
  var title = '';

  for (var i = 0; i < lines.length; i++) {
    if (lines[i].includes('[!poem]')) {
      poemLineIndex = i;
      var poemMatch = lines[i].match(/\[!poem\](.*)$/);
      if (poemMatch) title = poemMatch[1].trim();
      break;
    }
  }

  if (poemLineIndex === -1) return null;

  var contentLines = lines.slice(poemLineIndex + 1);
  var author = '';
  var verses = [];

  for (var j = contentLines.length - 1; j >= 0; j--) {
    var line = contentLines[j];
    if (line.startsWith('—') || line.startsWith('--') || line.startsWith('- ')) {
      author = line.replace(/^--/, '—').replace(/^- /, '— ');
      verses = contentLines.slice(0, j);
      break;
    }
  }

  if (!author && contentLines.length > 0) {
    verses = contentLines;
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
  var card = doc.createElement('div');
  card.className = 'kg-poem-card';

  if (data.centered) card.classList.add('kg-poem-centered');
  if (data.plain) card.classList.add('kg-poem-plain');

  if (data.title) {
    var header = doc.createElement('div');
    header.className = 'kg-poem-header';
    var titleEl = doc.createElement('h4');
    titleEl.className = 'kg-poem-title';
    titleEl.textContent = data.title;
    header.appendChild(titleEl);
    card.appendChild(header);

    var divider1 = doc.createElement('div');
    divider1.className = 'kg-poem-divider';
    card.appendChild(divider1);
  }

  if (data.verses.length > 0) {
    var content = doc.createElement('div');
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
    var divider2 = doc.createElement('div');
    divider2.className = 'kg-poem-divider';
    card.appendChild(divider2);

    var authorEl = doc.createElement('p');
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
    var text = blockquote.textContent.trim();
    if (!text.includes('[!poem]')) return;

    var poemData = parsePoemBlockquote(blockquote);
    if (poemData) {
      var poemCard = createPoemCard(poemData);
      blockquote.parentNode.replaceChild(poemCard, blockquote);
    }
  });
}
