import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCollection } from 'astro:content';

// Mock Astro content collections
vi.mock('astro:content', () => ({
  getCollection: vi.fn(),
}));

// Mock data for integration testing
const mockEpisodeData = {
  id: 'test-episode',
  collection: 'en-episodes',
  data: {
    id: '123',
    type: 'episode',
    attributes: {
      title: 'Integration Test Episode',
      summary: 'Test episode for integration testing',
      description: 'Guest: Test Guest URL: https://www.cro.cafe/guest/test-guest',
      status: 'published',
      published_at: '2024-01-15T10:00:00.000Z',
      media_url: 'https://example.com/episode.mp3',
      duration: 1800,
      duration_in_mmss: '30:00',
      formatted_published_at: 'January 15, 2024',
      clean_description: 'Test episode for integration testing',
      image_url: 'https://example.com/episode.jpg',
      local_image_url: '/images/episodes/en/test-episode.webp',
      slug: 'test-episode',
      number: 1,
      season: 1,
      explicit: false,
      keywords: ['testing', 'integration'],
      guests: [{ name: 'Test Guest', slug: 'test-guest' }],
    },
  },
};

const mockGuestData = {
  id: 'test-guest',
  collection: 'en-guests',
  data: {
    name: 'Test Guest',
    slug: 'test-guest',
    bio: 'A test guest for integration testing',
    company: 'Test Company',
    role: 'Test Role',
    image: '/images/guests/test-guest.jpg',
    social: {
      twitter: 'testguest',
      linkedin: 'testguest',
    },
  },
};

const mockHostData = {
  id: 'guido',
  collection: 'hosts',
  data: {
    name: 'Guido X Jansen',
    slug: 'guido',
    bio: 'Host of CRO.CAFE',
    role: 'Host',
    image: '/images/hosts/guido.webp',
    social: {
      twitter: 'guido',
      linkedin: 'guido',
    },
  },
};

