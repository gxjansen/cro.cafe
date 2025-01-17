import { describe, it, expect } from 'vitest';
import {
  trimSlash,
  getHomePermalink,
  getAsset,
  getEpisodePermalink,
  getGuestPermalink,
  getEpisodeCanonicalUrl,
  getGuestCanonicalUrl,
  generateHreflangTags,
  getLanguageFromShowId,
} from './permalinks';

describe('Permalinks Utility', () => {
  describe('trimSlash', () => {
    it('trims slashes from string', () => {
      expect(trimSlash('/test/')).toBe('test');
      expect(trimSlash('test')).toBe('test');
      expect(trimSlash('/test')).toBe('test');
      expect(trimSlash('test/')).toBe('test');
    });
  });

  describe('getHomePermalink', () => {
    it('returns home permalink', () => {
      expect(getHomePermalink()).toBe('/');
    });
  });

  describe('getAsset', () => {
    it('returns asset path', () => {
      expect(getAsset('test.jpg')).toBe('/test.jpg');
      expect(getAsset('/test.jpg')).toBe('/test.jpg');
    });
  });

  describe('getEpisodePermalink', () => {
    it('returns episode permalink', () => {
      expect(getEpisodePermalink('en', 'test-episode')).toBe('/en/episodes/test-episode');
    });
  });

  describe('getGuestPermalink', () => {
    it('returns guest permalink', () => {
      expect(getGuestPermalink('en', 'john-doe')).toBe('/en/guest/john-doe');
    });
  });

  describe('getEpisodeCanonicalUrl', () => {
    it('returns episode canonical URL', () => {
      expect(getEpisodeCanonicalUrl('en', 'test-episode')).toBe(
        'https://www.cro.cafe/en/episodes/test-episode'
      );
    });
  });

  describe('getGuestCanonicalUrl', () => {
    it('returns guest canonical URL', () => {
      expect(getGuestCanonicalUrl('en', 'john-doe')).toBe('https://www.cro.cafe/en/guest/john-doe');
    });
  });

  describe('generateHreflangTags', () => {
    it('generates hreflang tags', () => {
      const tags = generateHreflangTags('/test', ['en', 'es', 'de']);
      expect(tags).toEqual([
        '<link rel="alternate" hreflang="en" href="https://www.cro.cafe/test" />',
        '<link rel="alternate" hreflang="es" href="https://www.cro.cafe/es/test" />',
        '<link rel="alternate" hreflang="de" href="https://www.cro.cafe/de/test" />',
      ]);
    });
  });

  describe('getLanguageFromShowId', () => {
    it('returns correct language for show ID', () => {
      expect(getLanguageFromShowId('5036')).toBe('en');
      expect(getLanguageFromShowId('16113')).toBe('nl');
      expect(getLanguageFromShowId('28592')).toBe('de');
      expect(getLanguageFromShowId('16111')).toBe('es');
      expect(getLanguageFromShowId('unknown')).toBe('en');
    });
  });
});
