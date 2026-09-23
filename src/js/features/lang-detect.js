/**
 * Content Language Detection
 * The site's <html lang> is a single site-wide locale, but posts are
 * bilingual (English/Chinese). Mark the actual language on the content
 * element so `:lang(zh)` CSS rules (tracking, line-height, no faux italics)
 * apply where the post is really Chinese.
 */

var CJK_PATTERN = /[一-鿿㐀-䶿]/g;

export function detectContentLanguage(content) {
  if (!content) return;

  var text = content.textContent || '';
  if (!text.trim()) return;

  var cjkCount = (text.match(CJK_PATTERN) || []).length;
  if (cjkCount / text.length > 0.15) {
    content.lang = 'zh';
  }
}
