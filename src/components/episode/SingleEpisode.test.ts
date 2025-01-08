import { describe, it, expect } from 'vitest';
import { validateProps, SingleEpisodePropsSchema } from '~/utils/component-validation';

describe('SingleEpisode Component Validation', () => {
  // Test validation schema directly
  const validProps = {
    episode: {
      id: 'test-123',
      title: 'Test Episode',
      description: 'Test description',
      publishDate: new Date().toISOString(),
      audioUrl: 'https://example.com/audio.mp3',
      duration: '30:00',
      language: 'en',
      guests: [
        {
          name: 'Guest 1',
          role: 'Developer',
          company: 'Tech Co',
        },
        {
          name: 'Guest 2',
          role: 'Designer',
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
        language: 'fr', // Invalid language
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
        availableLanguages: ['en', 'fr'], // fr is not supported
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
        publishDate: new Date().toISOString(),
        audioUrl: 'https://example.com/audio.mp3',
        duration: '30:00',
        language: 'en',
      },
      availableLanguages: ['en'],
    };
    expect(() => validateProps(SingleEpisodePropsSchema, minimalEpisodeProps)).not.toThrow();
  });
});
