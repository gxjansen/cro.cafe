import type { CollectionEntry } from 'astro:content';
import type { Language } from '~/types';
import type { Episode, EpisodeData } from '~/types/episode';

export type EpisodeCollection = `${Language}-episodes`;

/**
 * Transforms a raw episode from the content collection into the validated schema structure
 */
export function transformEpisode(episode: CollectionEntry<EpisodeCollection>): Episode {
  return {
    id: episode.id,
    collection: episode.collection as EpisodeCollection,
    data: {
      type: 'episode' as const,
      id: episode.data.id,
      attributes: episode.data.attributes,
      relationships: episode.data.relationships,
    },
    render: episode.render,
  };
}

/**
 * Transforms an array of raw episodes from the content collection into the validated schema structure
 */
export function transformEpisodes(episodes: CollectionEntry<EpisodeCollection>[]): Episode[] {
  return episodes.map(transformEpisode);
}
