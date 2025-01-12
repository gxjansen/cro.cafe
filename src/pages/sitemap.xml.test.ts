import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { GET } from './sitemap.xml';

// Mock getCollection
vi.mock('astro:content', () => ({
  getCollection: vi.fn(),
}));

describe('Sitemap Generation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generates valid XML sitemap with correct headers', async () => {
    // Mock content collections
    (getCollection as jest.Mock).mockImplementation((collection: string) => {
      if (collection === 'en-episodes') {
        return Promise.resolve([
          {
            data: {
              id: 'episode-1',
              date: '2024-01-01',
              language: 'en',
              title: 'Test Episode',
              description: 'Test Description',
              duration: 3600,
              audio_url: 'https://example.com/audio.mp3',
              guests: [],
              topics: [],
              transcript: '',
            },
          },
        ]);
      }
      if (collection === 'en-guests') {
        return Promise.resolve([
          {
            data: {
              id: 'guest-1',
              language: 'en',
              name: 'Test Guest',
              role: 'Test Role',
              bio: 'Test Bio',
              image_url: 'https://example.com/image.jpg',
              social_links: [],
            },
          },
        ]);
      }
      return Promise.resolve([]);
    });

    const response = await GET({} as Parameters<APIRoute>[0]);
    const sitemap = await response.text();

    // Verify response headers
    expect(response.headers.get('Content-Type')).toBe('application/xml');
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=3600');

    // Verify XML structure
    expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(sitemap).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');

    // Verify content entries
    expect(sitemap).toContain('<loc>https://cro.cafe/en/episodes/episode-1</loc>');
    expect(sitemap).toContain('<lastmod>2024-01-01</lastmod>');
    expect(sitemap).toContain('<loc>https://cro.cafe/en/guests/guest-1</loc>');

    // Verify static pages
    expect(sitemap).toContain('<loc>https://cro.cafe/en</loc>');
    expect(sitemap).toContain('<loc>https://cro.cafe/en/about</loc>');
    expect(sitemap).toContain('<loc>https://cro.cafe/en/contact</loc>');
  });

  it('handles empty content collections gracefully', async () => {
    // Mock empty collections
    (getCollection as jest.Mock).mockResolvedValue([]);

    const response = await GET({} as Parameters<APIRoute>[0]);
    const sitemap = await response.text();

    // Should still include static pages
    expect(sitemap).toContain('<loc>https://cro.cafe/en</loc>');
    expect(sitemap).toContain('<loc>https://cro.cafe/de</loc>');
    expect(sitemap).toContain('<loc>https://cro.cafe/es</loc>');
    expect(sitemap).toContain('<loc>https://cro.cafe/nl</loc>');
  });

  it('includes correct priorities and change frequencies', async () => {
    (getCollection as jest.Mock).mockResolvedValue([]);

    const response = await GET({} as Parameters<APIRoute>[0]);
    const sitemap = await response.text();

    // Check homepage priority
    // Check homepage priority and frequency
    expect(sitemap).toContain('<priority>1</priority>');
    expect(sitemap).toContain('<changefreq>daily</changefreq>');

    // Check static pages priority and frequency
    expect(sitemap).toMatch(/<loc>https:\/\/cro\.cafe\/[a-z]{2}\/about<\/loc>/);
    expect(sitemap).toMatch(/<priority>0\.8<\/priority>/);
    expect(sitemap).toMatch(/<changefreq>monthly<\/changefreq>/);
  });

  it('handles errors in content collection gracefully', async () => {
    // Mock collection error
    (getCollection as jest.Mock).mockRejectedValue(new Error('Collection error'));

    const response = await GET({} as Parameters<APIRoute>[0]);
    const sitemap = await response.text();

    // Should still generate valid XML with static pages
    expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(sitemap).toContain('<urlset');
    expect(sitemap).toContain('<loc>https://cro.cafe/en</loc>');
  });
});
