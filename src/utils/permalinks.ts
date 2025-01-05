import type { Episode, Person, Quote, Platform, Brand } from '~/types';
import slugify from 'slugify';

/**
 * Generates a canonical URL for a content entry.
 * @param language The language of the content entry.
 * @param contentType The type of the content entry (e.g., 'episodes', 'guests', 'quotes', 'brands', 'platforms').
 * @param slug The slug of the content entry.
 * @returns The canonical URL for the content entry.
 */
export function generateCanonicalUrl(language: string, contentType: string, slug: string): string {
  return `https://cro.cafe/${language}/${contentType}/${slug}`;
}

/**
 * Updates an episode entry with canonical URL and language references.
 * @param episode The episode entry to update.
 * @param language The language of the episode entry.
 * @returns The updated episode entry with canonical URL and language references.
 */
export function updateEpisodeWithLanguageReferences(episode: Episode, language: string): Episode {
  return {
    ...episode,
    canonicalUrl: generateCanonicalUrl(language, 'episodes', episode.id),
  };
}

/**
 * Updates a guest entry with canonical URL and language references.
 * @param guest The guest entry to update.
 * @param language The language of the guest entry.
 * @returns The updated guest entry with canonical URL and language references.
 */
export function updateGuestWithLanguageReferences(guest: Person, language: string): Person {
  return {
    ...guest,
    canonicalUrl: generateCanonicalUrl(language, 'guests', guest.id),
  };
}

/**
 * Updates a quote entry with canonical URL and language references.
 * @param quote The quote entry to update.
 * @param language The language of the quote entry.
 * @returns The updated quote entry with canonical URL and language references.
 */
export function updateQuoteWithLanguageReferences(quote: Quote, language: string): Quote {
  return {
    ...quote,
    canonicalUrl: generateCanonicalUrl(language, 'quotes', quote.id),
  };
}

/**
 * Updates a platform entry with canonical URL and language references.
 * @param platform The platform entry to update.
 * @param language The language of the platform entry.
 * @returns The updated platform entry with canonical URL and language references.
 */
export function updatePlatformWithLanguageReferences(
  platform: Platform,
  language: string
): Platform {
  return {
    ...platform,
    canonicalUrl: generateCanonicalUrl(language, 'platforms', platform.id),
  };
}

/**
 * Updates a brand entry with canonical URL and language references.
 * @param brand The brand entry to update.
 * @param language The language of the brand entry.
 * @returns The updated brand entry with canonical URL and language references.
 */
export function updateBrandWithLanguageReferences(brand: Brand, language: string): Brand {
  return {
    ...brand,
    canonicalUrl: generateCanonicalUrl(language, 'brands', brand.id),
  };
}

// Keep track of used slugs per content type and language
const usedSlugs: Record<string, Set<string>> = {};

/**
 * Generates a unique slug from a given string.
 * @param title The title to generate a slug from.
 * @param contentType The content type (e.g., 'episodes', 'guests', 'quotes').
 * @param language The language code.
 * @returns A unique URL-friendly slug.
 */
export function generateSlug(title: string, contentType?: string, language?: string): string {
  // Generate base slug
  const slug = slugify(title, {
    lower: true,
    strict: true,
    replacement: '-',
  });

  // If contentType and language are provided, ensure uniqueness
  if (contentType && language) {
    const key = `${contentType}-${language}`;
    let slugSet = usedSlugs[key];
    if (!slugSet) {
      slugSet = new Set();
      usedSlugs[key] = slugSet;
    }

    // Ensure uniqueness
    if (slugSet.has(slug)) {
      let counter = 1;
      let newSlug = `${slug}-${counter}`;
      while (slugSet.has(newSlug)) {
        counter++;
        newSlug = `${slug}-${counter}`;
      }
      slugSet.add(newSlug);
      return newSlug;
    }

    // Track this slug
    slugSet.add(slug);
  }

  return slug;
}

/**
 * Validates a slug to ensure it meets the required criteria.
 * @param slug The slug to validate.
 * @param contentType The content type to validate against.
 * @param language The language code.
 * @returns True if the slug is valid and unique, false otherwise.
 */
export function validateSlug(slug: string, contentType?: string, language?: string): boolean {
  // Check format
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return false;
  }

  // Check length
  if (slug.length < 3 || slug.length > 100) {
    return false;
  }

  // Check for consecutive hyphens
  if (slug.includes('--')) {
    return false;
  }

  // If contentType and language are provided, check uniqueness
  if (contentType && language) {
    const key = `${contentType}-${language}`;
    let slugSet = usedSlugs[key];
    if (!slugSet) {
      slugSet = new Set();
      usedSlugs[key] = slugSet;
    }

    // If the slug is already used, return false
    if (slugSet.has(slug)) {
      return false;
    }

    // Register the slug
    slugSet.add(slug);
  }

  return true;
}

/**
 * Clears the slug registry for testing purposes.
 * @param contentType Optional content type to clear.
 * @param language Optional language to clear.
 */
export function clearSlugRegistry(contentType?: string, language?: string): void {
  if (contentType && language) {
    delete usedSlugs[`${contentType}-${language}`];
  } else {
    Object.keys(usedSlugs).forEach((key) => {
      usedSlugs[key].clear();
    });
  }
}

/**
 * Content entry for hreflang tag generation.
 */
interface HreflangContent {
  readonly id: string;
  readonly contentType: string;
  readonly language: string;
}

/**
 * Generates hreflang tags for a content entry.
 * @param content The content entry to generate hreflang tags for.
 * @param availableLanguages The list of available languages for the content entry.
 * @returns An array of hreflang tags.
 */
export function isValidHreflangContent(
  content: HreflangContent
): content is Required<HreflangContent> {
  return (
    content !== null &&
    typeof content === 'object' &&
    typeof content.id === 'string' &&
    typeof content.contentType === 'string' &&
    typeof content.language === 'string'
  );
}

export function generateHreflangTags(
  content: HreflangContent,
  availableLanguages: readonly string[]
): string[] {
  // Validate input with explicit type guard
  function assertValidContent(
    c: HreflangContent
  ): asserts c is { id: string; contentType: string } {
    if (
      typeof c !== 'object' ||
      c === null ||
      typeof c.id !== 'string' ||
      typeof c.contentType !== 'string'
    ) {
      throw new Error('Invalid content');
    }
  }

  // Early return for invalid input
  if (!Array.isArray(availableLanguages)) {
    return [];
  }

  try {
    assertValidContent(content);
  } catch {
    return [];
  }

  return availableLanguages
    .map((lang): string => {
      if (!lang || typeof lang !== 'string') return '';
      const url = generateCanonicalUrl(lang, content.contentType, content.id);
      return `<link rel="alternate" hreflang="${lang}" href="${url}" />`;
    })
    .filter((tag): tag is string => tag !== '');
}

/**
 * Render structured data as a script tag.
 * @param schema The structured data schema to render.
 * @returns An HTML script tag with JSON-LD content.
 */
export function renderSchema(schema: Record<string, unknown>): string {
  return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;
}
