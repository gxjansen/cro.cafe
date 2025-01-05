# Component Development Guide

This guide outlines the development standards and implementation details for CRO.CAFE components.

## Component Organization

### Directory Structure

```
src/components/
├── common/            # Shared components
├── episode/           # Episode components
├── guest/            # Guest components
├── platform/         # Platform components
├── search/           # Search components
└── ui/               # Base UI components
```

## Base Components

### Language Switcher

```typescript
// src/components/common/LanguageSwitcher.astro
---
interface Props {
  currentLang: 'en' | 'de' | 'es' | 'nl';
}

const { currentLang } = Astro.props;

const languages = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'nl', label: 'Nederlands' },
];
---

<div class="language-switcher">
  <select
    onChange="window.location.href = `/${this.value}/`"
    value={currentLang}
    class="select-language"
  >
    {languages.map(({ code, label }) => (
      <option value={code} selected={code === currentLang}>
        {label}
      </option>
    ))}
  </select>
</div>

<style>
.language-switcher {
  @apply relative inline-block;
}

.select-language {
  @apply px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300
         dark:border-gray-700 rounded-lg shadow-sm focus:ring-2
         focus:ring-blue-500 focus:border-blue-500;
}
</style>
```

### Episode Player

```typescript
// src/components/episode/Player.astro
---
interface Props {
  episodeId: string;
  title: string;
}

const { episodeId, title } = Astro.props;
---

<div class="episode-player">
  <iframe
    width="100%"
    height="180"
    frameborder="no"
    scrolling="no"
    seamless
    src={`https://share.transistor.fm/e/${episodeId}`}
    title={title}
    class="w-full"
  />
</div>

<style>
.episode-player {
  @apply w-full max-w-3xl mx-auto my-4 rounded-lg overflow-hidden
         shadow-lg bg-white dark:bg-gray-800;
}
</style>
```

### Episode Grid

```typescript
// src/components/episode/Grid.astro
---
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import EpisodeCard from './Card.astro';

interface Props {
  language: string;
  limit?: number;
  featured?: boolean;
}

const { language, limit, featured = false } = Astro.props;

const episodes = await getCollection('episodes', (entry) => {
  if (language && entry.data.language !== language) return false;
  if (featured && !entry.data.isFeatured) return false;
  return true;
});

const sortedEpisodes = episodes
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
  .slice(0, limit);
---

<div class="episode-grid">
  {sortedEpisodes.map((episode) => (
    <EpisodeCard episode={episode} />
  ))}
</div>

<style>
.episode-grid {
  @apply grid gap-6 md:grid-cols-2 lg:grid-cols-3;
}
</style>
```

### Guest Profile

```typescript
// src/components/guest/Profile.astro
---
import { Image } from 'astro:assets';
import type { CollectionEntry } from 'astro:content';

interface Props {
  guest: CollectionEntry<'guests'>;
  showEpisodes?: boolean;
}

const { guest, showEpisodes = true } = Astro.props;
const { name, title, company, bio, image, linkedin, twitter, website } = guest.data;
---

