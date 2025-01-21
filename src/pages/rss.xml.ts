import { getRssString } from '@astrojs/rss';
import { SITE } from '~/config';
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

type Episode = CollectionEntry<'en-episodes'>;

export const GET = async () => {
  const episodes = await getCollection('en-episodes');

  const rss = await getRssString({
    title: SITE.name,
    description: SITE.description,
    site: import.meta.env.SITE,
    items: episodes.map((episode: Episode) => ({
      link: `/en/podcast/${episode.slug}`,
      title: episode.data.title,
      description: episode.data.description,
      pubDate: episode.data.publishDate,
    })),
  });

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
