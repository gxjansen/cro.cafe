import type { Language } from './language';

/**
 * Trim slashes from a string
 */
export function trimSlash(s: string) {
  return s.replace(/^\/+|\/+$/g, '');
}

/**
 * Get the home permalink
 */
export function getHomePermalink() {
  return '/';
}

/**
 * Get an asset URL
 */
export function getAsset(path: string) {
  return `/${trimSlash(path)}`;
}

/**
 * Generate a permalink
 */
export function getPermalink(slug: string = '', type: string = 'page') {
  let permalink: string;

  switch (type) {
    case 'page':
    case 'post':
      permalink = `/${trimSlash(slug)}`;
      break;

    case 'category':
      permalink = `/category/${trimSlash(slug)}`;
      break;

    case 'tag':
      permalink = `/tag/${trimSlash(slug)}`;
      break;

    default:
      permalink = `/${trimSlash(slug)}`;
      break;
  }

  return permalink;
}

/**
 * Get blog permalink
 */
export function getBlogPermalink() {
  return getPermalink('blog');
}

/**
 * Generate a slug from a string
 */
export function generateSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Generate a podcast episode URL
 */
export function getEpisodePermalink(language: Language, slug: string) {
  return `/${language}/episodes/${slug}`;
}

/**
 * Generate a guest URL
 */
export function getGuestPermalink(language: Language, slug: string) {
  return `/${language}/guest/${slug}`;
}

/**
 * Generate a canonical URL for an episode
 */
export function getEpisodeCanonicalUrl(language: Language, slug: string) {
  return `https://www.cro.cafe${getEpisodePermalink(language, slug)}`;
}

/**
 * Generate a canonical URL for a guest
 */
export function getGuestCanonicalUrl(language: Language, slug: string) {
  return `https://www.cro.cafe${getGuestPermalink(language, slug)}`;
}

/**
 * Generate hreflang tags for a page
 */
export function generateHreflangTags(
  currentPath: string,
  availableLanguages: readonly Language[]
): readonly string[] {
  return availableLanguages.map((lang) => {
    const path = lang === 'en' ? currentPath : `/${lang}${currentPath}`;
    const url = `https://www.cro.cafe${path}`;
    return `<link rel="alternate" hreflang="${lang}" href="${url}" />`;
  });
}

/**
 * Map show IDs to languages
 */
export const SHOW_LANGUAGE_MAP = {
  '5036': 'en',
  '16113': 'nl',
  '28592': 'de',
  '16111': 'es',
} as const;

/**
 * Get language from show ID
 */
export function getLanguageFromShowId(showId: string): Language {
  return SHOW_LANGUAGE_MAP[showId as keyof typeof SHOW_LANGUAGE_MAP] || 'en';
}
