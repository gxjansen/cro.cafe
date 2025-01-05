import { defineCollection, z } from 'astro:content';
import {
  EpisodeSchema,
  PersonSchema,
  QuoteSchema,
  PlatformSchema,
  BrandSchema,
} from '../utils/content-schemas';

const episodesCollection = defineCollection({
  schema: EpisodeSchema,
});

const guestsCollection = defineCollection({
  schema: PersonSchema,
});

const quotesCollection = defineCollection({
  schema: QuoteSchema,
});

const platformsCollection = defineCollection({
  schema: PlatformSchema,
});

const brandsCollection = defineCollection({
  schema: BrandSchema,
});

export const collections = {
  episodes: episodesCollection,
  guests: guestsCollection,
  quotes: quotesCollection,
  platforms: platformsCollection,
  brands: brandsCollection,
};
