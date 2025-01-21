export const prerender = true;
import { getCollection } from 'astro:content';
import type { Episode } from '~/types/episode';
import type { Language } from '~/types';

const languages = ['en', 'nl', 'de', 'es'] as const;

export async function getStaticPaths() {
  return languages.map((lang) => ({ params: { lang } }));
}

export const GET = async ({ params }: { params: { lang: string } }) => {
  const lang = params.lang as Language;

  // Get episodes for this language
  const episodes = await getCollection(`${lang}-episodes`);

  // Sort episodes by date
  const sortedEpisodes = episodes.sort(
    (a: Episode, b: Episode) =>
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
    ...sortedEpisodes.map((episode: Episode) => ({
      url: `/${lang}/podcast/${episode.data.attributes.slug}`,
      lastmod: episode.data.attributes.published_at,
      alternates: languages.map((l) => ({
        lang: l,
        url: `/${l}/podcast/${episode.data.attributes.slug}`,
      })),
    })),
    // Additional entries for other pages
    ...languages.map((l) => ({
      url: `/${l}/episodes`,
      lastmod: new Date().toISOString(),
      alternates: languages.map((altLang) => ({
        lang: altLang,
        url: `/${altLang}/episodes`,
      })),
    })),
    ...languages.map((l) => ({
      url: `/${l}/about`,
      lastmod: new Date().toISOString(),
      alternates: languages.map((altLang) => ({
        lang: altLang,
        url: `/${altLang}/about`,
      })),
    })),
    ...languages.map((l) => ({
      url: `/${l}/contact`,
      lastmod: new Date().toISOString(),
      alternates: languages.map((altLang) => ({
        lang: altLang,
        url: `/${altLang}/contact`,
      })),
    })),
    ...languages.map((l) => ({
      url: `/${l}/pricing`,
      lastmod: new Date().toISOString(),
      alternates: languages.map((altLang) => ({
        lang: altLang,
        url: `/${altLang}/pricing`,
      })),
    })),
    ...languages.map((l) => ({
      url: `/${l}/privacy`,
      lastmod: new Date().toISOString(),
      alternates: languages.map((altLang) => ({
        lang: altLang,
        url: `/${altLang}/privacy`,
      })),
    })),
    ...languages.map((l) => ({
      url: `/${l}/terms`,
      lastmod: new Date().toISOString(),
      alternates: languages.map((altLang) => ({
        lang: altLang,
        url: `/${altLang}/terms`,
      })),
    })),
    ...languages.map((l) => ({
      url: `/${l}/subscribe`,
      lastmod: new Date().toISOString(),
      alternates: languages.map((altLang) => ({
        lang: altLang,
        url: `/${altLang}/subscribe`,
      })),
    })),
  ];

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${entries
    .map(
      (entry) => `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    ${entry.alternates
      .map(
        (alternate: { lang: Language; url: string }) => `
    <xhtml:link
      rel="alternate"
      hreflang="${alternate.lang}"
      href="${alternate.url}"
    />`
      )
      .join('')}
  </url>`
    )
    .join('')}
</urlset>`,
    {
      headers: {
        'Content-Type': 'application/xml',
      },
    }
  );
};
