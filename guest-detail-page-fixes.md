# Guest Detail Page Fixes

## Current Issues

1. **Missing Header and Footer**: The guest detail pages currently lack a header and footer that should be consistent with the rest of the site.
2. **Missing Episode Cards**: The guest detail pages don't properly show the episode cards for episodes that the guest appeared in.

## Root Causes

1. **Header and Footer Issue**: The `GuestLayout.astro` component is currently using `BaseLayout.astro` directly, which doesn't include the header and footer. The `PageLayout.astro` is the component that includes these elements.

2. **Episode Cards Issue**: The guest detail page (`src/pages/guest/[slug].astro`) is already fetching episodes and has code to display them using the `EpisodeCard` component. However, there might be an issue with how the episodes are being passed to the layout or displayed in the template.

## Implementation Plan

### 1. Update GuestLayout.astro

Modify `src/layouts/GuestLayout.astro` to use `PageLayout.astro` instead of `BaseLayout.astro`:

```astro
---
import PageLayout from './PageLayout.astro';
import type { GuestEntry, GuestCollectionType } from '~/types/layouts';
import type { Language } from '~/types';
import { getTranslations } from '~/utils/translations';

interface Props {
  guest: GuestEntry;
  collection?: GuestCollectionType;
  episodes?: any[];
}

const { guest, collection, episodes = [] } = Astro.props as Props;

// Extract language from collection name (e.g., 'en-guests' -> 'en')
const langPrefix = collection ? collection.split('-')[0] : 'en';
// Ensure it's a valid Language type
const currentLang = (langPrefix as Language);

// Get translations
const t = getTranslations(currentLang);

// Prepare metadata
const metadata = {
  title: `${guest.data.name} | ${t.title}`,
  description: guest.data.bio || `${guest.data.name} - ${guest.data.role || t.guest}`,
  image: guest.data.image_url ? `/images/guests/${guest.data.image_url}` : '/images/default.png',
  type: 'article' as const,
  canonicalUrl: Astro.url.href,
  alternateLanguages: {
    en: `/guest/${guest.id}`,
    de: `/guest/${guest.id}`,
    es: `/guest/${guest.id}`,
    nl: `/guest/${guest.id}`,
  },
};
---

<PageLayout
  metadata={metadata}
  currentLang={currentLang}
  availableLanguages={['en', 'nl', 'de', 'es']}
>
  <slot />
</PageLayout>
```

### 2. Ensure Episodes are Displayed Correctly

The guest detail page (`src/pages/guest/[slug].astro`) already has code to fetch and display episodes. We need to ensure that this code is working correctly:

1. Verify that `getEpisodesByGuest` is returning the correct episodes
2. Ensure that the episodes are being passed correctly to the `EpisodeCard` component
3. Check if there are any styling or layout issues that might be hiding the episode cards

## Testing Plan

1. After implementing the changes, navigate to a guest detail page (e.g., `/guest/abi-hough`)
2. Verify that the header and footer are displayed correctly
3. Verify that the episode cards for episodes featuring the guest are displayed correctly
4. Test with different guests to ensure the solution works for all cases
5. Test in different languages to ensure the solution works across all language variants

## Next Steps

After implementing and testing these changes, we should:

1. Update any documentation related to the guest detail pages
2. Consider adding more features to the guest detail pages, such as related guests or topics