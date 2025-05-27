# Language-Specific Latest Episodes Component Plan

## Overview

We need to create a component that displays the latest episodes for a specific language. This component will be used on the language-specific homepages.

## Component Structure

```astro
---
import { getCollection } from 'astro:content';
import Card from '../episode/Card.astro';

// Props
interface Props {
  language: string;
  limit?: number;
  title?: string;
}

const {
  language,
  limit = 4,
  title
} = Astro.props;

// Language display names
const langNames = {
  en: 'English',
  nl: 'Nederlands',
  de: 'Deutsch',
  es: 'Español',
} as const;

// Default titles based on language
const defaultTitles = {
  en: `Latest ${langNames.en} Episodes`,
  nl: `Nieuwste ${langNames.nl} Afleveringen`,
  de: `Neueste ${langNames.de} Folgen`,
  es: `Últimos Episodios en ${langNames.es}`,
};

// Use provided title or default
const sectionTitle = title || defaultTitles[language as keyof typeof defaultTitles] || `Latest ${language.toUpperCase()} Episodes`;

// Array to store language-specific episodes
let languageEpisodes = [];

try {
  // Get episodes from the specified language collection
  const episodes = await getCollection(`${language}-episodes`);

  // Sort episodes by date and get the latest ones
  languageEpisodes = episodes
    .sort((a, b) => {
      const dateA = new Date(b.data.attributes.published_at);
      const dateB = new Date(a.data.attributes.published_at);
      return dateA.valueOf() - dateB.valueOf();
    })
    .slice(0, limit)
    .map(episode => ({
      id: episode.id,
      collection: `${language}-episodes`,
      data: {
        id: episode.id,
        type: 'episode',
        attributes: episode.data.attributes,
        relationships: {
          show: {
            data: {
              id: episode.data.relationships.show.data.id,
              type: 'show'
            }
          }
        }
      }
    }));
} catch (error) {
  console.error(`Error in LanguageLatestEpisodes component for ${language}:`, error);
}
---

<div class="bg-white dark:bg-gray-900">
  <section
    class="language-latest-episodes py-16 relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
  >
    <h2 class="text-3xl font-bold mb-12 text-center text-gray-900 dark:text-white">
      {sectionTitle}
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {languageEpisodes.length > 0 ? (
        languageEpisodes.map((episode) => (
          <Card episode={episode} />
        ))
      ) : (
        <div class="col-span-full text-center text-gray-500 dark:text-gray-400">
          No episodes found
        </div>
      )}
    </div>
  </section>
</div>

<style>
  .episode-card {
    @apply hover:shadow-xl;
  }
</style>
```

## Implementation Steps

1. Create the new LanguageLatestEpisodes.astro component with the structure above
2. Make sure the Card component is properly imported
3. Ensure the episode data structure matches what the Card component expects
4. Test the component on the language-specific homepages

## GitHub Action Fix

For the GitHub Action issue, we need to update both workflow files to use the GitHub Push Action instead of direct git push:

```yaml
- name: Push changes
  uses: ad-m/github-push-action@master
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    branch: ${{ github.ref }}
```

This will resolve the permission denied error by properly handling GitHub token permissions.
