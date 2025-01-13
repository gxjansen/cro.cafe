import type { APIRoute } from 'astro';

const languages = ['en', 'nl', 'de', 'es'] as const;

export const GET: APIRoute = async () => {
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${languages
  .map(
    (lang) => `  <sitemap>
    <loc>https://www.cro.cafe/sitemap-${lang}.xml</loc>
  </sitemap>`
  )
  .join('\n')}
</sitemapindex>`;

  return new Response(sitemapIndex, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
