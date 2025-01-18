import { get } from './sitemap.xml';

describe('GET /sitemap.xml', () => {
  it('should return a valid sitemap for en', async () => {
    const response = await get({ params: { lang: 'en' } });
    const sitemap = response.body;

    expect(response.headers['Content-Type']).toBe('application/xml');
    expect(response.headers['Cache-Control']).toBe('public max-age=3600');
    expect(sitemap).toContain(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'
    );
    expect(sitemap).toContain('<loc>/</loc>');
    expect(sitemap).toContain('<loc>/en/about</loc>');
    expect(sitemap).toContain('<loc>/en/contact</loc>');
    expect(sitemap).toContain('<loc>/en/pricing</loc>');
    expect(sitemap).toContain('<loc>/en/privacy</loc>');
    expect(sitemap).toContain('<loc>/en/terms</loc>');
    expect(sitemap).toContain('<loc>/en/subscribe</loc>');
  });

  it('should return a valid sitemap for nl', async () => {
    const response = await get({ params: { lang: 'nl' } });
    const sitemap = response.body;

    expect(response.headers['Content-Type']).toBe('application/xml');
    expect(response.headers['Cache-Control']).toBe('public max-age=3600');
    expect(sitemap).toContain(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'
    );
    expect(sitemap).toContain('<loc>/nl</loc>');
    expect(sitemap).toContain('<loc>/nl/about</loc>');
    expect(sitemap).toContain('<loc>/nl/contact</loc>');
    expect(sitemap).toContain('<loc>/nl/pricing</loc>');
    expect(sitemap).toContain('<loc>/nl/privacy</loc>');
    expect(sitemap).toContain('<loc>/nl/terms</loc>');
    expect(sitemap).toContain('<loc>/nl/subscribe</loc>');
  });

  it('should return a valid sitemap for de', async () => {
    const response = await get({ params: { lang: 'de' } });
    const sitemap = response.body;

    expect(response.headers['Content-Type']).toBe('application/xml');
    expect(response.headers['Cache-Control']).toBe('public max-age=3600');
    expect(sitemap).toContain(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'
    );
    expect(sitemap).toContain('<loc>/de</loc>');
    expect(sitemap).toContain('<loc>/de/about</loc>');
    expect(sitemap).toContain('<loc>/de/contact</loc>');
    expect(sitemap).toContain('<loc>/de/pricing</loc>');
    expect(sitemap).toContain('<loc>/de/privacy</loc>');
    expect(sitemap).toContain('<loc>/de/terms</loc>');
    expect(sitemap).toContain('<loc>/de/subscribe</loc>');
  });

  it('should return a valid sitemap for es', async () => {
    const response = await get({ params: { lang: 'es' } });
    const sitemap = response.body;

    expect(response.headers['Content-Type']).toBe('application/xml');
    expect(response.headers['Cache-Control']).toBe('public max-age=3600');
    expect(sitemap).toContain(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'
    );
    expect(sitemap).toContain('<loc>/es</loc>');
    expect(sitemap).toContain('<loc>/es/about</loc>');
    expect(sitemap).toContain('<loc>/es/contact</loc>');
    expect(sitemap).toContain('<loc>/es/pricing</loc>');
    expect(sitemap).toContain('<loc>/es/privacy</loc>');
    expect(sitemap).toContain('<loc>/es/terms</loc>');
    expect(sitemap).toContain('<loc>/es/subscribe</loc>');
  });
});
