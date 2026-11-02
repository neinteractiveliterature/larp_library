import slugify from 'slugify';

/**
 * Turns a name into the lowercase, dash-separated form used in URLs, the way Rails' `String#parameterize` does (which is
 * how existing brands got their slugs): accents are transliterated away, anything that isn't a letter, digit, underscore or
 * dash becomes a separator, and runs of dashes are squeezed and trimmed. Text with no Latin letters or digits in it, like
 * "!!!" or a name written entirely in another script, comes out empty.
 */
export function parameterize(text: string): string {
  return slugify(text.replace(/[^\p{L}\p{N}_-]+/gu, ' '), {
    lower: true,
    replacement: '-',
    trim: true,
    remove: /[^A-Za-z0-9_\s-]/g,
  })
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
}
