import { describe, it, expect } from 'vitest';
import { validateProps, EpisodeCardPropsSchema } from '~/utils/component-validation';

describe('Card Component Validation', () => {
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
        language: 123,
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
