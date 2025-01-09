import { describe, it, expect } from 'vitest';
import {
  generateSlug,
  validateSlug,
  generateCanonicalUrl,
  updateEpisodeWithLanguageReferences,
  updateGuestWithLanguageReferences,
  updateQuoteWithLanguageReferences,
  updatePlatformWithLanguageReferences,
  updateBrandWithLanguageReferences,
  generateHreflangTags,
} from './permalinks';
import type { Episode, Person, Quote, Platform, Brand } from '~/types';

// Mock data for testing
const mockPerson: Person = {
  id: 'john-doe',
  language: 'en',
  name: 'John Doe',
  role: 'Guest Expert',
  bio: 'A renowned expert in conversion optimization',
  image_url: 'https://example.com/john-doe.jpg',
  social_links: ['https://twitter.com/johndoe'],
  type: 'guests',
};

const mockEpisode: Episode = {
  id: 'mastering-conversion-rates',
  language: 'en',
  title: 'Mastering Conversion Rates',
  description: 'Deep dive into conversion rate optimization strategies',
  date: new Date('2023-01-15'),
  duration: 3600, // 1 hour
  audio_url: 'https://example.com/podcast/episode1.mp3',
  transcript_url: 'https://example.com/podcast/episode1-transcript.txt',
  guests: [mockPerson],
  type: 'episodes',
};

const mockQuote: Quote = {
  id: 'conversion-is-all-about-understanding-user-behavior',
  language: 'en',
  text: 'Conversion is all about understanding user behavior',
  author: mockPerson,
  episode: mockEpisode,
  timestamp: 1800, // 30 minutes into the episode
  type: 'quotes',
};

const mockPlatform: Platform = {
  id: 'spotify',
  language: 'en',
  name: 'Spotify',
  description: 'Listen on Spotify',
  url: 'https://spotify.com/crocafe',
  icon_url: 'https://example.com/spotify-icon.png',
  type: 'platforms',
};

const mockBrand: Brand = {
  id: 'example-brand',
  language: 'en',
  name: 'Example Brand',
  description: 'An example brand for testing',
  logo_url: 'https://example.com/brand-logo.png',
  website_url: 'https://example.com/brand',
  iconUrl: 'https://example.com/brand-icon.png',
  type: 'brands',
};

describe('Permalinks Utility', () => {
  describe('generateSlug', () => {
    it('generates a valid slug from a title', () => {
      const slug = generateSlug('Mastering Conversion Rates');
      expect(slug).toBe('mastering-conversion-rates');
    });

    it('generates a valid slug with special characters', () => {
      const slug = generateSlug('Hello, World! @2023');
      expect(slug).toBe('hello-world-2023');
    });

    it('generates a valid slug with spaces', () => {
      const slug = generateSlug('This is a test');
      expect(slug).toBe('this-is-a-test');
    });
  });

  describe('validateSlug', () => {
    it('validates a correct slug', () => {
      const isValid = validateSlug('mastering-conversion-rates');
      expect(isValid).toBe(true);
    });

    it('invalidates a slug with uppercase letters', () => {
      const isValid = validateSlug('Mastering-Conversion-Rates');
      expect(isValid).toBe(false);
    });

    it('invalidates a slug with special characters', () => {
      const isValid = validateSlug('mastering_conversion-rates!');
      expect(isValid).toBe(false);
    });

    it('invalidates a slug with spaces', () => {
      const isValid = validateSlug('mastering conversion rates');
      expect(isValid).toBe(false);
    });
  });

  describe('generateCanonicalUrl', () => {
    it('generates a valid canonical URL for an episode', () => {
      const url = generateCanonicalUrl('en', 'episodes', 'mastering-conversion-rates');
      expect(url).toBe('https://cro.cafe/en/episodes/mastering-conversion-rates');
    });

    it('generates a valid canonical URL for a guest', () => {
      const url = generateCanonicalUrl('en', 'guests', 'john-doe');
      expect(url).toBe('https://cro.cafe/en/guests/john-doe');
    });

    it('generates a valid canonical URL for a quote', () => {
      const url = generateCanonicalUrl(
        'en',
        'quotes',
        'conversion-is-all-about-understanding-user-behavior'
      );
      expect(url).toBe(
        'https://cro.cafe/en/quotes/conversion-is-all-about-understanding-user-behavior'
      );
    });

    it('generates a valid canonical URL for a platform', () => {
      const url = generateCanonicalUrl('en', 'platforms', 'spotify');
      expect(url).toBe('https://cro.cafe/en/platforms/spotify');
    });

    it('generates a valid canonical URL for a brand', () => {
      const url = generateCanonicalUrl('en', 'brands', 'example-brand');
      expect(url).toBe('https://cro.cafe/en/brands/example-brand');
    });
  });

  describe('updateEpisodeWithLanguageReferences', () => {
    it('updates an episode with canonical URL and language references', () => {
      const updatedEpisode = updateEpisodeWithLanguageReferences(mockEpisode, 'en');
      expect(updatedEpisode.canonicalUrl).toBe(
        'https://cro.cafe/en/episodes/mastering-conversion-rates'
      );
    });
  });

  describe('updateGuestWithLanguageReferences', () => {
    it('updates a guest with canonical URL and language references', () => {
      const updatedGuest = updateGuestWithLanguageReferences(mockPerson, 'en');
      expect(updatedGuest.canonicalUrl).toBe('https://cro.cafe/en/guests/john-doe');
    });
  });

  describe('updateQuoteWithLanguageReferences', () => {
    it('updates a quote with canonical URL and language references', () => {
      const updatedQuote = updateQuoteWithLanguageReferences(mockQuote, 'en');
      expect(updatedQuote.canonicalUrl).toBe(
        'https://cro.cafe/en/quotes/conversion-is-all-about-understanding-user-behavior'
      );
    });
  });

  describe('updatePlatformWithLanguageReferences', () => {
    it('updates a platform with canonical URL and language references', () => {
      const updatedPlatform = updatePlatformWithLanguageReferences(mockPlatform, 'en');
      expect(updatedPlatform.canonicalUrl).toBe('https://cro.cafe/en/platforms/spotify');
    });
  });

  describe('updateBrandWithLanguageReferences', () => {
    it('updates a brand with canonical URL and language references', () => {
      const updatedBrand = updateBrandWithLanguageReferences(mockBrand, 'en');
      expect(updatedBrand.canonicalUrl).toBe('https://cro.cafe/en/brands/example-brand');
    });
  });

  describe('generateHreflangTags', () => {
    it('generates valid hreflang tags for a content entry', () => {
      const hreflangTags = generateHreflangTags(
        { id: generateSlug('Mastering Conversion Rates'), language: 'en', contentType: 'episodes' },
        ['en', 'es', 'fr']
      );
      expect(hreflangTags).toEqual([
        '<link rel="alternate" hreflang="en" href="https://cro.cafe/en/episodes/mastering-conversion-rates" />',
        '<link rel="alternate" hreflang="es" href="https://cro.cafe/es/episodes/mastering-conversion-rates" />',
        '<link rel="alternate" hreflang="fr" href="https://cro.cafe/fr/episodes/mastering-conversion-rates" />',
      ]);
    });
  });
});
