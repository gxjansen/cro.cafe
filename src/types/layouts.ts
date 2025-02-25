import type { CollectionEntry } from 'astro:content';

export type GuestCollectionType = 'en-guests' | 'nl-guests' | 'de-guests' | 'es-guests';
export type GuestEntry = CollectionEntry<GuestCollectionType>;
