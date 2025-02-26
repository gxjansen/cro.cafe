# Guest Overview Pages Implementation Plan

## Overview
This plan outlines the steps to create localized guest overview pages for all four languages (English, German, Spanish, and Dutch), add "View all guests" buttons to the homepage guest sections, and include these pages in the navigation menu.

## 1. Create Guest Filtering Utility

### 1.1 Enhance Guest Utility Functions
- Update or create functions in `src/utils/guests.ts`
- Implement a `getGuestsByLanguage` function that:
  - Accepts a language parameter (en, de, es, nl)
  - Retrieves all guests from the language-specific collection
  - Optionally filters guests that appear in at least one episode in that language
  - Returns the filtered list of guests
- Example implementation:
  ```typescript
  export async function getGuestsByLanguage(language: string, filterByEpisodes = false) {
    // Get all guests for the specified language
    const collectionName = `${language}-guests`;
    const allGuests = await getCollection(collectionName);
    
    if (!filterByEpisodes) {
      return allGuests;
    }
    
    // Get all episodes for the language to check guest appearances
    const episodeCollectionName = `${language}-episodes`;
    const allEpisodes = await getCollection(episodeCollectionName);
    
    // Filter guests that appear in at least one episode
    return allGuests.filter(guest => {
      return allEpisodes.some(episode => {
        const episodeGuests = episode.data.attributes.guests || [];
        return episodeGuests.some(episodeGuest =>
          episodeGuest.slug === guest.data.id ||
          episodeGuest.slug === guest.data.id.replace(`${language}-`, '') ||
          (episodeGuest.name && guest.data.name &&
            episodeGuest.name.toLowerCase() === guest.data.name.toLowerCase())
        );
      });
    });
  }
  ```

## 2. Create Guest Overview Page Template

### 2.1 Create Guest Overview Layout Component
- Create `src/components/guest/GuestOverviewLayout.astro`
- This component will:
  - Accept a language parameter and title
  - Use the `getGuestsByLanguage` function to fetch guests
  - Implement a responsive grid layout similar to `GuestsSection.astro`
  - Include sorting options (alphabetical by default)
  - Example implementation:
    ```astro
    ---
    import { getCollection } from 'astro:content';
    import GuestCard from './GuestCard.astro';
    import { getTranslations } from '~/utils/translations';
    import { getGuestsByLanguage } from '~/utils/guests';
    
    interface Props {
      title?: string;
      language: string;
      showBio?: boolean;
    }
    
    const { title, language, showBio = true } = Astro.props;
    
    // Get translations for the current language
    const t = getTranslations(language);
    
    // Set default title based on language
    const defaultTitle = t.allGuests || "All Guests";
    
    // Get all guests for the specified language
    const guests = await getGuestsByLanguage(language, true);
    
    // Sort guests alphabetically by name
    const sortedGuests = [...guests].sort((a, b) =>
      a.data.name.localeCompare(b.data.name)
    );
    ---
    
    <section class="py-12 bg-gray-50 dark:bg-gray-900">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">{title || defaultTitle}</h1>
        
        {sortedGuests.length > 0 ? (
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedGuests.map((guest) => (
              <GuestCard guest={guest.data} showBio={showBio} />
            ))}
          </div>
        ) : (
          <div class="text-center text-gray-600 dark:text-gray-400 py-12">
            <p>No guests found for this language.</p>
          </div>
        )}
      </div>
    </section>
    ```

## 3. Create Language-Specific Guest Overview Pages

### 3.1 Create English Guest Overview Page
- Create `src/pages/en/guests.astro`
- Use the PageLayout component with appropriate metadata
- Include the GuestOverviewLayout component
- Example implementation:
  ```astro
  ---
  import PageLayout from '~/layouts/PageLayout.astro';
  import GuestOverviewLayout from '~/components/guest/GuestOverviewLayout.astro';
  import { getTranslations } from '~/utils/translations';
  
  const t = getTranslations('en');
  const metadata = {
    title: `All Guests | ${t.title}`,
    description: `Meet all the guests who have appeared on the ${t.title} podcast.`,
    type: 'website' as const,
    canonicalUrl: Astro.url.href,
  };
  
  const availableLanguages = ['en', 'de', 'es', 'nl'] as const;
  ---
  
  <PageLayout {...{ metadata, availableLanguages, currentLang: 'en' }}>
    <GuestOverviewLayout language="en" />
  </PageLayout>
  ```

### 3.2 Create German Guest Overview Page
- Create `src/pages/de/guests.astro` with similar structure
- Use German translations

### 3.3 Create Spanish Guest Overview Page
- Create `src/pages/es/guests.astro` with similar structure
- Use Spanish translations

### 3.4 Create Dutch Guest Overview Page
- Create `src/pages/nl/guests.astro` with similar structure
- Use Dutch translations

### 3.5 Create Default/International Guest Overview Page
- Create `src/pages/guests.astro` that redirects to the appropriate language page
- Example implementation:
  ```astro
  ---
  // This is a redirect page that sends users to their preferred language
  import { getLanguageFromAcceptHeader } from '~/utils/language';
  
  // Get the user's preferred language from the Accept-Language header
  const preferredLanguage = getLanguageFromAcceptHeader(Astro.request.headers.get('accept-language') || '');
  
  // Default to English if no preference is detected or if the preferred language is not supported
  const redirectLanguage = ['en', 'de', 'es', 'nl'].includes(preferredLanguage) ? preferredLanguage : 'en';
  
  // Redirect to the appropriate language page
  return Astro.redirect(`/${redirectLanguage}/guests`);
  ---
  ```

