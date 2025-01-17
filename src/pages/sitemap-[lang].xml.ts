import { getCollection } from 'astro:content';

const languages = ['en', 'nl', 'de', 'es'] as const;
type Language = (typeof languages)[number];

export async function getStaticPaths() {
  return languages.map((lang) => ({ params: { lang } }));
}

export const get = async ({ params }: { params: { lang: string } }) => {
  const lang = params.lang as Language;

  // Get episodes for this language
  const episodes = await getCollection(`${lang}-episodes`);

  // Sort episodes by date
  const sortedEpisodes = episodes.sort(
    (a, b) =>
      new Date(b.data.attributes.published_at).valueOf() -
      new Date(a.data.attributes.published_at).valueOf()
  );

  // Generate sitemap entries
  const entries = [
    // Homepage entry
    {
      url: lang === 'en' ? '/' : `/${lang}`,
      lastmod: sortedEpisodes[0]?.data.attributes.published_at || new Date().toISOString(),
      alternates: languages.map((l) => ({
        lang: l,
        url: l === 'en' ? 'https://www.cro.cafe/' : `https://www.cro.cafe/${l}`,
      })),
    },
    // Episode entries
    ...sortedEpisodes.map((episode) => ({
      url: `/${lang}/podcast/${episode.data.attributes.slug}`,
      lastmod: episode.data.attributes.published_at,
      alternates: languages.map((l) => ({
        lang: l,
        url: `https://www.cro.cafe/${l}/podcast/${episode.data.attributes.slug}`,
      })),
    })),
  ];

  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries
  .map(
    (entry) => `  <url>
    <loc>https://www.cro.cafe${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
${entry.alternates
  .map(
    (alt) => `    <xhtml:link
      rel="alternate"
      hreflang="${alt.lang}"
      href="${alt.url}"
    />`
  )
  .join('\n')}
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
