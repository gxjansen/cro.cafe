# Handling Content Language Folders

## Problem

Astro is auto-generating collections for folders in `src/content/` that are not defined as collections. This is deprecated, and we should define these collections ourselves in `src/content/config.ts`.

## Solution

1. **Define Collections Explicitly**: Ensure that each content type within the language directories is explicitly defined in `src/content/config.ts`.
2. **Remove Unnecessary Configurations**: Remove any configurations that might be causing Astro to look for markdown files in the root language directories.
3. **Follow Internationalization Guide**: Refer to the [Astro Internationalization Guide](https://docs.astro.build/en/guides/internationalization/) to ensure proper setup.

## Steps Taken

1. **Removed Placeholder `.md` Files**: Removed placeholder `.md` files from each language directory to prevent Astro from treating them as content directories.
2. **Updated `src/content/config.ts`**: Defined collections explicitly for each content type within the language directories, including the `quotes` collection for the `es` directory.
3. **Created `_dir/.gitkeep` Files**: Created `.gitkeep` files in the `_dir` subdirectory of each language directory to prevent Astro from auto-generating collections for the root language directories.

## Example Configuration

Here is an example of how `src/content/config.ts` should be structured:

```typescript
import { defineCollection } from 'astro:content';
import { EpisodeSchema, PersonSchema, PlatformSchema } from '../utils/content-schemas';

export const collections = {
  // Episodes collections
  'en/episodes': defineCollection({
    type: 'data',
    schema: EpisodeSchema,
  }),
  'de/episodes': defineCollection({
    type: 'data',
    schema: EpisodeSchema,
  }),
  'es/episodes': defineCollection({
    type: 'data',
    schema: EpisodeSchema,
  }),
  'nl/episodes': defineCollection({
    type: 'data',
    schema: EpisodeSchema,
  }),

  // Guests collections
  'en/guests': defineCollection({
    type: 'data',
    schema: PersonSchema,
  }),
  'de/guests': defineCollection({
    type: 'data',
    schema: PersonSchema,
  }),
  'es/guests': defineCollection({
    type: 'data',
    schema: PersonSchema,
  }),
  'nl/guests': defineCollection({
    type: 'data',
    schema: PersonSchema,
  }),

  // Platform collections (only for en and de)
  'en/platforms': defineCollection({
    type: 'data',
    schema: PlatformSchema,
  }),
  'de/platforms': defineCollection({
    type: 'data',
    schema: PlatformSchema,
  }),
};
```

## Additional Notes

- Ensure that each language directory (de, en, es, nl) only contains subdirectories for specific content types (episodes, guests, platforms).
- Avoid placing any markdown files directly in the root language directories to prevent Astro from auto-generating collections.
