import type { Episode, Person, Quote, Platform, Brand } from '~/types';

interface StructuredDataOptions {
  canonicalUrl?: string;
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
    return {
      '@context': 'https://schema.org',
      '@type': 'PodcastEpisode',
      name: episode.title,
      description: episode.description,
      url: options.canonicalUrl || episode.canonicalUrl,
      duration: `PT${episode.duration}S`,
      datePublished: episode.date.toISOString(),
      audio: episode.audio_url,
      transcript: episode.transcript_url,
      partOfSeries: {
        '@type': 'PodcastSeries',
        name: 'CRO.CAFE Podcast',
      },
      guest: episode.guests.map(this.generatePersonSchema),
    };
  }

  /**
   * Generate JSON-LD structured data for a person
   * @param person The person to generate structured data for
   * @returns JSON-LD object for the person
   */
  static generatePersonSchema(person: Person): Record<string, unknown> {
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: person.name,
      description: person.bio,
      image: person.image_url,
      sameAs: person.social_links.map((link) => link.url),
    };
  }

  /**
   * Generate JSON-LD structured data for a quote
   * @param quote The quote to generate structured data for
   * @returns JSON-LD object for the quote
   */
  static generateQuoteSchema(quote: Quote): Record<string, unknown> {
    return {
      '@context': 'https://schema.org',
      '@type': 'Quotation',
      text: quote.text,
      author: this.generatePersonSchema(quote.author),
      citation: {
        '@type': 'Episode',
        name: quote.episode.title,
      },
    };
  }

  /**
   * Generate JSON-LD structured data for a podcast platform
   * @param platform The platform to generate structured data for
   * @returns JSON-LD object for the platform
   */
  static generatePlatformSchema(platform: Platform): Record<string, unknown> {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: platform.name,
      description: platform.description,
      url: platform.canonicalUrl || platform.url,
      logo: platform.icon_url,
    };
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
