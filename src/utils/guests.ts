import { getCollection, type CollectionEntry } from 'astro:content';

type GuestCollectionName = 'en-guests' | 'de-guests' | 'es-guests' | 'nl-guests';
type GuestEntry = CollectionEntry<GuestCollectionName>;

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
  return guests.find((guest) => guest.data.id === slug);
}

/**
 * Get all guests for an episode
 */
export async function getEpisodeGuests(
  language: string,
  description: string
): Promise<GuestEntry['data'][]> {
  const slugs = await extractGuestSlugs(description);
  const guestPromises = slugs.map((slug) => getGuestBySlug(language, slug));
  const guests = await Promise.all(guestPromises);
  return guests
    .filter((guest): guest is GuestEntry => guest !== undefined)
    .map((guest) => guest.data);
}
