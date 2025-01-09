import { describe, it, expect } from 'vitest';
import { validateProps, SingleEpisodePropsSchema } from '~/utils/component-validation';

describe('SingleEpisode Component Validation', () => {
  // Test validation schema directly
  const validProps = {
    episode: {
      id: 'test-123',
      title: 'Test Episode',
      description: 'Test description',
      date: new Date().toISOString(),
      audio_url: 'https://example.com/audio.mp3',
      duration: 1800, // 30 minutes in seconds
      language: 'en',
      guests: [
        {
          id: 'guest-1',
          name: 'Guest 1',
          role: 'Developer',
          bio: 'Test bio',
          image_url: 'https://example.com/guest1.jpg',
          social_links: ['https://twitter.com/guest1'],
          language: 'en',
          type: 'guest',
        },
        {
          id: 'guest-2',
          name: 'Guest 2',
          role: 'Designer',
          bio: 'Test bio',
          image_url: 'https://example.com/guest2.jpg',
          social_links: ['https://twitter.com/guest2'],
          language: 'en',
          type: 'guest',
        },
      ],
      tags: ['tech', 'development'],
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
    // Invalid episode data
    const invalidEpisodeProps = {
      ...validProps,
      episode: {
        ...validProps.episode,
        language: 'invalid' as unknown,
      },
    };
    expect(() => validateProps(SingleEpisodePropsSchema, invalidEpisodeProps)).toThrow();
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
        id: 'test-123',
        title: 'Test Episode',
        description: 'Test description',
        date: new Date().toISOString(),
        audio_url: 'https://example.com/audio.mp3',
        duration: 1800,
        language: 'en',
      },
      availableLanguages: ['en'],
    };
    expect(() => validateProps(SingleEpisodePropsSchema, minimalEpisodeProps)).not.toThrow();
  });
});
