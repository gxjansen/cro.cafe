/**
 * Convert a string to a URL-friendly slug
 * @param text The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD') // Normalize unicode characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Ensure a string starts with a given prefix
 * @param str The string to check
 * @param prefix The prefix to ensure
 * @returns The string with the prefix
 */
export function ensurePrefix(str: string, prefix: string): string {
  return str.startsWith(prefix) ? str : `${prefix}${str}`;
}

/**
 * Ensure a string ends with a given suffix
 * @param str The string to check
 * @param suffix The suffix to ensure
 * @returns The string with the suffix
 */
export function ensureSuffix(str: string, suffix: string): string {
  return str.endsWith(suffix) ? str : `${str}${suffix}`;
}

/**
 * Format a date string to a locale-specific format
 * @param date The date string to format
 * @param locale The locale to use for formatting
 * @returns A formatted date string
 */
export function formatDate(date: string, locale: string = 'en-US'): string {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a duration in seconds to a human-readable string (MM:SS)
 * @param seconds The duration in seconds
 * @returns A formatted duration string
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Clean HTML content by removing unwanted tags and attributes
 * @param html The HTML content to clean
 * @returns Cleaned HTML content
 */
export function cleanHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // Remove styles
    .replace(/on\w+="[^"]*"/g, '') // Remove inline event handlers
    .trim();
}

/**
 * Generate a random string of specified length
 * @param length The length of the random string
 * @returns A random string
 */
export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map((x) => chars[x % chars.length])
    .join('');
}
