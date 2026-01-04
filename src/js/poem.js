/**
 * Poem Card Markdown Parser
 * Converts specially formatted blockquotes into poem cards
 *
 * Syntax:
 * > [!poem] Optional Title
 * > Verse line 1
 * > Verse line 2
 * >
 * > — Author Name
 */

(function() {
  'use strict';

  /**
   * Parse and convert poem blockquotes to poem cards
   */
  function initPoemCards() {
    // Find all blockquotes in post content
    const blockquotes = document.querySelectorAll('.post-content blockquote');

    blockquotes.forEach(blockquote => {
      const text = blockquote.textContent.trim();

      // Check if this is a poem blockquote
      // Support both [!poem] at start or after whitespace
      if (!text.includes('[!poem]')) {
        return;
      }

      // Parse the poem content
      const poemData = parsePoemBlockquote(blockquote);

      if (poemData) {
        // Create poem card element
        const poemCard = createPoemCard(poemData);

        // Replace blockquote with poem card
        blockquote.parentNode.replaceChild(poemCard, blockquote);
      }
    });
  }

  /**
   * Parse poem blockquote content
   * @param {HTMLElement} blockquote - The blockquote element
   * @returns {Object|null} Parsed poem data
   */
  function parsePoemBlockquote(blockquote) {
    const lines = [];

    // Try to get lines from <p> tags first (HTML card format)
    const paragraphs = blockquote.querySelectorAll('p');

    if (paragraphs.length > 0) {
      // HTML format with <p> tags
      paragraphs.forEach(p => {
        const text = p.textContent.trim();
        if (text) {
          lines.push(text);
        }
      });
    } else {
      // Markdown format with <br> tags
      // Split by <br> tags and extract text nodes
      const html = blockquote.innerHTML;
      const parts = html.split(/<br\s*\/?>/i);

      parts.forEach(part => {
        // Remove HTML tags and trim
        const text = part.replace(/<[^>]*>/g, '').trim();
        if (text) {
          lines.push(text);
        }
      });
    }

    if (lines.length === 0) {
      return null;
    }

    // Find the line with [!poem] marker
    let poemLineIndex = -1;
    let title = '';

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('[!poem]')) {
        poemLineIndex = i;
        const poemMatch = lines[i].match(/\[!poem\](.*)$/);
        if (poemMatch) {
          title = poemMatch[1].trim();
        }
        break;
      }
    }

    if (poemLineIndex === -1) {
      return null;
    }

    // Get content lines after [!poem] marker
    const contentLines = lines.slice(poemLineIndex + 1);

    // Find author line (starts with em dash)
    let author = '';
    let verses = [];

    for (let i = contentLines.length - 1; i >= 0; i--) {
      const line = contentLines[i];
      if (line.startsWith('—') || line.startsWith('--') || line.startsWith('- ')) {
        author = line.replace(/^--/, '—').replace(/^- /, '— ');
        verses = contentLines.slice(0, i);
        break;
      }
    }

    // If no author found, all lines are verses
    if (!author && contentLines.length > 0) {
      verses = contentLines;
    }

    // Check for modifiers in title
    let centered = false;
    let plain = false;

    if (title.includes('[center]') || title.includes('[居中]')) {
      centered = true;
    }
    if (title.includes('[plain]') || title.includes('[非斜体]')) {
      plain = true;
    }

    // Clean title from modifiers
    const cleanTitle = title
      .replace(/\[center\]/gi, '')
      .replace(/\[居中\]/g, '')
      .replace(/\[plain\]/gi, '')
      .replace(/\[非斜体\]/g, '')
      .trim();

    return {
      title: cleanTitle,
      verses: verses.filter(v => v.length > 0),
      author: author,
      centered: centered,
      plain: plain
    };
  }

  /**
   * Create poem card HTML element
   * @param {Object} data - Poem data
   * @returns {HTMLElement} Poem card element
   */
  function createPoemCard(data) {
    const card = document.createElement('div');
    card.className = 'kg-poem-card';

    // Add modifier classes
    if (data.centered) {
      card.classList.add('kg-poem-centered');
    }
    if (data.plain) {
      card.classList.add('kg-poem-plain');
    }

    // Add title if present
    if (data.title) {
      const header = document.createElement('div');
      header.className = 'kg-poem-header';

      const titleEl = document.createElement('h4');
      titleEl.className = 'kg-poem-title';
      titleEl.textContent = data.title;

      header.appendChild(titleEl);
      card.appendChild(header);

      // Add divider after title
      const divider1 = document.createElement('div');
      divider1.className = 'kg-poem-divider';
      card.appendChild(divider1);
    }

    // Add verses
    if (data.verses.length > 0) {
      const content = document.createElement('div');
      content.className = 'kg-poem-content';

      data.verses.forEach(verse => {
        const line = document.createElement('p');
        line.className = 'kg-poem-line';
        line.textContent = verse;
        content.appendChild(line);
      });

      card.appendChild(content);
    }

    // Add author if present
    if (data.author) {
      // Add divider before author
      const divider2 = document.createElement('div');
      divider2.className = 'kg-poem-divider';
      card.appendChild(divider2);

      const authorEl = document.createElement('p');
      authorEl.className = 'kg-poem-author';
      authorEl.textContent = data.author;
      card.appendChild(authorEl);
    }

    return card;
  }

  /**
   * Initialize on DOM ready
   */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initPoemCards);
    } else {
      initPoemCards();
    }
  }

  // Run initialization
  init();

})();
