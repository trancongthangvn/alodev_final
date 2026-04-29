/**
 * Alt-text audit — find images in HTML that are missing or have empty `alt` attributes,
 * and helpers to update them in place. Used by the article editor and admin review panels.
 */

export type ImgIssue = {
  index: number;       // 0-based index among all <img> tags in the document
  src: string;
  alt: string;         // current alt value ("" if missing)
  hasAlt: boolean;     // alt attribute present at all (even if empty)
};

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof DOMParser !== "undefined";
}

/** Parse `html` and return every <img> that is missing `alt` or has an empty one. */
export function findImagesMissingAlt(html: string | null | undefined): ImgIssue[] {
  if (!html) return [];
  const imgs = extractImages(html);
  return imgs.filter((i) => !i.alt.trim());
}

/** Return all images in the document as structured records. */
export function extractImages(html: string): ImgIssue[] {
  if (!html) return [];
  if (isBrowser()) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const list = Array.from(doc.querySelectorAll("img"));
    return list.map((el, index) => ({
      index,
      src: el.getAttribute("src") ?? "",
      alt: el.getAttribute("alt") ?? "",
      hasAlt: el.hasAttribute("alt"),
    }));
  }
  // Fallback regex parser for server-side rendering (good enough for <img> tags).
  const out: ImgIssue[] = [];
  const re = /<img\b[^>]*>/gi;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(html)) !== null) {
    const tag = m[0];
    const src = /\ssrc\s*=\s*"([^"]*)"|\ssrc\s*=\s*'([^']*)'/i.exec(tag);
    const alt = /\salt\s*=\s*"([^"]*)"|\salt\s*=\s*'([^']*)'/i.exec(tag);
    out.push({
      index: i++,
      src: src ? (src[1] ?? src[2] ?? "") : "",
      alt: alt ? (alt[1] ?? alt[2] ?? "") : "",
      hasAlt: !!alt,
    });
  }
  return out;
}

/**
 * Set the `alt` attribute on the Nth <img> in the document (0-based).
 * Returns the updated HTML. Safe to call on trusted admin-authored content only.
 */
export function setImageAlt(html: string, targetIndex: number, alt: string): string {
  if (!html) return html;
  if (isBrowser()) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const imgs = doc.querySelectorAll("img");
    const el = imgs[targetIndex];
    if (el) el.setAttribute("alt", alt);
    // Return just the body contents, not the full <html>…
    return doc.body.innerHTML;
  }
  // Server-side string replacement fallback.
  let i = 0;
  return html.replace(/<img\b[^>]*>/gi, (tag) => {
    if (i++ !== targetIndex) return tag;
    const escaped = alt.replace(/"/g, "&quot;");
    if (/\salt\s*=\s*("[^"]*"|'[^']*')/i.test(tag)) {
      return tag.replace(/\salt\s*=\s*("[^"]*"|'[^']*')/i, ` alt="${escaped}"`);
    }
    return tag.replace(/<img\b/i, `<img alt="${escaped}"`);
  });
}
