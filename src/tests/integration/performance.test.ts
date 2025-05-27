import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCollection } from 'astro:content';

// Mock Astro content collections
vi.mock('astro:content', () => ({
  getCollection: vi.fn(),
}));

// Performance test utilities
const measurePerformance = async (fn: () => Promise<any>) => {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  return {
    result,
    duration: end - start,
  };
};

const generateMockEpisodes = (count: number) => {
  return Array.from({ length: count }, (_, index) => ({
    id: `episode-${index}`,
    collection: 'en-episodes',
    data: {
      id: `${index}`,
      type: 'episode',
      attributes: {
        title: `Episode ${index}`,
        summary: `Summary for episode ${index}`,
        description: `Description for episode ${index}`,
        status: 'published',
        published_at: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
        media_url: `https://example.com/episode-${index}.mp3`,
        duration: 1800 + index * 60,
        duration_in_mmss: `${Math.floor((1800 + index * 60) / 60)}:${((1800 + index * 60) % 60)
          .toString()
          .padStart(2, '0')}`,
        formatted_published_at: new Date(
          Date.now() - index * 24 * 60 * 60 * 1000
        ).toLocaleDateString(),
        clean_description: `Description for episode ${index}`,
        image_url: `https://example.com/episode-${index}.jpg`,
        local_image_url: `/images/episodes/en/episode-${index}.webp`,
        slug: `episode-${index}`,
        number: index + 1,
        season: Math.floor(index / 10) + 1,
        explicit: false,
        keywords: [`keyword-${index}`, `tag-${index}`],
        guests: index % 3 === 0 ? [{ name: `Guest ${index}`, slug: `guest-${index}` }] : [],
      },
    },
  }));
};

