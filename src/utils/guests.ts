import { getCollection, type CollectionEntry } from 'astro:content';

type GuestCollectionName = 'en-guests' | 'de-guests' | 'es-guests' | 'nl-guests';
type EpisodeCollectionName = 'en-episodes' | 'de-episodes' | 'es-episodes' | 'nl-episodes';
type GuestEntry = CollectionEntry<GuestCollectionName>;
type EpisodeEntry = CollectionEntry<EpisodeCollectionName>;

/**
 * Extract guest slugs from URLs in the description
 * Example: "Guest: Name URL: https://www.cro.cafe/guest/guest-slug"
 */
export async function extractGuestSlugs(description: string): Promise<string[]> {
  const guestUrlPattern = /https:\/\/www\.cro\.cafe\/guest\/([a-z0-9-]+)/g;
  const matches = [...description.matchAll(guestUrlPattern)];
  return matches.map((match) => match[1]).filter((slug): slug is string => slug !== undefined);
}

/**
 * Get guest data for a specific language and slug
 */
export async function getGuestBySlug(
  language: string,
  slug: string
): Promise<GuestEntry | undefined> {
  const collectionName = `${language}-guests` as GuestCollectionName;
  const guests = await getCollection(collectionName);
  return guests.find((guest: GuestEntry) => guest.data.id === slug);
}

/**
 * Get all guests for a specific language
 * Optionally filter guests that appear in at least one episode
 */
export async function getGuestsByLanguage(
  language: string,
  filterByEpisodes = false
): Promise<GuestEntry[]> {
  // Get all guests for the specified language
  const collectionName = `${language}-guests` as GuestCollectionName;
  const allGuests = await getCollection(collectionName);
  
  if (!filterByEpisodes) {
    return allGuests;
  }
  
  // Get all episodes for the language to check guest appearances
  const episodeCollectionName = `${language}-episodes` as EpisodeCollectionName;
  const allEpisodes = await getCollection(episodeCollectionName);
  
  // Filter guests that appear in at least one episode
  return allGuests.filter((guest: GuestEntry) => {
    return allEpisodes.some((episode: EpisodeEntry) => {
      // Check if guest appears in episode's guests array
      const episodeGuests = (episode.data.attributes as any).guests || [];
      const guestInEpisode = episodeGuests.some((episodeGuest: { slug?: string; name?: string }) => {
        // Try different matching strategies
        const matchBySlug = episodeGuest.slug === guest.data.id;
        const matchBySlugWithoutPrefix = episodeGuest.slug === guest.data.id.replace(`${language}-`, '');
        const matchByName = episodeGuest.name && guest.data.name &&
          episodeGuest.name.toLowerCase() === guest.data.name.toLowerCase();
        
        return matchBySlug || matchBySlugWithoutPrefix || matchByName;
      });
      
      if (guestInEpisode) {
        return true;
      }
      
      // Check if guest is mentioned in episode description
      if (episode.data.attributes.description) {
        const guestPattern = new RegExp(`Guest(?:\\s*\\d*)?\\s*:\\s*(${guest.data.name})`, 'i');
        return guestPattern.test(episode.data.attributes.description);
      }
      
      return false;
    });
  });
}

/**
 * Sort guests by name
 */
export function sortGuestsByName(guests: GuestEntry[]): GuestEntry[] {
  return [...guests].sort((a, b) => a.data.name.localeCompare(b.data.name));
}

/**
 * Get episodes that a specific guest appears in
 */
export async function getEpisodesByGuest(
  language: string,
  guestSlug: string
): Promise<EpisodeEntry[]> {
  console.log(`Finding episodes for guest: ${guestSlug} in language: ${language}`);
  
  // Get all episodes for the language
  const episodeCollectionName = `${language}-episodes` as EpisodeCollectionName;
  const allEpisodes = await getCollection(episodeCollectionName);
  console.log(`Total episodes in ${language}: ${allEpisodes.length}`);
  
  // Get the guest data
  const guest = await getGuestBySlug(language, guestSlug);
  if (!guest) {
    console.log(`Guest not found: ${guestSlug}`);
    return [];
  }
  console.log(`Found guest: ${guest.data.name}`);
  
  // Extract the base slug without language prefix
  const baseSlug = guestSlug.includes('-') ?
    guestSlug.split('-').slice(1).join('-') :
    guestSlug;
  
  // Filter episodes where this guest appears - using the same simple logic as in the test page
  const matchingEpisodes = allEpisodes.filter((episode: EpisodeEntry) => {
    // Check if guest appears in episode's guests array
    const episodeGuests = (episode.data.attributes as any).guests || [];
    
    // Simple direct matching like in the test page
    const isGuestInEpisode = episodeGuests.some((episodeGuest: { slug?: string; name?: string }) =>
      episodeGuest.slug === baseSlug ||
      episodeGuest.name === guest.data.name
    );
    
    if (isGuestInEpisode) {
      console.log(`Found guest ${guest.data.name} in episode ${episode.id}`);
      return true;
    }
    
    // Check if guest is mentioned in the description
    const description = episode.data.attributes.description || '';
    if (description.includes(guest.data.name)) {
      console.log(`Found guest ${guest.data.name} mentioned in description of episode ${episode.id}`);
      return true;
    }
    
    return false;
  });
  
  console.log(`Found ${matchingEpisodes.length} episodes for guest ${guest.data.name}`);
  return matchingEpisodes;
}
