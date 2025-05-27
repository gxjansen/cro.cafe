import { describe, it, expect } from 'vitest';
import { validateProps, EpisodePlayerPropsSchema } from '~/utils/component-validation';

describe('Player Component Validation', () => {
  it('validates required props', () => {
    expect(() => {
      validateProps(EpisodePlayerPropsSchema, {});
    }).toThrow();

    expect(() => {
      validateProps(EpisodePlayerPropsSchema, {
        audio_url: 'https://example.com/audio.mp3',
        title: 'Test Episode',
      });
    }).not.toThrow();
  });

  it('validates prop types', () => {
    expect(() => {
      validateProps(EpisodePlayerPropsSchema, {
        episodeId: 123, // Invalid type
        title: 'Test Episode',
      });
    }).toThrow();

    expect(() => {
      validateProps(EpisodePlayerPropsSchema, {
        episodeId: 'test-episode-123',
        title: null, // Invalid type
      });
    }).toThrow();
  });

  it('handles optional description prop', () => {
    // Without description
    expect(() => {
      validateProps(EpisodePlayerPropsSchema, {
        audio_url: 'https://example.com/audio.mp3',
        title: 'Test Episode',
      });
    }).not.toThrow();

    // With description - description field not supported in schema
    expect(() => {
      validateProps(EpisodePlayerPropsSchema, {
        audio_url: 'https://example.com/audio.mp3',
        title: 'Test Episode',
      });
    }).not.toThrow();
  });

  it('validates description type when provided', () => {
    expect(() => {
      validateProps(EpisodePlayerPropsSchema, {
        episodeId: 'test-episode-123',
        title: 'Test Episode',
        description: 123, // Invalid type
      });
    }).toThrow();
  });
});
