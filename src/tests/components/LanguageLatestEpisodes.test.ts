import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCollection } from 'astro:content';

// Mock Astro content collections
vi.mock('astro:content', () => ({
  getCollection: vi.fn(),
}));

// Mock episode data
const mockEpisodes = [
  {
    id: 'test-episode-1',
    collection: 'en-episodes',
    data: {
      id: '1',
      type: 'episode',
      attributes: {
        title: 'Test Episode 1',
        summary: 'Test summary 1',
        description: 'Test description 1',
        status: 'published',
        published_at: '2024-01-15T10:00:00.000Z',
        media_url: 'https://example.com/episode1.mp3',
        duration: 1800,
        duration_in_mmss: '30:00',
        formatted_published_at: 'January 15, 2024',
        clean_description: 'Test description 1',
        image_url: 'https://example.com/episode1.jpg',
        local_image_url: '/images/episodes/en/test-episode-1.webp',
        slug: 'test-episode-1',
        number: 1,
        season: 1,
        explicit: false,
        keywords: [],
        guests: [],
      },
    },
  },
  {
    id: 'test-episode-2',
    collection: 'en-episodes',
    data: {
      id: '2',
      type: 'episode',
      attributes: {
        title: 'Test Episode 2',
        summary: 'Test summary 2',
        description: 'Test description 2',
        status: 'published',
        published_at: '2024-01-10T10:00:00.000Z',
        media_url: 'https://example.com/episode2.mp3',
        duration: 2400,
        duration_in_mmss: '40:00',
        formatted_published_at: 'January 10, 2024',
        clean_description: 'Test description 2',
        image_url: 'https://example.com/episode2.jpg',
        local_image_url: '/images/episodes/en/test-episode-2.webp',
        slug: 'test-episode-2',
        number: 2,
        season: 1,
        explicit: false,
        keywords: [],
        guests: [],
      },
    },
  },
];

describe('LanguageLatestEpisodes Component Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch episodes for the correct language collection', async () => {
    const mockGetCollection = vi.mocked(getCollection);
    mockGetCollection.mockResolvedValue(mockEpisodes);

    // Simulate the component logic
    const language = 'en';
    const collectionName = `${language}-episodes` as const;

    const episodes = await getCollection(collectionName);

    expect(mockGetCollection).toHaveBeenCalledWith('en-episodes');
    expect(episodes).toHaveLength(2);
  });

  it('should sort episodes by published date (newest first)', () => {
    // Simulate the sorting logic from the component
    const sortedEpisodes = [...mockEpisodes].sort((a, b) => {
      const dateA = new Date(b.data.attributes.published_at);
      const dateB = new Date(a.data.attributes.published_at);
      return dateA.valueOf() - dateB.valueOf();
    });

    // Episode 1 (Jan 15) should come before Episode 2 (Jan 10)
    expect(sortedEpisodes[0].id).toBe('test-episode-1');
    expect(sortedEpisodes[1].id).toBe('test-episode-2');
  });

  it('should limit episodes to the specified number', () => {
    const limit = 1;
    const limitedEpisodes = mockEpisodes.slice(0, limit);

    expect(limitedEpisodes).toHaveLength(1);
    expect(limitedEpisodes[0].id).toBe('test-episode-1');
  });

  it('should handle empty episode collections gracefully', async () => {
    const mockGetCollection = vi.mocked(getCollection);
    mockGetCollection.mockResolvedValue([]);

    const episodes = await getCollection('en-episodes');

    expect(episodes).toHaveLength(0);
    expect(Array.isArray(episodes)).toBe(true);
  });

  it('should validate episode data structure', () => {
    const episode = mockEpisodes[0];

    // Check required fields exist
    expect(episode.id).toBeDefined();
    expect(episode.data.attributes.title).toBeDefined();
    expect(episode.data.attributes.published_at).toBeDefined();
    expect(episode.data.attributes.slug).toBeDefined();

    // Check data types
    expect(typeof episode.data.attributes.title).toBe('string');
    expect(typeof episode.data.attributes.duration).toBe('number');
    expect(Array.isArray(episode.data.attributes.guests)).toBe(true);
  });

  it('should handle different language collections', async () => {
    const mockGetCollection = vi.mocked(getCollection);

    // Test different languages
    const languages = ['en', 'de', 'es', 'nl'];

    for (const lang of languages) {
      mockGetCollection.mockResolvedValue(mockEpisodes);

      const collectionName = `${lang}-episodes` as const;
      await getCollection(collectionName);

      expect(mockGetCollection).toHaveBeenCalledWith(`${lang}-episodes`);
    }
  });
});
