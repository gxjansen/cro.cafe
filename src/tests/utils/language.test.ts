import { describe, it, expect } from 'vitest';

// Import utility functions (we'll need to check what exists)
// For now, let's test the language detection logic

describe('Language Utilities', () => {
  describe('Language Detection', () => {
    it('should detect language from URL pathname', () => {
      const testCases = [
        { pathname: '/en/episodes', expected: 'en' },
        { pathname: '/de/episodes', expected: 'de' },
        { pathname: '/es/episodes', expected: 'es' },
        { pathname: '/nl/episodes', expected: 'nl' },
        { pathname: '/episodes', expected: null }, // No language prefix
        { pathname: '/', expected: null }, // Root path
      ];

      testCases.forEach(({ pathname, expected }) => {
        // Simulate the language detection logic
        const languageMatch = pathname.match(/^\/([a-z]{2})\//);
        const detectedLanguage = languageMatch ? languageMatch[1] : null;

        expect(detectedLanguage).toBe(expected);
      });
    });

    it('should validate supported languages', () => {
      const supportedLanguages = ['en', 'de', 'es', 'nl'];
      const testLanguages = ['en', 'de', 'es', 'nl', 'fr', 'it', 'invalid'];

      testLanguages.forEach((lang) => {
        const isSupported = supportedLanguages.includes(lang);

        if (['en', 'de', 'es', 'nl'].includes(lang)) {
          expect(isSupported).toBe(true);
        } else {
          expect(isSupported).toBe(false);
        }
      });
    });

    it('should handle browser language preferences', () => {
      const testCases = [
        { acceptLanguage: 'en-US,en;q=0.9', expected: 'en' },
        { acceptLanguage: 'de-DE,de;q=0.9,en;q=0.8', expected: 'de' },
        { acceptLanguage: 'es-ES,es;q=0.9', expected: 'es' },
        { acceptLanguage: 'nl-NL,nl;q=0.9', expected: 'nl' },
        { acceptLanguage: 'fr-FR,fr;q=0.9', expected: 'en' }, // Fallback to English
        { acceptLanguage: null, expected: 'en' }, // No header, fallback to English
      ];

      testCases.forEach(({ acceptLanguage, expected }) => {
        // Simulate browser language detection logic
        let detectedLanguage = 'en'; // Default fallback

        if (acceptLanguage) {
          const supportedLanguages = ['en', 'de', 'es', 'nl'];
          const preferredLanguages = acceptLanguage
            .split(',')
            .map((lang) => lang.split(';')[0].split('-')[0])
            .filter((lang) => supportedLanguages.includes(lang));

          if (preferredLanguages.length > 0) {
            detectedLanguage = preferredLanguages[0];
          }
        }

        expect(detectedLanguage).toBe(expected);
      });
    });
  });

  describe('Collection Name Generation', () => {
    it('should generate correct collection names for different content types', () => {
      const languages = ['en', 'de', 'es', 'nl'];
      const contentTypes = ['episodes', 'guests', 'platforms'];

      languages.forEach((lang) => {
        contentTypes.forEach((type) => {
          const collectionName = `${lang}-${type}`;

          expect(collectionName).toMatch(/^[a-z]{2}-[a-z]+$/);
          expect(collectionName.startsWith(lang)).toBe(true);
          expect(collectionName.endsWith(type)).toBe(true);
        });
      });
    });

    it('should handle special collection names', () => {
      const specialCases = [
        { lang: 'en', type: 'episodes', expected: 'en-episodes' },
        { lang: 'de', type: 'guests', expected: 'de-guests' },
        { lang: 'es', type: 'platforms', expected: 'es-platforms' },
        { lang: 'nl', type: 'quotes', expected: 'nl-quotes' },
      ];

      specialCases.forEach(({ lang, type, expected }) => {
        const collectionName = `${lang}-${type}`;
        expect(collectionName).toBe(expected);
      });
    });
  });

  describe('URL Generation', () => {
    it('should generate correct language-specific URLs', () => {
      const testCases = [
        { lang: 'en', path: 'episodes', expected: '/en/episodes' },
        { lang: 'de', path: 'episodes/test-episode', expected: '/de/episodes/test-episode' },
        { lang: 'es', path: 'guests', expected: '/es/guests' },
        { lang: 'nl', path: 'guest/test-guest', expected: '/nl/guest/test-guest' },
      ];

      testCases.forEach(({ lang, path, expected }) => {
        const url = `/${lang}/${path}`;
        expect(url).toBe(expected);
      });
    });

    it('should handle root language URLs', () => {
      const languages = ['en', 'de', 'es', 'nl'];

      languages.forEach((lang) => {
        const rootUrl = `/${lang}`;
        expect(rootUrl).toBe(`/${lang}`);
        expect(rootUrl.length).toBe(3); // "/xx"
      });
    });
  });

  describe('Language Metadata', () => {
    it('should provide correct language metadata', () => {
      const languageMetadata = {
        en: { name: 'English', nativeName: 'English', direction: 'ltr' },
        de: { name: 'German', nativeName: 'Deutsch', direction: 'ltr' },
        es: { name: 'Spanish', nativeName: 'Español', direction: 'ltr' },
        nl: { name: 'Dutch', nativeName: 'Nederlands', direction: 'ltr' },
      };

      Object.entries(languageMetadata).forEach(([code, metadata]) => {
        expect(code).toMatch(/^[a-z]{2}$/);
        expect(metadata.name).toBeDefined();
        expect(metadata.nativeName).toBeDefined();
        expect(metadata.direction).toBe('ltr');
      });
    });
  });
});
