export const prerender = true;

const languages = ['en', 'nl', 'de', 'es'] as const;

export const GET = async () => {
  const lastmod = new Date().toISOString();

  // Generate sitemap index entries for each language
  const sitemapEntries = languages.map((lang) => ({
    url: `https://www.cro.cafe/sitemap-${lang}.xml`,
    lastmod,
  }));

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitemapEntries
      .map(
        (entry) => `
    <sitemap>
      <loc>${entry.url}</loc>
      <lastmod>${entry.lastmod}</lastmod>
    </sitemap>`
      )
      .join('')}
  </sitemapindex>`,
    {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public max-age=3600',
      },
    }
  );
};
