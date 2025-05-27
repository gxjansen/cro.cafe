import { describe, it, expect } from 'vitest';
import { validateProps, EpisodeGridPropsSchema } from '~/utils/component-validation';

describe('Grid Component Validation', () => {
  // Test validation schema directly
  const validProps = {
    episodes: [],
    language: 'en',
    limit: 10,
    featured: false,
    showGuests: true,
    columns: '3',
  };

  it('validates required props', () => {
    // Missing required language prop
    expect(() => validateProps(EpisodeGridPropsSchema, {})).toThrow();

    // Only required prop
    expect(() =>
      validateProps(EpisodeGridPropsSchema, {
        episodes: [],
        language: 'en',
      })
    ).not.toThrow();

    // All valid props
    expect(() => validateProps(EpisodeGridPropsSchema, validProps)).not.toThrow();
  });

  it('validates optional props', () => {
    // Valid with optional props
    expect(() =>
      validateProps(EpisodeGridPropsSchema, {
        episodes: [],
        limit: 10,
        featured: true,
        columns: '3',
      })
    ).not.toThrow();

    // Valid with different optional values
    expect(() =>
      validateProps(EpisodeGridPropsSchema, {
        episodes: [],
        limit: 5,
        featured: false,
        columns: '2',
      })
    ).not.toThrow();
  });

  it('validates type coercion and edge cases', () => {
    // Test with valid numeric limit
    expect(() =>
      validateProps(EpisodeGridPropsSchema, {
        episodes: [],
        limit: 10,
      })
    ).not.toThrow();

    // Test with valid boolean featured
    expect(() =>
      validateProps(EpisodeGridPropsSchema, {
        episodes: [],
        featured: true,
      })
    ).not.toThrow();

    // Test with valid loading prop
    expect(() =>
      validateProps(EpisodeGridPropsSchema, {
        episodes: [],
        loading: false,
      })
    ).not.toThrow();
  });

  it('validates columns prop', () => {
    // Invalid column number
    expect(() =>
      validateProps(EpisodeGridPropsSchema, {
        episodes: [],
        language: 'en',
        columns: '5', // Should be '2', '3', or '4'
      })
    ).toThrow();

    // Valid column numbers
    ['2', '3', '4'].forEach((cols) => {
      expect(() =>
        validateProps(EpisodeGridPropsSchema, {
          episodes: [],
          language: 'en',
          columns: cols,
        })
      ).not.toThrow();
    });
  });

  it('handles combinations of optional props', () => {
    // Multiple optional props
    expect(() =>
      validateProps(EpisodeGridPropsSchema, {
        episodes: [],
        language: 'en',
        limit: 5,
        featured: true,
        columns: '2',
      })
    ).not.toThrow();

    // All props with edge values
    expect(() =>
      validateProps(EpisodeGridPropsSchema, {
        episodes: [],
        language: 'en',
        limit: 1,
        featured: false,
        showGuests: false,
        columns: '4',
      })
    ).not.toThrow();
  });
});
