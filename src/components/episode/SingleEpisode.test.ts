import { describe, it, expect } from 'vitest';
import { validateProps, SingleEpisodePropsSchema } from '~/utils/component-validation';

describe('SingleEpisode Component Validation', () => {
  // Test validation schema directly - using correct Astro collection format
  const validProps = {
    episode: {
      id: 'test-episode',
      collection: 'en-episodes',
      data: {
        id: '123',
        type: 'episode',
        attributes: {
          title: 'Test Episode',
          summary: 'Test summary',
          description: 'Test description',
          status: 'published',
          published_at: '2024-01-15T10:00:00.000Z',
          media_url: 'https://example.com/audio.mp3',
          duration: 1800,
          duration_in_mmss: '30:00',
          formatted_published_at: 'January 15, 2024',
          clean_description: 'Test description',
          image_url: 'https://example.com/episode.jpg',
          local_image_url: '/images/episodes/en/test-episode.webp',
          slug: 'test-episode',
          number: 1,
          season: 1,
          explicit: false,
          keywords: ['tech', 'development'],
          guests: [],
          share_url: 'https://example.com/share/test-episode',
          embed_html: '<iframe src="https://example.com/embed/test-episode"></iframe>',
          embed_html_dark:
            '<iframe src="https://example.com/embed/test-episode?theme=dark"></iframe>',
        },
        relationships: {
          show: {
            data: {
              id: '5036',
              type: 'show',
            },
          },
        },
      },
    },
    availableLanguages: ['en', 'de', 'es', 'nl'],
  };

  it('validates required props', () => {
    // Missing episode prop
    expect(() =>
      validateProps(SingleEpisodePropsSchema, {
        availableLanguages: ['en'],
      })
    ).toThrow();

    // Missing availableLanguages prop
    expect(() =>
      validateProps(SingleEpisodePropsSchema, {
        episode: validProps.episode,
      })
    ).toThrow();

    // Valid props
    expect(() => validateProps(SingleEpisodePropsSchema, validProps)).not.toThrow();
  });

  it('validates episode data structure', () => {
    // Valid episode structure
    expect(() => validateProps(SingleEpisodePropsSchema, validProps)).not.toThrow();

    // Valid with optional loading prop
    expect(() =>
      validateProps(SingleEpisodePropsSchema, {
        ...validProps,
        loading: true,
      })
    ).not.toThrow();
  });

  it('validates availableLanguages array', () => {
    // Empty array
    expect(() =>
      validateProps(SingleEpisodePropsSchema, {
        ...validProps,
        availableLanguages: [],
      })
    ).toThrow();

    // Invalid language code
    expect(() =>
      validateProps(SingleEpisodePropsSchema, {
        ...validProps,
        availableLanguages: ['en', 'invalid' as unknown],
      })
    ).toThrow();

    // Valid language codes
    expect(() =>
      validateProps(SingleEpisodePropsSchema, {
        ...validProps,
        availableLanguages: ['en', 'de'],
      })
    ).not.toThrow();
  });

  it('handles optional episode fields', () => {
    // Without optional fields
    const minimalEpisodeProps = {
      episode: {
        id: 'minimal-episode',
        collection: 'en-episodes',
        data: {
          id: '456',
          type: 'episode',
          attributes: {
            title: 'Minimal Episode',
            summary: 'Minimal summary',
            description: 'Minimal description',
            status: 'published',
            published_at: '2024-01-15T10:00:00.000Z',
            media_url: 'https://example.com/audio.mp3',
            duration: 1800,
            duration_in_mmss: '30:00',
            formatted_published_at: 'January 15, 2024',
            clean_description: 'Minimal description',
            image_url: 'https://example.com/episode.jpg',
            local_image_url: '/images/episodes/en/minimal-episode.webp',
            slug: 'minimal-episode',
            number: 1,
            season: 1,
            explicit: false,
            keywords: [],
            guests: [],
            share_url: 'https://example.com/share/minimal-episode',
            embed_html: '<iframe src="https://example.com/embed/minimal-episode"></iframe>',
            embed_html_dark:
              '<iframe src="https://example.com/embed/minimal-episode?theme=dark"></iframe>',
          },
          relationships: {
            show: {
              data: {
                id: '5036',
                type: 'show',
              },
            },
          },
        },
      },
      availableLanguages: ['en'],
    };
    expect(() => validateProps(SingleEpisodePropsSchema, minimalEpisodeProps)).not.toThrow();
  });
});
