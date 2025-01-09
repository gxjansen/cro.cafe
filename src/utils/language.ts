import type { APIContext } from 'astro';

// Supported languages and their configurations
export const LANGUAGES = {
  en: { name: 'English', default: true },
  de: { name: 'Deutsch' },
  es: { name: 'Español' },
  nl: { name: 'Nederlands' },
} as const;

export type Language = keyof typeof LANGUAGES;
export const DEFAULT_LANGUAGE: Language = 'en';

/**
 * Get language from URL path
 * @param pathname URL path to extract language from
 * @returns Language code if found, undefined otherwise
 */
export function getLanguageFromURL(pathname: string): Language | undefined {
  const [, lang] = pathname.split('/');
  if (!lang) return undefined;
  return isValidLanguage(lang) ? lang : undefined;
}

/**
 * Check if a string is a valid language code
 * @param lang Language code to validate
 * @returns True if valid language code
 */
export function isValidLanguage(lang: string): lang is Language {
  return lang in LANGUAGES;
}

/**
 * Get user's preferred language from Accept-Language header
 * @param acceptLanguage Accept-Language header value
 * @returns Best matching supported language
 */
export function getBrowserLanguage(acceptLanguage: string | null): Language {
  if (!acceptLanguage) return DEFAULT_LANGUAGE;

  // Parse Accept-Language header
  const browserLangs = acceptLanguage
    .split(',')
    .map((lang) => {
      const [langCode = '', priority = '1.0'] = lang.trim().split(';q=');
      return { code: langCode.split('-')[0], priority: parseFloat(priority) };
    })
    .sort((a, b) => b.priority - a.priority);

  // Find first matching supported language
  const match = browserLangs.find((lang) => lang.code && isValidLanguage(lang.code));
  return match?.code ? (match.code as Language) : DEFAULT_LANGUAGE;
}

/**
 * Generate language-specific URL
 * @param pathname Current URL path
 * @param lang Target language
 * @returns URL path for target language
 */
export function getLanguageURL(pathname: string, lang: Language): string {
  const currentLang = getLanguageFromURL(pathname);
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (!currentLang) return `/${lang}${path}`;
  return path.replace(`/${currentLang}`, `/${lang}`);
}

/**
 * Check if redirection is needed based on language preferences
 * @param context API context from middleware
 * @returns Redirect URL if needed, null otherwise
 */
export function checkLanguageRedirect(context: APIContext): string | null {
  const pathname = context.url.pathname;
  const currentLang = getLanguageFromURL(pathname);
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;

  // If URL has no language code
  if (!currentLang) {
    const preferredLang = getBrowserLanguage(context.request.headers.get('accept-language'));
    return `/${preferredLang}${path}`;
  }

  // If URL has invalid language code
  if (!isValidLanguage(currentLang)) {
    return `/${DEFAULT_LANGUAGE}${path.replace(`/${currentLang}`, '')}`;
  }

  return null;
}

/**
 * Get available languages for current content
 * @param contentType Content type (e.g., 'episodes', 'guests')
 * @param slug Content slug
 * @returns Array of available language codes
 */
export async function getAvailableLanguages(
  _contentType: string,
  _slug: string
): Promise<Language[]> {
  // For now, return all supported languages
  // This will be implemented with actual content checks later
  return Object.keys(LANGUAGES) as Language[];
}