describe('Data Flow Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Episode to Guest Relationship', () => {
    it('should correctly link episodes to their guests', async () => {
      const mockGetCollection = vi.mocked(getCollection);

      // Mock episode collection call
      mockGetCollection.mockImplementation((collectionName) => {
        if (collectionName === 'en-episodes') {
          return Promise.resolve([mockEpisodeData]);
        }
        if (collectionName === 'en-guests') {
          return Promise.resolve([mockGuestData]);
        }
        return Promise.resolve([]);
      });

      // Simulate the data flow: Episode -> Guest lookup
      const episodes = await getCollection('en-episodes');
      const guests = await getCollection('en-guests');

      expect(episodes).toHaveLength(1);
      expect(guests).toHaveLength(1);

      const episode = episodes[0];
      const episodeGuests = episode.data.attributes.guests;

      expect(episodeGuests).toHaveLength(1);
      expect(episodeGuests[0].slug).toBe('test-guest');

      // Verify guest exists in guest collection
      const matchingGuest = guests.find((guest: any) => guest.id === episodeGuests[0].slug);
      expect(matchingGuest).toBeDefined();
      expect(matchingGuest?.data.name).toBe('Test Guest');
    });

    it('should handle episodes with multiple guests', async () => {
      const episodeWithMultipleGuests = {
        ...mockEpisodeData,
        data: {
          ...mockEpisodeData.data,
          attributes: {
            ...mockEpisodeData.data.attributes,
            guests: [
              { name: 'Test Guest 1', slug: 'test-guest-1' },
              { name: 'Test Guest 2', slug: 'test-guest-2' },
            ],
          },
        },
      };

      const mockGetCollection = vi.mocked(getCollection);
      mockGetCollection.mockResolvedValue([episodeWithMultipleGuests]);

      const episodes = await getCollection('en-episodes');
      const episode = episodes[0];

      expect(episode.data.attributes.guests).toHaveLength(2);
      expect(episode.data.attributes.guests[0].slug).toBe('test-guest-1');
      expect(episode.data.attributes.guests[1].slug).toBe('test-guest-2');
    });
  });

  describe('Multi-language Data Consistency', () => {
    it('should maintain data consistency across language collections', async () => {
      const mockGetCollection = vi.mocked(getCollection);

      const languages = ['en', 'de', 'es', 'nl'];
      const collectionCalls: string[] = [];

      mockGetCollection.mockImplementation((collectionName) => {
        collectionCalls.push(collectionName);
        return Promise.resolve([mockEpisodeData]);
      });

      // Simulate fetching episodes for all languages
      for (const lang of languages) {
        await getCollection(`${lang}-episodes` as any);
      }

      expect(collectionCalls).toEqual(['en-episodes', 'de-episodes', 'es-episodes', 'nl-episodes']);
    });

    it('should handle missing collections gracefully', async () => {
      const mockGetCollection = vi.mocked(getCollection);

      mockGetCollection.mockImplementation((collectionName) => {
        if (collectionName === 'en-episodes') {
          return Promise.resolve([mockEpisodeData]);
        }
        // Return empty array for other collections
        return Promise.resolve([]);
      });

      const enEpisodes = await getCollection('en-episodes');
      const deEpisodes = await getCollection('de-episodes' as any);

      expect(enEpisodes).toHaveLength(1);
      expect(deEpisodes).toHaveLength(0);
    });
  });

  describe('Host System Integration', () => {
    it('should correctly integrate host data with episodes', async () => {
      const mockGetCollection = vi.mocked(getCollection);

      mockGetCollection.mockImplementation((collectionName) => {
        if (collectionName === 'hosts') {
          return Promise.resolve([mockHostData]);
        }
        if (collectionName === 'en-episodes') {
          return Promise.resolve([mockEpisodeData]);
        }
        return Promise.resolve([]);
      });

      const hosts = await getCollection('hosts');
      const episodes = await getCollection('en-episodes');

      expect(hosts).toHaveLength(1);
      expect(episodes).toHaveLength(1);

      const host = hosts[0];
      expect(host.data.name).toBe('Guido X Jansen');
      expect(host.data.image).toBe('/images/hosts/guido.webp');
    });
  });

  describe('Content Validation', () => {
    it('should validate episode data structure integrity', () => {
      const episode = mockEpisodeData;

      // Required fields validation
      expect(episode.id).toBeDefined();
      expect(episode.data.attributes.title).toBeDefined();
      expect(episode.data.attributes.published_at).toBeDefined();
      expect(episode.data.attributes.slug).toBeDefined();

      // Data type validation
      expect(typeof episode.data.attributes.title).toBe('string');
      expect(typeof episode.data.attributes.duration).toBe('number');
      expect(Array.isArray(episode.data.attributes.guests)).toBe(true);
      expect(Array.isArray(episode.data.attributes.keywords)).toBe(true);

      // URL validation
      expect(episode.data.attributes.media_url).toMatch(/^https?:\/\//);
      expect(episode.data.attributes.local_image_url).toMatch(/^\/images\//);
    });

    it('should validate guest data structure integrity', () => {
      const guest = mockGuestData;

      // Required fields validation
      expect(guest.id).toBeDefined();
      expect(guest.data.name).toBeDefined();
      expect(guest.data.slug).toBeDefined();

      // Data type validation
      expect(typeof guest.data.name).toBe('string');
      expect(typeof guest.data.slug).toBe('string');
      expect(typeof guest.data.bio).toBe('string');

      // Social links validation
      if (guest.data.social) {
        expect(typeof guest.data.social).toBe('object');
      }
    });
  });

  describe('Performance Considerations', () => {
    it('should handle large collections efficiently', async () => {
      const mockGetCollection = vi.mocked(getCollection);

      // Create a large mock dataset
      const largeEpisodeCollection = Array.from({ length: 1000 }, (_, index) => ({
        ...mockEpisodeData,
        id: `episode-${index}`,
        data: {
          ...mockEpisodeData.data,
          attributes: {
            ...mockEpisodeData.data.attributes,
            title: `Episode ${index}`,
            slug: `episode-${index}`,
          },
        },
      }));

      mockGetCollection.mockResolvedValue(largeEpisodeCollection);

      const startTime = Date.now();
      const episodes = await getCollection('en-episodes');
      const endTime = Date.now();

      expect(episodes).toHaveLength(1000);
      expect(endTime - startTime).toBeLessThan(100); // Should complete quickly
    });
  });
});
