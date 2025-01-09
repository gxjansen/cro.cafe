import { describe, it, expect } from 'vitest';
import { validateProps, EpisodeCardPropsSchema } from '~/utils/component-validation';

describe('Card Component Validation', () => {
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
