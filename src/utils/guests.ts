import { getCollection, type CollectionEntry } from 'astro:content';
import type { Guest } from '~/types';

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
  const guests = await getCollection(language as GuestCollectionName);
  return guests.find((guest: GuestEntry) => guest.data.id === slug);
}