describe('Performance Benchmarking Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Collection Loading Performance', () => {
    it('should load small collections efficiently (< 100 episodes)', async () => {
      const mockGetCollection = vi.mocked(getCollection);
      const smallCollection = generateMockEpisodes(50);
      mockGetCollection.mockResolvedValue(smallCollection);

      const { duration, result } = await measurePerformance(async () => {
        return await getCollection('en-episodes');
      });

      expect(result).toHaveLength(50);
      expect(duration).toBeLessThan(50); // Should complete in under 50ms
    });

    it('should load medium collections efficiently (100-500 episodes)', async () => {
      const mockGetCollection = vi.mocked(getCollection);
      const mediumCollection = generateMockEpisodes(250);
      mockGetCollection.mockResolvedValue(mediumCollection);

      const { duration, result } = await measurePerformance(async () => {
        return await getCollection('en-episodes');
      });

      expect(result).toHaveLength(250);
      expect(duration).toBeLessThan(100); // Should complete in under 100ms
    });

    it('should load large collections efficiently (500+ episodes)', async () => {
      const mockGetCollection = vi.mocked(getCollection);
      const largeCollection = generateMockEpisodes(1000);
      mockGetCollection.mockResolvedValue(largeCollection);

      const { duration, result } = await measurePerformance(async () => {
        return await getCollection('en-episodes');
      });

      expect(result).toHaveLength(1000);
      expect(duration).toBeLessThan(200); // Should complete in under 200ms
    });
  });

  describe('Data Processing Performance', () => {
    it('should sort episodes efficiently', async () => {
      const episodes = generateMockEpisodes(500);

      const { duration, result } = await measurePerformance(async () => {
        return episodes.sort((a, b) => {
          const dateA = new Date(b.data.attributes.published_at);
          const dateB = new Date(a.data.attributes.published_at);
          return dateA.valueOf() - dateB.valueOf();
        });
      });

      expect(result).toHaveLength(500);
      expect(duration).toBeLessThan(50); // Sorting should be fast

      // Verify sorting is correct (newest first)
      for (let i = 0; i < result.length - 1; i++) {
        const currentDate = new Date(result[i].data.attributes.published_at);
        const nextDate = new Date(result[i + 1].data.attributes.published_at);
        expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
      }
    });

    it('should filter episodes efficiently', async () => {
      const episodes = generateMockEpisodes(1000);

      const { duration, result } = await measurePerformance(async () => {
        return episodes.filter((episode) => episode.data.attributes.guests.length > 0);
      });

      expect(duration).toBeLessThan(30); // Filtering should be very fast

      // Verify all results have guests
      result.forEach((episode) => {
        expect(episode.data.attributes.guests.length).toBeGreaterThan(0);
      });
    });

    it('should slice collections efficiently', async () => {
      const episodes = generateMockEpisodes(1000);
      const limits = [5, 10, 20, 50];

      for (const limit of limits) {
        const { duration, result } = await measurePerformance(async () => {
          return episodes.slice(0, limit);
        });

        expect(result).toHaveLength(limit);
        expect(duration).toBeLessThan(10); // Slicing should be very fast
      }
    });
  });

  describe('Multi-language Performance', () => {
    it('should handle concurrent language collection loading', async () => {
      const mockGetCollection = vi.mocked(getCollection);
      const languages = ['en', 'de', 'es', 'nl'];

      mockGetCollection.mockImplementation((collectionName) => {
        const episodes = generateMockEpisodes(100);
        return Promise.resolve(episodes);
      });

      const { duration } = await measurePerformance(async () => {
        const promises = languages.map((lang) => getCollection(`${lang}-episodes` as any));
        return await Promise.all(promises);
      });

      expect(duration).toBeLessThan(150); // Concurrent loading should be efficient
    });

    it('should handle sequential language collection loading', async () => {
      const mockGetCollection = vi.mocked(getCollection);
      const languages = ['en', 'de', 'es', 'nl'];

      mockGetCollection.mockImplementation((collectionName) => {
        const episodes = generateMockEpisodes(100);
        return Promise.resolve(episodes);
      });

      const { duration } = await measurePerformance(async () => {
        const results = [];
        for (const lang of languages) {
          const episodes = await getCollection(`${lang}-episodes` as any);
          results.push(episodes);
        }
        return results;
      });

      expect(duration).toBeLessThan(200); // Sequential loading should still be reasonable
    });
  });

  describe('Memory Usage Optimization', () => {
    it('should handle large datasets without memory issues', async () => {
      const mockGetCollection = vi.mocked(getCollection);

      // Simulate processing multiple large collections
      const collections = ['en-episodes', 'de-episodes', 'es-episodes', 'nl-episodes'];

      for (const collection of collections) {
        const largeCollection = generateMockEpisodes(500);
        mockGetCollection.mockResolvedValue(largeCollection);

        const { duration, result } = await measurePerformance(async () => {
          const episodes = await getCollection(collection as any);
          // Simulate processing (sorting + filtering + slicing)
          return episodes
            .sort(
              (a, b) =>
                new Date(b.data.attributes.published_at).getTime() -
                new Date(a.data.attributes.published_at).getTime()
            )
            .filter((ep) => ep.data.attributes.status === 'published')
            .slice(0, 10);
        });

        expect(result).toHaveLength(10);
        expect(duration).toBeLessThan(100);
      }
    });

    it('should efficiently process guest relationships', async () => {
      const episodes = generateMockEpisodes(200);
      const guests = Array.from({ length: 50 }, (_, index) => ({
        id: `guest-${index}`,
        data: {
          name: `Guest ${index}`,
          slug: `guest-${index}`,
          bio: `Bio for guest ${index}`,
        },
      }));

      const { duration } = await measurePerformance(async () => {
        // Simulate guest lookup for episodes
        return episodes.map((episode) => ({
          ...episode,
          guestDetails: episode.data.attributes.guests
            .map((guest) => guests.find((g) => g.id === guest.slug))
            .filter(Boolean),
        }));
      });

      expect(duration).toBeLessThan(50); // Guest relationship processing should be fast
    });
  });

  describe('Build Performance', () => {
    it('should simulate page generation performance', async () => {
      const episodes = generateMockEpisodes(100);

      const { duration } = await measurePerformance(async () => {
        // Simulate page generation for each episode
        return episodes.map((episode) => ({
          url: `/en/episodes/${episode.data.attributes.slug}`,
          title: episode.data.attributes.title,
          description: episode.data.attributes.clean_description,
          publishedAt: episode.data.attributes.published_at,
          guests: episode.data.attributes.guests,
        }));
      });

      expect(duration).toBeLessThan(30); // Page data generation should be fast
    });

    it('should simulate sitemap generation performance', async () => {
      const mockGetCollection = vi.mocked(getCollection);
      const languages = ['en', 'de', 'es', 'nl'];

      mockGetCollection.mockImplementation((collectionName) => {
        if (collectionName.includes('episodes')) {
          return Promise.resolve(generateMockEpisodes(100));
        }
        return Promise.resolve([]);
      });

      const { duration } = await measurePerformance(async () => {
        const sitemapUrls = [];

        for (const lang of languages) {
          const episodes = await getCollection(`${lang}-episodes` as any);

          episodes.forEach((episode) => {
            sitemapUrls.push({
              url: `https://cro.cafe/${lang}/episodes/${episode.data.attributes.slug}`,
              lastmod: episode.data.attributes.published_at,
              changefreq: 'weekly',
              priority: 0.8,
            });
          });
        }

        return sitemapUrls;
      });

      expect(duration).toBeLessThan(200); // Sitemap generation should be efficient
    });
  });

  describe('Performance Regression Detection', () => {
    it('should maintain consistent performance across test runs', async () => {
      const mockGetCollection = vi.mocked(getCollection);
      const episodes = generateMockEpisodes(300);
      mockGetCollection.mockResolvedValue(episodes);

      const runs = 5;
      const durations: number[] = [];

      for (let i = 0; i < runs; i++) {
        const { duration } = await measurePerformance(async () => {
          const data = await getCollection('en-episodes');
          return data
            .sort(
              (a, b) =>
                new Date(b.data.attributes.published_at).getTime() -
                new Date(a.data.attributes.published_at).getTime()
            )
            .slice(0, 10);
        });
        durations.push(duration);
      }

      // Check that performance is consistent (no run should be more than 2x slower than the fastest)
      const minDuration = Math.min(...durations);
      const maxDuration = Math.max(...durations);

      expect(maxDuration).toBeLessThan(minDuration * 2);
      expect(durations.every((d) => d < 150)).toBe(true); // All runs should be under 150ms
    });
  });
});
