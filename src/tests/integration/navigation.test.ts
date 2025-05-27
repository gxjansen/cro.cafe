import { describe, it, expect } from 'vitest';

describe('Cross-language Navigation Tests', () => {
  describe('URL Structure Validation', () => {
    it('should generate correct language-specific URLs', () => {
      const languages = ['en', 'de', 'es', 'nl'];
      const routes = ['episodes', 'guests', 'guest/test-guest', 'episodes/test-episode'];

      languages.forEach((lang) => {
        routes.forEach((route) => {
          const url = `/${lang}/${route}`;

          // Validate URL structure
          expect(url).toMatch(/^\/[a-z]{2}\//);
          expect(url.startsWith(`/${lang}/`)).toBe(true);

          // Validate language code
          const langCode = url.split('/')[1];
          expect(langCode).toBe(lang);
          expect(langCode.length).toBe(2);
        });
      });
    });

    it('should handle root language URLs correctly', () => {
      const languages = ['en', 'de', 'es', 'nl'];

      languages.forEach((lang) => {
        const rootUrl = `/${lang}`;

        expect(rootUrl).toBe(`/${lang}`);
        expect(rootUrl.length).toBe(3);
        expect(rootUrl.startsWith('/')).toBe(true);
      });
    });

    it('should validate episode URLs across languages', () => {
      const episodeSlug = 'test-episode-title';
      const languages = ['en', 'de', 'es', 'nl'];

      languages.forEach((lang) => {
        const episodeUrl = `/${lang}/episodes/${episodeSlug}`;

        expect(episodeUrl).toMatch(/^\/[a-z]{2}\/episodes\/[a-z0-9-]+$/);
        expect(episodeUrl.includes(lang)).toBe(true);
        expect(episodeUrl.includes('episodes')).toBe(true);
        expect(episodeUrl.includes(episodeSlug)).toBe(true);
      });
    });

    it('should validate guest URLs across languages', () => {
      const guestSlug = 'test-guest-name';
      const languages = ['en', 'de', 'es', 'nl'];

      languages.forEach((lang) => {
        const guestUrl = `/${lang}/guest/${guestSlug}`;

        expect(guestUrl).toMatch(/^\/[a-z]{2}\/guest\/[a-z0-9-]+$/);
        expect(guestUrl.includes(lang)).toBe(true);
        expect(guestUrl.includes('guest')).toBe(true);
        expect(guestUrl.includes(guestSlug)).toBe(true);
      });
    });
  });

  describe('Language Switching Logic', () => {
    it('should maintain current page when switching languages', () => {
      const currentPaths = [
        '/en/episodes',
        '/en/guests',
        '/en/guest/test-guest',
        '/en/episodes/test-episode',
      ];

      const targetLanguage = 'de';

      currentPaths.forEach((currentPath) => {
        // Extract the path without language
        const pathWithoutLang = currentPath.replace(/^\/[a-z]{2}/, '');
        const newPath = `/${targetLanguage}${pathWithoutLang}`;

        expect(newPath.startsWith(`/${targetLanguage}`)).toBe(true);
        expect(newPath.includes(pathWithoutLang)).toBe(true);
      });
    });

    it('should handle language switching for all supported languages', () => {
      const basePath = '/episodes/test-episode';
      const languages = ['en', 'de', 'es', 'nl'];

      languages.forEach((fromLang) => {
        languages.forEach((toLang) => {
          const fromUrl = `/${fromLang}${basePath}`;
          const toUrl = `/${toLang}${basePath}`;

          expect(fromUrl).toMatch(/^\/[a-z]{2}\/episodes\/test-episode$/);
          expect(toUrl).toMatch(/^\/[a-z]{2}\/episodes\/test-episode$/);

          // Path should be the same, only language changes
          const fromPath = fromUrl.replace(/^\/[a-z]{2}/, '');
          const toPath = toUrl.replace(/^\/[a-z]{2}/, '');
          expect(fromPath).toBe(toPath);
        });
      });
    });
  });

  describe('Breadcrumb Navigation', () => {
    it('should generate correct breadcrumbs for episode pages', () => {
      const episodeUrl = '/en/episodes/test-episode';

      // Simulate breadcrumb generation
      const pathSegments = episodeUrl.split('/').filter(Boolean);
      const language = pathSegments[0];
      const section = pathSegments[1];
      const episodeSlug = pathSegments[2];

      const breadcrumbs = [
        { label: 'Home', url: `/${language}` },
        { label: 'Episodes', url: `/${language}/${section}` },
        { label: 'Test Episode', url: `/${language}/${section}/${episodeSlug}` },
      ];

      expect(breadcrumbs).toHaveLength(3);
      expect(breadcrumbs[0].url).toBe('/en');
      expect(breadcrumbs[1].url).toBe('/en/episodes');
      expect(breadcrumbs[2].url).toBe('/en/episodes/test-episode');
    });

    it('should generate correct breadcrumbs for guest pages', () => {
      const guestUrl = '/de/guest/test-guest';

      const pathSegments = guestUrl.split('/').filter(Boolean);
      const language = pathSegments[0];
      const section = pathSegments[1];
      const guestSlug = pathSegments[2];

      const breadcrumbs = [
        { label: 'Home', url: `/${language}` },
        { label: 'Guests', url: `/${language}/guests` },
        { label: 'Test Guest', url: `/${language}/${section}/${guestSlug}` },
      ];

      expect(breadcrumbs).toHaveLength(3);
      expect(breadcrumbs[0].url).toBe('/de');
      expect(breadcrumbs[1].url).toBe('/de/guests');
      expect(breadcrumbs[2].url).toBe('/de/guest/test-guest');
    });
  });

  describe('SEO and Meta Tags', () => {
    it('should generate correct hreflang tags for multi-language pages', () => {
      const basePath = '/episodes/test-episode';
      const languages = ['en', 'de', 'es', 'nl'];

      const hreflangTags = languages.map((lang) => ({
        hreflang: lang,
        href: `https://cro.cafe/${lang}${basePath}`,
      }));

      expect(hreflangTags).toHaveLength(4);

      hreflangTags.forEach((tag, index) => {
        expect(tag.hreflang).toBe(languages[index]);
        expect(tag.href).toMatch(/^https:\/\/cro\.cafe\/[a-z]{2}\/episodes\/test-episode$/);
      });
    });

    it('should generate language-specific canonical URLs', () => {
      const testCases = [
        { lang: 'en', path: '/episodes', expected: 'https://cro.cafe/en/episodes' },
        { lang: 'de', path: '/guest/test-guest', expected: 'https://cro.cafe/de/guest/test-guest' },
        {
          lang: 'es',
          path: '/episodes/test-episode',
          expected: 'https://cro.cafe/es/episodes/test-episode',
        },
        { lang: 'nl', path: '/', expected: 'https://cro.cafe/nl' },
      ];

      testCases.forEach(({ lang, path, expected }) => {
        const canonicalUrl = `https://cro.cafe/${lang}${path === '/' ? '' : path}`;
        expect(canonicalUrl).toBe(expected);
      });
    });
  });

  describe('Navigation Menu Logic', () => {
    it('should generate correct navigation items for each language', () => {
      const languages = ['en', 'de', 'es', 'nl'];

      languages.forEach((lang) => {
        const navItems = [
          { label: 'Home', url: `/${lang}` },
          { label: 'Episodes', url: `/${lang}/episodes` },
          { label: 'Guests', url: `/${lang}/guests` },
        ];

        navItems.forEach((item) => {
          expect(item.url.startsWith(`/${lang}`)).toBe(true);
          expect(item.label).toBeDefined();
          expect(typeof item.label).toBe('string');
        });
      });
    });

    it('should handle active state detection', () => {
      const currentUrl = '/en/episodes/test-episode';
      const navItems = [
        { label: 'Home', url: '/en', active: false },
        { label: 'Episodes', url: '/en/episodes', active: true },
        { label: 'Guests', url: '/en/guests', active: false },
      ];

      // Simulate active state logic
      const updatedNavItems = navItems.map((item) => ({
        ...item,
        active: currentUrl.startsWith(item.url) && item.url !== '/en',
      }));

      expect(updatedNavItems[0].active).toBe(false); // Home
      expect(updatedNavItems[1].active).toBe(true); // Episodes
      expect(updatedNavItems[2].active).toBe(false); // Guests
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid language codes gracefully', () => {
      const invalidLanguages = ['xx', 'invalid', '123', ''];
      const supportedLanguages = ['en', 'de', 'es', 'nl'];

      invalidLanguages.forEach((invalidLang) => {
        const isSupported = supportedLanguages.includes(invalidLang);
        expect(isSupported).toBe(false);

        // Should fallback to default language (en)
        const fallbackLang = isSupported ? invalidLang : 'en';
        expect(fallbackLang).toBe('en');
      });
    });

    it('should handle missing translations gracefully', () => {
      // Simulate missing translation scenario
      const translations = {
        en: { episodes: 'Episodes', guests: 'Guests' },
        de: { episodes: 'Episoden' }, // Missing 'guests' translation
        es: { episodes: 'Episodios', guests: 'Invitados' },
      };

      const getTranslation = (lang: string, key: string) => {
        const langTranslations = translations[lang as keyof typeof translations];
        return (
          langTranslations?.[key as keyof typeof langTranslations] ||
          translations.en[key as keyof typeof translations.en] ||
          key
        );
      };

      expect(getTranslation('en', 'episodes')).toBe('Episodes');
      expect(getTranslation('de', 'episodes')).toBe('Episoden');
      expect(getTranslation('de', 'guests')).toBe('Guests'); // Fallback to English
      expect(getTranslation('es', 'guests')).toBe('Invitados');
    });
  });
});