<div class="guest-profile">
  <div class="profile-header">
    <Image
      src={image}
      alt={name}
      width={200}
      height={200}
      class="profile-image"
    />
    <div class="profile-info">
      <h2 class="profile-name">{name}</h2>
      <p class="profile-title">{title}</p>
      <p class="profile-company">{company}</p>
    </div>
  </div>

  <div class="profile-bio">
    {bio}
  </div>

  {showEpisodes && guest.data.episodes.length > 0 && (
    <div class="profile-episodes">
      <h3>Episodes</h3>
      <ul>
        {guest.data.episodes.map((episodeId) => (
          <li>
            <a href={`/episodes/${episodeId}`}>
              Episode {episodeId}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )}

  <div class="profile-social">
    {linkedin && (
      <a href={linkedin} class="social-link linkedin">
        LinkedIn
      </a>
    )}
    {twitter && (
      <a href={twitter} class="social-link twitter">
        Twitter
      </a>
    )}
    {website && (
      <a href={website} class="social-link website">
        Website
      </a>
    )}
  </div>
</div>

<style>
.guest-profile {
  @apply max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800
         rounded-lg shadow-lg;
}

.profile-header {
  @apply flex items-start space-x-6 mb-6;
}

.profile-image {
  @apply w-48 h-48 rounded-full object-cover;
}

.profile-info {
  @apply flex-1;
}

.profile-name {
  @apply text-2xl font-bold mb-2;
}

.profile-title,
.profile-company {
  @apply text-gray-600 dark:text-gray-400;
}

.profile-bio {
  @apply prose dark:prose-invert max-w-none mb-6;
}

.profile-episodes {
  @apply border-t border-gray-200 dark:border-gray-700 pt-6 mb-6;
}

.profile-social {
  @apply flex space-x-4;
}

.social-link {
  @apply px-4 py-2 rounded-lg text-white transition-colors;
}

.social-link.linkedin {
  @apply bg-blue-600 hover:bg-blue-700;
}

.social-link.twitter {
  @apply bg-sky-500 hover:bg-sky-600;
}

.social-link.website {
  @apply bg-gray-600 hover:bg-gray-700;
}
</style>
```

## Component Best Practices

1. **TypeScript Types**

```typescript
// src/types/components.ts
import type { CollectionEntry } from 'astro:content';

export interface EpisodeCardProps {
  episode: CollectionEntry<'episodes'>;
  showHost?: boolean;
  showGuests?: boolean;
}

export interface GuestProfileProps {
  guest: CollectionEntry<'guests'>;
  showEpisodes?: boolean;
}
```

2. **Prop Validation**

```typescript
// Example component with prop validation
---
import { z } from 'zod';

const props = Astro.props;

const PropSchema = z.object({
  title: z.string(),
  count: z.number().optional(),
});

const validatedProps = PropSchema.parse(props);
---
```

3. **Error Boundaries**

```typescript
// src/components/common/ErrorBoundary.astro
---
interface Props {
  fallback: string;
}

const { fallback } = Astro.props;
---

{
  Astro.slots.has('default') ? (
    <slot />
  ) : (
    <div class="error-fallback">
      {fallback}
    </div>
  )
}
```

## Accessibility Guidelines

1. **ARIA Labels**

```typescript
// Example of proper ARIA usage
<button
  aria-label="Play episode"
  aria-pressed={isPlaying}
  onClick="togglePlay()"
>
  {isPlaying ? 'Pause' : 'Play'}
</button>
```

2. **Keyboard Navigation**

```typescript
// Example of keyboard handling
<div
  role="button"
  tabindex="0"
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
  onClick={handleClick}
>
  Clickable Element
</div>
```

## Testing Components

```typescript
// src/components/episode/Card.test.ts
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/astro';
import EpisodeCard from './Card.astro';

describe('EpisodeCard', () => {
  it('renders episode information correctly', async () => {
    const episode = {
      data: {
        title: 'Test Episode',
        pubDate: new Date(),
        description: 'Test description',
      },
    };

    const { getByText } = await render(EpisodeCard, { episode });

    expect(getByText('Test Episode')).toBeDefined();
    expect(getByText('Test description')).toBeDefined();
  });
});
```

## Performance Optimization

1. **Image Optimization**
   Not needed, we use Astro's standard Image component.

2. **Component Islands**

```typescript
// Interactive components should use client:* directives sparingly
<SearchBox client:visible />
<PlayerControls client:idle />
```

## Validation Checklist

- [ ] TypeScript types defined and used
- [ ] Props validated with Zod
- [ ] Accessibility features implemented
- [ ] Tests written and passing
- [ ] Performance optimizations applied
- [ ] Error boundaries in place
- [ ] Responsive design working
- [ ] Dark mode support added
- [ ] Documentation updated
