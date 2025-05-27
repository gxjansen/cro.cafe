import { describe, it, expect } from 'vitest';
import { validateProps, EpisodeCardPropsSchema } from '~/utils/component-validation';

describe('Card Component Validation', () => {
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
  };

  it('validates required props', () => {
    // Missing episode prop
    expect(() => validateProps(EpisodeCardPropsSchema, {})).toThrow();

    // Valid props
    expect(() => validateProps(EpisodeCardPropsSchema, validProps)).not.toThrow();
  });

  it('validates episode data structure', () => {
    // Invalid language type
    const invalidLanguageProps = {
      episode: {
        ...validProps.episode,
        language: 'invalid' as unknown,
      },
    };
    expect(() => validateProps(EpisodeCardPropsSchema, invalidLanguageProps)).toThrow();

    // Invalid guests type
    const invalidGuestsProps = {
      episode: {
        ...validProps.episode,
        guests: 'guest-1', // Should be an array of objects
      },
    };
    expect(() => validateProps(EpisodeCardPropsSchema, invalidGuestsProps)).toThrow();
  });

  it('handles optional showGuests prop', () => {
    // Without showGuests
    expect(() => validateProps(EpisodeCardPropsSchema, validProps)).not.toThrow();

    // With valid showGuests
    expect(() =>
      validateProps(EpisodeCardPropsSchema, {
        ...validProps,
        showGuests: false,
      })
    ).not.toThrow();

    // With invalid showGuests type
    expect(() =>
      validateProps(EpisodeCardPropsSchema, {
        ...validProps,
        showGuests: 'true', // Should be boolean
      })
    ).toThrow();
  });
});
