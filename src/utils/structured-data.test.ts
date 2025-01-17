import { describe, it, expect } from 'vitest';
import { StructuredDataGenerator } from './structured-data';
import type { Episode, Person, Quote, Platform, Brand } from '~/types';

// Mock data for testing
const mockPerson: Person = {
  id: 'person-1',
  type: 'guest',
  name: 'John Doe',
  role: 'Guest Expert',
  bio: 'A renowned expert in conversion optimization',
  image_url: 'https://example.com/john-doe.jpg',
  social_links: [{ platform: 'Twitter', url: 'https://twitter.com/johndoe' }],
  language: 'en',
};

const mockEpisode: Episode = {
  id: 'mastering-conversion-rates',
  collection: 'en-episodes',
  data: {
    id: 'mastering-conversion-rates',
    type: 'episode',
    attributes: {
      title: 'Mastering Conversion Rates',
      summary: null,
      description: 'Deep dive into conversion rate optimization strategies',
      published_at: '2023-01-15T00:00:00.000Z',
      media_url: 'https://example.com/podcast/episode1.mp3',
      duration: 3600,
      duration_in_mmss: '60:00',
      formatted_published_at: 'January 15, 2023',
      transcript_url: 'https://example.com/podcast/episode1-transcript.txt',
      share_url: 'https://example.com/share',
      embed_html: '<iframe></iframe>',
      embed_html_dark: '<iframe></iframe>',
      slug: 'mastering-conversion-rates',
    },
    relationships: {
      show: {
        data: {
          id: '5036',
          type: 'show',
        },
      },
      guests: [
        {
          id: 'person-1',
          type: 'guest',
        },
      ],
    },
  },
};

const mockQuote: Quote = {
  id: 'quote-1',
  type: 'quotes',
  text: 'Conversion is all about understanding user behavior',
  author: 'John Doe',
  episode: 'mastering-conversion-rates',
  timestamp: '1800',
  data: {
    id: 'quote-1',
    type: 'quotes',
    text: 'Conversion is all about understanding user behavior',
    author: 'John Doe',
    episode: 'mastering-conversion-rates',
    timestamp: '1800',
  },
  collection: 'en-quotes',
};

const mockPlatform: Platform = {
  id: 'spotify',
  type: 'platforms',
  name: 'Spotify',
  description: 'Listen on Spotify',
  url: 'https://spotify.com/crocafe',
  logo: 'https://example.com/spotify-icon.png',
  data: {
    id: 'spotify',
    type: 'platforms',
    name: 'Spotify',
    description: 'Listen on Spotify',
    url: 'https://spotify.com/crocafe',
    logo: 'https://example.com/spotify-icon.png',
  },
  collection: 'en-platforms',
};

const mockBrand: Brand = {
  id: 'example-brand',
  name: 'Example Brand',
  description: 'An example brand for testing',
  logo_url: 'https://example.com/brand-logo.png',
  website_url: 'https://example.com/brand',
  iconUrl: 'https://example.com/brand-icon.png',
  language: 'en',
  type: 'brand',
  canonicalUrl: 'https://example.com/brand',
};

describe('Structured Data Generator', () => {
  describe('Person Schema', () => {
    it('generates valid person schema', () => {
      const personSchema = StructuredDataGenerator.generatePersonSchema(mockPerson);

      expect(personSchema).toHaveProperty('@context', 'https://schema.org');
      expect(personSchema).toHaveProperty('@type', 'Person');
      expect(personSchema.name).toBe('John Doe');
      expect(personSchema.description).toBe('A renowned expert in conversion optimization');
      expect(personSchema.sameAs).toEqual(['https://twitter.com/johndoe']);
    });
  });

  describe('Episode Schema', () => {
    it('generates valid episode schema', () => {
      const episodeSchema = StructuredDataGenerator.generateEpisodeSchema(mockEpisode);

      expect(episodeSchema).toHaveProperty('@context', 'https://schema.org');
      expect(episodeSchema).toHaveProperty('@type', 'PodcastEpisode');
      expect(episodeSchema.name).toBe('Mastering Conversion Rates');
      expect(episodeSchema.duration).toBe('PT3600S');
      expect(episodeSchema.partOfSeries).toHaveProperty('name', 'CRO.CAFE Podcast');
    });
  });

  describe('Quote Schema', () => {
    it('generates valid quote schema', () => {
      const quoteSchema = StructuredDataGenerator.generateQuoteSchema(mockQuote);

      expect(quoteSchema).toHaveProperty('@context', 'https://schema.org');
      expect(quoteSchema).toHaveProperty('@type', 'Quotation');
      expect(quoteSchema.text).toBe('Conversion is all about understanding user behavior');
      expect(quoteSchema.citation).toHaveProperty('name', 'mastering-conversion-rates');
    });
  });

  describe('Platform Schema', () => {
    it('generates valid platform schema', () => {
      const platformSchema = StructuredDataGenerator.generatePlatformSchema(mockPlatform);

      expect(platformSchema).toHaveProperty('@context', 'https://schema.org');
      expect(platformSchema).toHaveProperty('@type', 'WebSite');
      expect(platformSchema.name).toBe('Spotify');
      expect(platformSchema.url).toBe('https://spotify.com/crocafe');
    });
  });

  describe('Brand Schema', () => {
    it('generates valid brand schema', () => {
      const brandSchema = StructuredDataGenerator.generateBrandSchema(mockBrand);

      expect(brandSchema).toHaveProperty('@context', 'https://schema.org');
      expect(brandSchema).toHaveProperty('@type', 'Organization');
      expect(brandSchema.name).toBe('Example Brand');
      expect(brandSchema.description).toBe('An example brand for testing');
      expect(brandSchema.url).toBe('https://example.com/brand');
      expect(brandSchema.logo).toBe('https://example.com/brand-logo.png');
    });
  });

  describe('Schema Rendering', () => {
    it('renders schema as a script tag', () => {
      const personSchema = StructuredDataGenerator.generatePersonSchema(mockPerson);
      const renderedSchema = StructuredDataGenerator.renderSchema(personSchema);

      expect(renderedSchema).toContain('<script type="application/ld+json">');
      expect(renderedSchema).toContain('John Doe');
      expect(renderedSchema).toMatch(/<\/script>$/);
    });
  });

  describe('Schema Validation', () => {
    it('ensures all schemas have required properties', () => {
      const personSchema = StructuredDataGenerator.generatePersonSchema(mockPerson);
      const episodeSchema = StructuredDataGenerator.generateEpisodeSchema(mockEpisode);
      const quoteSchema = StructuredDataGenerator.generateQuoteSchema(mockQuote);
      const platformSchema = StructuredDataGenerator.generatePlatformSchema(mockPlatform);
      const brandSchema = StructuredDataGenerator.generateBrandSchema(mockBrand);

      const schemas = [personSchema, episodeSchema, quoteSchema, platformSchema, brandSchema];

      schemas.forEach((schema) => {
        expect(schema).toHaveProperty('@context');
        expect(schema).toHaveProperty('@type');
        expect(schema['@context']).toBe('https://schema.org');
      });
    });
  });
});