## 4. Update GuestsSection Component to Add "View All" Button

### 4.1 Update GuestsSection Component
- Modify `src/components/guest/GuestsSection.astro`
- Add a "View all guests" button below the guest cards
- Add a new prop to control button visibility
- Example implementation:
  ```diff
  ---
  import { getCollection } from 'astro:content';
  import GuestCard from './GuestCard.astro';
  import { getTranslations } from '~/utils/translations';
  
  interface Props {
    title?: string;
    language?: string;
    showBio?: boolean;
    limit?: number;
+   showViewAllButton?: boolean;
  }
  
- const { title, language, showBio = true, limit } = Astro.props;
+ const { title, language, showBio = true, limit, showViewAllButton = false } = Astro.props;
  
  // Get translations for the current language
  const t = language ? getTranslations(language) : getTranslations('en');
  
  // Set default title based on language
  const defaultTitle = t.meetTheGuests;
+
+ // Set view all button text
+ const viewAllText = t.viewAllGuests || "View all guests";
  
  // Get all guests for the specified language
  const collectionName = language ? `${language}-guests` : 'en-guests';
  const allGuests = await getCollection(collectionName);
  
  // Apply limit if specified
  const guests = limit ? allGuests.slice(0, limit) : allGuests;
  ---
  
  {guests.length > 0 && (
    <section class="py-12 bg-gray-50 dark:bg-gray-900">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">{title || defaultTitle}</h2>
        <div class={`grid grid-cols-1 gap-6 ${
          guests.length === 1
            ? 'md:grid-cols-1 lg:grid-cols-1 max-w-2xl mx-auto'
            : guests.length === 2
              ? 'md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto'
              : guests.length === 3
                ? 'md:grid-cols-3 lg:grid-cols-3'
                : 'md:grid-cols-2 lg:grid-cols-4'
        }`}>
          {guests.map((guest) => (
            <GuestCard guest={guest.data} />
          ))}
        </div>
+
+       {showViewAllButton && language && (
+         <div class="mt-10 text-center">
+           <a
+             href={`/${language}/guests`}
+             class="inline-block px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors duration-200 font-medium"
+           >
+             {viewAllText}
+           </a>
+         </div>
+       )}
      </div>
    </section>
  )}
  ```

### 4.2 Update Homepage Components
- Update `src/pages/index.astro` to add the button to the international homepage
  ```diff
  <div class="relative">
-   <GuestsSection language="en" limit={8} showBio={false} />
+   <GuestsSection language="en" limit={8} showBio={false} showViewAllButton={true} />
  </div>
  ```

- Update language-specific homepages (en, de, es, nl) to add the button
  ```diff
  {/* Guest Section */}
  <section class="py-12">
    <div class="container mx-auto">
-     <GuestsSection language="en" limit={8} />
+     <GuestsSection language="en" limit={8} showViewAllButton={true} />
    </div>
  </section>
  ```

## 5. Add Translations

### 5.1 Update Translation Files
- Add new translation keys to `src/utils/translations.ts`
  ```diff
  export const translations = {
    en: {
      title: 'CRO.CAFE - Conversion Rate Optimization Podcast',
      description:
        "Join 15K+ subscribers for the world's most exciting, raw discussions on experimentation, CRO, user research and digital marketing from the industry leaders who live and breathe it\.",
      latestEpisodes: 'Latest Episodes',
      listenNow: 'Listen Now',
      yourHost: 'Your Host',
      yourHosts: 'Your Hosts',
      episodeGuests: 'Episode Guests',
      meetTheGuests: 'Meet the Guests',
+     allGuests: 'All Guests',
+     viewAllGuests: 'View all guests',
      languageButtons: {
        // ...
      },
      // ...
    },
    nl: {
      // ...
+     allGuests: 'Alle Gasten',
+     viewAllGuests: 'Bekijk alle gasten',
      // ...
    },
    de: {
      // ...
+     allGuests: 'Alle Gäste',
+     viewAllGuests: 'Alle Gäste anzeigen',
      // ...
    },
    es: {
      // ...
+     allGuests: 'Todos los Invitados',
+     viewAllGuests: 'Ver todos los invitados',
      // ...
    },
  } as const;
  ```

## 6. Testing and SEO Optimization

### 6.1 Testing Checklist
- Verify all guest overview pages load correctly in each language
- Check that the "View all guests" buttons appear and link to the correct pages
- Test responsive layout on different screen sizes
- Verify that navigation works correctly
- Check that guests are properly filtered and displayed

### 6.2 SEO Optimization
- Ensure proper metadata is set for each page
- Add structured data for guest lists
- Update sitemap generation to include the new guest overview pages

## Implementation Timeline

1. **Day 1**:
   - Create guest filtering utility functions
   - Add translations for new pages and buttons

2. **Day 2**:
   - Create GuestOverviewLayout component
   - Implement language-specific guest overview pages
   - Create default/international guest overview page

3. **Day 3**:
   - Update GuestsSection component to add "View all guests" button
   - Update homepage components to use the updated GuestsSection

4. **Day 4**:
   - Testing and refinement
   - SEO optimization
   - Documentation

## Technical Considerations

- The navigation menu already includes links to guest pages (`/[lang]/guests`), so we don't need to update the navigation configuration
- Consider implementing pagination if there are many guests
- Ensure proper error handling for cases where no guests are found
- Consider adding filtering options on the guest overview pages (e.g., by topic, by date of appearance)