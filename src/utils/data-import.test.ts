import { describe, it, expect, beforeEach } from 'vitest';
import { importEpisodes, importPeople, importPlatforms, importQuotes } from './data-import';
import { clearSlugRegistry } from './permalinks';

describe('Data Import Utilities', () => {
  beforeEach(() => {
    // Clear slug registry before each test to ensure clean state
    clearSlugRegistry();
  });

  describe('Episode Import', () => {
    it('should import episodes with valid slugs', () => {
      const episodes = importEpisodes('project/current-site-data/English/CRO.CAFE - Episodes.csv');
      expect(episodes).toBeInstanceOf(Array);
      expect(episodes.length).toBeGreaterThan(0);

      const firstEpisode = episodes[0]!;
      expect(firstEpisode).toBeDefined();
      expect(firstEpisode.id).toMatch(/^[a-z0-9-]+$/);
      expect(firstEpisode.title).toBe('Test Episode 1');
      expect(firstEpisode.description).toBe('A test episode description');
      expect(firstEpisode.audio_url).toBe('https://example.com/audio1.mp3');
      expect(firstEpisode.transcript_url).toBe('https://example.com/transcript1.txt');
      expect(firstEpisode.guests).toEqual([]);
      expect(firstEpisode.platforms).toEqual([]);
      expect(firstEpisode.quotes).toEqual([]);
      expect(firstEpisode.language).toBe('en');
      expect(firstEpisode.type).toBe('podcast');
    });

    it('should handle duplicate episode titles by appending numbers', () => {
      clearSlugRegistry(); // Ensure clean state
      const episodes = importEpisodes('project/current-site-data/English/CRO.CAFE - Episodes.csv');
      const duplicateEpisodes = importEpisodes(
        'project/current-site-data/English/CRO.CAFE - Episodes.csv'
      );

      expect(episodes[0]!.id).not.toBe(duplicateEpisodes[0]!.id);
      expect(duplicateEpisodes[0]!.id).toMatch(/-\d+$/);
    });
  });

  describe('People Import', () => {
    it('should import people with valid slugs', () => {
      const people = importPeople('project/current-site-data/English/CRO.CAFE - People.csv');
      expect(people).toBeInstanceOf(Array);
      expect(people.length).toBeGreaterThan(0);

      const firstPerson = people[0]!;
      expect(firstPerson).toBeDefined();
      expect(firstPerson.id).toMatch(/^[a-z0-9-]+$/);
      expect(firstPerson.name).toBe('John Doe');
      expect(firstPerson.role).toBe('Guest');
      expect(firstPerson.bio).toBe('A test guest bio');
      expect(firstPerson.image_url).toBe('https://example.com/john.jpg');
      expect(firstPerson.social_links).toEqual([]);
      expect(firstPerson.language).toBe('en');
      expect(firstPerson.type).toBe('guest');
    });
  });

  describe('Platform Import', () => {
    it('should import platforms with valid slugs', () => {
      const platforms = importPlatforms(
        'project/current-site-data/English/CRO.CAFE - Platforms.csv'
      );
      expect(platforms).toBeInstanceOf(Array);
      expect(platforms.length).toBeGreaterThan(0);

      const firstPlatform = platforms[0]!;
      expect(firstPlatform).toBeDefined();
      expect(firstPlatform.id).toMatch(/^[a-z0-9-]+$/);
      expect(firstPlatform.name).toBe('Platform 1');
      expect(firstPlatform.description).toBe('A test platform');
      expect(firstPlatform.url).toBe('https://example.com/platform1');
      expect(firstPlatform.icon_url).toBe('https://example.com/icon1.png');
      expect(firstPlatform.language).toBe('en');
      expect(firstPlatform.type).toBe('platform');
    });
  });

  describe('Quote Import', () => {
    it('should import quotes with valid slugs', () => {
      const quotes = importQuotes('project/current-site-data/English/CRO.CAFE - Quotes.csv');
      expect(quotes).toBeInstanceOf(Array);
      expect(quotes.length).toBeGreaterThan(0);

      const firstQuote = quotes[0]!;
      expect(firstQuote).toBeDefined();
      expect(firstQuote.id).toMatch(/^[a-z0-9-]+$/);
      expect(firstQuote.text).toBe('A test quote');
      expect(firstQuote.timestamp).toBe(300);
      expect(firstQuote.episode.title).toBe('Test Episode 1');
      expect(firstQuote.author.name).toBe('John Doe');
      expect(firstQuote.language).toBe('en');
      expect(firstQuote.type).toBe('quote');
    });

    it('should handle invalid timestamps gracefully', () => {
      const quotes = importQuotes('project/current-site-data/English/CRO.CAFE - Quotes.csv');
      expect(quotes.every((quote) => !isNaN(quote.timestamp))).toBe(true);
    });
  });
});
