import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { LANGUAGES, type Language } from '../utils/language';

interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

const SITE_URL = 'https://cro.cafe';

/**
 * Format a date to YYYY-MM-DD format
 * @param input Date to format
 * @returns Formatted date string
 */
function formatDate(input: string | Date | undefined): string {
  const now = new Date();
  const fallback = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')}`;

  if (!input) {
    return fallback;
  }

  try {
    const date = input instanceof Date ? input : new Date(input);
    if (isNaN(date.getTime())) {
      return fallback;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  } catch {
    return fallback;
  }
}

function generateSitemapXML(entries: SitemapEntry[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${entries
    .map(
      (entry) => `
  <url>
    <loc>${entry.url}</loc>
    ${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}
    ${entry.changefreq ? `<changefreq>${entry.changefreq}</changefreq>` : ''}
    ${entry.priority ? `<priority>${entry.priority}</priority>` : ''}
  </url>`
    )
    .join('')}
</urlset>`;
}

async function getContentEntries(): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];

  // Add static pages for each language
  Object.keys(LANGUAGES).forEach((lang) => {
    entries.push({
      url: `${SITE_URL}/${lang}`,
      changefreq: 'daily',
      priority: 1.0,
    });

    // Add other static pages
    ['about', 'contact'].forEach((page) => {
      entries.push({
        url: `${SITE_URL}/${lang}/${page}`,
        changefreq: 'monthly',
        priority: 0.8,
      });
    });
  });

  // Add dynamic content
  for (const lang of Object.keys(LANGUAGES) as Language[]) {
    try {
      // Episodes
      const episodes = await getCollection(`${lang}-episodes`);
      episodes.forEach((episode) => {
        entries.push({
          url: `${SITE_URL}/${lang}/episodes/${episode.data.id}`,
          lastmod: formatDate(episode.data.attributes?.published_at),
          changefreq: 'weekly',
          priority: 0.9,
        });
      });

      // Guests
      const guests = await getCollection(`${lang}-guests`);
      guests.forEach((guest) => {
        entries.push({
          url: `${SITE_URL}/${lang}/guests/${guest.data.id}`,
          changefreq: 'monthly',
          priority: 0.7,
        });
      });

      // Platforms - only available in specific languages
      if (lang === 'en' || lang === 'de') {
        const platforms = await getCollection(`${lang}-platforms` as const);
        platforms.forEach((platform) => {
          if ('id' in platform.data) {
            entries.push({
              url: `${SITE_URL}/${lang}/platforms/${platform.data.id}`,
              changefreq: 'monthly',
              priority: 0.6,
            });
          }
        });
      }
    } catch (error) {
      console.error(`Error processing ${lang} content:`, error);
    }
  }

  return entries;
}

export const get = async () => {
  const entries = await getContentEntries();
  const sitemap = generateSitemapXML(entries);

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
