/// <reference types="vitest" />
import { GET } from './sitemap.xml';

describe('GET /sitemap.xml', () => {
  it('should return a valid sitemap index', async () => {
    const response = await GET();
    const sitemap = response.body;

    expect(response.headers.get('Content-Type')).toBe('application/xml');
    expect(response.headers.get('Cache-Control')).toBe('public max-age=3600');
    expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(sitemap).toContain('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

    // Check for language-specific sitemaps
    expect(sitemap).toContain('<loc>https://www.cro.cafe/sitemap-en.xml</loc>');
    expect(sitemap).toContain('<loc>https://www.cro.cafe/sitemap-nl.xml</loc>');
    expect(sitemap).toContain('<loc>https://www.cro.cafe/sitemap-de.xml</loc>');
    expect(sitemap).toContain('<loc>https://www.cro.cafe/sitemap-es.xml</loc>');

    // Check for lastmod dates
    const today = new Date().toISOString().split('T')[0];
    expect(sitemap).toMatch(new RegExp(`<lastmod>${today}`));
  });
});
