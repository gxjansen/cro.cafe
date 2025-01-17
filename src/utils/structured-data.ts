import type { Episode, Person, Quote, Platform, Brand } from '~/types';

interface StructuredDataOptions {
  canonicalUrl?: string;
}

interface SocialLink {
  platform: string;
  url: string;
}

interface GuestReference {
  id: string;
  type: 'guest';
}

export class StructuredDataGenerator {
  /**
   * Generate JSON-LD structured data for a podcast episode
   * @param episode The episode to generate structured data for
   * @param options Additional options for structured data generation
   * @returns JSON-LD object for the episode
   */
  static generateEpisodeSchema(
    episode: Episode,
    options: StructuredDataOptions = {}
  ): Record<string, unknown> {
    const schema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'PodcastEpisode',
      name: episode.data.attributes.title,
      description: episode.data.attributes.description,
      url: options.canonicalUrl || episode.data.attributes.alternate_url,
      duration: `PT${episode.data.attributes.duration}S`,
      datePublished: episode.data.attributes.published_at,
      audio: episode.data.attributes.media_url,
      partOfSeries: {
        '@type': 'PodcastSeries',
        name: 'CRO.CAFE Podcast',
      },
    };

    if (episode.data.attributes.transcript_url) {
      schema.transcript = episode.data.attributes.transcript_url;
    }

    if (episode.data.relationships.guests?.length) {
      schema.guest = episode.data.relationships.guests.map((guestRef: GuestReference) => ({
        '@type': 'Person',
        '@id': guestRef.id,
      }));
    }

    return schema;
  }

  /**
   * Generate JSON-LD structured data for a person
   * @param person The person to generate structured data for
   * @returns JSON-LD object for the person
   */
  static generatePersonSchema(person: Person): Record<string, unknown> {
    const schema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      '@id': person.id,
      name: person.name,
      image: person.image_url,
    };

    if (person.bio) {
      schema.description = person.bio;
    }

    if (person.social_links?.length) {
      schema.sameAs = person.social_links.map((link: SocialLink) => link.url);
    }

    return schema;
  }

  /**
   * Generate JSON-LD structured data for a quote
   * @param quote The quote to generate structured data for
   * @returns JSON-LD object for the quote
   */
  static generateQuoteSchema(quote: Quote): Record<string, unknown> {
    const schema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Quotation',
      text: quote.text,
      author: quote.author,
    };

    if (quote.episode) {
      schema.citation = {
        '@type': 'Episode',
        name: quote.episode,
      };
    }

    if (quote.timestamp) {
      schema.timeStamp = quote.timestamp;
    }

    return schema;
  }

  /**
   * Generate JSON-LD structured data for a podcast platform
   * @param platform The platform to generate structured data for
   * @returns JSON-LD object for the platform
   */
  static generatePlatformSchema(platform: Platform): Record<string, unknown> {
    const schema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: platform.name,
      description: platform.description,
    };

    if (platform.url) {
      schema.url = platform.url;
    }

    if (platform.logo) {
      schema.logo = platform.logo;
    }

    return schema;
  }

  /**
   * Generate JSON-LD structured data for a brand
   * @param brand The brand to generate structured data for
   * @returns JSON-LD object for the brand
   */
  static generateBrandSchema(brand: Brand): Record<string, unknown> {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: brand.name,
      description: brand.description,
      url: brand.canonicalUrl || brand.website_url,
      logo: brand.logo_url,
    };
  }

  /**
   * Render structured data as a script tag
   * @param schema The structured data schema to render
   * @returns HTML script tag with JSON-LD content
   */
  static renderSchema(schema: Record<string, unknown>): string {
    return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;
  }
}
