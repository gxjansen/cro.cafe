import { describe, expect, it } from 'vitest';
import type { APIContext } from 'astro';
import {
  getLanguageFromURL,
  isValidLanguage,
  getBrowserLanguage,
  getLanguageURL,
  checkLanguageRedirect,
} from './language';

describe('Language Utilities', () => {
  describe('getLanguageFromURL', () => {
    it('extracts language code from URL path', () => {
      expect(getLanguageFromURL('/en/about')).toBe('en');
      expect(getLanguageFromURL('/de/episodes/123')).toBe('de');
      expect(getLanguageFromURL('/invalid/path')).toBeUndefined();
    });
  });

  describe('isValidLanguage', () => {
    it('validates supported language codes', () => {
      expect(isValidLanguage('en')).toBe(true);
      expect(isValidLanguage('de')).toBe(true);
      expect(isValidLanguage('invalid')).toBe(false);
    });
  });

  describe('getBrowserLanguage', () => {
    it('returns default language for null input', () => {
      expect(getBrowserLanguage(null)).toBe('en');
    });

    it('parses Accept-Language header correctly', () => {
      expect(getBrowserLanguage('de-DE,de;q=0.9,en;q=0.8')).toBe('de');
      expect(getBrowserLanguage('es-ES,es;q=0.9')).toBe('es');
      expect(getBrowserLanguage('fr-FR,fr;q=0.9')).toBe('en'); // Falls back to default
    });
  });

  describe('getLanguageURL', () => {
    it('generates correct language-specific URLs', () => {
      expect(getLanguageURL('/en/about', 'de')).toBe('/de/about');
      expect(getLanguageURL('/about', 'en')).toBe('/en/about');
    });
  });

  describe('checkLanguageRedirect', () => {
    it('returns redirect URL when needed', () => {
      const mockContext = {
        url: new URL('https://cro.cafe/about'),
        request: {
          headers: new Headers({
            'accept-language': 'de-DE,de;q=0.9,en;q=0.8',
          }),
        },
      };

      const result = checkLanguageRedirect(mockContext as APIContext);
      expect(result).toBe('/de/about');
    });

    it('returns null when no redirect needed', () => {
      const mockContext = {
        url: new URL('https://cro.cafe/en/about'),
        request: {
          headers: new Headers({
            'accept-language': 'en-US,en;q=0.9',
          }),
        },
      };

      const result = checkLanguageRedirect(mockContext as APIContext);
      expect(result).toBeNull();
    });
  });
});
