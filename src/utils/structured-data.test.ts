import { describe, it, expect } from 'vitest';
import { StructuredDataGenerator } from './structured-data';
import type { Episode, Person, Quote, Platform } from '~/types';

// Mock data for testing
const mockPerson: Person = {
  name: 'John Doe',
  role: 'Guest Expert',
  bio: 'A renowned expert in conversion optimization',
  image_url: 'https://example.com/john-doe.jpg',
  social_links: [{ platform: 'Twitter', url: 'https://twitter.com/johndoe' }],
};

const mockEpisode: Episode = {
  title: 'Mastering Conversion Rates',
  description: 'Deep dive into conversion rate optimization strategies',
  date: new Date('2023-01-15'),
  duration: 3600, // 1 hour
  audio_url: 'https://example.com/podcast/episode1.mp3',
  transcript_url: 'https://example.com/podcast/episode1-transcript.txt',
  guests: [mockPerson],
  platforms: [],
  quotes: [],
};

const mockQuote: Quote = {
  text: 'Conversion is all about understanding user behavior',
  author: mockPerson,
  episode: mockEpisode,
  timestamp: 1800, // 30 minutes into the episode
};

const mockPlatform: Platform = {
  name: 'Spotify',
  description: 'Listen on Spotify',
  url: 'https://spotify.com/crocafe',
  icon_url: 'https://example.com/spotify-icon.png',
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
      expect(quoteSchema.citation).toHaveProperty('name', 'Mastering Conversion Rates');
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

      const schemas = [personSchema, episodeSchema, quoteSchema, platformSchema];

      schemas.forEach((schema) => {
        expect(schema).toHaveProperty('@context');
        expect(schema).toHaveProperty('@type');
        expect(schema['@context']).toBe('https://schema.org');
      });
    });
  });
});
