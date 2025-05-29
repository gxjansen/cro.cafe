import { getCollection, type CollectionEntry } from 'astro:content';

type HostEntry = CollectionEntry<'hosts'>;
type EpisodeCollectionName = 'en-episodes' | 'de-episodes' | 'es-episodes' | 'nl-episodes';
type EpisodeEntry = CollectionEntry<EpisodeCollectionName>;

export interface ShowSummary {
  language: string;
  showName: string;
  episodeCount: number;
  latestEpisode?: EpisodeEntry;
}

type ShowData = {
  language: string;
  showName: string;
  episodeCount: number;
  episodes: EpisodeEntry[];
};

/**
 * Get host data by slug
 */
export async function getHostBySlug(slug: string): Promise<HostEntry | undefined> {
  const hosts = await getCollection('hosts');
  return hosts.find((host: HostEntry) => host.data.id === slug);
}

/**
 * Get all hosts
 */
export async function getAllHosts(): Promise<HostEntry[]> {
  return await getCollection('hosts');
}

/**
 * Sort hosts by name
 */
export function sortHostsByName(hosts: HostEntry[]): HostEntry[] {
  return [...hosts].sort((a, b) => a.data.name.localeCompare(b.data.name));
}

/**
 * Get show name by language code
 */
export function getShowNameByLanguage(language: string): string {
  const showNames: Record<string, string> = {
    en: 'CRO.CAFE (English)',
    nl: 'CRO.CAFE (Nederlands)',
    de: 'CRO.CAFE (Deutsch)',
    es: 'CRO.CAFE (Español)',
  };
  return showNames[language] || `CRO.CAFE (${language})`;
}

/**
 * Extract language from collection name
 */
function getLanguageFromCollection(collection: string): string {
  return collection.replace('-episodes', '');
}

/**
 * Find episodes for languages that the host supports
 */
export async function getEpisodesByHost(hostSlug: string): Promise<EpisodeEntry[]> {
  console.log(`Finding episodes for host: ${hostSlug}`);

  // Get the host data
  const host = await getHostBySlug(hostSlug);
  if (!host) {
    console.log(`Host not found: ${hostSlug}`);
    return [];
  }
  console.log(`Found host: ${host.data.name}`);
  console.log(`Host languages: ${host.data.languages.join(', ')}`);

  // Get episodes for the languages this host supports
  const allEpisodes: EpisodeEntry[] = [];

  for (const language of host.data.languages) {
    const collectionName = `${language}-episodes` as EpisodeCollectionName;
    try {
      const episodes = await getCollection(collectionName);
      console.log(`Found ${episodes.length} episodes in ${collectionName}`);
      allEpisodes.push(...episodes);
    } catch (error) {
      console.warn(`No episodes found in collection: ${collectionName}`);
    }
  }

  console.log(`Total episodes for host ${host.data.name}: ${allEpisodes.length}`);
  return allEpisodes;
}

/**
 * Get unique shows/languages the host appears in with episode counts
 */
export async function getShowsByHost(hostSlug: string): Promise<ShowSummary[]> {
  const episodes = await getEpisodesByHost(hostSlug);

  // Group episodes by language/show
  const showsMap: Record<string, ShowData> = episodes.reduce((acc, episode) => {
    const language = getLanguageFromCollection(episode.collection);

    if (!acc[language]) {
      acc[language] = {
        language,
        showName: getShowNameByLanguage(language),
        episodeCount: 0,
        episodes: [],
      };
    }

    acc[language].episodeCount++;
    acc[language].episodes.push(episode);

    return acc;
  }, {} as Record<string, ShowData>);

  // Convert to array and add latest episode info
  const showsArray = Object.values(showsMap);

  return showsArray
    .map((show: ShowData): ShowSummary => {
      // Sort episodes by publication date to find the latest
      const sortedEpisodes = show.episodes.sort((a: EpisodeEntry, b: EpisodeEntry) => {
        const dateA = new Date(a.data.attributes.published_at);
        const dateB = new Date(b.data.attributes.published_at);
        return dateB.getTime() - dateA.getTime();
      });

      return {
        language: show.language,
        showName: show.showName,
        episodeCount: show.episodeCount,
        latestEpisode: sortedEpisodes[0],
      };
    })
    .sort((a: ShowSummary, b: ShowSummary) => a.language.localeCompare(b.language));
}
